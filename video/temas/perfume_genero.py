"""Tema: ¿perfumes de hombre y de mujer? (énfasis en que mucha gente usa los "del otro lado" y en los unisex como
CK One), con humor y en ESTILO CÓMIC: personajes con sombreado plano y contorno negro, fondo de puntos, pantalla
dividida "ÉL vs ELLA" y sellos en forma de explosión de cómic. ~50 s

Datos (revisados):
- Durante la mayor parte de la historia el perfume no tuvo género; en los siglos XVIII y XIX hombres y mujeres usaban
  violeta y rosa. La división "para él / para ella" la impuso el marketing a finales del XIX y principios del XX.
- Convenciones de marketing: maderas y notas frescas "para él"; flores y dulces "para ella".
- Le Male de Jean Paul Gaultier (1995), clásico "de hombre", lleva lavanda y vainilla.
- CK One de Calvin Klein (1994), creado por Alberto Morillas y Harry Frémont, se anunció como "un perfume para un
  hombre o una mujer" y fue el primer unisex en volverse un éxito masivo.
- Cada vez más gente usa perfumes etiquetados para el otro género, y salen cada vez más perfumes unisex.
"""

ESCENA = "genero.js"
SALIDA = "perfume-hombre-mujer.mp4"

GUION = [
    ("gancho", ["Tu perfume no sabe si eres *hombre o mujer*{genero}.", "No tiene *ni idea*{idea}."]),
    ("quimica", ["Las moléculas no traen *etiqueta*{etiqueta}:", "una rosa huele a rosa{rosa}, la huela quien la huela{quien}."]),
    ("historia", ["Durante siglos, los hombres usaban *violeta*{violeta} y rosa{siglos}, sin drama{nada}.",
                  "Lo de *para él*{el} y *para ella*{ella} lo inventó el *marketing*{mkt}, hace apenas un siglo."]),
    ("regla", ["La regla{regla}:", "*maderas*{madera} y frescura para él{fresco},", "*flores*{flores} y dulce para ella{dulce}.",
               "Pero el Le Male de Jean Paul Gaultier{lemale}, un clásico de hombre{famoso},", "tiene *vainilla*{vainilla}."]),
    ("ckone", ["Y en 1994 llegó *CK One*{ckone}, de Calvin Klein{calvin}:", "un perfume para *un hombre o una mujer*{ambos}.",
               "Y fue el primer unisex en volverse un *éxito*{exito} masivo."]),
    ("hoy", ["Hoy, muchísimos hombres usan perfumes *de mujer*{mujer},", "muchas mujeres usan *de hombre*{hombre},",
             "y muchas veces lo único que cambia es el frasco{frasco}...", "y el *anuncio*{anuncio}."]),
    ("final", ["Así que si te gusta cómo huele{gusta}, *úsalo*{usalo}.", "Tu nariz no lee etiquetas{nariz}.",
               "¿Tú usas alguno del otro lado{otro}?"]),
]
DICHO = {"1994": "mil novecientos noventa y cuatro", "CK": "ci kei", "One": "uan", "Le": "le", "Male": "mal",
         "Jean": "yan", "Paul": "pol", "Gaultier": "goltié", "Klein": "klain"}

PILDORAS = {}

SELLO_ESTILO = "comic"   # explosión amarilla con contorno negro
SELLOS = [
    ("gancho", "idea", "¡NI IDEA!", (255, 214, 0), 1.0),
    ("historia", "mkt", "¡MARKETING!", (255, 214, 0), 1.2),
    ("regla", "vainilla", "¡VAINILLA!", (255, 214, 0), 1.1),
    ("ckone", "ambos", "¡PARA TODOS!", (255, 214, 0), 1.3),
    ("final", "usalo", "¡ÚSALO!", (255, 214, 0), 1.0),
]
SELLO_Y = 1300

# pantalla dividida: (escena, cue de inicio o None, cue de fin o None, texto de arriba, texto de abajo)
DIVIDIDO = [
    ("historia", "el", None, "PARA ÉL", "PARA ELLA"),
    ("regla", None, "lemale", "PARA ÉL", "PARA ELLA"),
    ("hoy", None, "frasco", "ÉL... CON «DE MUJER»", "ELLA... CON «DE HOMBRE»"),
]

GOLPES = [
    ("gancho", "idea", 0.7, 0.0), ("quimica", "etiqueta", 0.5, 0.0), ("historia", "mkt", 0.8, 0.25),
    ("regla", "vainilla", 0.8, 0.0), ("ckone", "ckone", 0.6, 0.3), ("ckone", "ambos", 0.7, 0.0), ("final", "usalo", 0.7, 0.0),
]
TRANSICIONES = True
SOPLIDOS = False
BARRA = False
MUSICA = "energica"


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "genero"), "pop", None), (c("gancho", "idea"), "boing", None),
        (c("quimica", "etiqueta"), "pop", None), (c("quimica", "rosa"), "ding", None),
        (c("historia", "violeta"), "pop", None), (c("historia", "el"), "pop", None), (c("historia", "ella"), "pop", None),
        (c("historia", "mkt"), "golpe", None),
        (c("regla", "madera"), "tin", 1), (c("regla", "flores"), "tin", 2), (c("regla", "vainilla"), "golpe", None),
        (c("ckone", "ckone"), "boom", None), (c("ckone", "ambos"), "golpe", None), (c("ckone", "exito"), "ding", None),
        (c("hoy", "mujer"), "pop", None), (c("hoy", "hombre"), "pop", None), (c("hoy", "anuncio"), "boing", None),
        (c("final", "usalo"), "golpe", None), (c("final", "otro"), "pop", None),
    ]
