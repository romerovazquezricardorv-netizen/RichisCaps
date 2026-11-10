"""Tema: el ámbar gris, el ingrediente de perfume que sale de una ballena (ritmo rápido, tono de "dato increíble", ~50 s)

Datos (revisados): el ámbar gris solo lo produce el cachalote (se estima que alrededor del 1 % de ellos); se cree que se
forma para proteger el intestino de los picos duros de los calamares que come; sale al mar y puede flotar años, y el
sol y el agua salada lo "curan": fresco huele fuerte y desagradable, y con el tiempo se vuelve dulce, terroso y marino.
En perfumería se usó como fijador. En 2021 unos pescadores de Yemen encontraron un cachalote muerto con 127 kg de ámbar
gris y lo vendieron en alrededor de 1.5 millones de dólares. Hoy casi todos los perfumes usan ambroxan, una versión
sintética; en Estados Unidos su posesión y comercio están prohibidos (no así en otros países, como Reino Unido o
Francia).
"""

ESCENA = "ambar.js"
SALIDA = "ambar-gris.mp4"

GUION = [
    ("gancho", ["¿Sabías que uno de los ingredientes más caros del perfume sale de una *ballena*{ballena}?",
                "Y no precisamente de la parte bonita{bonita}."]),
    ("nombre", ["Se llama *ámbar gris*{ambar},", "y solo lo produce el *cachalote*{cacha}."]),
    ("como", ["El cachalote come muchísimos *calamares*{calamar},", "y sus picos duros le raspan el intestino{picos}.",
              "Para protegerse, su cuerpo los envuelve en una masa *cerosa*{cera}...",
              "que tarde o temprano termina en el *mar*{mar}."]),
    ("mar", ["Ahí flota *años*{anos}.", "El sol y el agua salada la van *curando*{curar}:",
             "al principio huele *horrible*{horrible},", "pero con el tiempo se vuelve *dulce*{dulce}, terroso y marino{marino}."]),
    ("precio", ["Y vale una *fortuna*{fortuna}:", "en 2021, unos pescadores de Yemen encontraron un cachalote muerto{yemen},",
                "y adentro tenía *127 kilos*{kilos} de ámbar gris.", "Lo vendieron en *un millón y medio*{millon} de dólares."]),
    ("perfume", ["En el perfume funciona como *fijador*{fijador}:", "hace que el aroma dure más{dura},",
                 "y le da un toque cálido y *sensual*{calido}."]),
    ("sintetico", ["Pero tranquilo:", "hoy casi todos los perfumes usan una versión *sintética*{sint}, el *ambroxan*{ambroxan},",
                   "y en países como Estados Unidos, comerciar el real está *prohibido*{prohib}."]),
    ("final", ["Así que si un día ves una piedra rara en la playa{playa}...", "*huélela*{huele}.", "¿Tú la recogerías{recoger}?"]),
]
DICHO = {"2021": "dos mil veintiuno", "127": "ciento veintisiete"}

PILDORAS = {}   # sin etiquetas fijas: solo los subtítulos de la voz y unos cuantos sellos

SELLOS = [
    ("nombre", "ambar", "ÁMBAR GRIS", (196, 138, 36), 1.4),
    ("mar", "horrible", "¡PUAJ!", (110, 160, 40), 1.1),
    ("precio", "millon", "$1 500 000", (34, 150, 80), 1.6),
    ("sintetico", "prohib", "PROHIBIDO", (232, 38, 58), 1.3),
]
SELLO_Y = 1250

GOLPES = [
    ("gancho", "ballena", 0.7, 0.3), ("gancho", "bonita", 0.5, 0.0), ("nombre", "ambar", 0.6, 0.0),
    ("como", "picos", 0.6, 0.0), ("como", "mar", 0.7, 0.2), ("mar", "horrible", 0.8, 0.0),
    ("precio", "kilos", 0.6, 0.0), ("precio", "millon", 1.0, 0.45), ("sintetico", "prohib", 0.8, 0.0),
    ("final", "huele", 0.5, 0.0),
]

BARRA = False          # sin barra de progreso
MUSICA = "energica"


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "ballena"), "boom", None), (c("gancho", "bonita"), "boing", None),
        (c("nombre", "ambar"), "golpe", None), (c("nombre", "cacha"), "whoosh", None),
        (c("como", "calamar"), "pop", None), (c("como", "calamar") + 0.25, "pop", None), (c("como", "calamar") + 0.5, "pop", None),
        (c("como", "picos"), "boing", None), (c("como", "cera"), "pop", None), (c("como", "mar"), "boom", None),
        (c("mar", "anos"), "whoosh", None), (c("mar", "horrible"), "golpe", None), (c("mar", "dulce"), "ding", None),
        (c("precio", "fortuna"), "tin", 1), (c("precio", "kilos"), "boom", None), (c("precio", "millon"), "golpe", None),
        (c("precio", "millon") + 0.3, "ding", None),
        (c("perfume", "fijador"), "pop", None), (c("perfume", "calido"), "ding", None),
        (c("sintetico", "sint"), "pop", None), (c("sintetico", "ambroxan"), "ding", None), (c("sintetico", "prohib"), "golpe", None),
        (c("final", "huele"), "spray", None), (c("final", "recoger"), "pop", None),
    ]
