"""Tema: ¿por qué el perfume es tan caro si casi todo es alcohol? (estilo cómic, ~45 s)

Datos (revisados, fuentes del sector con cifras que varían): el líquido aromático es una parte pequeña del precio de un
perfume de diseñador (entre ~1 % y ~8 % según la fuente); el resto se reparte entre frasco y empaque (~10-30 %), la
tienda y la distribución (~30-60 %), la publicidad y la ganancia de la marca. En los perfumes de nicho la esencia pesa más.
Un buen perfume se nota en cuánto dura y en cómo evoluciona en la piel.
Versión larga (~1:09): se agregan las licencias (Coty, L'Oréal, Puig fabrican perfumes de muchas marcas de moda), las
concentraciones (colonia 2-5 %, EDT 5-15 %, EDP 15-20 %, extracto hasta 30 %), los perfumes de nicho (más esencia y
producciones pequeñas) y los testers (mismo líquido sin caja).
"""
from temas._comun_comic import *

ESCENA = "caro.js"
SALIDA = "perfume-caro.mp4"

GUION = [
    ("gancho", ["Si tu perfume costó *cien*{cien},", "lo que de verdad huele costó, a veces, menos de *cinco*{cinco}."]),
    ("liquido", ["El líquido es casi todo *alcohol*{alcohol},", "y la esencia, que es lo que huele{esencia}, es solo una parte pequeña{pequena}."]),
    ("desglose", ["Entonces, ¿a dónde se va tu dinero{dinero}?", "Una parte al *frasco*{frasco} y a la caja,", "otra a la *tienda*{tienda} que te lo vende,",
                  "y un pedazo enorme a la *publicidad*{publi}:", "los anuncios con famosos no son baratos{famosos}."]),
    ("licencias", ["Y un secreto{secreto}: muchas marcas de moda ni siquiera fabrican su perfume{nifab}.",
                   "Se lo encargan a empresas como *Coty*, *L'Oréal* o *Puig*{lic},", "que lo hacen con una *licencia*{licencia}."]),
    ("conc", ["También importa la *concentración*{conc}:", "una colonia tiene de dos a cinco por ciento de esencia{col},", "un eau de toilette, de cinco a quince{edt},",
              "un eau de parfum, de quince a veinte{edp},", "y un extracto, hasta *treinta*{ext}."]),
    ("nicho", ["¿Y los perfumes de *nicho*{nicho}?", "Usan más esencia{mas}, y hacen muchos menos frascos{menos},", "por eso cuestan más{cuestan}."]),
    ("pero", ["Pero ojo{ojo}:", "barato no siempre es *mejor*{mejor}.", "Una buena esencia sí cuesta{cuesta},",
              "y se nota en cuánto *dura*{dura} en tu piel."]),
    ("tester", ["Un truco para pagar menos{truco}: los *testers*{tester} traen el mismo líquido,", "pero sin caja{caja}.",
                "Y en las tiendas libres de impuestos de los aeropuertos{aeropuerto}, a veces salen más baratos{baratos}."]),
    ("final", ["Así que la próxima vez que pagues un perfume{pagues},", "recuerda: también estás pagando el *anuncio*{anuncio}.",
               "¿Cuánto es lo más que has pagado por uno{cuanto}?"]),
]
DICHO = {"L'Oréal": "loreál", "Puig": "puch", "Coty": "cóti"}
SELLOS = [
    ("gancho", "cinco", "¡MENOS DE 5!", (255, 214, 0), 1.1),
    ("desglose", "publi", "¡PUBLICIDAD!", (255, 214, 0), 1.2),
    ("pero", "mejor", "¡OJO!", (255, 214, 0), 1.0),
    ("final", "anuncio", "¡EL ANUNCIO!", (255, 214, 0), 1.1),
    ("licencias", "licencia", "¡LICENCIA!", (255, 214, 0), 1.0),
    ("tester", "tester", "¡TESTER!", (150, 210, 60), 1.0),
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
        (c("licencias", "secreto"), "boing", None), (c("licencias", "lic"), "pop", None), (c("licencias", "licencia"), "golpe", None),
        (c("conc", "col"), "tin", 1), (c("conc", "edt"), "tin", 2), (c("conc", "edp"), "tin", 3), (c("conc", "ext"), "ding", None),
        (c("nicho", "nicho"), "pop", None), (c("nicho", "cuestan"), "ding", None), (c("tester", "tester"), "golpe", None),
    ]
