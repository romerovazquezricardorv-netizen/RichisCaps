# El tablero que arruinó a un rey

Video vertical (1080×1920, 30 fps, ~1 min) narrado con voz de hombre, al estilo de los videos explicativos en 3D de TikTok e Instagram:

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
pip install piper-tts numpy pillow
# voz es_MX "ald" de Piper (paquete vits-piper-es_MX-ald-medium de sherpa-onnx en GitHub)
python3 generar.py --modelo es_MX-ald-medium.onnx
```

- `--tono 0.86`: qué tan grave es la voz (menor = más grave).
- `--velocidad 0.9`: ritmo de la narración (menor = más rápido).
- `--etapa muestras`: genera solo una hoja de cuadros de muestra en `build/muestras.jpg`, para revisar sin renderizar todo.
- `--etapa audio | 3d | componer`: corre una sola etapa.

Para cambiar lo que se dice, edita `GUION` en `generar.py`: `*palabra*` la marca en azul y `palabra{cue}` deja una marca de tiempo que usan las animaciones.
