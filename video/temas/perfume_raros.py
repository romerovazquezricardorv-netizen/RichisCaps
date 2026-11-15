"""Tema: perfumes que huelen a cosas raras (estilo cómic, ~45 s)

Datos (revisados): Demeter Fragrance Library (EE. UU.) hace perfumes de cosas cotidianas; en 2006 sacó uno con olor a
Play-Doh por los 50 años de la plastilina. Su catálogo incluye Paperback (libro de bolsillo), Rain (lluvia), Dirt y
Petrichor (tierra mojada) y otros más raros como Earthworm (lombriz), Turpentine (aguarrás) y Funeral Home (funeraria).
El olfato está muy ligado a la memoria y las emociones.
Se evitan logotipos y diseños reales: la plastilina y los frascos son genéricos.
Versión larga (~1:09): Burger King "Flame" (2008), con un toque de carne a la parrilla; Pizza Hut Canadá (2012)
regaló unos cien frascos de un perfume con olor a masa de pizza.
"""
from temas._comun_comic import *

ESCENA = "raros.js"
SALIDA = "perfume-olores-raros.mp4"

GUION = [
    ("gancho", ["¿Te pondrías un perfume que huele a *plastilina*{plastilina}?", "Pues existe{existe}."]),
    ("demeter", ["Hay una marca, *Demeter*{demeter}, que hace perfumes de cosas de todos los días{cotidianas}.",
                 "En 2006 sacó uno con olor a *Play-Doh*{playdoh}, por sus cincuenta años{cincuenta}."]),
    ("libro", ["También tiene uno que huele a *libro*{libro},", "otro a *lluvia*{lluvia},", "y otro a *tierra mojada*{tierra}."]),
    ("petricor", ["Y ese olor a tierra mojada tiene nombre{nombre}: *petricor*{petricor},", "y tu nariz lo detecta aunque haya cantidades *diminutas*{diminutas}."]),
    ("raros", ["Y hay más raros{raros}:", "*lombriz*{lombriz},", "*aguarrás*{aguarras},", "y uno que se llama... *funeraria*{funeraria}."]),
    ("burger", ["Las marcas de comida también se animaron{comida}:", "en 2008, *Burger King* sacó un perfume", "con un toque de *carne a la parrilla*{parrilla}.",
                "Y en Japón lo volvieron a sacar en 2015{japon}... por un solo día{dia}."]),
    ("pizza", ["Y en 2012, *Pizza Hut* en Canadá regaló cien frascos{cien}", "de un perfume con olor a *masa de pizza*{pizza}."]),
    ("porque", ["¿Y por qué alguien compraría eso{porque}?", "Porque el olfato está pegado a tus *recuerdos*{recuerdos}:",
                "hueles algo de tu infancia{infancia}... y regresas{regresas}."]),
    ("proust", ["A eso le dicen el *efecto Proust*{proust}:", "un escritor francés contó cómo el sabor y el olor de una *magdalena*{magdalena}", "lo regresaron de golpe a su infancia{golpe}.",
                "Por eso estos perfumes se venden{venden}: no venden olor, venden *recuerdos*{recuerdos2}."]),
    ("final", ["¿A qué cosa rara te gustaría oler{oler}?"]),
]
DICHO = {"Burger": "burguer", "King": "king", "Pizza": "pitsa", "Hut": "jat", "2006": "dos mil seis", "Play-Doh": "pléi dou", "Demeter": "démeter"}
ALINEAR = {"2006": "2006", "Play-Doh": "play doh", "2008,": "2008", "2012,": "2012", "2015{japon}...": "2015"}
SELLOS = [
    ("gancho", "existe", "¡EXISTE!", (255, 214, 0), 1.0),
    ("libro", "tierra", "¡A TIERRA!", (150, 210, 60), 1.0),
    ("raros", "funeraria", "¿¡FUNERARIA!?", (255, 214, 0), 1.2),
    ("porque", "recuerdos", "¡RECUERDOS!", (255, 214, 0), 1.1),
    ("burger", "parrilla", "¡A PARRILLA!", (255, 214, 0), 1.1),
    ("pizza", "pizza", "¡A PIZZA!", (255, 214, 0), 1.1),
]
GOLPES = [("gancho", "existe", 0.7, 0.0), ("raros", "lombriz", 0.5, 0.0), ("raros", "funeraria", 0.9, 0.2), ("porque", "recuerdos", 0.5, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "plastilina"), "boing", None), (c("gancho", "existe"), "golpe", None),
        (c("demeter", "demeter"), "pop", None), (c("demeter", "playdoh"), "boing", None), (c("demeter", "cincuenta"), "ding", None),
        (c("libro", "libro"), "pop", None), (c("libro", "lluvia"), "tin", 1), (c("libro", "tierra"), "pop", None),
        (c("raros", "lombriz"), "boing", None), (c("raros", "aguarras"), "pop", None), (c("raros", "funeraria"), "golpe", None),
        (c("porque", "recuerdos"), "ding", None), (c("porque", "regresas"), "boing", None),
        (c("final", "oler"), "pop", None),
        (c("burger", "comida"), "pop", None), (c("burger", "parrilla"), "golpe", None),
        (c("pizza", "cien"), "pop", None), (c("pizza", "pizza"), "golpe", None),
        (c("burger", "dia"), "boing", None), (c("proust", "proust"), "pop", None), (c("proust", "magdalena"), "ding", None), (c("proust", "recuerdos2"), "golpe", None),
        (c("petricor", "petricor"), "ding", None), (c("petricor", "diminutas"), "pop", None),
    ]
