"""Tema: ¿Tu perfume es original o pirata? 6 señales (estilo cómic, ~1:09)

Datos (revisados):
- Señales comunes de un perfume falso: precio demasiado bajo, celofán flojo o con exceso de pegamento, caja con impresión mala o faltas de ortografía, código de lote ausente, en calcomanía o que no coincide entre caja y frasco, atomizador que rocía a chorro, olor que se va rápido o huele mucho a alcohol.
- Ninguna señal es definitiva por sí sola; la autenticidad se juzga con varias señales juntas.
- La Policía de la Ciudad de Londres (unidad PIPCU) ha reportado que pruebas de laboratorio a perfumes falsos decomisados encontraron químicos peligrosos como cianuro, y hasta orina.
- Recomendación: comprar en tiendas oficiales o distribuidores autorizados.
"""
from temas._comun_comic import *

ESCENA = "falso.js"
SALIDA = "perfume-original-o-pirata.mp4"

GUION = [
    ('gancho', ['¿Tu perfume es original{original}... o es *pirata*{pirata}?', 'Aquí van seis señales{seis}.']),
    ('precio', ['Uno: el *precio*{precio}.', 'Si un perfume de cien dólares te lo dejan en quince{quince}... sospecha{sospecha}.']),
    ('celofan', ['Dos: el *celofán*{celofan}.', 'El original viene bien pegado, sin arrugas ni pegamento de más{arrugas}.']),
    ('caja', ['Tres: la *caja*{caja}.', 'Letras chuecas{chuecas}, faltas de ortografía{ortografia}, o cartón delgadito{carton}: mala señal{mala}.']),
    ('lote', ['Cuatro, y la más importante: el *código de lote*{lote}.', 'Viene grabado abajo del frasco y también en la caja{grabado}, y tienen que *coincidir*{coincidir}.', 'Si es una calcomanía que se despega, o no coinciden{despega}... huye{huye}.', 'Y hay páginas donde metes ese código, y te dicen cuándo se fabricó{fabrico}.']),
    ('spray', ['Cinco: el *atomizador*{atomizador}.', 'En el original, sale una neblina fina{neblina}; en el pirata, muchas veces sale a *chorro*{chorro}.']),
    ('olor', ['Y seis: el *olor*{olor6}.', 'El pirata huele muy fuerte a alcohol al principio{alcohol}... y en un rato desaparece{desaparece}.']),
    ('peligro', ['Y no es solo perder tu dinero{dinero}:', 'en Inglaterra, la policía analizó perfumes falsos decomisados{policia},', 'y encontró químicos peligrosos como *cianuro*{cianuro}... y hasta *orina*{orina}.']),
    ('final', ['Así que mejor cómpralo en tiendas oficiales{oficiales}.', '¿A ti ya te vendieron uno pirata{pirata2}?']),
]
DICHO = {}
ALINEAR = {}

SELLOS = [('precio', 'sospecha', '¡SOSPECHA!', (255, 214, 0), 1.0),
 ('lote', 'coincidir', '¡DEBEN COINCIDIR!', (150, 210, 60), 1.2),
 ('spray', 'chorro', '¡CHORRO!', (255, 90, 90), 1.0),
 ('peligro', 'cianuro', '☠ CIANURO', (255, 90, 90), 1.1),
 ('peligro', 'orina', '¡¿ORINA?!', (255, 214, 0), 1.1)]
DIVIDIDO = [('spray', 'atomizador', None, 'ORIGINAL', 'PIRATA')]
GOLPES = [('gancho', 'pirata', 0.6, 0.2), ('lote', 'coincidir', 0.6, 0.0), ('spray', 'chorro', 0.6, 0.0), ('peligro', 'cianuro', 0.7, 0.0), ('peligro', 'orina', 0.8, 0.25)]

EF = [('gancho', 'pirata', 'boing'),
 ('precio', 'precio', 'pop'),
 ('precio', 'sospecha', 'golpe'),
 ('celofan', 'celofan', 'pop'),
 ('caja', 'chuecas', 'tin'),
 ('caja', 'ortografia', 'tin'),
 ('caja', 'mala', 'boing'),
 ('lote', 'lote', 'pop'),
 ('lote', 'coincidir', 'ding'),
 ('lote', 'huye', 'boing'),
 ('spray', 'neblina', 'ding'),
 ('spray', 'chorro', 'golpe'),
 ('olor', 'desaparece', 'boing'),
 ('peligro', 'cianuro', 'golpe'),
 ('peligro', 'orina', 'golpe'),
 ('final', 'oficiales', 'ding'),
 ('final', 'pirata2', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
