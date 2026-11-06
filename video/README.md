# El tablero que arruinó a un rey

Video animado vertical (1080×1920, 30 fps, ~1 min 44 s) con voz narrada en español, sobre la leyenda del ajedrez y los granos de trigo: 1 grano en la primera casilla, 2 en la segunda, 4 en la tercera… hasta la 64.

- `leyenda-ajedrez.mp4`: el video terminado, listo para Reels, TikTok o Shorts.
- `generar.py`: guion, animación, subtítulos, música y efectos, todo generado por código.

## Escenas

1. Gancho: "Un rey estuvo a punto de perder su reino entero…"
2. India, el sabio Sissa inventa el ajedrez
3. El rey: "¡Pide lo que quieras!"
4. El pedido: el tablero se llena casilla por casilla
5. El rey se ríe: "¡Que le traigan un costal!"
6. Casillas 10, 20, 32 y 64 con contador gigante (512 → 524 288 → 2 147 483 648 → 9 223 372 036 854 775 808)
7. Total: 18 446 744 073 709 551 615 granos ≈ mil años de cosecha mundial
8. La curva del crecimiento exponencial
9. Final y llamado a compartir

## Volver a generarlo

```bash
pip install piper-tts numpy pillow
# voz es_MX "claude-high" de Piper (incluida en el paquete vits-piper-es_MX-claude-high de sherpa-onnx)
python3 generar.py --modelo es_MX-claude-high.onnx --salida leyenda-ajedrez.mp4
```

Para cambiar lo que se dice, edita la lista `GUION` al inicio de `generar.py`. Con `--solo 10` se generan solo los primeros 10 segundos, para probar.
