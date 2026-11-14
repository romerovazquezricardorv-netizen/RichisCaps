"""Tema: ¿por qué el perfume es tan caro si casi todo es alcohol? (estilo cómic, ~45 s)

Datos (revisados, fuentes del sector con cifras que varían): el líquido aromático es una parte pequeña del precio de un
perfume de diseñador (entre ~1 % y ~8 % según la fuente); el resto se reparte entre frasco y empaque (~10-30 %), la
tienda y la distribución (~30-60 %), la publicidad y la ganancia de la marca. En los perfumes de nicho la esencia pesa más.
Un buen perfume se nota en cuánto dura y en cómo evoluciona en la piel.
"""
from temas._comun_comic import *

ESCENA = "caro.js"
SALIDA = "perfume-caro.mp4"

GUION = [
    ("gancho", ["Si tu perfume costó *cien*{cien},", "lo que de verdad huele costó, a veces, menos de *cinco*{cinco}."]),
    ("liquido", ["El líquido es casi todo *alcohol*{alcohol},", "y la esencia, que es lo que huele{esencia}, es solo una parte pequeña{pequena}."]),
    ("desglose", ["Entonces, ¿a dónde se va tu dinero{dinero}?", "Una parte al *frasco*{frasco} y a la caja,", "otra a la *tienda*{tienda} que te lo vende,",
                  "y un pedazo enorme a la *publicidad*{publi}:", "los anuncios con famosos no son baratos{famosos}."]),
    ("pero", ["Pero ojo{ojo}:", "barato no siempre es *mejor*{mejor}.", "Una buena esencia sí cuesta{cuesta},",
              "y se nota en cuánto *dura*{dura} en tu piel."]),
    ("final", ["Así que la próxima vez que pagues un perfume{pagues},", "recuerda: también estás pagando el *anuncio*{anuncio}.",
               "¿Cuánto es lo más que has pagado por uno{cuanto}?"]),
]
DICHO = {}
SELLOS = [
    ("gancho", "cinco", "¡MENOS DE 5!", (255, 214, 0), 1.1),
    ("desglose", "publi", "¡PUBLICIDAD!", (255, 214, 0), 1.2),
    ("pero", "mejor", "¡OJO!", (255, 214, 0), 1.0),
    ("final", "anuncio", "¡EL ANUNCIO!", (255, 214, 0), 1.1),
]
GOLPES = [("gancho", "cinco", 0.8, 0.2), ("desglose", "publi", 0.8, 0.0), ("pero", "mejor", 0.5, 0.0), ("final", "anuncio", 0.6, 0.0)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "cien"), "pop", None), (c("gancho", "cinco"), "golpe", None),
        (c("liquido", "alcohol"), "pop", None), (c("liquido", "esencia"), "tin", 1),
        (c("desglose", "frasco"), "pop", None), (c("desglose", "tienda"), "pop", None), (c("desglose", "publi"), "golpe", None),
        (c("desglose", "famosos"), "ding", None), (c("pero", "mejor"), "boing", None), (c("pero", "dura"), "ding", None),
        (c("final", "anuncio"), "golpe", None), (c("final", "cuanto"), "pop", None),
    ]
