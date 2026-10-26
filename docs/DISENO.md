# Gorv · guía de diseño

Esta guía documenta las decisiones visuales de la app para que cualquier cambio futuro (o un diseño en Figma) mantenga la misma línea.
Todo está en `style.css`; los valores de abajo son los mismos que las variables `--...` de ese archivo.

## Principios

1. **Primero el dinero y el dedo.** La pantalla *Hoy* se usa de pie, con una mano y con prisa: números enormes, botones de 50 px, cobrar en un toque y *Deshacer* a la vista.
2. **Un solo acento por local.** Morelos es naranja y Carrillo es turquesa. Al cambiar de local cambia toda la cabecera, así es imposible vender en el equivocado sin darse cuenta.
3. **El AGI siempre con sus tres colores.** Verde = Ahorro, amarillo = Ganancia, morado = Inversión. No se usan para nada más.
4. **Cristal con propósito (liquid glass).** Las superficies son de vidrio esmerilado sobre un fondo con manchas de color (durazno, rosa, menta, lila y limón; nada de azul). El blur real se usa solo donde pasa contenido por debajo: encabezado, barra de abajo, ticket y avisos. Lo demás es vidrio translúcido sin blur, para cuidar la batería. La jerarquía sigue saliendo del tamaño y del peso de la letra.
5. **El movimiento acompaña, no estorba.** Cortito, con salida suave, y se apaga solo si el celular tiene activado "reducir movimiento".

## Color

| Uso | Variable | Valor | Contraste (WCAG) |
|---|---|---|---|
| Texto principal sobre fondo | `--ink` / `--bg` | `#0c0c0d` / `#f4f2f8` | 17.6:1 |
| Texto secundario | `--muted` | `#5a5d65` | 5.5:1 o más, también sobre el cristal |
| Morelos (texto blanco encima) | `--M` | `#c93a12` | 5.1:1 (antes 4.4:1, no llegaba a AA) |
| Carrillo (texto blanco encima) | `--C` | `#08788d` | 5.1:1 |
| Ahorro | `--A` | `#14935f` | 3.9:1 (solo en puntos, barras y dona, que piden 3:1) |
| Ganancia | `--G` | `#c98a00` | 2.9:1 (solo en puntos y barras; la cifra siempre va escrita al lado) |
| Inversión | `--I` | `#6d4aff` | 5.2:1 |
| Peligro / agotado | `--danger` | `#cf2a37` | 5.2:1 |

Superficies: `--glass` (blanco al 58 %), `--glass-hi` (blanco al 82 %, para botones y campos), `--soft` (fondos de medidores), `--line` (separadores).
La app es siempre clara; no hay modo oscuro automático.

## Cristal

| Pieza | Receta |
|---|---|
| Fondo | cinco manchas de color fijas detrás de todo (`body::before`) |
| Tarjeta de vidrio | `--glass` + borde blanco `--edge` + brillo interior arriba `--spec` + sombra suave `--lift` |
| Encabezado, barra y ticket | blanco o negro translúcido + `backdrop-filter: blur(22–28px) saturate(1.8)` |
| Si el navegador no esmerila | fondos casi opacos (`@supports not`), se lee igual |

## Hoja inferior y resumen del mes

El resumen se abre en una hoja que sube desde abajo (curva `cubic-bezier(.32,.72,0,1)`, 550 ms), con el fondo oscurecido y esmerilado. Se cierra tocando el fondo o arrastrando la manija hacia abajo (más de 110 px). La imagen se dibuja con `canvas` (función `summaryBlob` en `app.js`), mide 1080 px de ancho y se comparte con la hoja nativa del celular (`navigator.share`) o se descarga.

## Entrada

Al abrir la app (no al cambiar de pestaña): el logo entra con resorte (750 ms), un brillo lo cruza y el telón se disuelve con un blur (450 ms). Dura ~1.3 s, se salta con un toque y no aparece con "reducir movimiento".

## Íconos de las 3 categorías

Tres gorras dibujadas con el mismo trazo (en `app.js`, constante `ICONS`): **Gorra $89** (una, fondo blanco), **Promo $170** (dos, fondo rosa) y **Premium $185** (una con destellos, fondo dorado). Salen en Hoy, en el Panel (AGI por tipo) y en el historial de Ventas.

## Tipografía

- Familia: Helvetica Neue / Helvetica / Arial / Segoe UI / Roboto (la del celular; no se descarga nada, así abre sin internet).
- Cifras y títulos: negrita itálica (`.num`), con espaciado cerrado (`-0.03em`) y números tabulares para que las columnas no bailen.
- Escala usada: 11 (menú) · 13 (apoyo) · 14–16 (texto) · 19 (producto) · 24–28 (importes) · 38–48 (cifras grandes).

## Forma y espacio

- Radios concéntricos: radio exterior = radio interior + relleno. Ejemplo: ticket de cobro con radio 20 y relleno 10, su botón *Cobrar* tiene radio 10.
- Zonas táctiles de 40 px o más (los botones chicos como ✕ amplían su área sin crecer visualmente).
- Contenido a 640 px como máximo, centrado.

## Movimiento

| Qué | Duración | Curva |
|---|---|---|
| Presionar un botón (escala 0.97) | 140 ms | `cubic-bezier(.23,1,.32,1)` |
| Cambiar de pestaña (la pantalla entra 26 px desde el lado hacia el que te mueves) | 220 ms | igual |
| Burbuja de la barra de abajo (viaja, rebota un poco y se estira al moverse) | 520 ms | `cubic-bezier(.34,1.22,.5,1)` |
| Aparece el ticket de cobro | 260 ms | igual |
| Barras y medidores al entrar | 450 ms, 30 ms entre barras | igual |
| Acordeones | 260 ms | igual |

Reglas: nada empieza desde escala 0 (se arranca en 0.8–0.97), no se anima lo que se toca cientos de veces al día (solo se confirma con una vibración corta), y todo se apaga con `prefers-reduced-motion`.

## Llevarlo a Figma

1. Crea un archivo con un *frame* de **390 × 844** (celular) y otro de **360 × 800**.
2. En *Variables* crea una colección "Gorv" con los colores de la tabla (mismos nombres que en el CSS) y otra con los radios (10, 12, 16, 20, 24, 28).
3. Usa las capturas de `tests/screens/` (se generan con `npm run capturas`) como base para dibujar cada pantalla.
4. Si más adelante conectas Figma a Claude, se puede pedir "pasa este frame a CSS" usando estos mismos nombres de variable y el cambio entra sin tocar la lógica de `app.js`.

## Revisión visual automática

`npm run capturas` guarda una foto de cada pantalla con datos de ejemplo, y `npm test` comprueba que no haya errores, que nada se salga de la pantalla en 360, 390 y 412 px, que los precios y el AGI sean correctos y que la app abra sin internet.
