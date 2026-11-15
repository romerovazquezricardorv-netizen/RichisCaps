"""Tema: 5 perfumes famosos que mucha gente dice que están sobrevalorados (opinión, estilo cómic, ~50 s)

Basado en opiniones frecuentes en foros y reseñas (no es un ranking oficial ni dice que sean malos):
- Baccarat Rouge 540 (Maison Francis Kurkdjian): muy caro y ahora lo usa muchísima gente.
- Aventus (Creed): precio, variación entre lotes y clones muy parecidos.
- Sauvage (Dior): huele bien pero es omnipresente.
- Hacivat (Nishane): se compra como alternativa a Aventus, pero tampoco es barato.
- By the Fireplace (Maison Margiela Replica): se volvió viral y la expectativa supera al perfume para muchos.
Los frascos del video son modelos genéricos numerados.
Versión larga (~1:09): por qué pasa (hype, TikTok, influencers, precios), una nota de olor de cada uno (By the Fireplace:
castaña y madera ahumada; Hacivat: piña y musgo; BR540: azúcar quemada/ámbar y madera) y el consejo de probar una muestra.
"""
from temas._comun_comic import *

ESCENA = "sobrevalorados.js"
SALIDA = "perfumes-sobrevalorados.mp4"

GUION = [
    ("gancho", ["Cinco perfumes famosísimos que mucha gente dice que están *sobrevalorados*{sobre}.", "Ojo: no son malos{malos},", "y no lo digo yo: son críticas que se repiten en foros y reseñas{foros}."]),
    ("porque", ["¿Y por qué pasa esto{porque}?", "Por el *hype*{hype}: TikTok{tiktok}, influencers{influ}, y precios que suben cada año{suben}."]),
    ("c5", ["Número cinco{n5}: *By the Fireplace*{fire}.", "Huele a madera quemada y castañas{castanas}.", "Se hizo viral{viral}, y la expectativa es más grande que el perfume{expect}."]),
    ("c4", ["Número cuatro{n4}: *Hacivat*{hacivat}.", "Huele a piña y musgo{musgo}.", "Mucha gente lo compra como alternativa al Aventus{alt}... y tampoco es barato{barato}."]),
    ("c3", ["Número tres{n3}: *Sauvage*{sauvage}.", "Es de los perfumes más vendidos del mundo{vendido}.", "Huele bien{bien}... pero lo usa *todo el mundo*{todos}."]),
    ("c2", ["Número dos{n2}: *Aventus*{aventus}.", "Por su precio{precio}, porque cambia de lote a lote{lote},", "y porque tiene clones muy parecidos{clones}."]),
    ("c1", ["Y el número uno{n1}: *Baccarat Rouge 540*{baccarat}.", "Huele a azúcar quemada y madera{azucar}.", "Carísimo{caro}, y ahora lo hueles en cada esquina{esquina}."]),
    ("consejo", ["Mi consejo{consejo}: antes de comprar uno caro,", "prueba una *muestra*{muestra} unos días en tu piel{piel},", "o compra un *decant*{decant}: unos mililitros en un frasquito{frasquito}."]),
    ("final", ["Al final, el mejor perfume es el que te gusta *a ti*{ati}.", "¿Cuál agregarías tú{cual}?"]),
]
DICHO = {"By": "bai", "the": "de", "Fireplace": "fáierpleis", "Fireplace*{fire}.": "fáierpleis", "Hacivat": "jachivat", "Sauvage": "sovásh",
         "Baccarat": "bacará", "Rouge": "rush", "540": "quinientos cuarenta"}
ALINEAR = {"540": "540"}
SELLOS = [
    ("gancho", "malos", "¡NO SON MALOS!", (255, 214, 0), 1.1),
    ("c3", "todos", "¡TODO EL MUNDO!", (255, 214, 0), 1.0),
    ("c2", "clones", "¡CLONES!", (255, 214, 0), 0.9),
    ("c1", "caro", "$$$", (150, 210, 60), 1.0),
    ("porque", "hype", "¡HYPE!", (255, 214, 0), 1.0),
    ("consejo", "muestra", "¡PRUEBA ANTES!", (150, 210, 60), 1.1),
]
GOLPES = [("gancho", "sobre", 0.6, 0.0), ("c5", "fire", 0.5, 0.0), ("c4", "hacivat", 0.5, 0.0), ("c3", "sauvage", 0.5, 0.0),
          ("c2", "aventus", 0.5, 0.0), ("c1", "baccarat", 0.8, 0.25)]


def efectos(segs):
    c = lambda esc, k: segs[esc]["cues"][k]
    return [
        (c("gancho", "sobre"), "golpe", None), (c("gancho", "malos"), "boing", None),
        (c("c5", "n5"), "boom", None), (c("c5", "viral"), "pop", None),
        (c("c4", "n4"), "boom", None), (c("c4", "barato"), "boing", None),
        (c("c3", "n3"), "boom", None), (c("c3", "todos"), "golpe", None),
        (c("c2", "n2"), "boom", None), (c("c2", "clones"), "pop", None),
        (c("c1", "n1"), "boom", None), (c("c1", "caro"), "golpe", None), (c("final", "cual"), "pop", None),
    ]
