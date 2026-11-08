"""Tema: "¿Qué pasa si…?" — tú eres el perfumista que crea Chanel N.º 5 (versión interactiva, ~60 s, sin etiquetas).

Datos (revisados): 1921, París; Coco Chanel quería un perfume que no oliera a una sola flor; ingredientes conocidos de
la fórmula: jazmín, rosa, sándalo, vainilla y aldehídos en dosis altas (en exceso dan un tono jabonoso, bien dosificados
dan un efecto chispeante); el perfumista Ernest Beaux le presentó muestras numeradas y ella eligió la n.º 5.
Visuales: personajes y frasco propios (sin frasco/logo reales ni personas reales).
"""

ESCENA = "receta.js"
SALIDA = "chanel-5-receta.mp4"

GUION = [
    ("gancho", ["Es 1921, estás en *París*{paris},", "y Coco Chanel te pide algo *imposible*{imp}:",
                "un perfume que no huela a una sola flor.", "¿Qué haces{que}?"]),
    ("jazmin", ["Primero, agregas *jazmín*{jaz}...", "huele rico,", "pero huele a *jardín*{jard}."]),
    ("rosa", ["Agregas *rosa*{rosa}...", "ahora huele a *ramo de novia*{novia}."]),
    ("fondo", ["Le pones *sándalo*{sand} y *vainilla*{vain}...", "mejor,", "pero todavía *falta algo*{falta}."]),
    ("alde", ["Y aquí viene lo arriesgado:", "un chorrito de *aldehídos*{alde},", "moléculas de laboratorio."]),
    ("jabon", ["Si te pasas{pasas}...", "*¡pum!*{pum}", "huele a *jabón*{jabon}."]),
    ("brillo", ["Pero si le atinas{atinas}...", "brilla como *champaña*{champ}."]),
    ("muestras", ["Haces varias versiones,", "las numeras{num},", "se las das a probar{prueba}...", "y ella escoge{esc}...",
                  "¡la *número cinco*{cinco}!"]),
    ("felicidades", ["Felicidades:", "acabas de crear{crear} *Chanel número cinco*."]),
    ("real", ["Bueno...", "en realidad lo creó el perfumista *Ernest Beaux*{beaux}.", "Pero ahora tú ya sabes la *receta*{receta}."]),
    ("final", ["¿Qué ingrediente le hubieras agregado *tú*{tu}?"]),
]
DICHO = {"1921": "mil novecientos veintiuno", "Beaux": "Bo"}

PILDORAS = {}   # sin etiquetas: solo los subtítulos de la voz


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "imp"), "pop", None), (c("gancho", "que"), "boing", None),
        (c("jazmin", "jaz") + 0.35, "tin", 0), (c("jazmin", "jard"), "pop", None),
        (c("rosa", "rosa") + 0.35, "tin", 1), (c("rosa", "novia"), "ding", None),
        (c("fondo", "sand") + 0.35, "tin", 2), (c("fondo", "vain") + 0.35, "tin", 3), (c("fondo", "falta"), "boing", None),
        (c("alde", "alde"), "tin", 0), (c("jabon", "pum"), "boom", None), (c("jabon", "jabon"), "pop", None),
        (c("brillo", "champ"), "ding", None), (c("muestras", "cinco"), "ding", None),
        (c("felicidades", "crear"), "boom", None), (c("real", "beaux"), "boing", None), (c("real", "receta"), "pop", None),
        (c("final", "tu"), "pop", None),
    ]
