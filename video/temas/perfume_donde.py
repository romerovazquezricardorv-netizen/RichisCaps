"""Tema: ¿dónde ponerte el perfume para que dure más? (estilo cómic, ~45 s)

Datos (revisados, guías de perfumería): los puntos de pulso (muñecas, cuello, detrás de las orejas, dentro de los codos)
son más calientes y ayudan a que el aroma se desarrolle; la piel hidratada (crema sin olor) retiene mejor el perfume que
la seca; en el cabello dura, pero conviene rociarlo de lejos porque el alcohol reseca; no frotar y no guardarlo en el baño.
"""
from temas._comun_comic import *

ESCENA = "donde.js"
SALIDA = "perfume-donde-ponerlo.mp4"

GUION = [
    ("gancho", ["¿Te echas perfume y a las dos horas ya no hueles a nada{nada}?", "Seguro te lo pones en el lugar *equivocado*{equivocado}."]),
    ("puntos", ["Los mejores lugares son donde tu piel está más *calientita*{calor}:", "las *muñecas*{munecas}, el *cuello*{cuello},",
                "detrás de las *orejas*{orejas}, y dentro de los *codos*{codos}."]),
    ("crema", ["Truco{truco}: ponte *crema sin olor*{crema} antes.", "La piel seca deja escapar el perfume{seca},", "y la hidratada lo *atrapa*{atrapa}."]),
    ("cabello", ["En el *cabello*{cabello} también dura muchísimo{dura},", "pero rocíalo de lejos{lejos}, porque el alcohol lo reseca{reseca}."]),
    ("no", ["Y lo que *no*{no} debes hacer:", "frotarte las muñecas{frotar},", "ni guardarlo en el *baño*{bano}."]),
    ("final", ["Póntelo bien, y te va a durar todo el día{dia}.", "¿Tú dónde te lo pones{donde}?"]),
]
DICHO = {}
SELLOS = [
    ("gancho", "equivocado", "¡ERROR!", (255, 214, 0), 1.0),
    ("crema", "truco", "¡TRUCO!", (255, 214, 0), 1.0),
    ("no", "frotar", "¡NO FROTES!", (232, 38, 58), 1.0),
]
GOLPES = [("gancho", "equivocado", 0.8, 0.0), ("crema", "atrapa", 0.5, 0.0), ("no", "frotar", 0.7, 0.0), ("no", "bano", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "nada"), "boing", None), (c("gancho", "equivocado"), "golpe", None),
        (c("puntos", "munecas"), "pop", None), (c("puntos", "cuello"), "pop", None), (c("puntos", "orejas"), "pop", None), (c("puntos", "codos"), "pop", None),
        (c("crema", "crema"), "ding", None), (c("crema", "atrapa"), "pop", None),
        (c("cabello", "cabello"), "pop", None), (c("cabello", "reseca"), "boing", None),
        (c("no", "frotar"), "golpe", None), (c("no", "bano"), "boing", None),
        (c("final", "dia"), "ding", None), (c("final", "donde"), "pop", None),
    ]
