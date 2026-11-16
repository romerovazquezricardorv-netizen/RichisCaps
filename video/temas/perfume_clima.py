"""Tema: Perfumes para el calor vs. para el frío (estilo cómic, ~1:09)

Datos (revisados):
- El calor acelera la evaporación del perfume: proyecta más, se siente más intenso y se gasta antes; el frío la frena.
- Por eso los perfumes dulces, ambarados o muy pesados pueden sentirse empalagosos con calor, y brillar en el frío.
- Para calor se recomiendan cítricos, notas acuáticas, verdes y florales ligeros, y menos atomizaciones.
- La humedad puede hacer que algunos perfumes se perciban más fuertes.
- Son tendencias generales: el gusto personal manda.
"""
from temas._comun_comic import *

ESCENA = "clima.js"
SALIDA = "perfume-calor-vs-frio.mp4"

GUION = [
    ('gancho', ['¿Por qué tu perfume favorito se siente *empalagoso* en verano{empalagoso}...', 'y perfecto en *invierno*{invierno}?']),
    ('calor', ['Por el *calor*{calor}:', 'con más temperatura, el perfume se evapora más rápido{evapora},', 'y se siente mucho más fuerte{fuerte}.']),
    ('dulces', ['Los perfumes dulces y pesados{dulces}, como vainilla, ámbar u oud{vainilla},', 'con calor se sienten como un *abrazo muy apretado*... a las doce del día{abrazo}.']),
    ('verano', ['Para el *verano*{verano}: cítricos como limón o bergamota{citricos},', 'notas acuáticas{acuaticas}, verdes{verdes} o florales ligeras{florales}.', 'Y menos atomizaciones{menos}, sobre la piel recién bañada{banada}.']),
    ('invierno', ['En *invierno* pasa lo contrario{frio}:', 'el frío hace que el perfume se evapore lento{lento}, y se siente más tímido{timido}.', 'Ahí sí brillan los *dulces*, los *especiados* y los *amaderados*{brillan}.']),
    ('humedad', ['Y ojo con la *humedad*{humedad}:', 'en clima húmedo, el perfume puede sentirse más fuerte{fuerte2}... así que mídete{midete}.']),
    ('noche', ['Y no solo importa la estación{estacion}:', 'de día y en la oficina, mejor algo ligero{oficina};', 'de noche, puedes subirle un poquito{noche}.']),
    ('armario', ['Lo ideal: tener uno fresco para el calor{fresco}, y uno cálido para el frío{calido}.', 'Como cambiar de chamarra{chamarra}... pero para tu olor.']),
    ('final', ['Así que no es que tu perfume sea malo{malo}...', 'es que no es su temporada{temporada}.', '¿Tú cambias de perfume según el clima{clima}?']),
]
DICHO = {'oud': 'ud'}
ALINEAR = {}

SELLOS = [('gancho', 'empalagoso', '¡EMPALAGOSO!', (255, 120, 160), 1.1),
 ('calor', 'evapora', '¡SE EVAPORA!', (255, 120, 60), 1.0),
 ('dulces', 'abrazo', '¡UF!', (255, 214, 0), 1.0),
 ('verano', 'citricos', '¡CÍTRICOS!', (255, 214, 0), 1.0),
 ('invierno', 'brillan', '¡AHORA SÍ!', (150, 210, 60), 1.0),
 ('humedad', 'midete', '¡MÍDETE!', (255, 214, 0), 1.0)]
DIVIDIDO = [('armario', None, None, 'CALOR', 'FRÍO')]
GOLPES = [('gancho', 'empalagoso', 0.6, 0.2), ('calor', 'evapora', 0.5, 0.0), ('dulces', 'abrazo', 0.7, 0.0), ('invierno', 'brillan', 0.5, 0.0)]

EF = [('gancho', 'empalagoso', 'boing'),
 ('gancho', 'invierno', 'ding'),
 ('calor', 'evapora', 'pop'),
 ('calor', 'fuerte', 'golpe'),
 ('dulces', 'abrazo', 'boing'),
 ('verano', 'citricos', 'tin'),
 ('verano', 'acuaticas', 'tin'),
 ('verano', 'verdes', 'tin'),
 ('verano', 'florales', 'tin'),
 ('invierno', 'lento', 'pop'),
 ('invierno', 'brillan', 'ding'),
 ('humedad', 'midete', 'boing'),
 ('noche', 'oficina', 'pop'),
 ('noche', 'noche', 'ding'),
 ('armario', 'fresco', 'pop'),
 ('armario', 'calido', 'pop'),
 ('final', 'temporada', 'ding'),
 ('final', 'clima', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
