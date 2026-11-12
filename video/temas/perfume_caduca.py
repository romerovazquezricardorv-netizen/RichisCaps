"""Tema (respuesta a un comentario): «¿A poco se echa a perder?» — sí, el perfume se echa a perder (~40 s)

Respuesta al comentario del video del refri. Se sube con "Responder con video" para que la red social ponga sola la
etiqueta del comentario arriba.

Versión 2: no repite la pregunta al inicio (la etiqueta del comentario ya la muestra), tono con humor sin ser bobo,
sin lo del vinagre, transiciones de barrido y render con brillo (bloom).

Datos (revisados): el perfume no trae una fecha de caducidad exacta; bien guardado suele durar de 3 a 5 años y algunos
mucho más. Lo degradan la luz, el calor y el oxígeno (entra más aire conforme se vacía el frasco). Señales: color más
oscuro, olor agrio, y que ya no huela como antes (las notas de salida son las primeras en irse).
Los cítricos y frescos se echan a perder antes; los amaderados y ámbar (con más notas de fondo) aguantan más.
"""

ESCENA = "caduca.js"
SALIDA = "perfume-se-echa-a-perder.mp4"

GUION = [
    ("gancho", ["Tu perfume sí se echa a *perder*{perder}...", "solo que, a diferencia de la leche{leche},", "él *no te avisa*{avisa}."]),
    ("caduca", ["Bien guardado, aguanta de *tres a cinco años*{anos}.", "Algunos duran más que muchas *relaciones*{novio}."]),
    ("enemigos", ["Y tiene tres enemigos{tres}:", "la *luz*{luz},", "el *calor*{calor},",
                  "y el *aire*{aire}, que se mete conforme se va vaciando el frasco{vacia}."]),
    ("senales", ["¿Cómo saber si ya se echó a perder{como}?", "Se pone más *oscuro*{color},", "huele *agrio*{agrio},",
                 "o lo rocías y piensas{rocia}:", "este no es el perfume que *compré*{olia}."]),
    ("cuales", ["Los *cítricos*{citricos} son los primeros en rendirse{rapido}.", "Los *amaderados*{madera}...",
                "esos aguantan *todo*{aguantan}."]),
    ("final", ["Así que antes de echarte ese perfume que tienes guardado desde hace años{guardado},", "*huélelo*{huele}.",
               "Tu cita te lo va a *agradecer*{cita}.", "¿Cuál es el más viejo que tienes{tienes}?"]),
]
DICHO = {}

PILDORAS = {}

SELLOS = [
    ("gancho", "avisa", "NO TE AVISA", (232, 38, 58), 1.2),
    ("caduca", "anos", "3 A 5 AÑOS", (196, 138, 36), 1.5),
    ("senales", "agrio", "AGRIO", (110, 160, 40), 1.0),
    ("cuales", "aguantan", "AGUANTA TODO", (150, 90, 40), 1.1),
]
SELLO_Y = 1250

GOLPES = [
    ("gancho", "perder", 0.6, 0.2), ("gancho", "avisa", 0.8, 0.0), ("caduca", "anos", 0.6, 0.0), ("caduca", "novio", 0.5, 0.0),
    ("enemigos", "luz", 0.4, 0.0), ("enemigos", "calor", 0.4, 0.0), ("enemigos", "aire", 0.4, 0.0),
    ("senales", "agrio", 0.7, 0.0), ("senales", "olia", 0.6, 0.0), ("cuales", "rapido", 0.5, 0.0), ("cuales", "aguantan", 0.7, 0.2),
    ("final", "huele", 0.5, 0.0),
]
TRANSICIONES = True    # barrido rápido con desenfoque en cada cambio de escena

BARRA = False
MUSICA = "energica"


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "perder"), "boom", None), (c("gancho", "leche"), "pop", None), (c("gancho", "avisa"), "golpe", None),
        (c("caduca", "anos"), "golpe", None), (c("caduca", "novio"), "pop", None), (c("caduca", "novio") + 0.35, "boing", None),
        (c("enemigos", "luz"), "pop", None), (c("enemigos", "calor"), "pop", None), (c("enemigos", "aire"), "whoosh", None),
        (c("senales", "color"), "tin", 1), (c("senales", "agrio"), "golpe", None), (c("senales", "rocia"), "spray", None),
        (c("senales", "olia"), "boing", None),
        (c("cuales", "rapido"), "whoosh", None), (c("cuales", "madera"), "pop", None), (c("cuales", "aguantan"), "golpe", None),
        (c("final", "huele"), "spray", None), (c("final", "cita"), "ding", None), (c("final", "tienes"), "pop", None),
    ]
