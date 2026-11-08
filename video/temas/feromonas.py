"""Tema: el mito de las feromonas en los perfumes (tono cómico, ~60 s, sin etiquetas).

Datos (revisados):
- Las feromonas existen en animales: la polilla del gusano de seda (bombykol, identificada en 1959) y la
  androstenona del cerdo macho, que se usa en spray en granjas para que la cerda adopte la postura de apareamiento.
- En humanos no hay ninguna feromona confirmada. Hare et al. (2017, Royal Society Open Science, Australia)
  probaron androstadienona y estratetraenol (las "favoritas" de estos perfumes) en 94 personas: sin efecto.
"""

ESCENA = "feromonas.js"
SALIDA = "mito-feromonas.mp4"

GUION = [
    ("gancho", ["¿Un perfume con *feromonas*{fero}", "que hace que todos se enamoren de ti{amor}?", "Suena increíble...",
                "pero hay un *problema*{prob}."]),
    ("animales", ["Las feromonas sí existen,", "pero en *animales*{anim}.", "Una polilla hembra suelta una molécula{mol}",
                  "y los machos la encuentran desde *lejísimos*{lejos}."]),
    ("cerdo", ["Y hasta hay un *spray para cerdos*{cerdo}:", "con el olor del macho,",
               "la hembra se queda *quieta*{quieta}, lista para aparearse."]),
    ("humanos", ["¿Y en humanos?", "Ahí la cosa se pone *incómoda*{inc}:", "después de décadas buscándolas{busca},",
                 "la ciencia *no ha confirmado*{nada} ni una sola feromona humana."]),
    ("estudio", ["En 2017, un estudio en Australia", "probó las dos *favoritas*{fav} de estos perfumes",
                 "en casi cien personas{gente}...", "y el resultado fue: *nada*{nada}."]),
    ("confianza", ["Entonces, ¿por qué hay gente que jura que le funcionan?", "Por la *confianza*{conf}:",
                   "te sientes irresistible{irr},", "y eso sí se nota{nota}."]),
    ("final", ["Así que no busques feromonas en un frasco:", "busca un perfume que te *encante*{encanta}.",
               "¿Tú habías caído en el *mito*{mito}?"]),
]
DICHO = {"2017": "dos mil diecisiete"}

PILDORAS = {}   # sin etiquetas: solo los subtítulos de la voz


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "fero") - 0.1, "spray", None), (c("gancho", "amor"), "pop", None), (c("gancho", "prob"), "boing", None),
        (c("animales", "mol"), "tin", 0), (c("animales", "lejos"), "spray", None),
        (c("cerdo", "cerdo"), "spray", None), (c("cerdo", "quieta"), "boing", None),
        (c("humanos", "inc"), "pop", None), (c("humanos", "nada"), "boing", None),
        (c("estudio", "fav"), "pop", None), (c("estudio", "nada"), "beep", None),
        (c("confianza", "conf"), "ding", None), (c("confianza", "nota"), "pop", None),
        (c("final", "encanta"), "pop", None), (c("final", "mito"), "boom", None),
    ]
