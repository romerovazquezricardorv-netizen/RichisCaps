"""Tema: ¿en Francia usaban perfume para no bañarse? (historia con humor, mito vs. realidad, estilo cómic) ~50 s

Datos (revisados):
- En la Francia de los siglos XVII y XVIII se desconfiaba del agua: los médicos creían que el baño abría los poros y
  dejaba entrar enfermedades. El baño se sustituía por una "toilette seca": frotarse con un lienzo, cambiarse la
  camisa de lino blanca (la limpieza se veía en la ropa blanca) y perfumarse mucho para tapar los olores.
- En Versalles se perfumaban las habitaciones y a los invitados.
- Lo de que Luis XIV se bañó solo dos veces en su vida es más leyenda que dato comprobado; sí se cambiaba la camisa
  varias veces al día.
- Hoy: encuesta IFOP de 2020, el 76 % de los franceses dice lavarse completo todos los días (3 de cada 4).
- La regadera moderna (la ducha) la inventó el médico francés François Merry Delabost en 1872, en una prisión de Ruan.
"""

ESCENA = "francia.js"
SALIDA = "perfume-francia-no-banarse.mp4"

GUION = [
    ("gancho", ["En la Francia de hace unos trescientos años{siglo},", "el agua daba más miedo que el *mal olor*{olor}."]),
    ("miedo", ["Los médicos creían que el baño *abría los poros*{poros}", "y dejaba entrar las *enfermedades*{enferm}.",
               "Así que mejor... no{mejorno}."]),
    ("seco", ["En vez de bañarse{vez}, se frotaban con un trapo{trapo},", "se cambiaban la *camisa blanca*{camisa},",
              "y lo demás lo tapaban con *perfume*{perfume}."]),
    ("versalles", ["En el palacio de *Versalles*{versalles}, perfumaban hasta a los invitados{invitados}...",
                   "y aun así, olía *fuertísimo*{fuerte}."]),
    ("rey", ["Dicen que Luis Catorce se bañó solo *dos veces*{dos} en su vida.", "Eso es más *leyenda*{leyenda} que historia{historia},",
             "pero sí se cambiaba la camisa varias veces al día{camisas}."]),
    ("hoy", ["¿Y hoy{hoy}?", "Tranquilos{tranq}:", "tres de cada cuatro franceses dicen que se lavan *todos los días*{diario}."]),
    ("ironia", ["Y lo más irónico{ironico}:", "la *regadera moderna*{regadera} la inventó un médico *francés*{frances}, en 1872{anio}."]),
    ("final", ["Así que el perfume no es para no bañarte{nobanarte}...", "es para *después*{despues} del baño.",
               "¿Tú te lo pones antes o después de bañarte{cuando}?"]),
]
DICHO = {"1872": "mil ochocientos setenta y dos"}
ALINEAR = {"Catorce": "14", "1872": "1872"}

PILDORAS = {}

SELLO_ESTILO = "comic"
SELLOS = [
    ("miedo", "enferm", "¡AGUA NO!", (255, 214, 0), 1.1),
    ("versalles", "fuerte", "¡PUAJ!", (150, 210, 60), 1.1),
    ("rey", "leyenda", "¿LEYENDA?", (255, 214, 0), 1.1),
    ("hoy", "diario", "3 DE CADA 4", (255, 214, 0), 1.3),
    ("ironia", "frances", "¡IRONÍA!", (255, 214, 0), 1.2),
]
SELLO_Y = 1300

# pantalla dividida: (escena, cue de inicio o None, cue de fin o None, arriba, abajo)
DIVIDIDO = [
    ("hoy", None, None, "ANTES", "HOY"),
]

GOLPES = [
    ("gancho", "olor", 0.6, 0.0), ("miedo", "enferm", 0.7, 0.0), ("seco", "perfume", 0.4, 0.0),
    ("versalles", "fuerte", 0.8, 0.0), ("rey", "dos", 0.5, 0.0), ("rey", "leyenda", 0.6, 0.0),
    ("hoy", "diario", 0.6, 0.0), ("ironia", "frances", 0.8, 0.3), ("final", "despues", 0.5, 0.0),
]
TRANSICIONES = True
SOPLIDOS = False
BARRA = False
MUSICA = "energica"


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "olor"), "boing", None),
        (c("miedo", "poros"), "pop", None), (c("miedo", "enferm"), "golpe", None), (c("miedo", "mejorno"), "boing", None),
        (c("seco", "trapo"), "tin", 1), (c("seco", "camisa"), "pop", None), (c("seco", "perfume"), "ding", None),
        (c("versalles", "versalles"), "ding", None), (c("versalles", "invitados"), "pop", None), (c("versalles", "fuerte"), "golpe", None),
        (c("rey", "dos"), "pop", None), (c("rey", "leyenda"), "boing", None), (c("rey", "camisas"), "pop", None),
        (c("hoy", "tranq"), "pop", None), (c("hoy", "diario"), "ding", None),
        (c("ironia", "regadera"), "pop", None), (c("ironia", "frances"), "golpe", None),
        (c("final", "despues"), "ding", None), (c("final", "cuando"), "pop", None),
    ]
