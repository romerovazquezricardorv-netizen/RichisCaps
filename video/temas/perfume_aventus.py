"""Tema: la historia de Creed Aventus (estilo cómic, ~45 s)

Datos (revisados): Aventus salió en 2010 (Olivier Creed); la marca dice que se inspiró en Napoleón (guerra, paz y
romance). Es famoso por su salida de piña con un fondo ahumado de abedul. La comunidad compara sus lotes ("batches")
porque varían un poco entre producciones. Es de los perfumes más clonados. En 2023 Kering Beauté compró Creed por unos
3 500 millones de euros (cifra del Financial Times). Los frascos son modelos genéricos.
"""
from temas._comun_comic import *

ESCENA = "aventus.js"
SALIDA = "perfume-aventus.mp4"

GUION = [
    ("gancho", ["¿Qué perfume ayudó a que una marca se vendiera en *tres mil quinientos millones de euros*{euros}?"]),
    ("origen", ["Es *Aventus*{aventus}, de Creed{creed}.", "Salió en 2010{anio}, y la marca dice que se inspiró en *Napoleón*{napoleon}:",
                "guerra, paz y romance{romance}."]),
    ("olor", ["Su firma: *piña*{pina},", "con un toque *ahumado*{humo} de abedul{abedul}."]),
    ("lotes", ["Y algo que lo volvió leyenda{leyenda}:", "cada *lote*{lote} huele un poquito distinto{distinto},", "y la gente compara lotes como si fueran *vinos*{vinos}."]),
    ("clones", ["Es tan famoso que es de los perfumes más *clonados*{clones} del mundo{mundo}."]),
    ("venta", ["En 2023, Kering compró Creed por esos *tres mil quinientos millones*{venta}.", "Y Aventus era su joya de la corona{joya}."]),
    ("final", ["¿Tú ya lo oliste{olido}?"]),
]
DICHO = {"2010": "dos mil diez", "2023": "dos mil veintitrés", "Creed": "crid", "Creed,": "crid", "Kering": "kéring", "Aventus": "aventus"}
ALINEAR = {"2010": "2010", "2023": "2023"}
SELLOS = [
    ("gancho", "euros", "3 500 MILLONES", (150, 210, 60), 1.4),
    ("olor", "pina", "¡PIÑA!", (255, 214, 0), 1.0),
    ("lotes", "lote", "LOTE 1 ≠ LOTE 2", (255, 214, 0), 1.2),
    ("clones", "clones", "¡CLONES!", (255, 214, 0), 1.0),
]
GOLPES = [("gancho", "euros", 0.8, 0.25), ("origen", "napoleon", 0.5, 0.0), ("lotes", "lote", 0.6, 0.0), ("clones", "clones", 0.7, 0.0), ("venta", "venta", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "euros"), "golpe", None), (c("origen", "aventus"), "pop", None), (c("origen", "napoleon"), "boom", None),
        (c("olor", "pina"), "pop", None), (c("olor", "humo"), "pop", None),
        (c("lotes", "lote"), "golpe", None), (c("lotes", "vinos"), "ding", None),
        (c("clones", "clones"), "golpe", None), (c("venta", "venta"), "ding", None), (c("final", "olido"), "pop", None),
    ]
