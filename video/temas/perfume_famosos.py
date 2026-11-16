"""Tema: ¿Por qué todos los famosos tienen su perfume? (estilo cómic, ~1:09)

Datos (revisados):
- White Diamonds, de Elizabeth Taylor (1991), es el perfume de celebridad más vendido de la historia: más de 1 500 millones de dólares para 2018 (Business of Fashion).
- Glow by JLo (2002) desató la ola de perfumes de celebridades de los 2000.
- Normalmente el famoso licencia su nombre a una empresa de fragancias; un perfumista crea el olor y el famoso participa con su imagen y opinión, y cobra regalías.
- Cloud, de Ariana Grande (2018), encabeza rankings recientes de perfumes de famosos; su línea de fragancias superó los 1 000 millones de dólares en ventas al público.
- Muchos perfumes de celebridades desaparecen en pocos años.
"""
from temas._comun_comic import *

ESCENA = "famosos.js"
SALIDA = "perfume-famosos.mp4"

GUION = [
    ('gancho', ['¿Por qué casi todos los *famosos* tienen su propio perfume{famosos}?']),
    ('taylor', ['La pionera fue *Elizabeth Taylor*{taylor}:', 'en 1991 lanzó un perfume llamado *White Diamonds*{white},', 'y para 2018 ya había vendido más de *mil quinientos millones de dólares*{mil}.']),
    ('jlo', ['En 2002, Jennifer López sacó *Glow*{glow},', 'y desató la fiebre de los perfumes de famosos{fiebre}:', 'cantantes{cantantes}, actores{actores}, futbolistas{futbol}... todos querían uno{todos}.', 'Hasta Cristiano Ronaldo tiene el suyo{cristiano}.']),
    ('como', ['Pero ojo{ojo}: casi nunca lo crea el famoso{crea}.', 'Una empresa lo fabrica{empresa}, un *perfumista* lo diseña{perfumista},', 'y el famoso pone su *nombre*, su cara y su opinión{cara}.', 'Y cobra una parte por cada frasco vendido{regalias}.']),
    ('porque', ['¿Y por qué se venden tanto{venden}?', 'Porque es la forma más fácil de tener algo de tu ídolo{idolo}:', 'no puedes comprar su vida... pero sí su *olor*{olor}.']),
    ('truco', ['¿Y cuál es la fórmula{formula}? Casi siempre:', 'un olor fácil de querer, *dulce* y frutal{dulce},', 'y un frasco que se vea bonito en las *redes*{redes}.']),
    ('fracasos', ['Aunque no todos triunfan{triunfan}:', 'muchos perfumes de famosos *desaparecen* en uno o dos años{desaparecen}.']),
    ('ariana', ['Hoy, la reina es *Ariana Grande*{ariana}:', 'su perfume *Cloud* es de los más buscados{cloud},', 'y su línea ya pasó los *mil millones de dólares* en ventas{milm}.']),
    ('final', ['¿Tú comprarías el perfume de un famoso{comprarias}?', '¿De cuál{cual}?']),
]
DICHO = {'Elizabeth': 'elísabet', 'Taylor': 'téilor', '1991': 'mil novecientos noventa y uno', 'White': 'uait', 'Diamonds': 'dáimonds', '2018': 'dos mil dieciocho', '2002': 'dos mil dos', 'Jennifer': 'yénifer', 'Glow': 'glou', 'Ariana': 'ariana', 'Grande': 'grande', 'Cristiano': 'cristiano', 'Cloud': 'claud'}
ALINEAR = {'1991': '1991', '2018': '2018', '2002': '2002'}

SELLOS = [('taylor', 'mil', '$1 500 000 000', (150, 210, 60), 1.1),
 ('jlo', 'fiebre', '¡FIEBRE!', (255, 120, 160), 1.0),
 ('como', 'perfumista', 'EL PERFUMISTA', (255, 214, 0), 1.0),
 ('fracasos', 'desaparecen', '¡ADIÓS!', (200, 210, 225), 1.0),
 ('ariana', 'milm', '+$1 000 MILLONES', (150, 210, 60), 1.1)]
DIVIDIDO = [('como', 'perfumista', 'regalias', 'LO CREA...', 'LO FIRMA...')]
GOLPES = [('taylor', 'mil', 0.8, 0.2), ('jlo', 'fiebre', 0.5, 0.0), ('como', 'crea', 0.6, 0.0), ('ariana', 'milm', 0.7, 0.0)]

EF = [('gancho', 'famosos', 'pop'),
 ('taylor', 'taylor', 'ding'),
 ('taylor', 'mil', 'golpe'),
 ('jlo', 'glow', 'pop'),
 ('jlo', 'cantantes', 'tin'),
 ('jlo', 'actores', 'tin'),
 ('jlo', 'futbol', 'tin'),
 ('como', 'crea', 'boing'),
 ('como', 'perfumista', 'pop'),
 ('como', 'regalias', 'ding'),
 ('porque', 'olor', 'ding'),
 ('truco', 'dulce', 'pop'),
 ('truco', 'redes', 'ding'),
 ('fracasos', 'desaparecen', 'boing'),
 ('ariana', 'ariana', 'ding'),
 ('ariana', 'milm', 'golpe'),
 ('final', 'comprarias', 'pop'),
 ('final', 'cual', 'pop')]


def efectos(segs):
    return [(segs[e]['cues'][k], tipo, (1 if tipo == 'tin' else None)) for e, k, tipo in EF]
