"""Tema: ¿cuánto cuesta fabricar un perfume de diseñador? (estilo cómic, línea de fábrica con contador, ~45 s)

Datos (revisados, cifras aproximadas del sector): en un perfume de diseñador de ~100 dólares, el líquido (unos 15 ml
de esencia en un eau de parfum de 100 ml, el resto alcohol) cuesta del orden de 3 a 10 dólares; el vidrio solo cuesta
alrededor de 1 dólar, y el frasco decorado con tapa y atomizador puede llegar a unos 8; la caja y el empaque suman unos
cuantos dólares. El resto del precio es tienda, publicidad y ganancia.
"""
from temas._comun_comic import *

ESCENA = "fabricar.js"
SALIDA = "perfume-cuanto-cuesta-fabricar.mp4"

GUION = [
    ("gancho", ["¿Cuánto cuesta *fabricar*{fabricar} un perfume de diseñador de unos cien dólares{cien}?"]),
    ("liquido", ["Empecemos por el *líquido*{liquido}:", "unos quince mililitros de esencia{esencia}, y lo demás es alcohol{alcohol}.",
                 "Todo eso cuesta entre *tres y diez dólares*{tres}."]),
    ("frasco", ["El *frasco*{frasco}: el vidrio solo cuesta como un dólar{dolar},", "pero ya decorado, con tapa y atomizador{tapa}, puede llegar a unos *ocho*{ocho}."]),
    ("caja", ["La *caja*{caja} y el empaque{empaque}:", "unos cuantos dólares más{mas}."]),
    ("total", ["Total{total}: fabricarlo cuesta unos *veinte dólares*{veinte}, y a veces menos{menos}.", "Lo demás se va en tienda{tienda}, publicidad{publi} y ganancia{ganancia}."]),
    ("final", ["Así que sí: pagas más por el *nombre*{nombre} que por el olor{olor}.", "¿Te sorprende{sorprende}?"]),
]
DICHO = {}
SELLOS = [
    ("liquido", "tres", "$3 – $10", (150, 210, 60), 1.1),
    ("frasco", "ocho", "HASTA $8", (150, 210, 60), 1.0),
    ("total", "veinte", "≈ $20", (255, 214, 0), 1.3),
    ("final", "nombre", "¡EL NOMBRE!", (255, 214, 0), 1.0),
]
GOLPES = [("liquido", "tres", 0.5, 0.0), ("frasco", "ocho", 0.5, 0.0), ("total", "veinte", 0.9, 0.25), ("final", "nombre", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "fabricar"), "pop", None), (c("liquido", "liquido"), "tin", 1), (c("liquido", "tres"), "ding", None),
        (c("frasco", "frasco"), "pop", None), (c("frasco", "ocho"), "ding", None),
        (c("caja", "caja"), "pop", None), (c("caja", "mas"), "ding", None),
        (c("total", "veinte"), "golpe", None), (c("total", "publi"), "pop", None),
        (c("final", "nombre"), "golpe", None), (c("final", "sorprende"), "pop", None),
    ]
