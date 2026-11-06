"""
La leyenda del ajedrez y los granos de trigo
Video animado vertical (1080x1920, 30 fps) con voz narrada.

Uso:
    python3 generar.py --modelo /ruta/es_MX-claude-high.onnx --salida leyenda-ajedrez.mp4

Requiere: piper-tts, numpy, Pillow, ffmpeg y las fuentes Inter / DejaVu / Noto Color Emoji.
"""
import argparse
import json
import math
import os
import random
import subprocess
import sys
import tempfile
import wave
from functools import lru_cache
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
SR = 44100
GAP = 0.45      # silencio entre frases (s)
INTRO = 0.4     # silencio inicial (s)
OUTRO = 1.6     # cola final (s)

# ---------------------------------------------------------------- guion
# (escena, texto para la voz, texto de subtítulos)
GUION = [
    ("gancho",
     "Un rey estuvo a punto de perder su reino entero... por culpa de un tablero de ajedrez y unos granos de trigo.",
     "Un rey estuvo a punto de perder su reino entero... por culpa de un tablero de ajedrez y unos granos de trigo."),
    ("india",
     "Cuenta la leyenda que, hace siglos, en la India, un sabio llamado Sissa inventó un juego de guerra para su rey: el ajedrez.",
     "Cuenta la leyenda que, hace siglos, en la India, un sabio llamado Sissa inventó un juego de guerra para su rey: el ajedrez."),
    ("rey",
     "Al rey le fascinó tanto, que le dijo: pide lo que quieras, y será tuyo.",
     "Al rey le fascinó tanto, que le dijo: «Pide lo que quieras, y será tuyo»."),
    ("pedido",
     "Sissa sonrió, y pidió algo que parecía ridículo. Un grano de trigo en la primera casilla. Dos, en la segunda. Cuatro, en la tercera. Ocho, en la cuarta. Y así, duplicando, hasta llegar a la casilla sesenta y cuatro.",
     "Sissa sonrió, y pidió algo que parecía ridículo. Un grano de trigo en la primera casilla. Dos, en la segunda. Cuatro, en la tercera. Ocho, en la cuarta. Y así, duplicando, hasta llegar a la casilla 64."),
    ("risa",
     "El rey soltó una carcajada. ¿Solo eso? ¡Que le traigan un costal de trigo!",
     "El rey soltó una carcajada. ¿Solo eso? ¡Que le traigan un costal de trigo!"),
    ("c10",
     "Pero mira lo que pasa. En la casilla diez, ya hay quinientos doce granos. Apenas un puñado.",
     "Pero mira lo que pasa. En la casilla 10 ya hay 512 granos. Apenas un puñado."),
    ("c20",
     "En la casilla veinte, más de medio millón. El costal ya no alcanza.",
     "En la casilla 20, más de medio millón. El costal ya no alcanza."),
    ("c32",
     "En la casilla treinta y dos, más de dos mil millones de granos. Una cosecha entera... y apenas vamos a la mitad del tablero.",
     "En la casilla 32, más de 2 mil millones de granos. Una cosecha entera... y apenas vamos a la mitad del tablero."),
    ("c64",
     "Y en la última casilla, la sesenta y cuatro, más de nueve trillones de granos. Sumando todo el tablero, son dieciocho trillones.",
     "Y en la última casilla, la 64, más de 9 trillones de granos. Sumando todo el tablero, son 18 trillones."),
    ("mil",
     "Eso es más trigo del que el mundo entero produciría en cerca de mil años de cosechas.",
     "Eso es más trigo del que el mundo entero produciría en cerca de mil años de cosechas."),
    ("expo",
     "Esa es la trampa del crecimiento exponencial. Al principio, parece que no pasa nada... y de pronto, lo devora todo.",
     "Esa es la trampa del crecimiento exponencial. Al principio parece que no pasa nada... y de pronto, lo devora todo."),
    ("final",
     "Dicen que el rey no pudo pagar, y que nombró a Sissa su consejero más sabio. Porque en sesenta y cuatro casillas, cabe algo más grande que un reino.",
     "Dicen que el rey no pudo pagar, y que nombró a Sissa su consejero más sabio. Porque en 64 casillas cabe algo más grande que un reino."),
    ("cta",
     "Si te voló la cabeza, compártelo con alguien que juegue ajedrez.",
     "Si te voló la cabeza, compártelo con alguien que juegue ajedrez. ♞"),
]

# ---------------------------------------------------------------- estilo
FONT_DIRS = ["/usr/share/fonts/opentype/inter/", "/usr/share/fonts/truetype/dejavu/",
             "/usr/share/fonts/truetype/noto/"]
GOLD = (245, 196, 82)
GOLD2 = (255, 228, 150)
CREAM = (250, 242, 225)
INK = (12, 10, 28)
SQ_LIGHT = (233, 210, 160)
SQ_DARK = (150, 100, 60)


def font_path(name):
    for d in FONT_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(name)


@lru_cache(maxsize=256)
def F(size, name="InterDisplay-Black.otf"):
    return ImageFont.truetype(font_path(name), int(size))


@lru_cache(maxsize=64)
def emoji(ch, size):
    f = ImageFont.truetype(font_path("NotoColorEmoji.ttf"), 109)
    im = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((80, 80), ch, font=f, embedded_color=True, anchor="mm")
    im = im.crop(im.getbbox())
    s = size / max(im.size)
    return im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)


@lru_cache(maxsize=32)
def glyph(ch, size, color=CREAM, outline=GOLD):
    """Pieza de ajedrez (Unicode) con relleno y contorno."""
    f = F(size, "DejaVuSans.ttf")
    pad = size // 4
    im = Image.new("RGBA", (int(size * 1.4) + pad, int(size * 1.4) + pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = (im.width // 2, im.height // 2)
    d.text(c, ch, font=f, fill=color + (255,), anchor="mm",
           stroke_width=max(2, size // 40), stroke_fill=outline + (255,))
    return im.crop(im.getbbox())


def paste(base, im, cx, cy, alpha=1.0, scale=1.0, rot=0.0):
    if scale != 1.0:
        im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.BILINEAR)
    if rot:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if alpha < 1.0:
        a = im.getchannel("A").point(lambda v: int(v * max(0.0, alpha)))
        im = im.copy()
        im.putalpha(a)
    base.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_io(x):
    x = clamp(x)
    return 3 * x * x - 2 * x * x * x


def spring(x):
    """Rebote: 0 -> 1 con sobrepaso."""
    x = clamp(x)
    return 1 - math.exp(-6 * x) * math.cos(10 * x)


def prog(t, a, b):
    return clamp((t - a) / max(1e-6, b - a))


def text_center(d, xy, s, size, fill=CREAM, name="InterDisplay-Black.otf", stroke=0, stroke_fill=INK, anchor="mm"):
    d.text(xy, s, font=F(size, name), fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=stroke_fill)


def text_layer(s, size, fill=CREAM, name="InterDisplay-Black.otf", stroke=0, stroke_fill=INK):
    f = F(size, name)
    l, t, r, b = f.getbbox(s, stroke_width=stroke)
    im = Image.new("RGBA", (r - l + 20, b - t + 20), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((10 - l, 10 - t), s, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
    return im


def fmt_int(n):
    return f"{n:,}".replace(",", " ")


# ---------------------------------------------------------------- fondo
def make_background():
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = W / 2, H * 0.42
    r = np.sqrt((x - cx) ** 2 + ((y - cy) * 0.75) ** 2) / (H * 0.7)
    r = np.clip(r, 0, 1)
    c0 = np.array([48, 30, 86], np.float32)   # violeta real
    c1 = np.array([8, 8, 24], np.float32)     # casi negro
    img = c0[None, None, :] * (1 - r[..., None]) + c1[None, None, :] * r[..., None]
    # patrón de tablero muy tenue
    tile = 135
    chk = (((x // tile) + (y // tile)) % 2).astype(np.float32)
    img += chk[..., None] * 5
    img = np.clip(img, 0, 255).astype(np.uint8)
    return Image.fromarray(img, "RGB").convert("RGBA")


RNG = random.Random(7)
DUST = [(RNG.random() * W, RNG.random() * H, RNG.uniform(1.5, 4.5), RNG.uniform(10, 40), RNG.random() * 6.28)
        for _ in range(70)]


def draw_dust(img, T):
    d = ImageDraw.Draw(img)
    for x, y, r, sp, ph in DUST:
        yy = (y - T * sp) % H
        xx = x + 18 * math.sin(T * 0.6 + ph)
        a = int(90 + 80 * math.sin(T * 1.7 + ph))
        d.ellipse((xx - r, yy - r, xx + r, yy + r), fill=GOLD2 + (max(0, a),))


# ---------------------------------------------------------------- tablero
def board_layer(size, values=None, lit_upto=0, heat=False, highlight=None, glow_t=0.0, show_counts=False):
    """values: función i(0..63) -> intensidad 0..1 para el modo calor."""
    pad = int(size * 0.045)
    im = Image.new("RGBA", (size + 2 * pad, size + 2 * pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, im.width - 1, im.height - 1), radius=pad, fill=(70, 40, 22, 255),
                        outline=GOLD + (255,), width=4)
    sq = size / 8
    for i in range(64):
        row, col = divmod(i, 8)
        # recorrido en serpentina desde abajo a la izquierda, como se cuenta la leyenda
        r = 7 - row
        c = col if row % 2 == 0 else 7 - col
        x0, y0 = pad + c * sq, pad + r * sq
        base = SQ_LIGHT if (r + c) % 2 == 0 else SQ_DARK
        col_rgb = base
        if heat and i < lit_upto and values is not None:
            v = values(i)
            hot = (255, int(220 - 160 * v), int(90 - 80 * v))
            mix = 0.35 + 0.65 * v
            col_rgb = tuple(int(base[k] * (1 - mix) + hot[k] * mix) for k in range(3))
        elif not heat and i < lit_upto:
            col_rgb = tuple(min(255, int(b * 0.5 + g * 0.6)) for b, g in zip(base, GOLD2))
        d.rectangle((x0, y0, x0 + sq, y0 + sq), fill=col_rgb + (255,))
        if highlight is not None and i == highlight:
            w = 6 + int(4 * math.sin(glow_t * 10))
            d.rectangle((x0 + 2, y0 + 2, x0 + sq - 2, y0 + sq - 2), outline=(255, 255, 255, 255), width=w)
        if show_counts and i < lit_upto:
            n = 2 ** i
            rr = random.Random(i)
            k = min(n, 16)
            for _ in range(k):
                gx = x0 + sq * rr.uniform(0.2, 0.8)
                gy = y0 + sq * rr.uniform(0.25, 0.85)
                d.ellipse((gx - sq * 0.05, gy - sq * 0.075, gx + sq * 0.05, gy + sq * 0.075),
                          fill=(200, 150, 40, 255), outline=(120, 80, 20, 255))
    return im


def square_center(size, i):
    pad = int(size * 0.045)
    sq = size / 8
    row, col = divmod(i, 8)
    r = 7 - row
    c = col if row % 2 == 0 else 7 - col
    return pad + c * sq + sq / 2, pad + r * sq + sq / 2


# ---------------------------------------------------------------- escenas
# Cada escena: fn(layer, t, dur, seg) dibuja sobre una capa RGBA transparente.

def sc_gancho(L, t, dur, seg):
    d = ImageDraw.Draw(L)
    # lluvia de trigo
    for k in range(26):
        rr = random.Random(k)
        x = rr.uniform(60, W - 60)
        y = (rr.uniform(-H, 0) + t * rr.uniform(380, 700)) % (H + 200) - 100
        paste(L, emoji("🌾", int(rr.uniform(50, 90))), x, y, alpha=0.55, rot=rr.uniform(-40, 40) + t * 30 * (rr.random() - .5))
    # corona que cae y se ladea
    p = spring(t / 1.0)
    cy = -200 + (560 + 200) * p
    tilt = 12 * math.sin(t * 2.2) if t > 1.0 else 0
    paste(L, emoji("👑", 330), W / 2, cy, rot=tilt)
    lines = ["EL TABLERO", "QUE ARRUINÓ", "A UN REY"]
    for k, s in enumerate(lines):
        a = prog(t, 0.6 + 0.35 * k, 1.0 + 0.35 * k)
        if a <= 0:
            continue
        sc = 0.4 + 0.6 * spring(a)
        col = GOLD if k == 1 else CREAM
        paste(L, text_layer(s, 128, fill=col, stroke=6), W / 2, 800 + k * 150, alpha=min(1, a * 2), scale=sc)
    # mini tablero inclinado
    a = prog(t, 2.0, 2.8)
    if a > 0:
        b = board_layer(320)
        paste(L, b, W / 2, 1440 + 30 * math.sin(t * 2), alpha=ease_out(a), scale=0.7 + 0.3 * ease_out(a), rot=8 * math.sin(t))


def palace(d, base_y, color):
    # silueta de palacio con cúpulas
    for cx, w, h in [(W / 2, 360, 300), (W / 2 - 300, 200, 200), (W / 2 + 300, 200, 200)]:
        d.rectangle((cx - w / 2, base_y - h, cx + w / 2, base_y), fill=color)
        d.ellipse((cx - w * 0.42, base_y - h - w * 0.55, cx + w * 0.42, base_y - h + w * 0.3), fill=color)
        d.polygon([(cx - 10, base_y - h - w * 0.5), (cx + 10, base_y - h - w * 0.5), (cx, base_y - h - w * 0.8)], fill=color)
        for k in range(-1, 2):
            ax = cx + k * w * 0.28
            d.rounded_rectangle((ax - 22, base_y - h * 0.55, ax + 22, base_y - 10), radius=22, fill=(30, 18, 50, 255))
    for cx in (W / 2 - 470, W / 2 + 470):
        d.rectangle((cx - 28, base_y - 420, cx + 28, base_y), fill=color)
        d.ellipse((cx - 45, base_y - 470, cx + 45, base_y - 390), fill=color)


def sc_india(L, t, dur, seg):
    d = ImageDraw.Draw(L)
    # sol
    a = ease_out(t / 1.2)
    sun_y = 760 - 120 * a
    for r, al in ((260, 40), (200, 70), (150, 255)):
        d.ellipse((W / 2 - r, sun_y - r, W / 2 + r, sun_y + r), fill=(255, 170, 70, int(al * a)))
    palace(d, 1080, (24, 14, 40, 255))
    d.rectangle((0, 1080, W, 1130), fill=(24, 14, 40, 255))
    # etiqueta
    tag = text_layer("INDIA · HACE SIGLOS", 54, fill=INK, name="Inter-Black.otf")
    pa = prog(t, 0.3, 0.9)
    if pa > 0:
        bx = Image.new("RGBA", (tag.width + 50, tag.height + 24), (0, 0, 0, 0))
        ImageDraw.Draw(bx).rounded_rectangle((0, 0, bx.width - 1, bx.height - 1), radius=bx.height // 2, fill=GOLD + (255,))
        bx.alpha_composite(tag, (25, 12))
        paste(L, bx, W / 2, 260, alpha=pa, scale=0.6 + 0.4 * spring(pa))
    # piezas que se levantan
    pieces = "♜♞♝♛♚♝♞♜"
    t0 = dur * 0.55
    for k, ch in enumerate(pieces):
        pp = prog(t, t0 + k * 0.12, t0 + k * 0.12 + 0.6)
        if pp <= 0:
            continue
        x = 95 + k * 127
        y = 1330 - 120 * spring(pp) + 8 * math.sin(t * 3 + k)
        paste(L, glyph(ch, 130, color=(40, 24, 60), outline=GOLD), x, y, alpha=pp)
    pa = prog(t, t0 + 1.2, t0 + 1.8)
    if pa > 0:
        paste(L, text_layer("AJEDREZ", 150, fill=GOLD, stroke=6), W / 2, 1490, alpha=pa, scale=0.5 + 0.5 * spring(pa))
    # Sissa
    ps = prog(t, 1.4, 2.0)
    if ps > 0:
        paste(L, emoji("🧙", 190), 230, 880 - 30 * spring(ps), alpha=ps)
        paste(L, text_layer("Sissa", 60, fill=CREAM, name="InterDisplay-Bold.otf", stroke=4), 230, 1030, alpha=ps)


def bubble(L, text, cx, cy, p, w=820):
    if p <= 0:
        return
    lay = text_layer(text, 74, fill=INK, name="InterDisplay-ExtraBold.otf")
    bw, bh = max(w, lay.width + 80), lay.height + 80
    b = Image.new("RGBA", (bw, bh + 60), (0, 0, 0, 0))
    d = ImageDraw.Draw(b)
    d.rounded_rectangle((0, 0, bw - 1, bh), radius=60, fill=CREAM + (255,), outline=GOLD + (255,), width=6)
    d.polygon([(bw * 0.42, bh - 3), (bw * 0.55, bh - 3), (bw * 0.45, bh + 55)], fill=CREAM + (255,))
    b.alpha_composite(lay, ((bw - lay.width) // 2, (bh - lay.height) // 2))
    paste(L, b, cx, cy, alpha=min(1, p * 2), scale=0.5 + 0.5 * spring(p))


def sc_rey(L, t, dur, seg):
    d = ImageDraw.Draw(L)
    # rayos de luz giratorios
    for k in range(12):
        ang = t * 0.25 + k * math.pi / 6
        x1, y1 = W / 2 + 1400 * math.cos(ang), 1150 + 1400 * math.sin(ang)
        x2, y2 = W / 2 + 1400 * math.cos(ang + 0.12), 1150 + 1400 * math.sin(ang + 0.12)
        d.polygon([(W / 2, 1150), (x1, y1), (x2, y2)], fill=GOLD + (22,))
    p = spring(t / 0.9)
    bob = 12 * math.sin(t * 2.5)
    paste(L, emoji("👑", 200), W / 2, 760 + bob - 40 * (1 - p), alpha=clamp(t / 0.4))
    paste(L, glyph("♚", 520, color=(40, 24, 60), outline=GOLD), W / 2, 1150 + bob, scale=0.6 + 0.4 * p)
    # el rey habla a partir de "le dijo"
    i = seg["text"].find("pide")
    ts = seg["speech"] * i / len(seg["text"]) - 0.2
    bubble(L, "¡Pide lo que quieras!", W / 2, 400, prog(t, ts, ts + 0.5))


def sc_pedido(L, t, dur, seg):
    size = 820
    txt = seg["text"]
    marks = [txt.find(k) for k in ("Un grano", "Dos", "Cuatro", "Ocho", "Y así")]
    tm = [seg["speech"] * m / len(txt) for m in marks]
    lit = 0
    for k in range(4):
        if t >= tm[k]:
            lit = k + 1
    # barrido: duplicando hasta la 64
    sweep = 0.0
    if t >= tm[4]:
        sweep = ease_io(prog(t, tm[4] + 0.6, seg["speech"]))
        lit = max(lit, 4 + int(60 * sweep))
    pb = ease_out(t / 0.8)
    b = board_layer(size, lit_upto=lit, show_counts=True, highlight=(lit - 1 if lit else None), glow_t=t)
    by = 980
    paste(L, b, W / 2, by + 80 * (1 - pb), alpha=pb, scale=0.85 + 0.15 * pb)
    # etiqueta de la casilla actual
    if lit:
        n = 2 ** (lit - 1)
        label = f"Casilla {lit}:  {fmt_int(n)} grano" + ("s" if n > 1 else "")
        col = GOLD if lit <= 4 else GOLD2
        paste(L, text_layer(label, 70 if lit < 30 else 56, fill=col, stroke=5), W / 2, 420)
        bx, byy = square_center(size, lit - 1)
        ox = W / 2 - b.width / 2
        oy = by - b.height / 2
        if lit <= 4:
            k = lit - 1
            pp = prog(t, tm[k], tm[k] + 0.6)
            paste(L, text_layer("×2" if k else "1", 90, fill=CREAM, stroke=6), ox + bx, oy + byy - 150 * ease_out(pp),
                  alpha=1 - pp)
    else:
        paste(L, text_layer("Su pedido:", 80, fill=CREAM, stroke=5), W / 2, 420, alpha=prog(t, 0.5, 1.0))


def sc_risa(L, t, dur, seg):
    shake = 18 * math.sin(t * 28) * math.exp(-((t % 1.2) * 2.5))
    paste(L, glyph("♚", 480, color=(40, 24, 60), outline=GOLD), W / 2 + shake, 1100, rot=shake * 0.4)
    paste(L, emoji("😂", 170), W / 2 + 230, 820)
    for k, (x, y, r) in enumerate([(250, 520, -14), (800, 450, 10), (540, 330, -4)]):
        p = prog(t, 0.2 + k * 0.3, 0.6 + k * 0.3)
        if p > 0:
            paste(L, text_layer("JA", 150, fill=GOLD, stroke=7), x, y + 8 * math.sin(t * 9 + k), alpha=p,
                  scale=0.4 + 0.6 * spring(p), rot=r)
    i = seg["text"].find("¡Que")
    ts = seg["speech"] * i / len(seg["text"])
    p = prog(t, ts, ts + 0.5)
    if p > 0:
        paste(L, emoji("🧺", 200), W / 2 - 260, 1480 - 40 * spring(p), alpha=p)
        paste(L, text_layer("1 costal", 90, fill=CREAM, stroke=6), W / 2 + 120, 1480, alpha=p, scale=0.6 + 0.4 * spring(p))


CASILLAS = {"c10": (0, 10, "✋", "un puñado"), "c20": (10, 20, "🧺", "¡ya no alcanza!"),
            "c32": (20, 32, "🚜", "una cosecha entera"), "c64": (32, 64, "🌍", "")}


def sc_casilla(L, t, dur, seg):
    a, b_, emo, caption = CASILLAS[seg["scene"]]
    grow = ease_io(prog(t, 0.2, min(dur * 0.55, 3.2)))
    cur = a + (b_ - a) * grow
    lit = max(1, int(round(cur)))
    size = 700
    heat = lambda i: (i / 63) ** 1.3
    b = board_layer(size, values=heat, lit_upto=lit, heat=True, highlight=lit - 1, glow_t=t)
    paste(L, b, W / 2, 610)
    # contador gigante
    n = 2 ** (lit - 1)  # valor exacto de la casilla iluminada
    paste(L, text_layer(f"CASILLA {lit}", 76, fill=GOLD, name="Inter-Black.otf"), W / 2, 1060)
    s = fmt_int(n)
    size_n = 150 if len(s) < 10 else (110 if len(s) < 16 else 64)
    pulse = 1 + 0.04 * math.sin(t * 8) if lit == b_ else 1
    paste(L, text_layer(s, size_n, fill=CREAM, stroke=7), W / 2, 1200, scale=pulse)
    paste(L, text_layer("granos", 58, fill=CREAM, name="InterDisplay-Bold.otf"), W / 2, 1300)
    p = prog(t, dur * 0.5, dur * 0.5 + 0.6)
    if seg["scene"] != "c64" and p > 0:
        tl = text_layer(caption, 74, fill=GOLD2, stroke=5)
        paste(L, emoji(emo, 150), W / 2 - (tl.width + 170) / 2 + 75, 1460, alpha=p, scale=0.5 + 0.5 * spring(p))
        paste(L, tl, W / 2 + 85, 1460, alpha=p)
    if seg["scene"] == "c32":
        q = prog(t, dur * 0.72, dur * 0.72 + 0.5)
        if q > 0:
            paste(L, text_layer("...y vamos a la MITAD", 64, fill=CREAM, stroke=5), W / 2, 1580, alpha=q)
    if seg["scene"] == "c64":
        i = seg["text"].find("Sumando")
        ts = seg["speech"] * i / len(seg["text"])
        q = prog(t, ts, ts + 0.7)
        if q > 0:
            box = Image.new("RGBA", (980, 250), (0, 0, 0, 0))
            ImageDraw.Draw(box).rounded_rectangle((0, 0, 979, 249), radius=40, fill=GOLD + (255,))
            tl = text_layer("TOTAL DEL TABLERO", 48, fill=INK, name="Inter-Black.otf")
            box.alpha_composite(tl, ((980 - tl.width) // 2, 25))
            tn = text_layer(fmt_int(2 ** 64 - 1), 62, fill=INK, name="InterDisplay-Black.otf")
            box.alpha_composite(tn, ((980 - tn.width) // 2, 100))
            paste(L, box, W / 2, 1520, alpha=q, scale=0.6 + 0.4 * spring(q))
            paste(L, emoji("🤯", 150), W / 2 + 430, 1380, alpha=q, rot=10 * math.sin(t * 4))


def sc_mil(L, t, dur, seg):
    d = ImageDraw.Draw(L)
    paste(L, emoji("🌍", 160), 200, 330, alpha=prog(t, 0, 0.5))
    paste(L, text_layer("1 cuadrito =", 62, fill=CREAM, name="InterDisplay-Bold.otf"), 620, 290, alpha=prog(t, 0, 0.5))
    paste(L, text_layer("1 año de cosecha mundial", 50, fill=GOLD2, name="InterDisplay-Bold.otf"), 620, 370, alpha=prog(t, 0, 0.5))
    cols, rows = 25, 40
    cs = 30
    gx0 = (W - cols * cs) / 2
    gy0 = 470
    fill = ease_io(prog(t, 0.6, dur - 0.9))
    k = int(1000 * fill)
    for i in range(1000):
        r, c = divmod(i, cols)
        x, y = gx0 + c * cs, gy0 + r * cs
        col = GOLD + (255,) if i < k else (255, 255, 255, 25)
        d.rounded_rectangle((x + 3, y + 3, x + cs - 3, y + cs - 3), radius=5, fill=col)
    years = text_layer(f"{k} años", 130, fill=CREAM, stroke=8)
    paste(L, years, W / 2, gy0 + rows * cs / 2, scale=1 + 0.03 * math.sin(t * 9))


def sc_expo(L, t, dur, seg):
    d = ImageDraw.Draw(L)
    x0, y0, x1, y1 = 140, 1450, 960, 380
    d.line((x0, y0, x1 + 20, y0), fill=CREAM + (200,), width=6)
    d.line((x0, y0, x0, y1 - 20), fill=CREAM + (200,), width=6)
    text_center(d, (x1 - 60, y0 + 60), "casillas →", 44, fill=CREAM, name="InterDisplay-Bold.otf")
    text_center(d, (x0 + 120, y1 - 50), "↑ granos", 44, fill=CREAM, name="InterDisplay-Bold.otf")
    p = ease_io(prog(t, 0.3, dur * 0.8))
    pts = []
    N = 200
    for i in range(int(N * p) + 1):
        u = i / N
        v = (2 ** (u * 20) - 1) / (2 ** 20 - 1)
        pts.append((x0 + (x1 - x0) * u, y0 - (y0 - y1) * v))
    if len(pts) > 1:
        d.line(pts, fill=(255, 140, 60, 90), width=26, joint="curve")
        d.line(pts, fill=GOLD + (255,), width=12, joint="curve")
        hx, hy = pts[-1]
        r = 22 + 6 * math.sin(t * 10)
        d.ellipse((hx - r, hy - r, hx + r, hy + r), fill=(255, 255, 255, 255))
    i = seg["text"].find("Al principio")
    ts = seg["speech"] * i / len(seg["text"])
    q = prog(t, ts, ts + 0.5)
    if q > 0:
        paste(L, text_layer("«no pasa nada»", 62, fill=CREAM, stroke=4), 420, y0 - 110, alpha=q)
    j = seg["text"].find("de pronto")
    tj = seg["speech"] * j / len(seg["text"])
    q = prog(t, tj, tj + 0.4)
    if q > 0:
        paste(L, text_layer("¡BOOM!", 150, fill=GOLD, stroke=8), 640, 640, alpha=q, scale=0.4 + 0.8 * spring(q), rot=-8)
    paste(L, text_layer("CRECIMIENTO EXPONENCIAL", 64, fill=GOLD2, name="Inter-Black.otf"), W / 2, 250, alpha=prog(t, 0, 0.6))


def sc_final(L, t, dur, seg):
    p = ease_out(t / 1.0)
    b = board_layer(600)
    paste(L, b, W / 2, 1150, alpha=p, rot=4 * math.sin(t * 0.8))
    paste(L, emoji("👑", 220 + int(10 * math.sin(t * 3))), W / 2, 760, alpha=p)
    paste(L, glyph("♚", 220, color=(40, 24, 60), outline=GOLD), 180, 1500, alpha=p)
    paste(L, emoji("🧙", 210), W - 180, 1500, alpha=p)
    i = seg["text"].find("Porque")
    ts = seg["speech"] * i / len(seg["text"])
    q = prog(t, ts, ts + 0.6)
    if q > 0:
        paste(L, text_layer("64 casillas", 110, fill=GOLD, stroke=6), W / 2, 330, alpha=q, scale=0.6 + 0.4 * spring(q))
        paste(L, text_layer("> un reino", 110, fill=CREAM, stroke=6), W / 2, 470, alpha=q, scale=0.6 + 0.4 * spring(q))


def sc_cta(L, t, dur, seg):
    paste(L, glyph("♞", 420, color=(40, 24, 60), outline=GOLD), W / 2, 760 + 15 * math.sin(t * 2), rot=6 * math.sin(t * 1.5))
    p = spring(prog(t, 0.2, 1.0))
    paste(L, text_layer("¡COMPÁRTELO!", 130, fill=GOLD, stroke=7), W / 2, 1150, scale=0.5 + 0.5 * p + 0.03 * math.sin(t * 6))
    paste(L, text_layer("con alguien que juegue ajedrez", 58, fill=CREAM, name="InterDisplay-Bold.otf"), W / 2, 1290,
          alpha=prog(t, 0.6, 1.2))
    paste(L, emoji("🔁", 120), W / 2 - 120, 1460, alpha=prog(t, 1.0, 1.5))
    paste(L, emoji("♟️", 120), W / 2 + 120, 1460, alpha=prog(t, 1.2, 1.7))


SCENES = {"gancho": sc_gancho, "india": sc_india, "rey": sc_rey, "pedido": sc_pedido, "risa": sc_risa,
          "c10": sc_casilla, "c20": sc_casilla, "c32": sc_casilla, "c64": sc_casilla, "mil": sc_mil,
          "expo": sc_expo, "final": sc_final, "cta": sc_cta}


# ---------------------------------------------------------------- subtítulos
def chunks(text, maxc=26):
    words, out, cur = text.split(), [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > maxc:
            out.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
        if cur.endswith((".", "?", "!", "...", "»", ":")) and len(cur) > 10:
            out.append(cur)
            cur = ""
    if cur:
        out.append(cur)
    return out


def caption_at(seg, t):
    cs = seg["chunks"]
    total = sum(len(c) for c in cs)
    acc = 0
    sp = seg["speech"]
    for c in cs:
        a = sp * acc / total
        acc += len(c)
        b = sp * acc / total
        if t < b or c is cs[-1]:
            return c, t - a
    return None, 0


def draw_caption(img, seg, t):
    t -= seg.get("vo_off", 0.0)
    if t < 0:
        return
    if t > seg["speech"] + 0.3:
        return
    c, ct = caption_at(seg, t)
    if not c:
        return
    lay = text_layer(c, 66, fill=(255, 255, 255), name="InterDisplay-ExtraBold.otf", stroke=7, stroke_fill=(10, 8, 20))
    sc = 0.85 + 0.15 * spring(ct / 0.25)
    paste(img, lay, W / 2, 1745, scale=sc)


# ---------------------------------------------------------------- render
BG = None
SEGS = None
TOTAL = 0


def init_worker(segs, total):
    global BG, SEGS, TOTAL
    BG = make_background()
    SEGS = segs
    TOTAL = total


def render_frame(fi):
    T = fi / FPS
    img = BG.copy()
    draw_dust(img, T)
    for seg in SEGS:
        if seg["start"] - 0.001 <= T < seg["end"] or (seg is SEGS[-1] and T >= seg["start"]):
            t = T - seg["start"]
            dur = seg["end"] - seg["start"]
            L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            SCENES[seg["scene"]](L, t, dur, seg)
            fade = min(1.0, t / 0.25)
            if seg is not SEGS[-1]:
                fade = min(fade, (dur - t) / 0.2)
            else:
                fade = min(fade, (TOTAL - T) / 0.6)
            if fade < 1:
                L.putalpha(L.getchannel("A").point(lambda v: int(v * max(0, fade))))
            img.alpha_composite(L)
            draw_caption(img, seg, t)
            break
    # barra de progreso
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((60, 70, W - 60, 82), radius=6, fill=(255, 255, 255, 50))
    d.rounded_rectangle((60, 70, 60 + (W - 120) * min(1, T / TOTAL), 82), radius=6, fill=GOLD + (255,))
    return img.convert("RGB").tobytes()


# ---------------------------------------------------------------- audio
def read_wav(path):
    with wave.open(path) as w:
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        if w.getnchannels() == 2:
            x = x.reshape(-1, 2).mean(1)
    if sr != SR:
        n = int(len(x) * SR / sr)
        x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    return x


def tts(model, text, out):
    subprocess.run([sys.executable, "-m", "piper", "-m", model, "-f", out, "--length-scale", "1.0",
                    "--sentence-silence", "0.3"], input=text.encode(), check=True, capture_output=True)
    x = read_wav(out)
    # recorta silencios de los extremos
    idx = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, idx[0] - 800): idx[-1] + 2000]


def music(total):
    """Colchón musical generado: acordes Re menor - Si♭ - Fa - Do con pulso suave."""
    n = int(total * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, np.float32)
    prog_ = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]]
    bar = 4.0
    for i in range(int(total / bar) + 1):
        a, b = int(i * bar * SR), min(n, int((i + 1) * bar * SR + SR))
        if a >= n:
            break
        tt = t[a:b] - i * bar
        env = np.clip(tt / 1.2, 0, 1) * np.clip((bar + 1 - tt) / 1.2, 0, 1)
        for m in prog_[i % 4]:
            f = 440 * 2 ** ((m - 69) / 12)
            out[a:b] += 0.05 * env * (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 1.003 * tt))
        root = 440 * 2 ** ((prog_[i % 4][0] - 12 - 69) / 12)
        out[a:b] += 0.07 * env * np.sin(2 * np.pi * root * tt)
        # arpegio tipo pluck
        for k in range(8):
            m = prog_[i % 4][k % 3] + 12 * (k // 3 % 2)
            f = 440 * 2 ** ((m - 69) / 12)
            s = a + int(k * 0.5 * SR)
            e = min(n, s + int(0.6 * SR))
            if s >= n:
                break
            tp = np.arange(e - s) / SR
            out[s:e] += 0.035 * np.exp(-tp * 6) * np.sin(2 * np.pi * f * tp)
    fade = np.minimum(1, np.minimum(t / 2, (total - t) / 2.5))
    return out * fade


def blip(f=880, d=0.12, v=0.25):
    tp = np.arange(int(d * SR)) / SR
    return (v * np.exp(-tp * 30) * np.sin(2 * np.pi * f * tp * (1 + 0.5 * np.exp(-tp * 40)))).astype(np.float32)


def whoosh(d=0.5, v=0.12):
    rng = np.random.default_rng(1)
    x = rng.standard_normal(int(d * SR)).astype(np.float32)
    x = np.convolve(x, np.ones(30) / 30, mode="same")
    env = np.sin(np.linspace(0, np.pi, len(x))) ** 2
    return v * x * env * 3


def mix_in(buf, x, at):
    a = int(at * SR)
    if a >= len(buf):
        return
    e = min(len(buf), a + len(x))
    buf[a:e] += x[:e - a]


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--modelo", required=True, help="modelo de voz Piper (.onnx)")
    ap.add_argument("--salida", default="leyenda-ajedrez.mp4")
    ap.add_argument("--procesos", type=int, default=os.cpu_count() or 2)
    ap.add_argument("--solo", type=int, default=0, help="renderiza solo los primeros N segundos (prueba)")
    args = ap.parse_args()

    tmp = tempfile.mkdtemp(prefix="ajedrez_")
    segs, voices = [], []
    tcur = INTRO
    for k, (scene, say, cap) in enumerate(GUION):
        x = tts(args.modelo, say, os.path.join(tmp, f"v{k}.wav"))
        dur = len(x) / SR
        seg = {"scene": scene, "text": cap, "speech": dur, "start": tcur, "end": tcur + dur + GAP,
               "chunks": chunks(cap)}
        seg["vo_at"] = tcur
        seg["vo_off"] = 0.0
        if k == 0:
            seg["start"] = 0.0
            seg["vo_off"] = INTRO
        voices.append((seg["vo_at"], x))
        segs.append(seg)
        tcur = seg["end"]
        print(f"  {scene:7s} {dur:5.2f}s")
    total = tcur + OUTRO
    segs[-1]["end"] = total
    print(f"Duración total: {total:.1f}s")

    # audio
    n = int(total * SR) + SR
    vo = np.zeros(n, np.float32)
    for at, x in voices:
        mix_in(vo, x * 0.95, at)
    sfx = np.zeros(n, np.float32)
    for s in segs[1:]:
        mix_in(sfx, whoosh(), s["start"] - 0.2)
    ped = next(s for s in segs if s["scene"] == "pedido")
    for k, key in enumerate(("Un grano", "Dos", "Cuatro", "Ocho")):
        at = ped["start"] + ped["speech"] * ped["text"].find(key) / len(ped["text"])
        mix_in(sfx, blip(660 * 2 ** (k / 4)), at)
    for s in segs:
        if s["scene"] in CASILLAS:
            a, b_, *_ = CASILLAS[s["scene"]]
            g_end = min((s["end"] - s["start"]) * 0.55, 3.2)
            for j in range(b_ - a):
                mix_in(sfx, blip(500 + 25 * (a + j), 0.06, 0.12), s["start"] + 0.2 + (g_end - 0.2) * (j + 1) / (b_ - a))
    mus = music(n / SR)
    # ducking: baja la música cuando habla la voz
    envv = np.convolve(np.abs(vo), np.ones(4410) / 4410, mode="same")
    duck = 1 - 0.55 * np.clip(envv * 12, 0, 1)
    mixx = vo + sfx + mus * duck * 1.4
    mixx = mixx / max(1.0, np.abs(mixx).max() / 0.95)
    wav_path = os.path.join(tmp, "mezcla.wav")
    with wave.open(wav_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mixx * 32767).astype(np.int16).tobytes())

    frames = int((args.solo or total) * FPS)
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-i", wav_path, "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", args.salida]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(args.procesos, initializer=init_worker, initargs=(segs, total)) as pool:
        for i, fr in enumerate(pool.imap(render_frame, range(frames), chunksize=8)):
            ff.stdin.write(fr)
            if i % 150 == 0:
                print(f"  cuadro {i}/{frames}", flush=True)
    ff.stdin.close()
    ff.wait()
    with open(os.path.splitext(args.salida)[0] + ".json", "w") as f:
        json.dump([{k: s[k] for k in ("scene", "start", "end")} for s in segs], f, indent=1)
    print("Listo:", args.salida)


if __name__ == "__main__":
    main()
