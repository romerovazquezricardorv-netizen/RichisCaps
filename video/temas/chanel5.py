"""Tema: la historia de Chanel N.º 5 (dinámico, un poco cómico, sin etiquetas, ~60 s).

Datos (revisados): creado en 1921 por el perfumista Ernest Beaux para Coco Chanel; ella eligió la quinta muestra;
el 5 era su número de la suerte y se presentó el 5 de mayo de 1921; usó aldehídos en dosis inusualmente altas;
frasco simple frente a los frascos recargados de la época; en 1924 se creó Parfums Chanel con los Wertheimer y ella
se quedó con el 10 % (pasó años en disputas); en 1952 Marilyn Monroe dijo en una entrevista que para dormir solo
usaba unas gotas de N.º 5. Sigue entre los perfumes más vendidos del mundo.
Visuales: frasco genérico (no se copia el frasco ni el logo reales) y personajes propios, sin representar a personas reales.
"""

ESCENA = "chanel.js"
SALIDA = "historia-chanel-5.mp4"

GUION = [
    ("gancho", ["Este perfume tiene más de *cien años*{cien}", "y sigue siendo de los más vendidos del *mundo*{mundo}.",
                "Todo empezó con un número{num}... y un poco de *suerte*{suerte}."]),
    ("paris", ["1921.", "La diseñadora *Coco Chanel*{coco} quería un perfume diferente:", "que no oliera a una sola *flor*{flor},",
               "sino a *mujer*{mujer}."]),
    ("muestras", ["El perfumista *Ernest Beaux*{beaux} le preparó varias muestras{muestras},", "ella las olió una por una{olio}...",
                  "y escogió la *número cinco*{cinco}."]),
    ("suerte", ["¿Casualidad?", "El cinco era su número de la *suerte*{suerte},", "así que lo lanzó el *cinco de mayo*{mayo}."]),
    ("secreto", ["Su secreto: los *aldehídos*{alde},", "moléculas de laboratorio", "que le dan un brillo como de *champaña*{champ}."]),
    ("frasco", ["Y en lugar de un frasco lleno de adornos{adornos},", "eligió uno *simple*{simple}, casi de laboratorio."]),
    ("drama", ["Pero hubo drama:", "en 1924 firmó un trato", "y se quedó con apenas el *diez por ciento*{diez},",
               "y pasó años *peleando*{pelea} por su propio perfume."]),
    ("noche", ["Y en 1952,", "le preguntaron a Marilyn Monroe qué usaba para *dormir*{dormir}.", "Su respuesta:",
               "*unas gotas*{gotas} de Chanel número cinco."]),
    ("final", ["Desde entonces,", "es *leyenda*{leyenda}.", "¿Tú ya lo has probado{prob}?"]),
]
DICHO = {"1921": "mil novecientos veintiuno", "1924": "mil novecientos veinticuatro", "1952": "mil novecientos cincuenta y dos"}

PILDORAS = {}   # sin etiquetas: solo los subtítulos de la voz


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "mundo"), "pop", None), (c("gancho", "suerte"), "ding", None),
        (c("paris", "flor"), "pop", None), (c("paris", "mujer"), "tin", 0),
        (c("muestras", "cinco"), "ding", None), (c("suerte", "suerte"), "tin", 1), (c("suerte", "mayo"), "pop", None),
        (c("secreto", "champ"), "pop", None), (c("frasco", "adornos"), "boing", None), (c("frasco", "simple"), "ding", None),
        (c("drama", "diez"), "boing", None), (c("drama", "pelea"), "boom", None),
        (c("noche", "dormir"), "tin", 2), (c("noche", "gotas"), "tin", 3),
        (c("final", "leyenda"), "boom", None), (c("final", "prob"), "pop", None),
    ]
