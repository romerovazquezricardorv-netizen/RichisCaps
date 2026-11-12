"""Tema (respuesta a un comentario): «¿A poco se echa a perder?» — sí, el perfume se echa a perder (~40 s)

Respuesta al comentario del video del refri. Se sube con "Responder con video" para que la red social ponga sola la
etiqueta del comentario arriba.

Datos (revisados): el perfume no trae una fecha de caducidad exacta; bien guardado suele durar de 3 a 5 años y algunos
mucho más. Lo degradan la luz, el calor y el oxígeno (entra más aire conforme se vacía el frasco). Señales: color más
oscuro, olor agrio, a vinagre o metálico, y que ya no huela como antes (las notas de salida son las primeras en irse).
Los cítricos y frescos se echan a perder antes; los amaderados y ámbar (con más notas de fondo) aguantan más.
"""

ESCENA = "caduca.js"
SALIDA = "perfume-se-echa-a-perder.mp4"

GUION = [
    ("gancho", ["¿A poco el perfume se echa a *perder*{perder}?", "*Sí*{si}.", "Pero no como la leche{leche}."]),
    ("caduca", ["No tiene una fecha de caducidad *exacta*{exacta}:", "bien guardado, dura en promedio de *tres a cinco años*{anos},",
                "y algunos, muchísimo más{mas}."]),
    ("enemigos", ["Lo que lo echa a perder son tres cosas{tres}:", "la *luz*{luz},", "el *calor*{calor},",
                  "y el *aire*{aire} que entra conforme se va vaciando el frasco{vacia}."]),
    ("senales", ["¿Cómo saber si ya se echó a perder{como}?", "Se pone más *oscuro*{color},",
                 "huele *agrio*{agrio}, como a vinagre o a metal{vinagre},", "o ya no huele a lo que *olía*{olia} antes."]),
    ("cuales", ["Los *cítricos*{citricos} y los frescos se echan a perder más rápido{rapido},",
                "y los *amaderados*{madera} aguantan más{aguantan}."]),
    ("final", ["Así que si tienes uno guardado hace años{guardado}...", "*huélelo*{huele} antes de usarlo.",
               "¿Tú tienes alguno así{tienes}?"]),
]
DICHO = {}

PILDORAS = {}

SELLOS = [
    ("gancho", "si", "¡SÍ!", (232, 38, 58), 1.0),
    ("caduca", "anos", "3 A 5 AÑOS", (196, 138, 36), 1.6),
    ("senales", "agrio", "¡AGRIO!", (110, 160, 40), 1.1),
]
SELLO_Y = 1250

GOLPES = [
    ("gancho", "si", 0.9, 0.35), ("caduca", "anos", 0.6, 0.0), ("enemigos", "luz", 0.4, 0.0), ("enemigos", "calor", 0.4, 0.0),
    ("enemigos", "aire", 0.4, 0.0), ("senales", "agrio", 0.7, 0.0), ("final", "huele", 0.5, 0.0),
]

BARRA = False
MUSICA = "energica"


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "perder"), "boing", None), (c("gancho", "si"), "golpe", None), (c("gancho", "leche"), "boing", None),
        (c("caduca", "anos"), "golpe", None), (c("caduca", "mas"), "ding", None),
        (c("enemigos", "luz"), "pop", None), (c("enemigos", "calor"), "pop", None), (c("enemigos", "aire"), "whoosh", None),
        (c("senales", "color"), "tin", 1), (c("senales", "agrio"), "golpe", None), (c("senales", "olia"), "boing", None),
        (c("cuales", "rapido"), "whoosh", None), (c("cuales", "aguantan"), "ding", None),
        (c("final", "huele"), "spray", None), (c("final", "tienes"), "pop", None),
    ]
