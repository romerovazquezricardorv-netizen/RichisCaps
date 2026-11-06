"""
El tablero que arruinó a un rey: video vertical en 3D con voz narrada, en el estilo de los videos
explicativos de TikTok e Instagram (escenas 3D con cámara en movimiento, subtítulos palabra por palabra
arriba y etiquetas en "píldora").

Etapas:
  1. Voz: Kokoro (voz masculina en español "em_alex"), una escena completa por vez para que la entonación sea
     natural; los tiempos de cada palabra salen de las pausas reales del audio.
  2. 3D: three.js en Chromium sin pantalla (escena3d/), un JPEG por cuadro.
  3. Composición: subtítulos, etiquetas, música y efectos con Pillow, numpy y ffmpeg.

Uso:
    npm install
    python3 generar.py --kokoro carpeta/kokoro-multi-lang-v1_0
"""
import argparse
import json
import math
import os
import random
import shutil
import subprocess
import sys
import wave
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(AQUI, "build")
W, H, FPS, SR = 1080, 1920, 30, 44100

# ---------------------------------------------------------------- guion
# Cada escena es una lista de frases. *palabra* = palabra clave (azul); palabra{cue} = marca de tiempo
# que usan las animaciones. Los números se leen con DICHO.
GUION = [
    ("gancho", ["¿Sabías que este tablero de ajedrez", "casi deja en la *ruina* a un *rey*?"]),
    ("pago", ["Cuenta la leyenda que su inventor", "le pidió al rey un pago muy *extraño*:"]),
    ("granos", ["*un{g1} grano* de trigo en la primera casilla,", "*dos*{g2} en la segunda,", "*cuatro*{g3} en la tercera,",
                "*ocho*{g4} en la cuarta..."]),
    ("duplicar", ["y así, *duplicando*,", "hasta la casilla *64*."]),
    ("risa", ["El rey se rió y aceptó de inmediato.", "Le pareció *casi nada*."]),
    ("c10", ["Pero mira: en la casilla 10", "ya hay *512 granos*."]),
    ("c20", ["En la 20,", "más de *medio millón*."]),
    ("c32", ["En la 32,", "más de *dos mil millones*...", "y apenas vamos a la *mitad*{mitad} del tablero."]),
    ("c64", ["Y en la última casilla,", "habría más de *nueve trillones* de granos."]),
    ("total", ["En total, unos *18 trillones*.", "Más trigo del que el mundo entero", "cosecharía en *mil{mil} años*."]),
    ("expo", ["Eso es el *crecimiento exponencial*:", "al principio no se nota...", "y de{boom} repente, es *imposible* de detener."]),
    ("final", ["Por eso dicen que el rey...", "*nunca*{cae} pudo pagar."]),
]
DICHO = {"64": "sesenta y cuatro", "10": "diez", "512": "quinientos doce", "20": "veinte", "32": "treinta y dos",
         "18": "dieciocho"}

# Etiquetas ("píldoras"): escena -> lista de (cue o segundos desde el inicio, texto, subtexto)
PILDORAS = {
    "granos": [("g1", "1 grano", None), ("g2", "2 granos", None), ("g3", "4 granos", None), ("g4", "8 granos", None)],
    "duplicar": [(0.5, "×2 en cada casilla", None)],
    "c10": [(0.6, "512 granos", "casilla 10")],
    "c20": [(0.5, "524 288 granos", "casilla 20")],
    "c32": [(0.6, "2 147 483 648 granos", "casilla 32"), ("mitad", "2 147 483 648 granos", "la mitad del tablero")],
    "c64": [(0.5, "9 223 372 036 854 775 808", "granos en la casilla 64")],
    "total": [(0.3, "18 446 744 073 709 551 615", "granos en todo el tablero"), ("mil", "≈ 1 000 años", "de cosecha mundial de trigo")],
}

# ---------------------------------------------------------------- tipografía
FONT_DIRS = ["/usr/share/fonts/opentype/inter/", "/usr/share/fonts/truetype/dejavu/"]
WHITE = (255, 255, 255)
BLUE = (128, 176, 255)


def font_path(name):
    for d in FONT_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(name)


@lru_cache(maxsize=64)
def F(size, name):
    return ImageFont.truetype(font_path(name), int(size))


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def spring(x):
    x = clamp(x)
    return 1 - math.exp(-7 * x) * math.cos(9 * x)


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


# ---------------------------------------------------------------- texto del guion
def parse_frase(frase):
    """Devuelve [(palabra_visible, es_clave, cue)] y el texto para la voz."""
    out, clave = [], False
    for raw in frase.split():
        cue = None
        if "{" in raw:
            i, j = raw.index("{"), raw.index("}")
            cue = raw[i + 1:j]
            raw = raw[:i] + raw[j + 1:]
        empieza = raw.startswith("*")
        if empieza:
            clave = True
        txt = raw.replace("*", "")
        out.append([txt, clave, cue])
        if raw.rstrip(".,:;!?…").endswith("*"):
            clave = False
    voz = " ".join(DICHO.get(w.strip(".,:;"), w.strip(".,:;")) + w[len(w.rstrip(".,:;")):] for w, _, _ in out)
    return out, voz


def peso(palabra):
    base = palabra.strip(".,:;!?…")
    return len(DICHO.get(base, base)) + 2


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


def write_wav(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


class Kokoro:
    """Voz neuronal Kokoro (onnx) con fonemas en español latino de espeak-ng."""

    def __init__(self, carpeta, voz):
        import onnxruntime as ort
        self.sess = ort.InferenceSession(os.path.join(carpeta, "model.onnx"), providers=["CPUExecutionProvider"])
        meta = self.sess.get_modelmeta().custom_metadata_map
        nombres = meta["speaker_names"].split(",")
        self.sr = int(meta.get("sample_rate", 24000))
        self.vocab = {}
        for line in open(os.path.join(carpeta, "tokens.txt"), encoding="utf-8"):
            line = line.rstrip("\n")
            if line:
                tok, idx = line.rsplit(" ", 1)
                self.vocab[tok if tok else " "] = int(idx)
        voces = np.fromfile(os.path.join(carpeta, "voices.bin"), dtype=np.float32).reshape(len(nombres), 510, 1, 256)
        self.estilo = voces[nombres.index(voz)]

    @staticmethod
    def fonemas(texto):
        import re
        out = ""
        for parte in re.split(r"([.,;:!?¡¿…]+)", texto):
            if not parte.strip():
                continue
            if re.fullmatch(r"[.,;:!?¡¿…]+", parte):
                p = parte.replace("…", "...").replace("¡", "").replace("¿", "")
                if p:
                    out = out.rstrip() + p + " "
                continue
            ipa = subprocess.run(["espeak-ng", "-q", "--ipa", "-v", "es-419", parte], capture_output=True, text=True).stdout
            out += " ".join(ipa.split()).replace("_", "") + " "
        return out.strip()

    def __call__(self, texto, velocidad):
        ids = [self.vocab[c] for c in self.fonemas(texto) if c in self.vocab][:508]
        audio = self.sess.run(None, {"tokens": np.array([[0] + ids + [0]], dtype=np.int64),
                                     "style": self.estilo[len(ids)].astype(np.float32),
                                     "speed": np.array([velocidad], dtype=np.float32)})[0]
        x = np.asarray(audio, dtype=np.float32).reshape(-1)
        n = int(len(x) * SR / self.sr)
        x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
        idx = np.where(np.abs(x) > 0.01)[0]
        return x[max(0, idx[0] - 400): idx[-1] + 1500]


def silencios(x, minimo=0.06):
    """Pausas internas (inicio, fin) en segundos."""
    hop = int(0.01 * SR)
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, mode="same")[::hop])
    umbral = 0.08 * np.percentile(rms, 95)
    mudo = rms < umbral
    out, i = [], 0
    while i < len(mudo):
        if mudo[i]:
            j = i
            while j < len(mudo) and mudo[j]:
                j += 1
            if i > 0 and j < len(mudo) and (j - i) * 0.01 >= minimo:
                out.append((i * 0.01, j * 0.01))
            i = j
        else:
            i += 1
    return out


def tiempos_palabras(frases, d, pausas):
    """Reparte las palabras: los cortes entre frases caen en las pausas reales del audio."""
    pesos_f = [sum(peso(w) for w, _, _ in ws) + 4 for ws in frases]
    tot = sum(pesos_f)
    esperado, acc = [], 0
    for p in pesos_f[:-1]:
        acc += p
        esperado.append(d * acc / tot)
    cortes, libres = [], list(pausas)
    for e in esperado:
        cand = [g for g in libres if not cortes or g[0] >= cortes[-1][1]]
        if cand:
            g = min(cand, key=lambda g: abs((g[0] + g[1]) / 2 - e))
            if abs((g[0] + g[1]) / 2 - e) < 0.9:
                cortes.append(g)
                libres.remove(g)
                continue
        cortes.append((e - 0.05, e + 0.05))
    limites = [0.0] + [c for g in cortes for c in g] + [d]
    res = []
    for k, ws in enumerate(frases):
        a, b = limites[2 * k], limites[2 * k + 1]
        pesos = [peso(w) for w, _, _ in ws]
        tp, acc = sum(pesos), 0
        res.append([])
        for p in pesos:
            res[-1].append((a + (b - a) * acc / tp, a + (b - a) * (acc + p) / tp))
            acc += p
    return res


def voz_locutor(src, dst):
    """Ecualización y compresión suaves: cuerpo de locutor sin cambiar el timbre."""
    af = ("highpass=f=70,equalizer=f=140:t=q:w=1.2:g=2,equalizer=f=4000:t=q:w=1.5:g=1.5,"
          "acompressor=threshold=-20dB:ratio=2.5:attack=5:release=100:makeup=1.5")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", af, "-ar", str(SR), "-ac", "1", dst], check=True)


def tone(f, d, v, decay):
    tp = np.arange(int(d * SR)) / SR
    return (v * np.exp(-tp * decay) * np.sin(2 * np.pi * f * tp)).astype(np.float32)


def boom(v=0.55):
    tp = np.arange(int(1.6 * SR)) / SR
    f = 38 + 50 * np.exp(-tp * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (v * np.exp(-tp * 2.6) * np.sin(ph)).astype(np.float32)


def whoosh(d=0.45, v=0.1, seed=1):
    rng = np.random.default_rng(seed)
    x = rng.standard_normal(int(d * SR)).astype(np.float32)
    x = np.convolve(x, np.ones(24) / 24, mode="same")
    env = np.sin(np.linspace(0, np.pi, len(x))) ** 3
    return v * 3 * x * env


def tick(v=0.05, seed=0):
    rng = np.random.default_rng(seed)
    x = rng.standard_normal(int(0.05 * SR)).astype(np.float32)
    x = x - np.convolve(x, np.ones(6) / 6, mode="same")  # paso alto sencillo
    return v * x * np.exp(-np.arange(len(x)) / SR * 90)


def music(total):
    """Colchón oscuro en Re menor con pulso, al estilo de los videos explicativos."""
    n = int(total * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, np.float32)
    acordes = [[50, 53, 57], [46, 50, 53], [43, 47, 50, 55], [45, 49, 52]]
    bar = 2.4  # 100 bpm, compás de 4
    for i in range(int(total / bar) + 1):
        a = int(i * bar * SR)
        if a >= n:
            break
        b = min(n, int((i + 1) * bar * SR + 0.5 * SR))
        tt = t[a:b] - i * bar
        env = np.clip(tt / 0.6, 0, 1) * np.clip((bar + 0.5 - tt) / 0.6, 0, 1)
        ch = acordes[(i // 2) % 4]
        for m in ch:
            f = 440 * 2 ** ((m - 69) / 12)
            out[a:b] += 0.03 * env * (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 1.004 * tt + 1))
        f0 = 440 * 2 ** ((ch[0] - 24 - 69) / 12)
        for k in range(8):  # bajo en corcheas
            s = a + int(k * bar / 8 * SR)
            if s < n:
                x = tone(f0, 0.25, 0.09, 9)
                out[s:s + len(x)] += x[:max(0, min(len(x), n - s))]
        for k in range(16):  # hi-hat en semicorcheas, suave
            s = a + int(k * bar / 16 * SR)
            if s < n:
                x = tick(0.035 if k % 4 == 2 else 0.015, seed=k)
                out[s:s + len(x)] += x[:max(0, min(len(x), n - s))]
    fade = np.minimum(1, np.minimum(t / 1.0, (total - t) / 1.5))
    return out * fade


def mix_in(buf, x, at):
    a = int(at * SR)
    if a < 0 or a >= len(buf):
        return
    e = min(len(buf), a + len(x))
    buf[a:e] += x[:e - a]


# ---------------------------------------------------------------- etapa 1: voz y línea de tiempo
def etapa_audio(args):
    os.makedirs(os.path.join(BUILD, "voz"), exist_ok=True)
    tts = Kokoro(args.kokoro, args.voz)
    INTRO, ENTRE_ESCENAS, COLA = 0.2, 0.22, 1.4
    t = INTRO
    segs, palabras, piezas = [], [], []
    for si, (escena, frases) in enumerate(GUION):
        seg = {"scene": escena, "start": 0.0 if si == 0 else t, "cues": {}}
        parsed = [parse_frase(f) for f in frases]
        texto = " ".join(v for _, v in parsed)
        x = tts(texto, args.velocidad)          # la escena completa de una vez: entonación natural
        write_wav(os.path.join(BUILD, "voz", f"{si:02d}_{escena}.wav"), x)
        d = len(x) / SR
        piezas.append((t, x))
        tiempos = tiempos_palabras([ws for ws, _ in parsed], d, silencios(x))
        for fi, (ws, _) in enumerate(parsed):
            for (w, clave, cue), (a, b) in zip(ws, tiempos[fi]):
                palabras.append({"w": w, "key": clave, "start": round(t + a, 3), "end": round(t + b, 3),
                                 "frase": f"{si}_{fi}", "scene": escena})
                if cue:
                    seg["cues"][cue] = round(t + a, 3)
        t += d + ENTRE_ESCENAS
        seg["end"] = t
        segs.append(seg)
    total = t + COLA
    segs[-1]["end"] = total
    n = int(total * SR) + SR
    vo = np.zeros(n, np.float32)
    for at, x in piezas:
        mix_in(vo, x, at)
    write_wav(os.path.join(BUILD, "voz_cruda.wav"), vo)
    voz_locutor(os.path.join(BUILD, "voz_cruda.wav"), os.path.join(BUILD, "voz.wav"))
    tl = {"fps": FPS, "total": total, "frames": int(total * FPS), "segments": segs, "words": palabras}
    with open(os.path.join(BUILD, "timeline.json"), "w") as f:
        json.dump(tl, f, ensure_ascii=False, indent=1)
    for s in segs:
        print(f"  {s['scene']:9s} {s['start']:6.2f} → {s['end']:6.2f}")
    print(f"Duración: {total:.1f} s, {tl['frames']} cuadros")
    return tl


def mezcla(tl):
    total = tl["total"]
    vo = read_wav(os.path.join(BUILD, "voz.wav"))
    n = int(total * SR)
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    sfx = np.zeros(n, np.float32)
    segs = {s["scene"]: s for s in tl["segments"]}
    for i, s in enumerate(tl["segments"][1:]):
        mix_in(sfx, whoosh(seed=i), s["start"] - 0.22)
    for k in ("g1", "g2", "g3", "g4"):
        at = segs["granos"]["cues"][k]
        for j in range(2 ** (int(k[1]) - 1)):
            mix_in(sfx, tone(1400 + 300 * random.Random(j).random(), 0.05, 0.06, 60), at + 0.35 + j * 0.05)
    for at in (segs["c20"]["start"] + 0.3, segs["c32"]["start"] + 0.5, segs["c64"]["start"] + 0.2,
               segs["total"]["cues"]["mil"], segs["expo"]["cues"]["boom"], segs["final"]["cues"]["cae"] + 1.0):
        mix_in(sfx, boom(), at)
    mus = music(total)
    env = np.convolve(np.abs(vo), np.ones(4410) / 4410, mode="same")
    duck = 1 - 0.5 * np.clip(env * 14, 0, 1)
    out = vo * 1.0 + sfx + mus * duck * 1.3
    out /= max(1.0, np.abs(out).max() / 0.95)
    path = os.path.join(BUILD, "mezcla.wav")
    write_wav(path, out)
    return path


# ---------------------------------------------------------------- etapa 3: composición
def chunks(words):
    """Agrupa palabras en bloques de subtítulo (máx. ~26 caracteres, sin cruzar frases)."""
    out, cur = [], []
    for w in words:
        if cur and (cur[-1]["frase"] != w["frase"] or len(" ".join(x["w"] for x in cur + [w])) > 26):
            out.append(cur)
            cur = []
        cur.append(w)
    if cur:
        out.append(cur)
    return out


def layout(chunk, size=68, maxw=900):
    fb = F(size, "Inter-ExtraBold.otf")
    sp = fb.getlength(" ")
    lines, cur, cw = [], [], 0
    for w in chunk:
        ww = fb.getlength(w["w"])
        if cur and cw + sp + ww > maxw:
            lines.append((cur, cw))
            cur, cw = [], 0
        cur.append((w, ww))
        cw += (sp if len(cur) > 1 else 0) + ww
    lines.append((cur, cw))
    pos = []
    for li, (ln, lw) in enumerate(lines):
        x = (W - lw) / 2
        for w, ww in ln:
            pos.append((w, x, li))
            x += ww + sp
    return pos, len(lines)


def draw_caption(img, chunk, t):
    size = 68
    pos, nl = layout(chunk, size)
    y0 = 360 - (nl - 1) * 42
    lay = Image.new("RGBA", (W, 300), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    started = [w for w in chunk if t >= w["start"] - 0.03]
    actual = started[-1] if started else None
    for w, x, li in pos:
        if t < w["start"] - 0.03:
            continue
        y = 40 + li * 84
        p = clamp((t - w["start"] + 0.03) / 0.15)
        if w["key"]:
            fill, fnt = BLUE + (int(255 * p),), F(size, "Inter-ExtraBold.otf")
        elif w is actual:
            fill, fnt = WHITE + (int(255 * p),), F(size, "Inter-ExtraBold.otf")
        else:
            fill, fnt = (205, 210, 225, 170), F(size, "Inter-SemiBold.otf")
        d.text((x, y + 10 * (1 - p)), w["w"], font=fnt, fill=fill)
    sombra = Image.new("RGBA", lay.size, (0, 0, 0, 0))
    sombra.putalpha(lay.getchannel("A").point(lambda v: int(v * 0.7)).filter(ImageFilter.GaussianBlur(10)))
    img.alpha_composite(sombra, (0, int(y0 - 40)))
    img.alpha_composite(lay, (0, int(y0 - 40)))


@lru_cache(maxsize=32)
def pill_image(text, size, bold):
    f = F(size, "Inter-Bold.otf" if bold else "Inter-SemiBold.otf")
    l, tp, r, b = f.getbbox(text)
    padx, pady = int(size * 0.55), int(size * 0.32)
    w, h = r - l + 2 * padx, int(size * 1.05) + 2 * pady
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=(18, 20, 34, 205 if bold else 185))
    d.text((w / 2, h / 2), text, font=f, fill=WHITE, anchor="mm")
    return im


def paste_scaled(img, im, cx, cy, s, a=1.0):
    if s != 1:
        im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BICUBIC)
    if a < 1:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
    img.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def pildoras_de(tl):
    """Lista de (inicio, fin, texto, sub) en segundos absolutos."""
    out = []
    for s in tl["segments"]:
        items = PILDORAS.get(s["scene"], [])
        for i, (c, txt, sub) in enumerate(items):
            a = s["cues"][c] + 0.15 if isinstance(c, str) else s["start"] + c
            b = s["end"] - 0.05
            if i + 1 < len(items):
                c2 = items[i + 1][0]
                b = s["cues"][c2] + 0.15 if isinstance(c2, str) else s["start"] + c2
            out.append((a, b, txt, sub))
    return out


def draw_pill(img, pills, t):
    for i, (a, b, txt, sub) in enumerate(pills):
        if a <= t < b:
            prev = pills[i - 1] if i else None
            mismo = prev and abs(prev[1] - a) < 0.01 and prev[2] == txt
            p = 1.0 if mismo else (t - a) / 0.35
            s = 0.6 + 0.4 * spring(p)
            alpha = clamp((t - a) / 0.12) if not mismo else 1
            alpha = min(alpha, clamp((b - t) / 0.12))
            size = 58 if len(txt) < 20 else 46
            paste_scaled(img, pill_image(txt, size, True), W / 2, 1290, s, alpha)
            if sub:
                q = (t - a) / 0.35 if not (prev and prev[3] == sub and mismo) else 1
                paste_scaled(img, pill_image(sub, 34, False), W / 2, 1385, 0.6 + 0.4 * spring(q - 0.25), min(alpha, clamp(q * 2)))
            return


def degradado():
    g = np.zeros((H, W, 4), np.uint8)
    y = np.arange(H)[:, None]
    a = np.clip(1 - y / 820, 0, 1) ** 1.6 * 150 + np.clip((y - 1500) / 420, 0, 1) ** 1.5 * 110
    g[..., 3] = a.astype(np.uint8)
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.75)) ** 2)
    g[..., 3] = np.clip(g[..., 3] + np.clip(r - 0.55, 0, 1) * 220, 0, 255).astype(np.uint8)
    return Image.fromarray(g, "RGBA")


def componer(tl, salida, cuadros=None, solo_img=None):
    frames_dir = os.path.join(BUILD, "frames")
    words = tl["words"]
    chs = chunks(words)
    pills = pildoras_de(tl)
    grad = degradado()

    def frame(i):
        t = i / FPS
        p = os.path.join(frames_dir, f"{i:05d}.jpg")
        img = Image.open(p).convert("RGBA")
        img.alpha_composite(grad)
        draw_pill(img, pills, t)
        for k, ch in enumerate(chs):
            fin = chs[k + 1][0]["start"] if k + 1 < len(chs) else ch[-1]["end"] + 0.6
            if ch[-1]["frase"] != (chs[k + 1][0]["frase"] if k + 1 < len(chs) else None):
                fin = min(fin, ch[-1]["end"] + 0.7)
            if ch[0]["start"] - 0.03 <= t < fin:
                draw_caption(img, ch, t)
                break
        return img.convert("RGB")

    if solo_img:
        return frame
    audio = mezcla(tl)
    n = tl["frames"]
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-i", audio, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
           "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", salida]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(frame(i).tobytes())
        if i % 300 == 0:
            print(f"  composición {i}/{n}", flush=True)
    ff.stdin.close()
    ff.wait()


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kokoro", default=os.path.join(AQUI, "kokoro"), help="carpeta del modelo Kokoro v1.0 (model.onnx, voices.bin, tokens.txt)")
    ap.add_argument("--voz", default="em_alex", help="voz de Kokoro: em_alex o em_santa (hombres, español)")
    ap.add_argument("--salida", default=os.path.join(AQUI, "leyenda-ajedrez.mp4"))
    ap.add_argument("--velocidad", type=float, default=1.12, help="velocidad de la voz (1 = normal)")
    ap.add_argument("--procesos", type=int, default=3)
    ap.add_argument("--etapa", choices=["todo", "audio", "3d", "componer", "muestras"], default="todo")
    ap.add_argument("--muestras", default="", help="segundos separados por coma para --etapa muestras")
    args = ap.parse_args()

    if args.etapa in ("todo", "audio"):
        tl = etapa_audio(args)
        shutil.rmtree(os.path.join(BUILD, "frames"), ignore_errors=True)
    else:
        tl = json.load(open(os.path.join(BUILD, "timeline.json")))
    if args.etapa == "muestras":
        ts = [float(x) for x in args.muestras.split(",")] if args.muestras else \
            [s["start"] + (s["end"] - s["start"]) * 0.7 for s in tl["segments"]]
        idx = [int(t * FPS) for t in ts]
        for i in idx:
            subprocess.run(["node", os.path.join(AQUI, "render.mjs"), os.path.join(BUILD, "frames"), str(tl["frames"]),
                            str(FPS), "1", str(i), str(i + 1)], check=True)
        fr = componer(tl, None, solo_img=True)
        ims = [fr(i).resize((360, 640)) for i in idx]
        cols = min(6, len(ims))
        sheet = Image.new("RGB", (360 * cols, 640 * ((len(ims) + cols - 1) // cols)))
        for k, im in enumerate(ims):
            sheet.paste(im, ((k % cols) * 360, (k // cols) * 640))
        sheet.save(os.path.join(BUILD, "muestras.jpg"), quality=88)
        print("Muestras:", os.path.join(BUILD, "muestras.jpg"))
        return
    if args.etapa in ("todo", "3d"):
        subprocess.run(["node", os.path.join(AQUI, "render.mjs"), os.path.join(BUILD, "frames"), str(tl["frames"]),
                        str(FPS), str(args.procesos)], check=True)
    if args.etapa in ("todo", "componer"):
        componer(tl, args.salida)
        print("Listo:", args.salida)


if __name__ == "__main__":
    main()
