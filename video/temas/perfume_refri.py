"""Tema: ¿guardar el perfume en el refri? (cómico, el frasco es un personaje, sin etiquetas, ~55 s)

Datos (revisados): el frío puede hacer más lentas las reacciones que degradan el perfume y el refri es oscuro; pero el
refri de la cocina se abre muchas veces al día (entra aire caliente, cambia la temperatura) y se forma condensación en el
frasco; el frío extremo estresa la fórmula y puede separar o enturbiar algunos ingredientes. Consenso: "fresco, no frío";
un cajón o clóset fresco, oscuro y estable basta. (Lo de la cebolla es un chiste, no un dato.)
"""

ESCENA = "refri.js"
SALIDA = "perfume-en-el-refri.mp4"

GUION = [
    ("gancho", ["Hay gente que guarda su perfume...", "*en el refri*{refri}.", "Entre el jamón{jamon} y la gelatina{gela}.",
                "¿Funciona, o es puro *mito*{mito}?"]),
    ("idea", ["La idea no es tan loca:", "el *frío*{frio} hace más lentas las reacciones que lo echan a perder{lento},",
              "y adentro está *oscuro*{osc}."]),
    ("pero", ["Pero, ¿cuántas veces abres el refri al día{abres}?", "*Diez*{diez}, *veinte*{veinte}...",
              "y cada vez entra aire caliente{aire}."]),
    ("gotas", ["Ese cambio hace que se formen *gotitas*{gotas} en el frasco,", "y el sube y baja lo *estresa*{estres}."]),
    ("congela", ["Además, el frío extremo puede *separar*{separa} algunos ingredientes,", "y tu perfume termina *turbio*{turbio}."]),
    ("cebolla", ["Y la verdad,", "¿de verdad quieres que tu perfume viva con la *cebolla*{cebolla}?"]),
    ("veredicto", ["El veredicto:", "*fresco*{fresco}, sí;", "*congelado*{cong}, no.",
                   "Un cajón lejos del calor es más que suficiente{cajon}."]),
    ("final", ["Y el refri, déjaselo a la gelatina{gela2}.", "¿Tú lo has guardado ahí{ahi}?"]),
]
DICHO = {}

PILDORAS = {}   # sin etiquetas: solo los subtítulos de la voz


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "refri"), "pop", None), (c("gancho", "gela"), "boing", None), (c("gancho", "mito"), "pop", None),
        (c("idea", "frio"), "tin", 0), (c("idea", "osc"), "tin", 1),
        (c("pero", "diez"), "pop", None), (c("pero", "veinte"), "pop", None), (c("pero", "aire"), "spray", None),
        (c("gotas", "gotas"), "tin", 2), (c("gotas", "estres"), "boing", None),
        (c("congela", "separa"), "tin", 3), (c("congela", "turbio"), "boing", None),
        (c("cebolla", "cebolla"), "boing", None),
        (c("veredicto", "fresco"), "ding", None), (c("veredicto", "cong"), "boom", None), (c("veredicto", "cajon"), "ding", None),
        (c("final", "gela2"), "boing", None), (c("final", "ahi"), "pop", None),
    ]
