"""Tema: ¿cuántas flores se necesitan para un perfume? (estilo cómic, ~45 s)

Datos (revisados): para 1 kg de aceite esencial de rosa (rose otto) se necesitan unas 3.5 a 5 toneladas de pétalos
(alrededor de 4 toneladas es la cifra más citada, más de un millón de flores); la rosa se cosecha a mano temprano en la
mañana porque con el calor pierde aroma. Para 1 kg de absoluto de jazmín se necesitan cientos de kilos de flores
(~660 kg según Firmenich), es decir millones de florecitas (6-7 millones). El aceite de rosa cuesta miles de dólares el
kilo; por eso muchos perfumes usan también versiones sintéticas.
Versión larga (~1:09): rosa de mayo (Rosa centifolia) de Grasse, que florece solo unas semanas; raíz de iris que se
seca unos tres años antes de extraer su esencia, de las más caras; vainilla polinizada a mano flor por flor fuera de
México.
"""
from temas._comun_comic import *

ESCENA = "flores.js"
SALIDA = "perfume-flores.mp4"

GUION = [
    ("gancho", ["Para sacar *un kilo*{kilo} de aceite de rosa,", "se necesitan unas *cuatro toneladas*{toneladas} de pétalos."]),
    ("rosas", ["Eso es más de *un millón*{millon} de flores{flores},", "cortadas a mano y al amanecer{amanecer},", "porque con el calor pierden su aroma{calor}."]),
    ("mayo", ["Y hay rosas que casi no se dejan{casi}:", "la *rosa de mayo*{mayo} de Grasse florece solo unas semanas al año{semanas}."]),
    ("jazmin", ["Con el *jazmín*{jazmin} es igual de intenso{intenso}:", "para un kilo de su esencia{kilo2},", "hacen falta como *siete millones*{siete} de florecitas{florecitas}."]),
    ("iris", ["¿Y el *iris*{iris}?", "Su raíz se deja secar unos *tres años*{tres}", "antes de sacarle la esencia{esencia},", "y es de las más *caras*{caras} del mundo."]),
    ("vainilla", ["La *vainilla*{vainilla} tampoco se queda atrás{atras}:", "fuera de México, cada flor se poliniza *a mano*{mano},", "una por una{una}."]),
    ("lavanda", ["En Provenza, la *lavanda*{lavanda} pinta los campos de morado{morado},", "y se cosecha en pleno verano{verano}."]),
    ("oud", ["¿Y el *oud*{oud}?", "Sale de un árbol, el agar{agar}, cuando lo ataca un *hongo*{hongo}.", "Es tan caro que le dicen *oro líquido*{oro}."]),
    ("azahar", ["Y del naranjo amargo salen *tres*{tres2} esencias distintas{distintas}:", "de la flor, el *azahar*{azahar} y el neroli{neroli},", "y de las hojas, el *petitgrain*{petit}."]),
    ("caro", ["Por eso el aceite de rosa cuesta *miles de dólares*{miles} el kilo{kilo3},", "y muchos perfumes usan también versiones *sintéticas*{sint}."]),
    ("final", ["Así que la próxima vez que huelas rosa en tu perfume{rosa},", "piensa en esa *montaña*{montana} de pétalos.", "¿Tú lo sabías{sabias}?"]),
]
DICHO = {"oud": "ud", "*oud*{oud}?": "ud", "petitgrain": "petigrán", "neroli": "néroli"}
SELLOS = [
    ("gancho", "toneladas", "¡4 TONELADAS!", (255, 214, 0), 1.3),
    ("rosas", "millon", "+1 000 000", (255, 214, 0), 1.2),
    ("jazmin", "siete", "7 MILLONES", (255, 214, 0), 1.3),
    ("caro", "miles", "$$$", (150, 210, 60), 1.0),
    ("iris", "tres", "¡3 AÑOS!", (255, 214, 0), 1.1),
    ("vainilla", "mano", "¡A MANO!", (255, 214, 0), 1.0),
    ("oud", "oro", "¡ORO LÍQUIDO!", (255, 214, 0), 1.2),
]
GOLPES = [("gancho", "toneladas", 0.9, 0.2), ("rosas", "millon", 0.6, 0.0), ("jazmin", "siete", 0.7, 0.0), ("caro", "miles", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "kilo"), "tin", 1), (c("gancho", "toneladas"), "boom", None),
        (c("rosas", "millon"), "golpe", None), (c("rosas", "amanecer"), "ding", None),
        (c("jazmin", "jazmin"), "pop", None), (c("jazmin", "siete"), "golpe", None),
        (c("caro", "miles"), "ding", None), (c("caro", "sint"), "pop", None),
        (c("final", "montana"), "boom", None), (c("final", "sabias"), "pop", None),
        (c("mayo", "mayo"), "pop", None), (c("mayo", "semanas"), "tin", 1),
        (c("iris", "iris"), "pop", None), (c("iris", "tres"), "golpe", None), (c("iris", "caras"), "ding", None),
        (c("vainilla", "vainilla"), "pop", None), (c("vainilla", "mano"), "golpe", None),
        (c("lavanda", "lavanda"), "pop", None), (c("oud", "hongo"), "boing", None), (c("oud", "oro"), "golpe", None),
        (c("azahar", "tres2"), "pop", None), (c("azahar", "azahar"), "tin", 2), (c("azahar", "petit"), "ding", None),
    ]
