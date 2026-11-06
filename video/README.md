# El tablero que arruinó a un rey

Video vertical (1080×1920, 30 fps, 48 s) narrado con una voz neuronal de hombre (Kokoro, voz `em_alex`), al estilo de los videos explicativos en 3D de TikTok e Instagram:

- escenas 3D con la cámara en movimiento y cortes rápidos con un pequeño zoom,
- subtítulos arriba que aparecen palabra por palabra: la palabra que se dice en blanco, las dichas en gris y las palabras clave en azul,
- etiquetas en "píldora" con las cifras («524 288 granos» / «casilla 20»),
- música oscura con pulso, golpes graves en las revelaciones y *whoosh* en cada corte.

El tema es la leyenda del ajedrez y los granos de trigo: 1 grano en la primera casilla, 2 en la segunda, 4 en la tercera… hasta la 64. En la casilla 20 hay un montón más alto que el rey, en la 32 una montaña, en la 64 una columna que llega al espacio y el total (18 446 744 073 709 551 615 granos) equivale a unos mil años de cosecha mundial de trigo.

## Archivos

- `leyenda-ajedrez.mp4`: el video terminado.
- `generar.py`: guion, voz, subtítulos, etiquetas, música, efectos y composición final.
- `escena3d/escena.js`: el mundo 3D (three.js): tablero, reyes, granos, montones, montaña, columna, cubos y barras.
- `render.mjs`: renderiza los cuadros 3D en Chromium sin pantalla, en paralelo.

## Volver a generarlo

```bash
npm install                 # three.js
pip install onnxruntime numpy pillow
sudo apt install espeak-ng ffmpeg
# modelo de voz Kokoro v1.0 (≈350 MB), no se guarda en el repo:
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2
tar xjf kokoro-multi-lang-v1_0.tar.bz2
python3 generar.py --kokoro kokoro-multi-lang-v1_0
```

- `--voz em_alex`: voz de hombre (también hay `em_santa`, más grave y teatral).
- `--velocidad 1.12`: ritmo de la narración (1 = normal, más alto = más rápido).
- `--etapa muestras`: genera solo una hoja de cuadros de muestra en `build/muestras.jpg`, para revisar sin renderizar todo.
- `--etapa audio | 3d | componer`: corre una sola etapa.

La voz se genera una escena completa a la vez para que la entonación suene natural. Los tiempos de cada palabra del subtítulo salen de las pausas reales del audio. El volumen final se normaliza a -14 LUFS, el nivel que usan TikTok e Instagram.

Para cambiar lo que se dice, edita `GUION` en `generar.py`: `*palabra*` la marca en azul y `palabra{cue}` deja una marca de tiempo que usan las animaciones.
