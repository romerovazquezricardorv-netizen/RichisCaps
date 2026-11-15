"""Tema: ¿por qué el 1 Million viene en un lingote de oro? (estilo cómic, versión larga ~1:09)

Datos (revisados):
- 1966: Paco Rabanne presenta su primera colección, «12 vestidos importables en materiales contemporáneos», hechos de
  placas (discos) de plástico y de metal unidas con anillos de alambre.
- Coco Chanel lo llamó «el metalúrgico» de la moda.
- 2008: sale 1 Million (perfumistas Christophe Raynaud, Olivier Pescheux y Michel Girard); el concepto juega con el
  lujo, el dinero y el exceso. Frasco con forma de lingote, diseñado por Noé Duchaufour-Lawrance.
- Notas: toronja, mandarina y menta; rosa y canela; cuero y ámbar. Dulce y especiado, con mucha proyección.
- 2010: Lady Million, con frasco en forma de diamante. Después: Privé (2016), Lucky (2018), Elixir (2023), entre otras.
- Es de los perfumes masculinos más vendidos del mundo. En 2023 la marca pasó a llamarse solo «Rabanne».
El lingote, el diamante y todo lo que sale en el video son modelos genéricos; no se copia el frasco real.
"""
from temas._comun_comic import *

ESCENA = "million.js"
SALIDA = "perfume-1-million-lingote.mp4"

GUION = [
    ("gancho", ["¿Por qué el *1 Million*{million} viene en un *lingote de oro*{lingote}?",
                "La respuesta empieza en 1966{anio66}... con unos vestidos de metal{vestidos0}."]),
    ("desfile", ["Ese año, Paco Rabanne presentó *doce vestidos imposibles de usar*{doce}:",
                 "hechos con placas de plástico y de *metal*{placas}, unidas con alambre{alambre}."]),
    ("chanel", ["A Coco Chanel no le encantó la idea{chanel}:", "le dijo *el metalúrgico*{metalurgico} de la moda."]),
    ("nombre", ["Cuarenta y dos años después, en 2008{anio}, salió *1 Million*{unmillon}.",
                "La idea: oler a *lujo*{lujo}, a dinero{dinero}, y a exceso{exceso}."]),
    ("frasco", ["El frasco lo diseñó Noé Duchaufour-Lawrance{noe}:",
                "un bloque de *metal dorado*{metal}, como sacado de la *bóveda de un banco*{boveda}."]),
    ("olor", ["¿Y a qué huele{huele}? A toronja y menta{toronja}, canela{canela}, cuero{cuero} y ámbar{ambar}.",
              "Dulce, especiado... y se nota *desde lejos*{lejos}.", "Es de esos perfumes que amas{amas}... o que no soportas{soportas}."]),
    ("lady", ["Dos años después llegó su pareja{pareja}:", "*Lady Million*{lady}, con un frasco en forma de *diamante*{diamante}.", "Y luego, un montón de versiones{versiones}: Privé, Lucky, Elixir{elixir}..."]),
    ("exito", ["Y funcionó{funciono}: es de los perfumes de hombre más *vendidos* del mundo{vendidos}.",
               "Tanto, que en 2023{anio23} la marca se quitó el Paco{quito}, y ahora se llama solo *Rabanne*{rabanne}."]),
    ("final", ["Así que el lingote no es casualidad: es *metal*{metal2}, como sus vestidos.",
               "¿Tú lo comprarías por el frasco{frasco2}... o por el olor{olor2}?"]),
]
DICHO = {"2008": "dos mil ocho", "1966": "mil novecientos sesenta y seis", "2023": "dos mil veintitrés", "1": "uan",
         "Million": "mílion", "Million*{million}": "mílion", "Million*{lady},": "mílion", "Noé": "noé",
         "Duchaufour-Lawrance{noe}:": "duchofúr lorans", "Paco": "paco", "Rabanne": "rabán", "Rabanne*{rabanne}.": "rabán",
         "Coco": "coco", "Chanel": "chanel", "Lady": "léidi", "Privé,": "privé", "Lucky,": "loki", "Elixir{elixir}...": "elíxir"}
ALINEAR = {"2008": "2008", "1": "1", "1966": "1966", "2023": "2023"}

SELLOS = [
    ("desfile", "doce", "12 VESTIDOS", (255, 214, 0), 1.2),
    ("chanel", "metalurgico", "¡METALÚRGICO!", (200, 210, 225), 1.4),
    ("nombre", "unmillon", "$1 000 000", (150, 210, 60), 1.2),
    ("frasco", "boveda", "¡ORO!", (255, 214, 0), 1.0),
    ("olor", "lejos", "¡SE NOTA!", (255, 214, 0), 1.0),
    ("lady", "diamante", "¡DIAMANTE!", (255, 150, 200), 1.1),
    ("exito", "rabanne", "¡RABANNE!", (255, 214, 0), 1.1),
]
DIVIDIDO = [("final", "frasco2", None, "¿EL FRASCO?", "¿EL OLOR?")]
GOLPES = [("gancho", "lingote", 0.7, 0.25), ("desfile", "doce", 0.6, 0.0), ("chanel", "metalurgico", 0.8, 0.2),
          ("nombre", "unmillon", 0.7, 0.0), ("frasco", "boveda", 0.7, 0.0), ("lady", "diamante", 0.6, 0.0),
          ("exito", "rabanne", 0.7, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "million"), "pop", None), (c("gancho", "lingote"), "golpe", None), (c("gancho", "anio66"), "boing", None),
        (c("desfile", "doce"), "golpe", None), (c("desfile", "placas"), "tin", 1), (c("desfile", "alambre"), "tin", 2),
        (c("chanel", "chanel"), "pop", None), (c("chanel", "metalurgico"), "golpe", None),
        (c("nombre", "anio"), "pop", None), (c("nombre", "unmillon"), "golpe", None), (c("nombre", "lujo"), "ding", None),
        (c("frasco", "noe"), "pop", None), (c("frasco", "metal"), "ding", None), (c("frasco", "boveda"), "golpe", None),
        (c("olor", "toronja"), "tin", 1), (c("olor", "canela"), "tin", 2), (c("olor", "cuero"), "tin", 3), (c("olor", "ambar"), "tin", 1),
        (c("olor", "lejos"), "boing", None),
        (c("lady", "lady"), "pop", None), (c("lady", "diamante"), "ding", None), (c("lady", "versiones"), "tin", 1), (c("lady", "elixir"), "tin", 2), (c("olor", "soportas"), "boing", None),
        (c("exito", "vendidos"), "golpe", None), (c("exito", "quito"), "boing", None), (c("exito", "rabanne"), "ding", None),
        (c("final", "metal2"), "ding", None), (c("final", "frasco2"), "pop", None), (c("final", "olor2"), "pop", None),
    ]
