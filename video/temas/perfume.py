"""Tema: por qué un perfume huele distinto con el tiempo (notas de salida, corazón y fondo)."""

ESCENA = "perfume.js"
SALIDA = "perfume-capas.mp4"

# *palabra* = palabra clave (azul); palabra{cue} = marca de tiempo para las animaciones.
GUION = [
    ("gancho", ["¿Por qué tu perfume{spray} huele *distinto*", "a los diez minutos de ponértelo?"]),
    ("capas", ["El secreto es que un perfume", "no es un solo olor:", "son *tres capas*{capas} que se van turnando."]),
    ("salida", ["Primero llegan las *notas de salida*:", "limón{i1}, bergamota{i2}, toronja{i3}."]),
    ("ligeras", ["Son moléculas pequeñas y ligeras,", "por eso se *evaporan*{evap} rapidísimo:",
                 "en unos *15 minutos*{min} ya casi no están."]),
    ("corazon", ["Luego aparece el *corazón*:", "jazmín{i1}, rosa{i2}, lavanda{i3}.", "Ese dura *varias horas*{horas}."]),
    ("fondo", ["Y al final queda el *fondo*:", "vainilla{i1}, sándalo{i2}, ámbar{i3}."]),
    ("pesadas", ["Moléculas *pesadas*,", "que pueden quedarse en tu piel", "*seis horas o más*{seis}..."]),
    ("ropa", ["y en la ropa,", "hasta *días*{dias}."]),
    ("concentracion", ["Y ojo: no todos duran igual.", "Una colonia{c1} lleva apenas", "entre *2 y 5 por ciento* de esencia;",
                       "un extracto{c4}, *más del 20*."]),
    ("consejo", ["Por eso, cuando pruebes un perfume,", "*no lo juzgues*{nojuz} en el primer minuto."]),
    ("final", ["Espera a que llegue su *corazón*...", "ahí está su *verdadera*{fin} personalidad."]),
]
DICHO = {"15": "quince", "2": "dos", "5": "cinco", "20": "veinte"}

PILDORAS = {
    "salida": [("i1", "Notas de salida", "limón · bergamota · toronja")],
    "ligeras": [("min", "≈ 15 minutos", "y se evaporan")],
    "corazon": [("i1", "Notas de corazón", "jazmín · rosa · lavanda"), ("horas", "Varias horas", "notas de corazón")],
    "fondo": [("i1", "Notas de fondo", "vainilla · sándalo · ámbar")],
    "pesadas": [("seis", "6 horas o más", "en tu piel")],
    "ropa": [("dias", "Hasta días", "en la ropa")],
}


def efectos(segs):
    ev = [(segs["gancho"]["cues"]["spray"], "spray", None), (segs["consejo"]["start"] + 0.35, "spray", None),
          (segs["capas"]["cues"]["capas"], "boom", None), (segs["pesadas"]["cues"]["seis"], "boom", None),
          (segs["concentracion"]["cues"]["c4"], "boom", None), (segs["final"]["cues"]["fin"], "boom", None)]
    for esc in ("salida", "corazon", "fondo"):
        for j, k in enumerate(("i1", "i2", "i3")):
            ev.append((segs[esc]["cues"][k] + 0.05, "tin", j))
    return ev
