"""Tema: el frasco de perfume más grande que se ha vendido (de 100 ml a 10 litros), ritmo rápido y con humor, ~45 s

Datos (revisados):
- Lo normal en tienda: frascos de 100 ml y algunos de 200 ml.
- Chanel N.º 5, centenario (2021): frasco de cristal con 2021 ml de extracto; el precio más citado es de unos
  34 000 dólares (Luxury Launches); otra fuente da 25 000 libras.
- Shumukh (Nabeel, Dubái, 2019): 3 litros de perfume en una estructura de 1.97 m con 3571 diamantes; dos récords
  Guinness (más diamantes en un frasco de perfume y el aerosol de fragancia a control remoto más alto); unos
  1.3 millones de dólares (4.752 millones de dírhams).
- Morreale Paris (Le Monde sur Mesure): frascos hechos a la medida de 5, 7 o 10 litros, desde 1.5 millones de dólares.
Se evitan los diseños reales de los frascos: todo es genérico, con nuestros propios modelos.
"""

ESCENA = "gigante.js"
SALIDA = "perfume-mas-grande.mp4"

GUION = [
    ("gancho", ["Tu perfume trae *cien mililitros*{cien}.", "Ahora imagina uno de *diez{diez} litros*.", "Sí, existe{existe}."]),
    ("normal", ["Lo normal en una tienda son frascos de *cien*{n100},", "y si te va bien, de *doscientos*{n200}."]),
    ("chanel", ["Pero en 2021, Chanel sacó su Número Cinco en un frasco de *2021{c2021} mililitros*,", "como el año{anio}.",
                "Precio: unos *34{precio} mil dólares*."]),
    ("shumukh", ["En Dubái hicieron *Shumukh*{shumukh}:", "tres litros de perfume{tres}, en una estructura de casi *dos{metros} metros*,",
                 "con *3,571{diam} diamantes*.", "Tiene dos récords Guinness{guinness},", "y cuesta *un{precio2} millón trescientos mil dólares*."]),
    ("morreale", ["Y el rey{rey}:", "la casa francesa *Morreale*{morreale} hace frascos a la medida{medida}",
                  "de cinco, siete y hasta *diez{diez2} litros*.", "Eso son *cien*{cienf} frascos normales,",
                  "desde *un{precio3} millón y medio de dólares*."]),
    ("final", ["Diez litros{litros}...", "eso ya no es perfume, es un *garrafón*{garrafon}.", "¿Tú cuánto pagarías por uno{cual}?"]),
]
DICHO = {"2021": "dos mil veintiún", "34": "treinta y cuatro", "3,571": "tres mil quinientos setenta y uno"}

PILDORAS = {}

SELLOS = [
    ("chanel", "c2021", "2021 ml", (196, 138, 36), 1.3),
    ("chanel", "precio", "$34 000", (34, 150, 80), 1.2),
    ("shumukh", "diam", "3,571 DIAMANTES", (60, 120, 220), 1.3),
    ("shumukh", "precio2", "$1 300 000", (34, 150, 80), 1.3),
    ("morreale", "diez2", "10 LITROS", (150, 60, 200), 1.3),
    ("morreale", "precio3", "$1 500 000", (34, 150, 80), 1.3),
]
SELLO_Y = 1300

GOLPES = [
    ("gancho", "diez", 1.0, 0.35), ("normal", "n200", 0.4, 0.0), ("chanel", "c2021", 0.6, 0.0), ("chanel", "precio", 0.6, 0.0),
    ("shumukh", "metros", 0.5, 0.0), ("shumukh", "diam", 0.7, 0.3), ("shumukh", "precio2", 0.7, 0.0),
    ("morreale", "diez2", 0.9, 0.3), ("morreale", "precio3", 0.8, 0.0), ("final", "garrafon", 0.9, 0.2),
]
TRANSICIONES = True
SOPLIDOS = False
BARRA = False
MUSICA = "energica"


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "cien"), "pop", None), (c("gancho", "diez"), "boom", None), (c("gancho", "existe"), "boing", None),
        (c("normal", "n100"), "pop", None), (c("normal", "n200"), "pop", None),
        (c("chanel", "c2021"), "golpe", None), (c("chanel", "precio"), "ding", None),
        (c("shumukh", "shumukh"), "pop", None), (c("shumukh", "metros"), "boom", None), (c("shumukh", "diam"), "ding", None),
        (c("shumukh", "guinness"), "tin", 1), (c("shumukh", "guinness") + 0.25, "tin", 2), (c("shumukh", "precio2"), "golpe", None),
        (c("morreale", "rey"), "boom", None), (c("morreale", "diez2"), "golpe", None), (c("morreale", "cienf"), "pop", None),
        (c("morreale", "precio3"), "ding", None),
        (c("final", "garrafon"), "boing", None), (c("final", "cual"), "pop", None),
    ]
