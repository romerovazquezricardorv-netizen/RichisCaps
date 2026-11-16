"""Tema: Perfume de nicho vs. de diseñador: ¿cuál es la diferencia? (estilo cómic, ~1:09)

Datos (revisados):
- Diseñador: perfumes de casas de moda; se crean para gustarle a muchísima gente, con pruebas de consumidores y gran publicidad y distribución.
- Nicho: casas que se dedican principalmente al perfume, con más libertad creativa y producciones más pequeñas.
- El nicho suele costar más; más caro no siempre significa mejor.
- La línea se ha vuelto borrosa: Estée Lauder compró Le Labo (2014) y LVMH tomó la mayoría de Maison Francis Kurkdjian (2017), entre otras compras.
"""
from temas._comun_comic import *

ESCENA = "nicho.js"
SALIDA = "perfume-nicho-vs-disenador.mp4"

GUION = [
    ('gancho', ['Perfume de *nicho* contra perfume de *diseñador*{vs}.', '¿Cuál es la diferencia de verdad{diferencia}?']),
    ('nicho', ['Los de *nicho* son de casas que solo hacen perfume{solo},', 'con más libertad para hacer olores raros o atrevidos{raros},', 'y en producciones más pequeñas{pequenas}.']),
    ('ejemplos', ['Unos ejemplos de nicho{ejemplos}: Creed{creed}, Xerjoff{xerjoff}, Amouage{amouage} o Le Labo{lelabo0}.', 'El de diseñador lo encuentras en cualquier tienda departamental{departamental};', 'el de nicho, casi siempre en boutiques o tiendas especializadas{boutiques}.']),
    ('pruebas', ['Los de diseñador pasan por pruebas con *público*{publico}:', 'si a la mayoría no le gusta, se cambia{cambia}.', 'El de nicho puede ser de *amor u odio*{odio}.']),
    ('precio', ['El nicho suele costar *más*{mas}: vende menos{menos}, y a veces usa materiales más caros{materiales}.', 'Y como vende menos, no gasta tanto en anuncios de tele{anuncios}.', 'Pero ojo: *más caro no siempre es mejor*{mejor}.']),
    ('borroso', ['Y hoy la línea es borrosa{borrosa}: las grandes empresas *compraron* marcas de nicho{compraron}.', 'Estée Lauder compró Le Labo{lelabo}, y LVMH, Maison Francis Kurkdjian{mfk}.', 'Así que mucho nicho de hoy... es de una *gigante*{gigante}.']),
    ('final', ['Al final, lo que importa es si te gusta *a ti*{ti}.', '¿Tú eres más de nicho, o de diseñador{eres}?']),
]
DICHO = {'Dior': 'dior', 'Versace': 'versáche', 'Carolina': 'carolina', 'Herrera': 'herrera', 'Estée': 'esté', 'Lauder': 'lóder', 'Le': 'le', 'Labo': 'labo', 'LVMH': 'ele uve eme ache', 'Maison': 'mesón', 'Francis': 'fransis', 'Kurkdjian': 'kurkyián', 'Creed': 'crid', 'Xerjoff': 'yérjof', 'Amouage': 'amuásh'}
ALINEAR = {}

SELLOS = [('gancho', 'vs', 'NICHO VS DISEÑADOR', (255, 214, 0), 1.2),
 ('nicho', 'raros', '¡ATREVIDO!', (255, 120, 160), 1.0),
 ('pruebas', 'odio', '♥ AMOR U ODIO', (255, 120, 160), 1.0),
 ('precio', 'mejor', '$$$ ≠ MEJOR', (255, 214, 0), 1.1),
 ('borroso', 'gigante', '¡SORPRESA!', (255, 214, 0), 1.0)]
DIVIDIDO = [('pruebas', None, None, 'DISEÑADOR', 'NICHO')]
GOLPES = [('gancho', 'vs', 0.7, 0.2), ('pruebas', 'odio', 0.5, 0.0), ('precio', 'mejor', 0.6, 0.0), ('borroso', 'gigante', 0.8, 0.25)]

EF = [('gancho', 'vs', 'golpe'),
 ('nicho', 'solo', 'pop'),
 ('nicho', 'raros', 'boing'),
 ('ejemplos', 'creed', 'tin'),
 ('ejemplos', 'xerjoff', 'tin'),
 ('ejemplos', 'amouage', 'tin'),
 ('ejemplos', 'boutiques', 'ding'),
 ('pruebas', 'publico', 'pop'),
 ('pruebas', 'cambia', 'boing'),
 ('pruebas', 'odio', 'golpe'),
 ('precio', 'mas', 'pop'),
 ('precio', 'mejor', 'golpe'),
 ('borroso', 'compraron', 'pop'),
 ('borroso', 'lelabo', 'tin'),
 ('borroso', 'mfk', 'tin'),
 ('borroso', 'gigante', 'golpe'),
 ('final', 'ti', 'ding'),
 ('final', 'eres', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
