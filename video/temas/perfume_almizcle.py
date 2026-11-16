"""Tema: El almizcle: el olor que salía de un venado (estilo cómic, ~1:09)

Datos (revisados):
- El almizcle natural se obtenía de una glándula del ciervo almizclero macho (Asia). Se necesitaban decenas de animales por kilo, y la caza casi los extingue.
- 1888: el químico alemán Albert Baur, buscando un explosivo más potente, obtuvo el primer almizcle sintético («almizcle Baur»).
- Desde 1979 el ciervo almizclero está protegido por CITES; el comercio internacional de su almizcle está prohibido en casi todos los casos.
- Hoy los perfumes usan almizcles sintéticos («almizcles blancos»), que huelen a piel limpia y ropa recién lavada.
"""
from temas._comun_comic import *

ESCENA = "almizcle.js"
SALIDA = "perfume-almizcle-venado.mp4"

GUION = [
    ('gancho', ['Uno de los olores más usados en los perfumes{usados}...', 'venía de un *venado*{venado}.']),
    ('venado', ['El *almizcle* natural salía de una glándula del ciervo almizclero{ciervo},', 'un animalito de las montañas de Asia{asia}, que ni siquiera tiene cuernos{cuernos}.']),
    ('lujo', ['Se usó durante siglos{siglos}: en perfumes, en medicina antigua{medicina},', 'y como el olor del *lujo*{lujo}. Llegó a valer más que el *oro*{oro}.']),
    ('problema', ['El problema{problema}: para juntar un kilo de almizcle,', 'se necesitaban *decenas* de venados{decenas}.', 'Casi los acaban{acaban}.']),
    ('baur', ['Y en 1888 pasó algo muy curioso{curioso}:', 'un químico alemán, Albert Baur, buscaba un *explosivo* más potente{explosivo}...', 'y en vez de eso, creó un polvo que olía a almizcle{olia}.', 'El primer almizcle *sintético*{sintetico}.']),
    ('protegido', ['Desde 1979, el ciervo almizclero está *protegido*{protegido},', 'y venderlo entre países está prohibido casi en todo el mundo{prohibido}.']),
    ('hoy', ['Hoy, el almizcle de tu perfume es *de laboratorio*{laboratorio}:', 'huele a piel limpia, suave{suave}, como a *ropa recién lavada*{ropa}.', 'Y está en casi todos los perfumes{todos}.', 'Hay decenas de almizcles sintéticos distintos{distintos}, y cada uno huele un poquito diferente{diferente}.']),
    ('final', ['Así que tranquilo: ningún venado sufrió por tu perfume{tranquilo}.', '¿Te gustan los perfumes que huelen a piel limpia{gusta}?']),
]
DICHO = {'1888': 'mil ochocientos ochenta y ocho', '1979': 'mil novecientos setenta y nueve', 'Albert': 'álbert', 'Baur': 'báur'}
ALINEAR = {'1888': '1888', '1979': '1979'}

SELLOS = [('gancho', 'venado', '¿UN VENADO?', (255, 214, 0), 1.1),
 ('lujo', 'oro', '¡MÁS QUE EL ORO!', (255, 214, 0), 1.2),
 ('baur', 'explosivo', '¡BOOM!', (255, 120, 60), 1.0),
 ('baur', 'sintetico', '¡SINTÉTICO!', (150, 210, 60), 1.1),
 ('protegido', 'protegido', '¡PROTEGIDO!', (150, 210, 60), 1.1)]
DIVIDIDO = [('hoy', None, 'suave', 'ANTES', 'HOY')]
GOLPES = [('gancho', 'venado', 0.7, 0.2), ('lujo', 'oro', 0.6, 0.0), ('baur', 'explosivo', 0.9, 0.3), ('protegido', 'protegido', 0.5, 0.0)]

EF = [('gancho', 'venado', 'boing'),
 ('venado', 'ciervo', 'pop'),
 ('venado', 'cuernos', 'boing'),
 ('lujo', 'lujo', 'ding'),
 ('lujo', 'oro', 'golpe'),
 ('problema', 'decenas', 'golpe'),
 ('baur', 'explosivo', 'boom'),
 ('baur', 'olia', 'boing'),
 ('baur', 'sintetico', 'ding'),
 ('protegido', 'protegido', 'golpe'),
 ('hoy', 'laboratorio', 'pop'),
 ('hoy', 'ropa', 'ding'),
 ('final', 'tranquilo', 'pop'),
 ('final', 'gusta', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
