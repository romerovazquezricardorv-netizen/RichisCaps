"""Tema: ¿frotar el perfume con tu piel puede arruinar su aroma? (experimento con dos muñecas, ritmo rápido, ~50 s)

Datos (revisados): al frotar, la fricción calienta un poco la piel y el calor acelera la evaporación del alcohol y de las
notas de salida (las más volátiles: cítricos, notas frescas), así que la apertura dura menos y el perfume se desarrolla
distinto. Lo de que frotar "rompe" o "aplasta" las moléculas es un mito: la fricción de la piel no rompe enlaces
químicos. Al frotar también se mezcla más con la grasa y el sudor de la piel. Lo recomendado: rociar, esperar y dejar
que seque solo; si acaso, dar toquecitos suaves.

Versión dinámica: sellos que golpean la pantalla, sacudidas y destellos en los momentos clave, barra de progreso,
cortes más rápidos dentro de cada escena y música con bombo.
"""

ESCENA = "frotar.js"
SALIDA = "perfume-frotar.mp4"

GUION = [
    ("gancho", ["¿Tú también haces *esto*{esto} después de echarte perfume?", "*Detente*{alto}."]),
    ("promesa", ["Porque podrías estar arruinando la *mejor parte*{mejor} de tu aroma."]),
    ("experimento", ["Hagamos la prueba:", "dos muñecas{dos},", "el mismo perfume{mismo}.",
                     "Una la *frotamos*{frota},", "y la otra la dejamos *secar*{seca} solita."]),
    ("calor", ["Al frotar, la fricción genera *calor*{calor},",
               "y el calor hace que las notas de salida se *evaporen*{evap} más rápido."]),
    ("salida", ["Y esas notas son lo *primero*{primero} que hueles:", "los cítricos{citricos},", "lo fresco{fresco}...",
                "y con el frote, se *van*{van} volando."]),
    ("mito", ["Ahora, ¿es cierto que *rompes*{rompes} las moléculas?", "*No*{no},", "eso es un mito{mito}.",
              "Pero sí las *apuras*{apuras},", "y las revuelves con la grasa y el sudor de tu piel{piel}."]),
    ("resultado", ["Diez minutos después{diez}...", "la muñeca que no frotaste huele *completa*{completa}.",
                   "Y la otra{otra}...", "huele *plana*{plana}, como si le faltara algo."]),
    ("consejo", ["Así que rocía{rocia},", "*espera*{espera},", "y déjalo secar solo.",
                 "Y si quieres, dale *toquecitos*{toques},", "pero nunca lo frotes{nunca}."]),
    ("final", ["¿Tú lo *frotabas*{frotabas}?", "Cuéntame en los comentarios{coment}."]),
]
DICHO = {}

PILDORAS = {}   # sin etiquetas fijas: solo los subtítulos de la voz y unos cuantos sellos

# Sellos que golpean la pantalla: (escena, cue, texto, color de fondo RGB, segundos en pantalla)
SELLOS = [
    ("gancho", "alto", "¡ALTO!", (232, 38, 58), 1.1),
    ("mito", "mito", "MITO", (232, 38, 58), 1.3),
    ("consejo", "toques", "TOQUECITOS ✓", (34, 170, 90), 1.2),
    ("consejo", "nunca", "NUNCA FROTES", (232, 38, 58), 1.3),
]
SELLO_Y = 1250

# Sacudida y acercamiento rápido de la imagen 3D: (escena, cue, fuerza 0..1, destello blanco 0..1)
GOLPES = [
    ("gancho", "alto", 1.0, 0.55), ("promesa", "mejor", 0.5, 0.0), ("experimento", "frota", 0.6, 0.0),
    ("calor", "calor", 0.7, 0.25), ("salida", "van", 0.8, 0.3), ("mito", "no", 0.8, 0.0), ("mito", "mito", 0.6, 0.0),
    ("resultado", "plana", 0.6, 0.0), ("consejo", "nunca", 0.8, 0.0),
]

BARRA = True           # barra de progreso abajo
MUSICA = "energica"    # bombo en cada tiempo, 112 bpm


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "esto"), "spray", None), (c("gancho", "alto"), "golpe", None),
        (c("promesa", "mejor"), "ding", None),
        (c("experimento", "dos"), "pop", None), (c("experimento", "mismo"), "spray", None),
        (c("experimento", "frota"), "frote", None), (c("experimento", "seca"), "tin", 1),
        (c("calor", "calor"), "boom", None), (c("calor", "evap"), "whoosh", None),
        (c("salida", "citricos"), "pop", None), (c("salida", "fresco"), "pop", None), (c("salida", "van"), "whoosh", None),
        (c("mito", "rompes"), "frote", None), (c("mito", "no"), "boing", None), (c("mito", "mito"), "golpe", None),
        (c("mito", "apuras"), "whoosh", None), (c("mito", "piel"), "pop", None),
        (c("resultado", "diez"), "tin", 2), (c("resultado", "completa"), "ding", None), (c("resultado", "plana"), "beep", None),
        (c("consejo", "rocia"), "spray", None), (c("consejo", "espera"), "tin", 3),
        (c("consejo", "toques"), "tin", 4), (c("consejo", "toques") + 0.35, "tin", 5),
        (c("consejo", "nunca"), "golpe", None), (c("final", "frotabas"), "pop", None),
    ]
