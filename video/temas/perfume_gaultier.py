"""Tema: ¿por qué los perfumes de Jean Paul Gaultier tienen forma de torso? (estilo cómic, ~40 s)

Datos (revisados): Classique (1993), el primer perfume de la marca, es un torso de mujer con corsé; el corsé es una
obsesión de Gaultier ligada a los corsés de su abuela (diseñó corsés para pasarela y para giras de estrellas del pop).
Le Male (1995) es un torso de hombre con la camiseta de rayas de marinero (la "marinière", su sello) y venía en una
lata metálica, que Gaultier comparó con las latas de comida del supermercado. Los frascos son modelos genéricos.
"""
from temas._comun_comic import *

ESCENA = "gaultier.js"
SALIDA = "perfume-gaultier-torso.mp4"

GUION = [
    ("gancho", ["¿Por qué los perfumes de Jean Paul Gaultier tienen forma de *cuerpo*{cuerpo}?"]),
    ("abuela", ["De niño, Gaultier veía los *corsés*{corses} de su abuela{abuela},", "y se volvieron su obsesión{obsesion}:",
                "los puso en pasarelas{pasarela}, y hasta en giras de estrellas del pop{pop}."]),
    ("classique", ["En 1993 lanzó su primer perfume, *Classique*{classique}:", "un frasco con forma de torso de mujer... *con corsé*{corse}."]),
    ("lemale", ["Dos años después llegó *Le Male*{lemale}:", "un torso de hombre con la camiseta de *rayas de marinero*{rayas},", "su sello personal{sello}."]),
    ("lata", ["Y en vez de una caja elegante, lo metió en una *lata*{lata},", "como las de comida del supermercado{super}."]),
    ("final", ["Por eso sus frascos parecen *esculturas*{escultura}:", "como si el perfume fuera otra *prenda*{prenda} de ropa.", "¿Tú tienes alguno{tienes}?"]),
]
DICHO = {"1993": "mil novecientos noventa y tres", "Jean": "yan", "Paul": "pol", "Gaultier": "goltié", "Gaultier,": "goltié", "Classique": "clasic", "Le": "le", "Male": "mal"}
ALINEAR = {"1993": "1993"}
SELLOS = [
    ("abuela", "corses", "¡CORSÉS!", (255, 214, 0), 1.0),
    ("classique", "corse", "¡CON CORSÉ!", (255, 214, 0), 1.1),
    ("lemale", "rayas", "¡RAYAS!", (90, 160, 255), 1.0),
    ("lata", "lata", "¿¡UNA LATA!?", (255, 214, 0), 1.2),
]
GOLPES = [("gancho", "cuerpo", 0.6, 0.0), ("classique", "corse", 0.6, 0.0), ("lemale", "rayas", 0.5, 0.0), ("lata", "lata", 0.8, 0.2)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "cuerpo"), "pop", None), (c("abuela", "corses"), "golpe", None), (c("abuela", "pasarela"), "pop", None), (c("abuela", "pop"), "ding", None),
        (c("classique", "classique"), "pop", None), (c("classique", "corse"), "golpe", None),
        (c("lemale", "lemale"), "pop", None), (c("lemale", "rayas"), "golpe", None),
        (c("lata", "lata"), "golpe", None), (c("lata", "super"), "boing", None),
        (c("final", "escultura"), "ding", None), (c("final", "tienes"), "pop", None),
    ]
