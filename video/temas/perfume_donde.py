"""Tema: ¿dónde ponerte el perfume para que dure más? (estilo cómic, ~45 s)

Datos (revisados, guías de perfumería): los puntos de pulso (muñecas, cuello, detrás de las orejas, dentro de los codos)
son más calientes y ayudan a que el aroma se desarrolle; la piel hidratada (crema sin olor) retiene mejor el perfume que
la seca; en el cabello dura, pero conviene rociarlo de lejos porque el alcohol reseca; no frotar y no guardarlo en el baño.
Versión larga (~1:09): cuántas atomizaciones (2 a 4), la ropa (dura pero puede manchar telas delicadas), el sol
(algunos cítricos pueden manchar la piel con sol directo) y la fatiga olfativa (tu nariz se acostumbra; los demás sí te
huelen).
"""
from temas._comun_comic import *

ESCENA = "donde.js"
SALIDA = "perfume-donde-ponerlo.mp4"

GUION = [
    ("gancho", ["¿Te echas perfume y a las dos horas ya no hueles a nada{nada}?", "Seguro te lo pones en el lugar *equivocado*{equivocado}."]),
    ("puntos", ["Los mejores lugares son donde tu piel está más *calientita*{calor}:", "las *muñecas*{munecas}, el *cuello*{cuello},",
                "detrás de las *orejas*{orejas}, dentro de los *codos*{codos},", "y hasta detrás de las *rodillas*{rodillas}."]),
    ("cuantos", ["¿Y cuántas veces lo rocías{cuantas}?", "De *dos a cuatro*{dos} es suficiente.", "Si te pasas{pasas}, *mareas*{mareas} a todo el que pase."]),
    ("momento", ["¿Y el mejor momento{momento}?", "Justo después de bañarte{banarte}, con la piel limpia{limpia} y todavía calientita{calientita}."]),
    ("crema", ["Truco{truco}: ponte *crema sin olor*{crema} antes.", "La piel seca deja escapar el perfume{seca},", "y la hidratada lo *atrapa*{atrapa}."]),
    ("cabello", ["En el *cabello*{cabello} también dura muchísimo{dura},", "pero rocíalo de lejos{lejos}, porque el alcohol lo reseca{reseca}."]),
    ("ropa", ["¿Y en la *ropa*{ropa}?", "Dura bastante{bastante},", "pero puede *manchar*{manchar} las telas delicadas{telas}."]),
    ("sol", ["Y cuidado con el *sol*{sol}:", "algunos perfumes con cítricos pueden *manchar la piel*{piel} si te da el sol directo{directo}."]),
    ("no", ["Y lo que *no*{no} debes hacer:", "frotarte las muñecas{frotar},", "ni guardarlo en el *baño*{bano}."]),
    ("nariz", ["Y si a la hora ya no lo hueles{nolo}, no te eches más{mas}:", "tu nariz se *acostumbró*{acost},", "pero los demás sí te huelen{demas}."]),
    ("final", ["Póntelo bien, y te va a durar todo el día{dia}.", "¿Tú dónde te lo pones{donde}?"]),
]
DICHO = {}
SELLOS = [
    ("gancho", "equivocado", "¡ERROR!", (255, 214, 0), 1.0),
    ("crema", "truco", "¡TRUCO!", (255, 214, 0), 1.0),
    ("no", "frotar", "¡NO FROTES!", (232, 38, 58), 1.0),
    ("cuantos", "dos", "2 – 4", (255, 214, 0), 1.0),
    ("sol", "piel", "¡OJO CON EL SOL!", (255, 214, 0), 1.1),
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
        (c("cuantos", "dos"), "tin", 1), (c("cuantos", "mareas"), "boing", None),
        (c("ropa", "ropa"), "pop", None), (c("ropa", "manchar"), "boing", None),
        (c("sol", "sol"), "ding", None), (c("sol", "piel"), "golpe", None),
        (c("nariz", "acost"), "pop", None), (c("nariz", "demas"), "ding", None),
        (c("puntos", "rodillas"), "pop", None), (c("momento", "banarte"), "ding", None),
    ]
