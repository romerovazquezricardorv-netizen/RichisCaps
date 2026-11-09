"""Tema: ¿guardar perfumes en el baño los daña? (experimento con dos frascos, tono cómico, sin etiquetas, ~55 s)

Datos (revisados): en el baño las duchas causan cambios de temperatura y humedad; el calor, la luz y el oxígeno
oxidan las moléculas del perfume; señales de que se echó a perder: color más oscuro, olor agrio o a vinagre, y que
cambie su aroma (las notas de salida, las más volátiles, son las primeras en perderse). Se recomienda un lugar
fresco, oscuro y estable (cajón, clóset o su caja original).
"""

ESCENA = "bano.js"
SALIDA = "perfume-en-el-bano.mp4"

GUION = [
    ("gancho", ["¿Tienes tus perfumes en el *baño*{bano}?", "Ojo,", "porque podrías estar *arruinándolos*{arru} sin saberlo."]),
    ("experimento", ["Hagamos un experimento:", "dos perfumes *iguales*{igual}.", "Uno vive en el baño{uno},",
                     "y el otro en un *cajón*{otro}."]),
    ("enemigos", ["El del baño tiene tres *enemigos*{ene}:", "el *calor*{calor} del agua caliente,", "la *humedad*{hum} del vapor,",
                  "y la *luz*{luz} de la ventana."]),
    ("cambios", ["Y lo peor no es el calor,", "son los *cambios*{camb}:", "*frío*{fc}, *caliente*{c1}, *frío*{f2}, *caliente*{c2},", "todos los días."]),
    ("meses", ["Unos meses después{meses}...", "el del cajón huele *igualito*{igualito}.", "Y el del baño{bano2}...",
               "más *oscuro*{osc},", "y con un olor *agrio*{agrio}, como a vinagre."]),
    ("porque", ["Eso pasa porque el calor y la luz *oxidan*{oxi} las moléculas,",
                "y las notas de salida son las primeras en *desaparecer*{morir}."]),
    ("consejo", ["Así que guárdalos en un lugar *fresco*{fresco}, *oscuro*{osc2} y estable:", "un cajón,", "un clóset{closet},",
                 "o en su *caja*{caja} original."]),
    ("final", ["Tu perfume te lo va a *agradecer*{agra}.", "¿Y tú dónde guardas los tuyos{donde}?"]),
]
DICHO = {}

PILDORAS = {}   # sin etiquetas: solo los subtítulos de la voz


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "arru"), "boing", None), (c("experimento", "uno"), "pop", None), (c("experimento", "otro"), "pop", None),
        (c("enemigos", "calor"), "pop", None), (c("enemigos", "hum"), "pop", None), (c("enemigos", "luz"), "pop", None),
        (c("cambios", "fc"), "tin", 0), (c("cambios", "c1"), "tin", 1), (c("cambios", "f2"), "tin", 2), (c("cambios", "c2"), "tin", 3),
        (c("meses", "igualito"), "ding", None), (c("meses", "agrio"), "boing", None),
        (c("porque", "oxi"), "boom", None), (c("porque", "morir"), "pop", None),
        (c("consejo", "caja"), "ding", None), (c("final", "agra"), "pop", None),
    ]
