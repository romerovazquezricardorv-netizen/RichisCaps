"""Tema: la historia de Creed Aventus (estilo cómic, ~45 s)

Datos (revisados): Aventus salió en 2010 (Olivier Creed); la marca dice que se inspiró en Napoleón (guerra, paz y
romance). Es famoso por su salida de piña con un fondo ahumado de abedul. La comunidad compara sus lotes ("batches")
porque varían un poco entre producciones. Es de los perfumes más clonados. En 2023 Kering Beauté compró Creed por unos
3 500 millones de euros (cifra del Financial Times). Los frascos son modelos genéricos.
Versión larga (~1:09): la historia "desde 1760" que la marca presume y que varios expertos cuestionan (Glossy);
en 2026 Creed pasó a L'Oréal junto con Kering Beauté.
"""
from temas._comun_comic import *

ESCENA = "aventus.js"
SALIDA = "perfume-aventus.mp4"

GUION = [
    ("gancho", ["¿Qué perfume ayudó a que una marca se vendiera en *tres mil quinientos millones de euros*{euros}?"]),
    ("origen", ["Es *Aventus*{aventus}, de Creed{creed}.", "Lo crearon Olivier Creed y su hijo Erwin{erwin}, y salió en 2010{anio}.",
                "La marca dice que se inspiró en *Napoleón*{napoleon}:", "guerra, paz y romance{romance}."]),
    ("olor", ["Su firma: *piña*{pina},", "con un toque *ahumado*{humo} de abedul{abedul}."]),
    ("exito", ["En redes le dicen *el olor del éxito*{exito2},", "y se volvió de los perfumes de nicho más vendidos{nicho}."]),
    ("lotes", ["Y algo que lo volvió leyenda{leyenda}:", "cada *lote*{lote} huele un poquito distinto{distinto},", "y la gente compara lotes como si fueran *vinos*{vinos}."]),
    ("clones", ["Es tan famoso que es de los perfumes más *clonados*{clones} del mundo{mundo}."]),
    ("precio", ["Y no es barato{barato}: el original cuesta *cientos de dólares*{precio},", "mientras sus clones cuestan una *fracción*{fraccion}.",
                "Los fans hasta revisan el *código del lote*{codigo} en la base del frasco{base},", "y discuten cuál lote es el mejor{debate}."]),
    ("historia", ["Ojo con un detalle{detalle}: la marca presume una historia desde *1760*{anio2},", "pero varios expertos la *cuestionan*{cuestionan}."]),
    ("venta", ["En 2023, Kering compró Creed por esos *tres mil quinientos millones*{venta}.", "Y Aventus era su joya de la corona{joya}."]),
    ("loreal", ["Y la historia sigue{sigue}:", "en 2026, Creed pasó a manos de *L'Oréal*{loreal},", "junto con toda la belleza de Kering{kering}."]),
    ("final", ["¿Tú ya lo oliste{olido}?"]),
]
DICHO = {"1760": "mil setecientos sesenta", "2026": "dos mil veintiséis", "L'Oréal{loreal},": "loreál", "2010": "dos mil diez", "2023": "dos mil veintitrés", "Creed": "crid", "Creed,": "crid", "Kering": "kéring", "Aventus": "aventus", "Olivier": "olivié", "Erwin": "erwin"}
ALINEAR = {"2010": "2010", "2023": "2023", "1760": "1760", "1760*{anio2},": "1760", "2026": "2026", "2026,": "2026"}
SELLOS = [
    ("gancho", "euros", "3 500 MILLONES", (150, 210, 60), 1.4),
    ("olor", "pina", "¡PIÑA!", (255, 214, 0), 1.0),
    ("lotes", "lote", "LOTE 1 ≠ LOTE 2", (255, 214, 0), 1.2),
    ("clones", "clones", "¡CLONES!", (255, 214, 0), 1.0),
    ("historia", "cuestionan", "¿1760?", (255, 214, 0), 1.1),
    ("exito", "exito2", "¡EL OLOR DEL ÉXITO!", (255, 214, 0), 1.2),
]
GOLPES = [("gancho", "euros", 0.8, 0.25), ("origen", "napoleon", 0.5, 0.0), ("lotes", "lote", 0.6, 0.0), ("clones", "clones", 0.7, 0.0), ("venta", "venta", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "euros"), "golpe", None), (c("origen", "aventus"), "pop", None), (c("origen", "napoleon"), "boom", None),
        (c("olor", "pina"), "pop", None), (c("olor", "humo"), "pop", None),
        (c("lotes", "lote"), "golpe", None), (c("lotes", "vinos"), "ding", None),
        (c("clones", "clones"), "golpe", None), (c("venta", "venta"), "ding", None), (c("final", "olido"), "pop", None),
        (c("historia", "anio2"), "pop", None), (c("historia", "cuestionan"), "boing", None),
        (c("loreal", "loreal"), "golpe", None), (c("loreal", "kering"), "ding", None),
        (c("precio", "precio"), "ding", None), (c("precio", "fraccion"), "boing", None), (c("precio", "codigo"), "pop", None),
        (c("exito", "exito2"), "golpe", None), (c("exito", "nicho"), "ding", None),
    ]
