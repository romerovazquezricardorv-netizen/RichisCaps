"""Tema: ¿Oler café entre perfumes 'limpia' la nariz? (mito vs ciencia) (estilo cómic, ~1:09)

Datos (revisados):
- La fatiga olfativa es real: tras oler varios aromas, la nariz se adapta y los percibe menos.
- Estudio de Beloit College (Grosofsky y otros, 2011, Perceptual and Motor Skills): oler granos de café no mejoró la identificación de aromas más que oler limón o aire.
- Un estudio de 2006 (Secundo y Sobel) sí reportó cierta ventaja del café frente al aire: la evidencia no es concluyente.
- Recomendación común de perfumistas: oler la propia piel (codo, muñeca), salir a tomar aire y probar pocos perfumes por visita, de preferencia en tiras.
"""
from temas._comun_comic import *

ESCENA = "cafe.js"
SALIDA = "perfume-granos-de-cafe.mp4"

GUION = [
    ('gancho', ['En las perfumerías te ponen un frasquito con granos de *café*{cafe}.', '¿Para qué{para}? Dicen que te *limpia* la nariz{limpia}.']),
    ('fatiga', ['Primero: el problema es real{real}. Se llama *fatiga olfativa*{fatiga}.', 'Después de oler muchos perfumes{muchos}, tu nariz se cansa{cansa}, y todo empieza a oler igual{igual}.', 'Por eso, después de un rato, ya ni hueles tu propio perfume{propio}.']),
    ('idea', ['La idea del café es que un olor muy distinto *reinicia* tu olfato{reinicia},', 'como cuando le cambias de canal a la tele{canal}.']),
    ('estudio', ['Pero en 2011, unos investigadores en Estados Unidos lo pusieron a prueba{prueba}:', 'unos olían café{grupo1}, otros limón{grupo2}, y otros... aire{grupo3}.', '¿El resultado? El café *no ayudó más* que respirar aire normal{resultado}.']),
    ('otro', ['Otro estudio sí le encontró algo de ventaja{ventaja}.', 'O sea: la ciencia todavía *no se pone de acuerdo*{acuerdo}.']),
    ('truco', ['Lo que sí recomiendan muchos perfumistas{recomiendan}: huele *tu propia piel*{piel},', 'por ejemplo en el codo{codo}. Es tu olor neutro{neutro}.', 'Y sal un momento a tomar *aire fresco*{aire}.']),
    ('limite', ['Y lo más importante: no pruebes más de *tres o cuatro* perfumes por visita{tres},', 'y pruébalos en tiras de papel, no todos en tu piel{tira}.']),
    ('final', ['Así que el café no hace magia{magia}... pero huele rico{rico}.', '¿Tú lo usas cuando pruebas perfumes{usas}?']),
]
DICHO = {'2011': 'dos mil once'}
ALINEAR = {'2011': '2011'}

SELLOS = [('fatiga', 'fatiga', 'FATIGA OLFATIVA', (255, 214, 0), 1.1),
 ('estudio', 'resultado', '¡COMO EL AIRE!', (200, 210, 225), 1.2),
 ('otro', 'acuerdo', '¿?', (255, 214, 0), 1.0),
 ('truco', 'piel', '¡TU PIEL!', (150, 210, 60), 1.0),
 ('limite', 'tres', 'MÁX. 3-4', (255, 214, 0), 1.1)]
DIVIDIDO = [('estudio', 'grupo1', 'resultado', 'CAFÉ', 'AIRE')]
GOLPES = [('gancho', 'limpia', 0.6, 0.0), ('fatiga', 'fatiga', 0.6, 0.0), ('estudio', 'resultado', 0.8, 0.25), ('truco', 'piel', 0.5, 0.0), ('limite', 'tres', 0.6, 0.0)]

EF = [('gancho', 'cafe', 'pop'),
 ('gancho', 'limpia', 'boing'),
 ('fatiga', 'fatiga', 'golpe'),
 ('fatiga', 'igual', 'boing'),
 ('idea', 'reinicia', 'ding'),
 ('idea', 'canal', 'pop'),
 ('estudio', 'grupo1', 'tin'),
 ('estudio', 'grupo2', 'tin'),
 ('estudio', 'grupo3', 'tin'),
 ('estudio', 'resultado', 'golpe'),
 ('otro', 'acuerdo', 'boing'),
 ('truco', 'piel', 'ding'),
 ('truco', 'aire', 'pop'),
 ('limite', 'tres', 'golpe'),
 ('final', 'magia', 'boing'),
 ('final', 'usas', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
