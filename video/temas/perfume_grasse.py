"""Tema: ¿por qué Grasse (Francia) es la capital del perfume? (historia con humor, estilo cómic, ~45 s)

Datos (revisados): Grasse tenía una industria de curtido de cuero y sus guantes de piel olían mal; los curtidores
empezaron a perfumarlos con flores de la región. Los guantes perfumados se pusieron de moda en la corte francesa (se
asocia a Catalina de Médici, que trajo costumbres de Florencia). Los curtidores pasaron a llamarse "guanteros
perfumistas" y en 1724 los perfumistas se independizaron de los curtidores; con impuestos más altos al cuero, se
quedaron con el perfume. En 2018 la UNESCO inscribió los saberes del perfume del País de Grasse como patrimonio
cultural inmaterial.
Versión larga (~1:09): el clima de Grasse para el jazmín, la rosa de mayo y el nardo; Galimard, fundada en 1747,
proveedora de la corte de Luis XV; la novela "El perfume" de Patrick Süskind, que transcurre en parte en Grasse.
"""
from temas._comun_comic import *

ESCENA = "grasse.js"
SALIDA = "perfume-grasse.mp4"

GUION = [
    ("gancho", ["La capital mundial del perfume{capital}... nació por culpa del *mal olor*{olor}."]),
    ("cuero", ["En *Grasse*{grasse}, un pueblo del sur de Francia{francia},", "se dedicaban a curtir *cuero*{cuero},",
               "y sus guantes de piel *apestaban*{apestaban}."]),
    ("idea", ["Así que tuvieron una idea{idea}:", "*perfumar los guantes*{guantes} con las flores de la región{flores}."]),
    ("clima", ["Y flores sobraban{sobraban}:", "su clima es perfecto para el *jazmín*{jazmin}, la rosa de mayo{rosa} y el nardo{nardo}."]),
    ("fiestas", ["Y las celebra con fiestas{fiestas}:", "en mayo, la de la *rosa*{rosa2},", "y en agosto, la del *jazmín*{jazmin2}."]),
    ("corte", ["Los guantes perfumados se pusieron de *moda*{moda} en la corte{corte},", "y se dice que la reina *Catalina de Médici*{catalina} los volvió famosos{famosos}."]),
    ("cambio", ["Los curtidores se volvieron *guanteros perfumistas*{guanteros},", "y con el tiempo{tiempo}, dejaron el cuero{dejaron}",
                "y se quedaron solo con el *perfume*{perfume}."]),
    ("galimard", ["Algunas perfumerías de ahí tienen siglos{siglos}:", "*Galimard* se fundó en *1747*{anio}", "y le hacía perfumes a la corte de Luis Quince{luis}."]),
    ("novela", ["Y Grasse hasta sale en una novela famosa{novela}:", "*El perfume*{perfume}, de Patrick Süskind{suskind}."]),
    ("museo", ["Hoy tiene hasta un *Museo Internacional de la Perfumería*{museo},", "y ahí se forman muchas *narices*{narices}:", "así les dicen a los perfumistas{perfumistas}."]),
    ("final", ["Hoy, el saber del perfume de Grasse es *patrimonio de la UNESCO*{unesco}.", "Y todo empezó... con unos guantes que olían feo{feo}."]),
]
DICHO = {"1747": "mil setecientos cuarenta y siete", "Galimard": "galimar", "Süskind": "suskind", "Süskind{suskind}.": "suskind", "UNESCO": "unesco"}
ALINEAR = {"1747": "1747"}
SELLOS = [
    ("cuero", "apestaban", "¡PUAJ!", (150, 210, 60), 1.0),
    ("idea", "guantes", "¡IDEA!", (255, 214, 0), 1.1),
    ("corte", "moda", "¡DE MODA!", (255, 214, 0), 1.0),
    ("final", "unesco", "¡PATRIMONIO!", (255, 214, 0), 1.3),
    ("galimard", "anio", "¡DESDE 1747!", (255, 214, 0), 1.1),
    ("museo", "narices", "¡NARICES!", (255, 214, 0), 1.0),
]
GOLPES = [("gancho", "olor", 0.6, 0.0), ("cuero", "apestaban", 0.8, 0.0), ("idea", "guantes", 0.6, 0.2), ("final", "unesco", 0.7, 0.2)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "olor"), "boing", None),
        (c("cuero", "grasse"), "pop", None), (c("cuero", "cuero"), "pop", None), (c("cuero", "apestaban"), "golpe", None),
        (c("idea", "idea"), "ding", None), (c("idea", "guantes"), "golpe", None), (c("idea", "flores"), "pop", None),
        (c("corte", "moda"), "golpe", None), (c("corte", "catalina"), "ding", None),
        (c("cambio", "guanteros"), "pop", None), (c("cambio", "perfume"), "ding", None),
        (c("final", "unesco"), "golpe", None), (c("final", "feo"), "boing", None),
        (c("clima", "jazmin"), "pop", None), (c("clima", "rosa"), "pop", None), (c("clima", "nardo"), "pop", None),
        (c("galimard", "anio"), "golpe", None), (c("galimard", "luis"), "ding", None),
        (c("novela", "novela"), "pop", None), (c("novela", "perfume"), "ding", None),
        (c("museo", "museo"), "ding", None), (c("museo", "narices"), "boing", None),
        (c("fiestas", "rosa2"), "pop", None), (c("fiestas", "jazmin2"), "pop", None),
    ]
