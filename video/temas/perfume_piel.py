"""Tema: ¿por qué un perfume huele diferente en cada persona? (tono divertido, hablándole al espectador)

Datos que se usan (revisados): la grasa de la piel retiene el perfume y la piel seca lo pierde antes; el calor acelera
la evaporación; las bacterias de la piel producen nuestro olor natural, que se mezcla con el perfume; hay
"anosmia específica" (mucha gente no detecta ciertos almizcles); la nariz se adapta a un olor constante.
Se deja fuera el pH, que se repite mucho pero tiene poca evidencia.
"""

ESCENA = "piel.js"
SALIDA = "perfume-en-cada-piel.mp4"

GUION = [
    ("gancho", ["¿Te ha pasado?", "Hueles un perfume *increíble*{wow} en alguien,", "corres a comprarlo{compra}...",
                "y en ti huele a *jarabe para la tos*{jarabe}."]),
    ("noeres", ["Tranquilo,", "no estás maldito{mal}:", "tu piel está haciendo *química*{quim}."]),
    ("cocina", ["Piénsalo así:", "el perfume es la receta{receta},", "y tu piel es la *cocina*{cocina}.",
                "Misma receta,", "pero cada quien la cocina *diferente*{dif}."]),
    ("grasa", ["Si tu piel es *grasosa*{grasa},", "el perfume se agarra y dura más.", "Si es *seca*{seca},",
               "se evapora rapidísimo...", "y te deja *plantado*{plant}."]),
    ("calor", ["Luego está el *calor*{calor}:", "entre más caliente tu piel, más rápido sale el aroma.",
               "Por eso en el gym tu perfume *grita*{grita}...", "y en invierno, apenas *susurra*{susurra}."]),
    ("bacterias", ["Y lo más loco:", "en tu piel viven *millones de bacterias*{bact}", "que crean tu olor natural,",
                   "y ese olor se *mezcla*{mezcla} con tu perfume."]),
    ("nariz", ["Pero espérate,", "que también influye *tu nariz*{nariz}:", "hay gente que literalmente",
               "*no puede oler*{noole} ciertos almizcles."]),
    ("fatiga", ["Y después de un rato,", "tu nariz se *acostumbra*{acost} y deja de olerte...",
                "aunque los demás sí te huelen{otros}."]),
    ("consejo", ["Así que el truco:", "nunca compres un perfume por cómo huele en otra persona.",
                 "*Pruébalo en tu piel*{prueba},", "espera unos minutos{espera},", "y ahí sí, *decide*{decide}."]),
    ("final", ["Y si en ti huele a jarabe...", "no era tu perfume{noera}.", "¿A ti cuál te ha *traicionado*{trai}?"]),
]
DICHO = {}

PILDORAS = {
    "gancho": [("wow", "En otra persona", "huele increíble"), ("jarabe", "En ti", "huele a jarabe")],
    "noeres": [("quim", "No estás maldito", "es química")],
    "cocina": [("cocina", "Perfume = receta", "tu piel = la cocina")],
    "grasa": [("grasa", "Piel grasosa", "el perfume dura más"), ("seca", "Piel seca", "se evapora más rápido")],
    "calor": [("calor", "Más calor", "más proyección"), ("grita", "En el gym", "GRITA"), ("susurra", "En invierno", "susurra")],
    "bacterias": [("bact", "Millones de bacterias", "crean tu olor natural")],
    "nariz": [("noole", "Anosmia específica", "no detectan ciertos almizcles")],
    "fatiga": [("acost", "Adaptación olfativa", "tu nariz se acostumbra")],
    "consejo": [("prueba", "Pruébalo en tu piel", "y espera unos minutos")],
}


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "wow"), "pop", None), (c("gancho", "jarabe"), "boing", None), (c("gancho", "compra") - 0.1, "spray", None),
        (c("noeres", "quim"), "pop", None), (c("cocina", "dif"), "pop", None), (c("cocina", "receta"), "tin", 0),
        (c("grasa", "seca"), "tin", 1), (c("grasa", "plant"), "boing", None),
        (c("calor", "grita"), "boom", None), (c("calor", "susurra"), "tin", 2),
        (c("bacterias", "bact"), "pop", None), (c("bacterias", "mezcla"), "pop", None),
        (c("nariz", "noole"), "boing", None), (c("fatiga", "acost"), "tin", 3),
        (c("consejo", "decide"), "ding", None), (c("final", "trai"), "boom", None), (c("final", "noera"), "boing", None),
    ]
