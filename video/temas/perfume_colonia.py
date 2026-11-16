"""Tema: ¿Por qué se llama «colonia»? La historia del Agua de Colonia (estilo cómic, ~1:09)

Datos (revisados):
- En 1709, en Colonia (Alemania), el perfumista italiano Johann Maria Farina (Giovanni Maria Farina) creó el «Eau de Cologne», un agua fresca de cítricos y hierbas. Dijo que le recordaba una mañana de primavera en Italia.
- La usaron cortes y nobles de Europa. La casa Farina dice que Napoleón fue cliente; las cantidades que se cuentan vienen de la propia marca.
- Hubo muchas imitaciones; Wilhelm Mülhens usó el apellido Farina para vender la suya y hubo pleitos. De ahí viene 4711, nombre tomado del número de la casa en la calle Glockengasse.
- Hoy «colonia» es una concentración ligera (≈2-5 % de esencia).
"""
from temas._comun_comic import *

ESCENA = "colonia.js"
SALIDA = "perfume-agua-de-colonia.mp4"

GUION = [
    ('gancho', ['¿Sabías que la palabra *colonia*{colonia}...', 'viene del nombre de una *ciudad*{ciudad}?']),
    ('ciudad', ['Colonia, en *Alemania*{alemania}.', 'Ahí, en 1709{anio}, un perfumista italiano, Farina{farina},', 'creó un agua fresca de *cítricos*{citricos}.']),
    ('olor', ['Olía a limón{limon}, bergamota{bergamota}, naranja y hierbas{hierbas},', 'y según él, le recordaba una mañana de primavera en Italia{italia}.', 'La llamó *Eau de Cologne*{nombre}: agua de Colonia.']),
    ('furor', ['Y se volvió un furor{furor}: la usaban reyes y nobles de toda Europa{reyes}.', 'Dicen que *Napoleón* la usaba muchísimo{napoleon}...', 'aunque eso lo cuenta la propia marca{marca}.']),
    ('copias', ['Y como todos querían una{querian}, llegaron las *copias*{copias}.', 'Un comerciante hasta usó el apellido Farina para vender la suya{apellido},', 'y terminaron en *pleito*{pleito}.']),
    ('n4711', ['De ahí salió otra muy famosa: la *4711*{n4711},', 'que se llama así por el *número de la casa* donde se vendía{numero}.']),
    ('hoy', ['Hoy, colonia es un *tipo* de perfume{tipo}: ligero, con muy poca esencia{poca},', 'de dos a cinco por ciento{cinco}.', 'Por eso dura poco{dura}... pero refresca muchísimo{refresca}.']),
    ('hoyfarina', ['Y lo más curioso{curioso}: la casa Farina *todavía existe* en Colonia{existe},', 'y dice que su receta casi no ha cambiado en más de *trescientos años*{trescientos}.']),
    ('final', ['Así que cada vez que dices: échate colonia{echate},', 'estás nombrando una ciudad alemana{alemana}.', '¿Tú usas colonia, o perfume{usas}?']),
]
DICHO = {'1709': 'mil setecientos nueve', 'Farina': 'farina', 'Eau': 'o', 'de': 'de', 'Cologne': 'colón', '4711': 'cuarenta y siete once', 'Napoleón': 'napoleón'}
ALINEAR = {'1709': '1709', '4711': '4711'}

SELLOS = [('ciudad', 'alemania', '¡ALEMANIA!', (255, 214, 0), 1.0),
 ('ciudad', 'anio', '1709', (255, 214, 0), 1.0),
 ('copias', 'pleito', '¡PLEITO!', (255, 120, 60), 1.0),
 ('n4711', 'numero', 'Nº 4711', (255, 214, 0), 1.1),
 ('hoy', 'cinco', '2-5 %', (150, 210, 60), 1.0)]
DIVIDIDO = [('hoy', 'tipo', 'refresca', 'COLONIA', 'PERFUME')]
GOLPES = [('gancho', 'ciudad', 0.6, 0.2), ('ciudad', 'alemania', 0.5, 0.0), ('copias', 'pleito', 0.7, 0.0), ('n4711', 'numero', 0.7, 0.0)]

EF = [('gancho', 'colonia', 'pop'),
 ('gancho', 'ciudad', 'boing'),
 ('ciudad', 'alemania', 'golpe'),
 ('ciudad', 'citricos', 'ding'),
 ('olor', 'limon', 'tin'),
 ('olor', 'bergamota', 'tin'),
 ('olor', 'hierbas', 'tin'),
 ('furor', 'reyes', 'ding'),
 ('furor', 'napoleon', 'pop'),
 ('furor', 'marca', 'boing'),
 ('copias', 'copias', 'pop'),
 ('copias', 'pleito', 'golpe'),
 ('n4711', 'n4711', 'pop'),
 ('n4711', 'numero', 'ding'),
 ('hoy', 'cinco', 'pop'),
 ('hoyfarina', 'existe', 'ding'),
 ('hoyfarina', 'trescientos', 'pop'),
 ('final', 'alemana', 'boing'),
 ('final', 'usas', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
