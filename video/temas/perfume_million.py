"""Tema: ¿por qué el 1 Million viene en un lingote de oro? (estilo cómic, ~40 s)

Datos (revisados): 1 Million de Paco Rabanne salió en 2008; su nombre y su concepto juegan con el lujo, el dinero y el
exceso. El frasco con forma de lingote lo diseñó Noé Duchaufour-Lawrance: una placa de aluminio anodizado dorado.
Conecta con los vestidos de placas de metal que hicieron famoso a Paco Rabanne en los años sesenta. Es uno de los
perfumes de hombre más conocidos y vendidos. El lingote del video es un modelo genérico.
"""
from temas._comun_comic import *

ESCENA = "million.js"
SALIDA = "perfume-1-million-lingote.mp4"

GUION = [
    ("gancho", ["¿Por qué el *1 Million*{million} viene en un *lingote de oro*{lingote}?"]),
    ("nombre", ["Porque el nombre lo dice todo{todo}: *un millón*{unmillon}.", "Salió en 2008{anio},", "y la idea era que oliera a *lujo*{lujo} y a exceso{exceso}."]),
    ("frasco", ["El frasco lo diseñó Noé Duchaufour-Lawrance{noe}:", "una placa de *metal dorado*{metal}", "que parece un lingote de verdad{verdad}."]),
    ("paco", ["Y no es casualidad{casualidad}:", "Paco Rabanne se hizo famoso en los sesentas por sus *vestidos de metal*{vestidos}."]),
    ("exito", ["El resultado: uno de los perfumes de hombre más *vendidos*{vendidos},", "y uno de los frascos que más se reconocen{reconocen}."]),
    ("final", ["¿Te lo comprarías solo por el frasco{frasco2}?"]),
]
DICHO = {"2008": "dos mil ocho", "1": "uan", "Million": "mílion", "Noé": "noé", "Duchaufour-Lawrance": "duchofúr lorans", "Duchaufour-Lawrance:": "duchofúr lorans",
         "Paco": "paco", "Rabanne": "rabán"}
ALINEAR = {"2008": "2008", "1": "1"}
SELLOS = [
    ("nombre", "unmillon", "$1 000 000", (150, 210, 60), 1.2),
    ("frasco", "metal", "¡ORO!", (255, 214, 0), 1.0),
    ("paco", "vestidos", "¡METAL!", (200, 210, 225), 1.1),
    ("exito", "vendidos", "¡ÉXITO!", (255, 214, 0), 1.0),
]
GOLPES = [("gancho", "lingote", 0.7, 0.25), ("nombre", "unmillon", 0.7, 0.0), ("paco", "vestidos", 0.6, 0.0), ("exito", "vendidos", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "million"), "pop", None), (c("gancho", "lingote"), "golpe", None),
        (c("nombre", "unmillon"), "golpe", None), (c("nombre", "lujo"), "ding", None),
        (c("frasco", "noe"), "pop", None), (c("frasco", "metal"), "ding", None),
        (c("paco", "vestidos"), "golpe", None), (c("exito", "vendidos"), "golpe", None), (c("final", "frasco2"), "pop", None),
    ]
