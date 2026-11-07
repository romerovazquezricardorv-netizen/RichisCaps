"""Tema: la leyenda del ajedrez y los granos de trigo."""

ESCENA = "escena.js"          # escena 3D en escena3d/
SALIDA = "leyenda-ajedrez.mp4"

# Cada escena es una lista de frases. *palabra* = palabra clave (azul); palabra{cue} = marca de tiempo
# que usan las animaciones. Los números se leen con DICHO.
GUION = [
    ("gancho", ["¿Sabías que este tablero de ajedrez", "casi deja en la *ruina* a un *rey*?"]),
    ("pago", ["Cuenta la leyenda que su inventor", "le pidió al rey un pago muy *extraño*:"]),
    ("granos", ["*un{g1} grano* de trigo en la primera casilla,", "*dos*{g2} en la segunda,", "*cuatro*{g3} en la tercera,",
                "*ocho*{g4} en la cuarta..."]),
    ("duplicar", ["y así, *duplicando*,", "hasta la casilla *64*."]),
    ("risa", ["El rey se rió y aceptó de inmediato.", "Le pareció *casi nada*."]),
    ("c10", ["Pero mira: en la casilla 10", "ya hay *512 granos*."]),
    ("c20", ["En la 20,", "más de *medio millón*."]),
    ("c32", ["En la 32,", "más de *dos mil millones*...", "y apenas vamos a la *mitad*{mitad} del tablero."]),
    ("c64", ["Y en la última casilla,", "habría más de *nueve trillones* de granos."]),
    ("total", ["En total, unos *18 trillones*.", "Más trigo del que el mundo entero", "cosecharía en *mil{mil} años*."]),
    ("expo", ["Eso es el *crecimiento exponencial*:", "al principio no se nota...", "y de{boom} repente, es *imposible* de detener."]),
    ("final", ["Por eso dicen que el rey...", "*nunca*{cae} pudo pagar."]),
]
DICHO = {"64": "sesenta y cuatro", "10": "diez", "512": "quinientos doce", "20": "veinte", "32": "treinta y dos",
         "18": "dieciocho"}

# Etiquetas ("píldoras"): escena -> lista de (cue o segundos desde el inicio, texto, subtexto)
PILDORAS = {
    "granos": [("g1", "1 grano", None), ("g2", "2 granos", None), ("g3", "4 granos", None), ("g4", "8 granos", None)],
    "duplicar": [(0.5, "×2 en cada casilla", None)],
    "c10": [(0.6, "512 granos", "casilla 10")],
    "c20": [(0.5, "524 288 granos", "casilla 20")],
    "c32": [(0.6, "2 147 483 648 granos", "casilla 32"), ("mitad", "2 147 483 648 granos", "la mitad del tablero")],
    "c64": [(0.5, "9 223 372 036 854 775 808", "granos en la casilla 64")],
    "total": [(0.3, "18 446 744 073 709 551 615", "granos en todo el tablero"), ("mil", "≈ 1 000 años", "de cosecha mundial de trigo")],
}



def efectos(segs):
    """Efectos de sonido propios del tema: (segundo, tipo, parámetro)."""
    ev = []
    for k in ("g1", "g2", "g3", "g4"):
        at = segs["granos"]["cues"][k]
        for j in range(2 ** (int(k[1]) - 1)):
            ev.append((at + 0.35 + j * 0.05, "tin", j))
    for at in (segs["c20"]["start"] + 0.3, segs["c32"]["start"] + 0.5, segs["c64"]["start"] + 0.2,
               segs["total"]["cues"]["mil"], segs["expo"]["cues"]["boom"], segs["final"]["cues"]["cae"] + 1.0):
        ev.append((at, "boom", None))
    return ev
