"""Tema: Shalimar: el perfume que nació de un accidente y una historia de amor (estilo cómic, ~1:09)

Datos (revisados):
- Shalimar, de Guerlain, lo creó Jacques Guerlain y se presentó en París en 1925 (Exposición de Artes Decorativas).
- Su nombre viene de los jardines de Shalimar, que el emperador mogol Shah Jahan hizo en honor de su esposa Mumtaz Mahal; para ella también construyó el Taj Mahal.
- La historia más contada: Jacques Guerlain echó vainillina (etilvainillina) en un frasco de Jicky (1889) para ver qué pasaba. Es una anécdota, no un hecho comprobado.
- Es considerado de los primeros perfumes «ambarados»/orientales: bergamota, vainilla, incienso, cuero.
- Su frasco tiene un tapón azul en forma de abanico, inspirado en las fuentes de los jardines. En 2025 cumplió 100 años.
- En el video, los frascos y la fuente son modelos genéricos.
"""
from temas._comun_comic import *

ESCENA = "shalimar.js"
SALIDA = "perfume-shalimar.mp4"

GUION = [
    ('gancho', ['Este perfume nació de un *accidente*{accidente}...', 'y de una *historia de amor*{amor}.']),
    ('amor', ['Shalimar, de Guerlain{guerlain}, se inspiró en unos jardines de la India{jardines},', 'que un emperador, Shah Jahan, hizo para su esposa, Mumtaz{mumtaz}.', 'El mismo que después le construyó el *Taj Mahal*{taj}.']),
    ('accidente', ['Y el accidente{acc2}: cuentan que el perfumista Jacques Guerlain{jacques}', 'echó *vainillina*{vainillina}, o sea, vainilla de laboratorio,', 'en un frasco de otro perfume de la casa{jicky}... nomás para ver qué pasaba{pasaba}.']),
    ('nacio', ['Le gustó tanto{gusto}, que de ahí nació *Shalimar*{nacio},', 'y se presentó en París en *1925*{anio}.']),
    ('olor', ['Fue de los primeros perfumes *ambarados* de la historia{ambar}:', 'bergamota{bergamota}, vainilla{vainilla}, incienso{incienso} y cuero{cuero}.', 'Cálido, dulce y elegante{calido}.', 'Fue tan importante, que se volvió el modelo de toda una familia de perfumes{familia}.']),
    ('postre', ['Y hay una frase famosa{frase}: dicen que Ernest Beaux, el creador del Chanel número cinco{beaux}, comentó:', 'con tanta vainilla, yo haría un *postre*{postre}...', 'y ellos hicieron *Shalimar*{shalimar2}.']),
    ('frasco', ['Hasta su frasco cuenta la historia{frasco}:', 'su tapa azul tiene forma de *abanico*{abanico},', 'inspirada en las *fuentes* de esos jardines{fuentes}.']),
    ('cien', ['Y en 2025 cumplió *cien años*{cien},', 'y se sigue vendiendo como si nada{vende}.']),
    ('final', ['¿Será verdad lo del accidente{verdad}? Nadie lo sabe seguro{seguro}.', 'Pero qué buen accidente{bueno}. ¿Tú ya lo oliste{olido}?']),
]
DICHO = {'Shalimar': 'shalimár', 'Guerlain': 'guerlán', 'Jacques': 'yak', 'Shah': 'sha', 'Ernest': 'érnest', 'Beaux': 'bo', 'Chanel': 'chanel', 'Jahan': 'yahán', 'Mumtaz': 'mumtáz', 'Taj': 'tash', 'Mahal': 'majal', '1925': 'mil novecientos veinticinco', '2025': 'dos mil veinticinco'}
ALINEAR = {'1925': '1925', '2025': '2025'}

SELLOS = [('gancho', 'accidente', '¡ACCIDENTE!', (255, 214, 0), 1.1),
 ('amor', 'taj', '♥ TAJ MAHAL ♥', (255, 150, 200), 1.1),
 ('accidente', 'vainillina', '¡VAINILLINA!', (255, 214, 0), 1.1),
 ('nacio', 'anio', '1925', (255, 214, 0), 1.0),
 ('cien', 'cien', '100 AÑOS', (255, 214, 0), 1.1),
 ('postre', 'postre', '¡UN POSTRE!', (255, 214, 0), 1.0)]
DIVIDIDO = []
GOLPES = [('gancho', 'accidente', 0.7, 0.2), ('accidente', 'vainillina', 0.6, 0.0), ('nacio', 'nacio', 0.7, 0.0), ('cien', 'cien', 0.6, 0.0)]

EF = [('gancho', 'accidente', 'golpe'),
 ('gancho', 'amor', 'ding'),
 ('amor', 'jardines', 'pop'),
 ('amor', 'taj', 'ding'),
 ('accidente', 'vainillina', 'pop'),
 ('accidente', 'pasaba', 'boing'),
 ('nacio', 'nacio', 'golpe'),
 ('nacio', 'anio', 'pop'),
 ('olor', 'bergamota', 'tin'),
 ('olor', 'vainilla', 'tin'),
 ('olor', 'incienso', 'tin'),
 ('olor', 'cuero', 'tin'),
 ('frasco', 'abanico', 'pop'),
 ('frasco', 'fuentes', 'ding'),
 ('cien', 'cien', 'golpe'),
 ('postre', 'postre', 'boing'),
 ('postre', 'shalimar2', 'ding'),
 ('final', 'verdad', 'boing'),
 ('final', 'olido', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
