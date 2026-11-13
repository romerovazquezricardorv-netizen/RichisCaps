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
import re
import shutil
import subprocess
import sys
import wave
from functools import lru_cache

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(AQUI, "build")
W, H, FPS, SR = 1080, 1920, 30, 44100

# ---------------------------------------------------------------- tema
# El guion, las etiquetas y los efectos de cada video viven en temas/<nombre>.py (ver cargar_tema).
GUION, DICHO, PILDORAS, TEMA = [], {}, {}, None


def cargar_tema(nombre):
    global GUION, DICHO, PILDORAS, TEMA, BUILD
    import importlib
    TEMA = importlib.import_module(f"temas.{nombre}")
    GUION, DICHO, PILDORAS = TEMA.GUION, TEMA.DICHO, TEMA.PILDORAS
    BUILD = os.path.join(AQUI, "build", nombre)
    os.makedirs(BUILD, exist_ok=True)


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
        # el ". " inicial da a Kokoro un arranque: sin él se come la primera sílaba ("Cuenta" → "Penta")
        ids = [self.vocab[c] for c in ". " + self.fonemas(texto) if c in self.vocab][:508]
        audio = self.sess.run(None, {"tokens": np.array([[0] + ids + [0]], dtype=np.int64),
                                     "style": self.estilo[len(ids)].astype(np.float32),
                                     "speed": np.array([velocidad], dtype=np.float32)})[0]
        x = np.asarray(audio, dtype=np.float32).reshape(-1)
        n = int(len(x) * SR / self.sr)
        x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
        # recorte suave: umbral bajo y margen amplio para no comerse los inicios de palabra suaves
        env = np.convolve(np.abs(x), np.ones(220) / 220, mode="same")
        idx = np.where(env > 0.004)[0]
        ini = max(0, idx[0] - int(0.06 * SR))
        fin = min(len(x), idx[-1] + int(0.06 * SR))
        y = x[ini:fin].copy()
        f = int(0.01 * SR)
        y[:f] *= np.linspace(0, 1, f)
        y[-f:] *= np.linspace(1, 0, f)
        return y


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


def kick(v=0.5):
    tp = np.arange(int(0.32 * SR)) / SR
    f = 45 + 110 * np.exp(-tp * 30)
    return (v * np.exp(-tp * 11) * np.sin(2 * np.pi * np.cumsum(f) / SR)).astype(np.float32)


def music_energica(total):
    """Colchón más movido (112 bpm): el mismo ambiente con bombo en cada tiempo y palmada en el 2 y el 4."""
    out = music(total) * 0.85
    n = len(out)
    beat = 60 / 112
    k = kick(0.16)
    for i in range(int(total / beat) + 1):
        s = int(i * beat * SR)
        if s >= n:
            break
        e = min(n, s + len(k))
        out[s:e] += k[:e - s]
        if i % 2 == 1 and getattr(TEMA, "SOPLIDOS", True):
            c = whoosh(d=0.09, v=0.05, seed=40 + i % 3)
            e = min(n, s + len(c))
            out[s:e] += c[:e - s]
    t = np.arange(n) / SR
    return out * np.minimum(1, np.minimum(t / 0.3, (total - t) / 1.5))


def mix_in(buf, x, at):
    a = int(at * SR)
    if a < 0 or a >= len(buf):
        return
    e = min(len(buf), a + len(x))
    buf[a:e] += x[:e - a]


# ---------------------------------------------------------------- etapa 1: voz y línea de tiempo
PAUSAS = {",": 0.17, ";": 0.26, ":": 0.28, ".": 0.36, "?": 0.40, "!": 0.36, "...": 0.42}


def pausa_de(palabra):
    if palabra.endswith("..."):
        return PAUSAS["..."]
    return PAUSAS.get(palabra[-1], 0.0)


def etapa_audio(args):
    """Cada trozo hasta un signo de puntuación se genera aparte (conserva su entonación: suspensiva en la
    coma, descendente en el punto, ascendente en la pregunta) y luego se respeta la pausa del signo."""
    carpeta = os.path.join(BUILD, "voz")
    shutil.rmtree(carpeta, ignore_errors=True)
    os.makedirs(carpeta)
    tts = Kokoro(args.kokoro, args.voz)
    INTRO, COLA = 0.2, 1.4
    t = INTRO
    segs, palabras, piezas = [], [], []
    habla, silabas = 0.0, 0
    for si, (escena, frases) in enumerate(GUION):
        seg = {"scene": escena, "start": 0.0 if si == 0 else t, "cues": {}}
        # las palabras de toda la escena; solo se corta donde hay signo de puntuación
        ws_esc = [(w, clave, cue, fi) for fi, frase in enumerate(frases) for w, clave, cue in parse_frase(frase)[0]]
        trozo = []
        for k, item in enumerate(ws_esc):
            trozo.append(item)
            corto = len(" ".join(w for w, _, _, _ in trozo)) < 10   # "Y así," solo se pronuncia mal: va con lo que sigue
            if k < len(ws_esc) - 1 and (pausa_de(item[0]) == 0 or (corto and pausa_de(item[0]) < PAUSAS["."])):
                continue
            voz = " ".join(DICHO.get(w.strip(".,:;?!"), w.strip(".,:;?!")) + w[len(w.rstrip(".,:;?!")):]
                           for w, _, _, _ in trozo)
            x = tts(voz, args.velocidad)
            write_wav(os.path.join(carpeta, f"{si:02d}_{k:02d}.wav"), x)
            d = len(x) / SR
            piezas.append((t, x))
            habla += d
            silabas += sum(len(re.findall(r"[aeiouáéíóúü]+", DICHO.get(w.strip(".,:;?!"), w).lower()))
                           for w, _, _, _ in trozo)
            pesos = [peso(w) for w, _, _, _ in trozo]
            tp, acc = sum(pesos), 0
            for (w, clave, cue, fi), p in zip(trozo, pesos):
                ini = t + d * acc / tp
                acc += p
                palabras.append({"w": w, "key": clave, "start": round(ini, 3), "end": round(t + d * acc / tp, 3),
                                 "frase": f"{si}_{fi}", "scene": escena})
                if cue:
                    seg["cues"][cue] = round(ini, 3)
            t += d + (pausa_de(trozo[-1][0]) or PAUSAS[","])
            trozo = []
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
    print(f"Ritmo al hablar: {silabas / habla:.1f} sílabas/s; con pausas: {silabas / (total - INTRO - COLA):.1f} sílabas/s")
    print(f"Duración: {total:.1f} s, {tl['frames']} cuadros")
    return tl


# ---------------------------------------------------------------- voz externa (p. ej. CapCut)
NUM_ASR = {"1": "un", "2": "dos", "3": "tres", "4": "cuatro", "5": "cinco", "6": "seis", "8": "ocho", "9": "nueve", "10": "diez",
           "15": "quince", "18": "dieciocho", "20": "veinte", "32": "treinta y dos", "64": "sesenta y cuatro",
           "512": "quinientos doce", "127": "ciento veintisiete", "2021": "dos mil veintiuno"}


def normaliza(texto):
    import unicodedata
    t = unicodedata.normalize("NFD", texto.lower().replace("%", " por ciento"))
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    out = []
    for w in re.findall(r"[a-z0-9]+", t):
        out.extend(NUM_ASR.get(w, w).split())
    return out


def etapa_audio_externa(args):
    """Usa una voz grabada aparte: la parte en sus pausas, transcribe cada trozo con Whisper y alinea el guion
    palabra por palabra, para que escenas y subtítulos sigan a la voz (no al revés)."""
    import difflib
    import glob
    import sherpa_onnx
    os.makedirs(BUILD, exist_ok=True)
    cruda = os.path.join(BUILD, "voz_externa.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", args.voz_externa, "-vn", "-ac", "1", "-ar", str(SR), cruda], check=True)
    x = read_wav(cruda)
    dur = len(x) / SR
    gaps = silencios(x, 0.06)
    lim = [0.0] + [t for g in gaps for t in g] + [dur]
    D = args.whisper
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=glob.glob(os.path.join(D, "*encoder.int8.onnx"))[0], decoder=glob.glob(os.path.join(D, "*decoder.int8.onnx"))[0],
        tokens=glob.glob(os.path.join(D, "*tokens.txt"))[0], language="es", task="transcribe", num_threads=4)
    trozos, asr = [], []
    for i in range(0, len(lim), 2):
        a, b = lim[i], lim[i + 1]
        seg = x[int(a * SR):int(b * SR)]
        env = np.convolve(np.abs(seg), np.ones(220) / 220, mode="same")
        idx = np.where(env > 0.01)[0]
        if len(idx) == 0:
            continue
        va, vb = a + idx[0] / SR, a + idx[-1] / SR
        n = int(len(seg) * 16000 / SR)
        y = np.interp(np.linspace(0, len(seg) - 1, n), np.arange(len(seg)), seg).astype(np.float32)
        st = rec.create_stream()
        st.accept_waveform(16000, np.concatenate([np.zeros(3200, np.float32), y, np.zeros(3200, np.float32)]))
        rec.decode_stream(st)
        texto = st.result.text.strip()
        trozos.append((va, vb, texto))
        asr.extend((tok, len(trozos) - 1) for tok in normaliza(texto))
        print(f"  {va:6.2f}–{vb:6.2f}  {texto}")
    # palabras del guion, cada una con sus fichas "dichas" (64 -> sesenta y cuatro)
    palabras_g = []
    for si, (escena, frases) in enumerate(GUION):
        for fi, frase in enumerate(frases):
            for w, clave, cue in parse_frase(frase)[0]:
                palabras_g.append({"w": w, "key": clave, "cue": cue, "scene": escena, "si": si, "frase": f"{si}_{fi}",
                                   "tok": normaliza(getattr(TEMA, "ALINEAR", {}).get(w.strip(".,:;?!¿"),
                                                    DICHO.get(w.strip(".,:;?!¿"), w)))})
    fichas = [(k, t) for k, pw in enumerate(palabras_g) for t in pw["tok"]]
    sm = difflib.SequenceMatcher(None, [t for _, t in fichas], [t for t, _ in asr], autojunk=False)
    trozo_de = [None] * len(palabras_g)
    for bl in sm.get_matching_blocks():
        for j in range(bl.size):
            k = fichas[bl.a + j][0]
            if trozo_de[k] is None:
                trozo_de[k] = asr[bl.b + j][1]
    faltan = sum(1 for t in trozo_de if t is None)
    # palabras no reconocidas entre dos reconocidas: si entre sus trozos hay trozos "huérfanos"
    # (p. ej. "jazmín" que Whisper oyó como "Kazmin"), se reparten en ellos
    k = 0
    while k < len(trozo_de):
        if trozo_de[k] is not None:
            k += 1
            continue
        j = k
        while j < len(trozo_de) and trozo_de[j] is None:
            j += 1
        pa = trozo_de[k - 1] if k else -1
        pb = trozo_de[j] if j < len(trozo_de) else len(trozos)
        libres = list(range(pa + 1, pb))
        if libres:
            for n, kk in enumerate(range(k, j)):
                trozo_de[kk] = libres[min(len(libres) - 1, n * len(libres) // (j - k))]
        k = j
    for k in range(len(trozo_de)):          # el resto de las no reconocidas: van con la vecina
        if trozo_de[k] is None:
            trozo_de[k] = trozo_de[k - 1] if k else next(t for t in trozo_de if t is not None)
    for k in range(1, len(trozo_de)):       # el orden nunca retrocede
        trozo_de[k] = max(trozo_de[k], trozo_de[k - 1])
    palabras = []
    for ti, (va, vb, _) in enumerate(trozos):
        ks = [k for k, t in enumerate(trozo_de) if t == ti]
        if not ks:
            continue
        pesos = [peso(palabras_g[k]["w"]) for k in ks]
        tot, acc = sum(pesos), 0
        for k, p in zip(ks, pesos):
            pw = palabras_g[k]
            palabras.append({"w": pw["w"], "key": pw["key"], "start": round(va + (vb - va) * acc / tot, 3),
                             "end": round(va + (vb - va) * (acc + p) / tot, 3), "frase": pw["frase"], "scene": pw["scene"],
                             "cue": pw["cue"], "si": pw["si"]})
            acc += p
    segs = []
    for si, (escena, _) in enumerate(GUION):
        ws = [w for w in palabras if w["si"] == si]
        ini = 0.0 if si == 0 else max(0.0, ws[0]["start"] - 0.12)
        segs.append({"scene": escena, "start": round(ini, 3), "cues": {w["cue"]: w["start"] for w in ws if w["cue"]}})
    total = palabras[-1]["end"] + 1.8   # el silencio que sobre al final de la exportación se recorta
    for i, sg in enumerate(segs):
        sg["end"] = segs[i + 1]["start"] if i + 1 < len(segs) else total
    for w in palabras:
        del w["cue"], w["si"]
    shutil.copy(cruda, os.path.join(BUILD, "voz.wav"))   # la voz grabada se deja tal cual
    tl = {"fps": FPS, "total": total, "frames": int(total * FPS), "segments": segs, "words": palabras}
    with open(os.path.join(BUILD, "timeline.json"), "w") as f:
        json.dump(tl, f, ensure_ascii=False, indent=1)
    print(f"Palabras del guion sin reconocer: {faltan} de {len(palabras_g)}")
    for sg in segs:
        print(f"  {sg['scene']:9s} {sg['start']:6.2f} → {sg['end']:6.2f}")
    print(f"Duración: {total:.1f} s, {tl['frames']} cuadros")
    return tl


def mezcla(tl):
    total = tl["total"]
    vo = read_wav(os.path.join(BUILD, "voz.wav"))
    n = int(total * SR)
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    sfx = np.zeros(n, np.float32)
    segs = {s["scene"]: s for s in tl["segments"]}
    soplidos = getattr(TEMA, "SOPLIDOS", True)   # False: sin ningún ruido tipo "fshh" (barridos, rocíos, palmadas)
    for i, s in enumerate(tl["segments"][1:]):
        if soplidos:
            mix_in(sfx, whoosh(seed=i), s["start"] - 0.22)
    for at, tipo, par in TEMA.efectos(segs):
        if not soplidos and tipo in ("spray", "whoosh", "frote"):
            continue
        if tipo == "boom":
            mix_in(sfx, boom(), at)
        elif tipo == "tin":        # tintineo agudo (grano que cae, gota...)
            mix_in(sfx, tone(1400 + 300 * random.Random(par or 0).random(), 0.05, 0.06, 60), at)
        elif tipo == "spray":      # rocío de perfume: ráfaga de ruido suave
            mix_in(sfx, whoosh(d=0.7, v=0.16, seed=7), at)
        elif tipo == "boing":      # resorte de caricatura
            tp = np.arange(int(0.55 * SR)) / SR
            f = 180 + 260 * np.exp(-tp * 5) * (1 + 0.35 * np.sin(2 * np.pi * 9 * tp))
            mix_in(sfx, (0.22 * np.exp(-tp * 4.5) * np.sin(2 * np.pi * np.cumsum(f) / SR)).astype(np.float32), at)
        elif tipo == "pop":        # burbuja que revienta
            tp = np.arange(int(0.12 * SR)) / SR
            f = 900 - 600 * tp / 0.12
            mix_in(sfx, (0.2 * np.exp(-tp * 35) * np.sin(2 * np.pi * np.cumsum(f) / SR)).astype(np.float32), at)
        elif tipo == "beep":       # monitor en línea plana
            tp = np.arange(int(1.4 * SR)) / SR
            env = np.minimum(1, tp / 0.01) * np.minimum(1, (1.4 - tp) / 0.15)
            mix_in(sfx, (0.07 * env * np.sin(2 * np.pi * 1000 * tp)).astype(np.float32), at)
        elif tipo == "ding":       # campanita de acierto
            for k, fr in enumerate((1318.5, 1975.5)):
                mix_in(sfx, tone(fr, 1.2, 0.09, 3.5), at + k * 0.09)
        elif tipo == "whoosh":     # barrido rápido
            mix_in(sfx, whoosh(d=0.5, v=0.16, seed=int(at * 10)), at - 0.15)
        elif tipo == "golpe":      # sello que cae: golpe grave + chasquido
            mix_in(sfx, boom(0.45)[:int(0.5 * SR)], at)
            mix_in(sfx, tick(0.35, seed=5) * 1.0, at)
            if soplidos:
                mix_in(sfx, whoosh(d=0.25, v=0.12, seed=9), at - 0.2)
        elif tipo == "frote":      # fricción: ráfagas cortas de ruido
            for k in range(6):
                mix_in(sfx, whoosh(d=0.12, v=0.11, seed=20 + k), at + k * 0.11)
    mus = music(total) if getattr(TEMA, "MUSICA", "") != "energica" else music_energica(total)
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


@lru_cache(maxsize=16)
def sello_comic(text, color):
    """Explosión de cómic: estrella de picos con contorno negro, sombra dura y texto negro."""
    f = F(92, "Inter-Black.otf")
    l, tp, r, b = f.getbbox(text)
    tw, th = r - l, b - tp
    rx, ry = tw / 2 + 120, th / 2 + 110
    w, h = int(2 * rx + 60), int(2 * ry + 60)
    cx, cy = w / 2, h / 2
    pts = []
    n = 18
    for i in range(2 * n):
        a = math.pi * i / n
        k = 1.0 if i % 2 == 0 else 0.74 + 0.06 * math.sin(i * 1.7)
        pts.append((cx + math.cos(a) * rx * k, cy + math.sin(a) * ry * k))
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.polygon([(x + 12, y + 14) for x, y in pts], fill=(0, 0, 0, 255))          # sombra dura
    d.polygon(pts, fill=color + (255,), outline=(0, 0, 0, 255), width=10)
    d.text((cx + 5, cy + 6), text, font=f, fill=(255, 255, 255, 255), anchor="mm")
    d.text((cx, cy), text, font=f, fill=(0, 0, 0, 255), anchor="mm", stroke_width=0)
    return im


@lru_cache(maxsize=16)
def sello_image(text, color):
    if getattr(TEMA, "SELLO_ESTILO", "") == "comic":
        return sello_comic(text, color)
    f = F(96, "Inter-Black.otf" if os.path.exists(os.path.join(FONT_DIRS[0], "Inter-Black.otf")) else "Inter-ExtraBold.otf")
    txt = text.replace("✓", "").strip()
    l, tp, r, b = f.getbbox(txt)
    padx, pady, borde = 46, 26, 9
    extra = 90 if "✓" in text else 0
    w, h = r - l + 2 * padx + extra, 96 + 2 * pady
    im = Image.new("RGBA", (w + 40, h + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((20, 20, 20 + w, 20 + h), radius=26, fill=color + (240,), outline=WHITE + (255,), width=borde)
    d.text((20 + padx - l, 20 + h / 2), txt, font=f, fill=WHITE, anchor="lm")
    if extra:   # palomita dibujada (la fuente no trae el símbolo)
        x0, y0 = 20 + w - padx - 62, 20 + h / 2
        d.line([(x0, y0), (x0 + 20, y0 + 22), (x0 + 60, y0 - 26)], fill=WHITE, width=14, joint="curve")
    sombra = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sombra.putalpha(im.getchannel("A").point(lambda v: int(v * 0.6)).filter(ImageFilter.GaussianBlur(12)))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.alpha_composite(sombra, (0, 8))
    out.alpha_composite(im)
    return out


def sellos_de(tl):
    segs = {s["scene"]: s for s in tl["segments"]}
    out = []
    for esc, cue, txt, col, dur in getattr(TEMA, "SELLOS", []):
        if esc in segs and cue in segs[esc]["cues"]:
            a = segs[esc]["cues"][cue]
            out.append((a, max(0.5, min(dur, segs[esc]["end"] - a)), txt, tuple(col)))   # no pasa a la escena siguiente
    return out


def draw_sellos(img, sellos, t):
    for k, (a, dur, txt, col) in enumerate(sellos):
        if a - 0.02 <= t < a + dur:
            p = (t - a) / 0.32
            s = 1.0 + 1.3 * (1 - ease_out(p * 1.6)) if p < 0.62 else 1 + 0.05 * math.exp(-(p - 0.62) * 6) * math.sin((p - 0.62) * 20)
            alpha = clamp((t - a + 0.02) / 0.08) * clamp((a + dur - t) / 0.18)
            im = sello_image(txt, col).rotate(-6 if k % 2 == 0 else 5, resample=Image.BICUBIC, expand=True)
            paste_scaled(img, im, W / 2, getattr(TEMA, "SELLO_Y", 1250), s, alpha)


def golpes_de(tl):
    segs = {s["scene"]: s for s in tl["segments"]}
    return [(segs[e]["cues"][c], f, fl) for e, c, f, fl in getattr(TEMA, "GOLPES", []) if e in segs and c in segs[e]["cues"]]


def aplicar_golpes(img, golpes, t):
    """Acercamiento rápido y sacudida que se apagan en ~0.4 s; destello blanco opcional."""
    z, dx, dy, flash = 0.0, 0.0, 0.0, 0.0
    for a, f, fl in golpes:
        x = t - a
        if 0 <= x < 0.6:
            e = math.exp(-x * 9)
            z += 0.07 * f * e
            dx += 26 * f * e * math.sin(x * 70)
            dy += 18 * f * e * math.cos(x * 55)
            flash += fl * math.exp(-x * 14)
    if z > 0.001 or abs(dx) > 0.5:
        s = 1 + z
        big = img.resize((int(W * s), int(H * s)), Image.BILINEAR)
        x0, y0 = int((big.width - W) / 2 + dx), int((big.height - H) / 2 + dy)
        x0, y0 = max(0, min(big.width - W, x0)), max(0, min(big.height - H, y0))
        img = big.crop((x0, y0, x0 + W, y0 + H))
    if flash > 0.01:
        img = Image.blend(img, Image.new("RGBA", img.size, (255, 255, 255, 255)), clamp(flash))
    return img


def aplicar_transicion(img, cortes, t):
    """Barrido rápido (whip pan): desenfoque horizontal y desplazamiento alrededor de cada cambio de escena."""
    for b in cortes:
        x = t - b
        if abs(x) < 0.16:
            k = 1 - abs(x) / 0.16
            k = k * k * (3 - 2 * k)
            ancho = max(8, int(W / (1 + 26 * k)))
            smear = img.resize((ancho, H), Image.BILINEAR).resize((W, H), Image.BILINEAR)
            dx = int((-1 if x < 0 else 1) * 160 * k)
            smear = ImageChops.offset(smear, -dx, 0)
            return Image.blend(img, smear, clamp(k * 1.1))
    return img


def divisiones_de(tl):
    segs = {s["scene"]: s for s in tl["segments"]}
    out = []
    for esc, c0, c1, arriba, abajo in getattr(TEMA, "DIVIDIDO", []):
        if esc not in segs:
            continue
        sg = segs[esc]
        a = sg["cues"].get(c0, sg["start"]) if c0 else sg["start"]
        b = sg["cues"].get(c1, sg["end"]) - 0.12 if c1 else sg["end"]
        out.append((a, b, arriba, abajo))
    return out


@lru_cache(maxsize=8)
def etiqueta_panel(text, fondo):
    f = F(54, "Inter-Black.otf")
    l, tp, r, b = f.getbbox(text)
    w, h = r - l + 56, 92
    im = Image.new("RGBA", (w + 14, h + 14), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((10, 12, w + 10, h + 12), fill=(0, 0, 0, 255))
    d.rectangle((0, 0, w, h), fill=fondo + (255,), outline=(0, 0, 0, 255), width=7)
    d.text((w / 2, h / 2 + 2), text, font=f, fill=(255, 255, 255, 255), anchor="mm", stroke_width=4, stroke_fill=(0, 0, 0, 255))
    return im


def draw_division(img, divs, t):
    """Pantalla dividida tipo cómic: línea negra al centro, insignia VS y etiquetas de cada mitad."""
    for a, b, arriba, abajo in divs:
        if a - 0.02 <= t < b:
            p = ease_out(clamp((t - a) / 0.25))
            q = clamp((b - t) / 0.12)
            d = ImageDraw.Draw(img)
            y = H // 2
            ancho = int(W * p)
            d.rectangle(((W - ancho) // 2, y - 11, (W + ancho) // 2, y + 11), fill=(0, 0, 0, int(255 * q)))
            d.rectangle(((W - ancho) // 2, y - 4, (W + ancho) // 2, y + 4), fill=(255, 255, 255, int(255 * q)))
            r = 64 * spring(clamp((t - a - 0.1) / 0.35))
            if r > 2:
                d.ellipse((W / 2 - r - 6, y - r - 6, W / 2 + r + 6, y + r + 6), fill=(0, 0, 0, 255))
                d.ellipse((W / 2 - r, y - r, W / 2 + r, y + r), fill=(232, 38, 58, 255))
                d.text((W / 2, y + 2), "VS", font=F(max(8, int(r * 0.95)), "Inter-Black.otf"), fill=WHITE, anchor="mm")
            for k, (txt, col, yy) in enumerate([(arriba, (60, 120, 230), 560), (abajo, (230, 70, 150), 1090)]):
                e = clamp((t - a - 0.15 - k * 0.1) / 0.3)
                if e > 0:
                    im = etiqueta_panel(txt, col)
                    x0 = int(-im.width + (60 + im.width) * ease_out(e))
                    img.alpha_composite(im, (x0, yy))
            return


def draw_barra(img, t, total):
    p = clamp(t / max(0.1, total - 1.2))
    d = ImageDraw.Draw(img)
    y, h = H - 26, 10
    d.rounded_rectangle((40, y, W - 40, y + h), radius=5, fill=(255, 255, 255, 60))
    if p > 0.005:
        d.rounded_rectangle((40, y, 40 + (W - 80) * p, y + h), radius=5, fill=(255, 111, 176, 235))


def componer(tl, salida, cuadros=None, solo_img=None):
    frames_dir = os.path.join(BUILD, "frames")
    words = tl["words"]
    chs = chunks(words)
    pills = pildoras_de(tl)
    grad = degradado()
    sellos, golpes = sellos_de(tl), golpes_de(tl)
    divs = divisiones_de(tl)
    cortes = [sg["start"] for sg in tl["segments"][1:]] if getattr(TEMA, "TRANSICIONES", False) else []

    def frame(i):
        t = i / FPS
        p = os.path.join(frames_dir, f"{i:05d}.jpg")
        img = Image.open(p).convert("RGBA")
        if golpes:
            img = aplicar_golpes(img, golpes, t)
        if cortes:
            img = aplicar_transicion(img, cortes, t)
        img.alpha_composite(grad)
        draw_pill(img, pills, t)
        if divs:
            draw_division(img, divs, t)
        draw_sellos(img, sellos, t)
        if getattr(TEMA, "BARRA", False):
            draw_barra(img, t, tl["total"])
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
    ap.add_argument("--tema", default="ajedrez", help="tema del video: un archivo de temas/ (ajedrez, perfume...)")
    ap.add_argument("--salida", help="archivo de video (por defecto el que indica el tema)")
    ap.add_argument("--voz-externa", help="audio o video con la voz ya grabada (CapCut, tu propia voz...)")
    ap.add_argument("--whisper", help="carpeta del modelo sherpa-onnx-whisper (para alinear la voz externa)")
    ap.add_argument("--velocidad", type=float, default=1.28, help="velocidad de la voz (1 = normal)")
    ap.add_argument("--procesos", type=int, default=3)
    ap.add_argument("--etapa", choices=["todo", "audio", "3d", "componer", "muestras"], default="todo")
    ap.add_argument("--muestras", default="", help="segundos separados por coma para --etapa muestras")
    args = ap.parse_args()
    cargar_tema(args.tema)
    args.salida = args.salida or os.path.join(AQUI, TEMA.SALIDA)
    os.environ["ESCENA_QUERY"] = f"escena={TEMA.ESCENA}&tl=/build/{args.tema}/timeline.json"

    if args.etapa in ("todo", "audio"):
        tl = etapa_audio_externa(args) if args.voz_externa else etapa_audio(args)
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
