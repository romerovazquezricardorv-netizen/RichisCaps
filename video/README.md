# El tablero que arruinó a un rey

Video vertical (1080×1920, 30 fps, 54 s) narrado con una voz neuronal de hombre (Kokoro, voz `em_alex`), al estilo de los videos explicativos en 3D de TikTok e Instagram:

- escenas 3D con la cámara en movimiento y cortes rápidos con un pequeño zoom,
- subtítulos arriba que aparecen palabra por palabra: la palabra que se dice en blanco, las dichas en gris y las palabras clave en azul,
- etiquetas en "píldora" con las cifras («524 288 granos» / «casilla 20»),
- música oscura con pulso, golpes graves en las revelaciones y *whoosh* en cada corte.

El tema es la leyenda del ajedrez y los granos de trigo: 1 grano en la primera casilla, 2 en la segunda, 4 en la tercera… hasta la 64. En la casilla 20 hay un montón más alto que el rey, en la 32 una montaña, en la 64 una columna que llega al espacio y el total (18 446 744 073 709 551 615 granos) equivale a unos mil años de cosecha mundial de trigo.

## Archivos

- `perfume-capas.mp4`: video de perfume (notas de salida, corazón y fondo), por ahora con voz provisional.
- `guion-perfume-para-grabar.md`: el guion de perfume para hacer la voz en CapCut.
- `temas/`: un archivo por video (guion, etiquetas y efectos). `escena3d/escena.js` es la escena del ajedrez y `escena3d/perfume.js` la del perfume.
- `leyenda-ajedrez-nandez.mp4`: el video con la voz de Nandez hecha en CapCut, con escenas y subtítulos ajustados a esa voz.
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

- `--voz em_alex`: voz de hombre (también hay `em_santa`, otra voz de hombre).
- `--velocidad 1.28`: ritmo de la narración (1 = normal, más alto = más rápido). Con 1.28 habla a unas 6 sílabas por segundo, un ritmo normal-rápido.
- `--etapa muestras`: genera solo una hoja de cuadros de muestra en `build/muestras.jpg`, para revisar sin renderizar todo.
- `--etapa audio | 3d | componer`: corre una sola etapa.

La voz está en español latinoamericano: los fonemas salen de espeak-ng con `es-419`, con seseo y «j» suave. Cada trozo hasta un signo de puntuación se genera aparte para que conserve su entonación: suspensiva en la coma, descendente en el punto y ascendente en la pregunta. Luego se respeta la pausa de cada signo (coma 0.17 s, dos puntos 0.28 s, punto 0.36 s, pregunta 0.40 s, puntos suspensivos 0.42 s); las pausas se ajustan en `PAUSAS`. Los subtítulos quedan sincronizados con cada trozo. El volumen final se normaliza a -14 LUFS, el nivel que usan TikTok e Instagram.

Para cambiar lo que se dice, edita `GUION` en `generar.py`: `*palabra*` la marca en azul y `palabra{cue}` deja una marca de tiempo que usan las animaciones.

## Usar una voz grabada aparte (CapCut, tu propia voz…)

```bash
# modelo Whisper para alinear (≈600 MB), no se guarda en el repo:
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2
tar xjf sherpa-onnx-whisper-small.tar.bz2
pip install sherpa-onnx
python3 generar.py --voz-externa video_de_capcut.mp4 --whisper sherpa-onnx-whisper-small --salida mi-video.mp4
```

El programa corta la voz en sus pausas, transcribe cada trozo con Whisper y alinea cada palabra del guion con esos tiempos. Las escenas, los subtítulos y los efectos siguen a la voz, así que no hay que sincronizar nada a mano. La voz se deja tal cual; solo se normaliza el volumen al final.

## Temas

Cada video es un tema: `python3 generar.py --tema perfume ...` usa `temas/perfume.py` (guion, etiquetas y efectos) y la escena `escena3d/perfume.js`. Los archivos intermedios quedan en `build/<tema>/`. Para hacer un tema nuevo se copia un archivo de `temas/`, se cambia el guion y se arma su escena 3D.

### Opciones para un video más dinámico

Un tema puede activar, sin afectar a los demás:

- `SELLOS`: textos tipo sello que golpean la pantalla en un momento del guion (`(escena, cue, texto, color, segundos)`); `SELLO_Y` fija su altura.
- `GOLPES`: sacudida y acercamiento rápido de la imagen, con destello blanco opcional (`(escena, cue, fuerza, destello)`).
- `BARRA = True`: barra de progreso abajo.
- `MUSICA = "energica"`: la misma música con bombo en cada tiempo (112 bpm).
- Efectos de sonido nuevos en `efectos()`: `golpe`, `frote` y `whoosh`.

`temas/perfume_frotar.py` (con `escena3d/frotar.js`) es el primero que los usa: `perfume-frotar.mp4`, con voz provisional; el guion para CapCut está en `guion-perfume-frotar-para-grabar.md`.

