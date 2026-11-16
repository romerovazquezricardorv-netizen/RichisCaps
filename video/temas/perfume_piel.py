"""Tema: ¿Por qué el mismo perfume huele distinto en cada persona? (estilo cómic, ~1:09)

Datos (revisados):
- La piel grasa tiende a retener más el perfume; la piel seca lo deja ir antes (afirmación muy repetida por perfumistas, con poca investigación formal).
- Más temperatura en la piel = más evaporación: el perfume proyecta más al inicio y se gasta antes.
- El sudor y las bacterias de la piel tienen su propio olor y se mezclan con el perfume; también influyen cremas, jabones y la dieta (por ejemplo, ajo o comida muy condimentada).
- La percepción también cambia: por genética, hay personas que perciben distinto ciertas moléculas, y hay quien no huele ciertos almizcles (anosmia específica).
- Consejo: probar el perfume en la propia piel y esperar unas horas antes de comprarlo.
"""
from temas._comun_comic import *

ESCENA = "piel.js"
SALIDA = "perfume-huele-distinto.mp4"

GUION = [
    ('gancho', ['¿Por qué el mismo perfume huele increíble en tu amigo{amigo}...', 'y en ti no{ti}?']),
    ('piel', ['Primero: tu *piel*{piel}.', 'La piel *grasa* retiene más el perfume{grasa}, y puede hacerlo durar más;', 'la piel *seca* lo deja ir más rápido{seca}.']),
    ('temp', ['Segundo: la *temperatura*{temperatura}.', 'Si tu piel es más caliente, el perfume se evapora más rápido{evapora},', 'se siente más fuerte al principio{fuerte}... y se acaba antes{acaba}.', 'Por eso en el gimnasio, tu perfume se siente el doble{gym}.']),
    ('bacterias', ['Tercero: lo que vive en tu piel{vive}.', 'Tu sudor y tus *bacterias* tienen su propio olor{bacterias},', 'y se mezclan con el perfume{mezclan}.']),
    ('comida', ['También influyen tus cremas, tu jabón{jabon}...', 'y hasta lo que *comes*{comes}: el ajo o la comida muy condimentada se notan en el sudor{ajo}.']),
    ('nariz', ['Y algo que casi nadie sabe{nadie}: no solo cambia tu piel, también cambia la *nariz* de quien te huele{nariz}.', 'Por genética, cada persona percibe algunas moléculas distinto{genetica},', 'y hay quien de plano *no huele* ciertos almizcles{almizcles}.']),
    ('crema', ['Un truco{truco}: si tu piel es seca{seca2}, ponte una *crema sin olor* antes del perfume{crema}.', 'Así se agarra mejor{agarra}, y dura más{dura}.']),
    ('consejo', ['Por eso, nunca compres un perfume solo porque le queda bien a otro{otro}.', 'Pruébalo en *tu piel*, y espera unas horas{horas}.']),
    ('final', ['¿A ti te ha pasado que un perfume no te queda{pasado}?']),
]
DICHO = {}
ALINEAR = {}

SELLOS = [('piel', 'grasa', 'PIEL GRASA', (255, 214, 0), 1.0),
 ('piel', 'seca', 'PIEL SECA', (200, 210, 225), 1.0),
 ('temp', 'evapora', '¡SE EVAPORA!', (255, 120, 60), 1.0),
 ('bacterias', 'bacterias', '¡BACTERIAS!', (150, 210, 60), 1.0),
 ('nariz', 'almizcles', '¿QUÉ OLOR?', (255, 214, 0), 1.0),
 ('consejo', 'horas', '¡ESPERA!', (150, 210, 60), 1.0)]
DIVIDIDO = [('gancho', 'amigo', None, 'EN TU AMIGO', 'EN TI'), ('piel', 'grasa', None, 'GRASA', 'SECA')]
GOLPES = [('gancho', 'ti', 0.6, 0.2), ('temp', 'evapora', 0.5, 0.0), ('bacterias', 'bacterias', 0.5, 0.0), ('nariz', 'almizcles', 0.6, 0.0)]

EF = [('gancho', 'amigo', 'ding'),
 ('gancho', 'ti', 'boing'),
 ('piel', 'grasa', 'pop'),
 ('piel', 'seca', 'pop'),
 ('temp', 'evapora', 'pop'),
 ('temp', 'acaba', 'boing'),
 ('bacterias', 'bacterias', 'golpe'),
 ('comida', 'comes', 'pop'),
 ('comida', 'ajo', 'boing'),
 ('nariz', 'nariz', 'pop'),
 ('nariz', 'genetica', 'ding'),
 ('nariz', 'almizcles', 'golpe'),
 ('crema', 'crema', 'pop'),
 ('crema', 'dura', 'ding'),
 ('consejo', 'horas', 'ding'),
 ('final', 'pasado', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
