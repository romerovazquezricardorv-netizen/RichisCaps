"""Tema: ¿Es legal copiar un perfume? Clones, dupes y falsificaciones (estilo cómic, ~1:09)

Datos (revisados):
- En la mayoría de los países un olor no se patenta ni se registra fácilmente; la fórmula es secreto comercial. Crear un olor parecido con tu propia marca normalmente no es ilegal.
- Los clones se basan en análisis por cromatografía de gases (y espectrometría de masas), que separa e identifica los componentes.
- Copiar nombre, logo o el diseño del frasco sí es falsificación o violación de marca.
- 2006: la Suprema Corte de Holanda (Lancôme vs. Kecofa) dijo que el olor de un perfume puede tener derechos de autor (caso de Trésor); días antes, la Corte de Casación de Francia dijo lo contrario.
- Clon/dupe: se inspira en el olor y usa marca propia. Falso: finge ser el original.
"""
from temas._comun_comic import *

ESCENA = "clones.js"
SALIDA = "perfume-clones-legal.mp4"

GUION = [
    ('gancho', ['¿Es *legal* copiar un perfume{legal}?', 'La respuesta te va a sorprender{sorprender}.']),
    ('olor', ['En la mayoría de los países, un *olor* no se puede registrar como si fuera una canción{registrar}.', 'La fórmula es *secreta*{secreta}... pero si alguien logra un olor parecido{parecido},', 'normalmente *no* es ilegal{ilegal}.']),
    ('maquina', ['Así nacen los *clones*{clones}:', 'meten el perfume a una máquina llamada *cromatógrafo*{cromatografo},', 'que separa sus ingredientes uno por uno{separa},', 'y luego lo recrean con materiales más baratos{baratos}.']),
    ('marca', ['Lo que *no* pueden copiar es la marca{marca}:', 'el nombre{nombre}, el logo{logo}, o el frasco igualito{frasco}.', 'Eso ya es *falsificación*{falsificacion}.']),
    ('holanda', ['Aunque hay excepciones{excepciones}:', 'en 2006, un tribunal de Holanda le dio la razón a Lancôme{lancome}, contra una empresa que copió su perfume Trésor{tresor},', 'y dijo que un olor *sí* puede tener derechos de autor{derechos}.', 'Pero ese mismo año, en Francia, un tribunal dijo lo *contrario*{contrario}.']),
    ('diferencia', ['Entonces{entonces}: un *clon* se inspira en el olor{clon}, y usa su propia marca{propia}.', 'Un *falso* finge ser el original{falso}.', 'El primero casi siempre es legal{casi}... el segundo, *nunca*{nunca}.']),
    ('calidad', ['¿Y huelen igual{igual}? A veces se parecen muchísimo{parecen},', 'pero suelen durar menos{durar}, y cambian más en la piel{cambian}.']),
    ('final', ['¿Tú usas clones{usas}... o solo originales{originales}?']),
]
DICHO = {'2006': 'dos mil seis', 'Lancôme': 'lancóm', 'Trésor': 'tresór'}
ALINEAR = {'2006': '2006'}

SELLOS = [('olor', 'ilegal', '¡NO ES ILEGAL!', (150, 210, 60), 1.1),
 ('maquina', 'cromatografo', 'CROMATÓGRAFO', (255, 214, 0), 1.0),
 ('marca', 'falsificacion', '¡FALSIFICACIÓN!', (255, 90, 90), 1.2),
 ('holanda', 'derechos', '© OLOR', (255, 214, 0), 1.0),
 ('diferencia', 'nunca', '¡NUNCA!', (255, 90, 90), 1.0)]
DIVIDIDO = [('diferencia', 'clon', 'nunca', 'CLON', 'FALSO')]
GOLPES = [('gancho', 'legal', 0.6, 0.2), ('olor', 'ilegal', 0.6, 0.0), ('marca', 'falsificacion', 0.8, 0.25), ('holanda', 'contrario', 0.5, 0.0), ('diferencia', 'nunca', 0.7, 0.0)]

EF = [('gancho', 'legal', 'pop'),
 ('gancho', 'sorprender', 'boing'),
 ('olor', 'secreta', 'pop'),
 ('olor', 'ilegal', 'ding'),
 ('maquina', 'cromatografo', 'pop'),
 ('maquina', 'separa', 'tin'),
 ('maquina', 'baratos', 'ding'),
 ('marca', 'nombre', 'tin'),
 ('marca', 'logo', 'tin'),
 ('marca', 'frasco', 'tin'),
 ('marca', 'falsificacion', 'golpe'),
 ('holanda', 'derechos', 'ding'),
 ('holanda', 'contrario', 'boing'),
 ('diferencia', 'clon', 'pop'),
 ('diferencia', 'falso', 'pop'),
 ('diferencia', 'nunca', 'golpe'),
 ('calidad', 'durar', 'boing'),
 ('final', 'usas', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
