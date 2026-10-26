# Gorv

App web instalable (PWA) para llevar un negocio de gorras de dos calidades (normal y premium) y dos locales (Morelos y Carrillo), con el método **AGI**: cada venta se reparte sola en **A**horro, **G**anancia e **I**nversión.

No tiene servidores ni cuentas: los datos viven en el celular y funciona sin internet.

## Pantallas

- **Hoy**: eliges el local y registras lo vendido en tres apartados separados: **Gorra $89**, **Promo 2 por $170** y **Premium $185**. Cada uno muestra su reparto AGI y se guarda como su propia venta. Con *Deshacer* y vibración corta al cobrar.
- **Panel**: solo por meses (flechas para cambiar de mes). Ingresos y margen del mes, y el AGI (Ahorro, Ganancia, Inversión) de cada tipo de venta: en total y por separado en Morelos y Carrillo. Gráfica de los últimos 6 meses.
- **Inventario**: existencias por calidad en Bodega, Morelos y Carrillo; mover gorras entre lugares, registrar compras (costo promedio) y corregir el conteo.
- **Ventas**: historial por día con filtros de local y mes.
- **Ajustes**: precios (normal, temporada alta, premium), montos del AGI, respaldo y restauración, exportar a CSV.

- **Resumen del mes**: en el Panel, *Compartir resumen del mes* genera una imagen (ingresos, margen, Ahorro/Ganancia/Inversión, y una tabla por tipo de venta para los dos locales juntos, Morelos y Carrillo). Se comparte por WhatsApp o se guarda en el celular, sin internet.
- **Entrada**: al abrir la app, el logo aparece con un resorte y un brillo, y se puede saltar tocando la pantalla.

Estilo **liquid glass** claro: fondo con manchas de color, vidrio esmerilado (blur) en el encabezado, la barra de abajo y el ticket, iconos de gorra para cada tipo de venta y una burbuja animada que se desliza en la barra al cambiar de sección.

Mantén presionado el ícono en el celular para entrar directo a *Vender*, *Panel* o *Inventario*.

## Publicar en GitHub Pages

1. Sube a un repositorio: `index.html`, `style.css`, `app.js`, `sw.js`, `manifest.json` y los 4 íconos `icon-*.png`.
2. *Settings > Pages* > rama `main`, carpeta `/ (root)` > *Save*.
3. Abre `https://TU-USUARIO.github.io/TU-REPO/` y, en Chrome, ⋮ > *Instalar app*.

## Diseño

Ver [docs/DISENO.md](docs/DISENO.md): colores con su contraste, tipografía, radios, movimiento y cómo llevarlo a Figma.

## Pruebas (opcional)

Con Playwright se comprueba que no haya errores, que no se desborde la pantalla en celulares chicos, que los precios y el AGI estén bien, que *Deshacer* funcione y que la app abra sin internet.

```bash
npm install
npx playwright install chromium
npm test            # pruebas
npm run capturas    # fotos de cada pantalla en tests/screens/
```

En GitHub corren solas en cada cambio (`.github/workflows/tests.yml`).

## Respaldo

Los datos están en el navegador del celular. Descarga un respaldo desde *Ajustes* de vez en cuando: si borras los datos del sitio o cambias de celular, sin respaldo se pierden las ventas.
