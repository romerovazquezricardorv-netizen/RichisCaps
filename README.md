# Gorv

App web instalable (PWA) para llevar un negocio de gorras de dos calidades (normal y premium) y tres locales (Morelos, Carrillo y Roble), con el método **AGI**: cada venta se reparte sola en **A**horro, **G**anancia e **I**nversión.

No tiene servidores ni cuentas: los datos viven en el celular y funciona sin internet.

## Pantallas

- **Hoy**: eliges el local y registras lo vendido en tres apartados separados: **Gorra $89**, **Promo 2 por $170** y **Premium $185**. Cada uno muestra su reparto AGI y se guarda como su propia venta. Con *Deshacer* y vibración corta al cobrar.
- **Panel**: solo por meses (flechas para cambiar de mes). Ingresos y margen del mes, y el AGI (Ahorro, Ganancia, Inversión) de cada tipo de venta: en total y por separado en Morelos, Carrillo y Roble. Gráfica de los últimos 6 meses.
- **Inventario**: existencias por calidad en Bodega, Morelos, Carrillo y Roble; en Roble, cuántas gorras están exhibidas de las que caben (5 por defecto, se cambia en Ajustes); mover gorras entre lugares, registrar compras (costo promedio) y corregir el conteo.
- **Ventas**: historial por día con filtros de local y mes.
- **Ajustes**: precios (normal, temporada alta, premium), montos del AGI, respaldo y restauración, exportar a CSV.

- **Resumen del mes**: en el Panel, *Compartir resumen del mes* genera una imagen (ingresos, margen, Ahorro/Ganancia/Inversión, y una tabla por tipo de venta para los locales juntos, Morelos, Carrillo y Roble). Se comparte por WhatsApp o se guarda en el celular, sin internet.
- **Entrada**: al abrir la app, el logo aparece con un resorte y un brillo, y se puede saltar tocando la pantalla.

Estilo **liquid glass** en claro y oscuro (*Ajustes > Apariencia*: automático, claro u oscuro): fondo con manchas de color, tarjetas de vidrio con reflejo, vidrio esmerilado (blur) en el encabezado, la barra de abajo y el ticket, iconos de gorra para cada tipo de venta y una burbuja animada que se desliza en la barra al cambiar de sección.

Mantén presionado el ícono en el celular para entrar directo a *Vender*, *Panel* o *Inventario*.

## Oficina del canal de YouTube (`oficina/`)

Una oficina virtual con un equipo de 7 que produce los videos del canal. Se abre en `https://TU-USUARIO.github.io/TU-REPO/oficina/`.

| # | Integrante | Qué hace |
|---|---|---|
| 1 | **Lupe · Tendencias** | Revisa los videos de los últimos 7 días de 8 nichos, mide qué tan rápido suben (vistas por hora) y se queda con el nicho que más está en tendencia. Si un video hace **10 veces la media** de su canal, suena una alarma (sonido, vibración y notificación). Revisa sola cada 30 min mientras la oficina está abierta. |
| 2 | **Gael · Guion** | Escribe el guion con el **gancho en el primer segundo** (máximo 4 palabras, se valida), remate, promesa, puntos, "giros" para romper el ritmo y llamada a suscribirse. Lleva el historial de cada tipo de gancho y cuántas veces la gente se fue en el segundo 3. |
| 3 | **Vale · Voz y audio** | Lee el guion con voz sintética para escuchar el ritmo, graba tu voz con teleprompter y crea música original (sin derechos de autor) con un *whoosh* en cada corte. |
| 4 | **Andrés · Animación** | Anima cada línea como una escena con fondo, movimiento, paleta y transición. Guarda cada combinación usada y **nunca repite una**, ni dentro del video ni entre videos. Exporta el video con voz y música. |
| 5 | **Mia · Miniaturas** | Crea **10 versiones**, analiza cada una (contraste, palabras, punto focal, color, curiosidad) y elige la de más CTR estimado. Si escribes impresiones y clics reales (de *Probar y comparar* de YouTube Studio), gana la de **más clics de verdad**. |
| 6 | **Sofi · Studio** | Prepara título, descripción con capítulos, etiquetas, y programa la publicación **1 hora antes del pico de tu audiencia** (mapa por día y hora). Con OAuth sube el video, lo programa y pone la miniatura ganadora. |
| 7 | **Rafa · Retención** | Lee la curva de retención (YouTube Analytics, pegada desde Studio o simulada). Si en el **segundo 3** queda menos del 70 %, **le manda un aviso a Gael** para reanalizar; con un toque se reescribe el gancho con otra fórmula. |

Sin conexión trabaja en **modo demo** (tendencias y retención simuladas). Para datos reales, en *Ajustes* de la oficina:

- **API key de YouTube Data v3**: Tendencias con datos reales.
- **ID de cliente OAuth** (tipo "Aplicación web", con tu dirección de GitHub Pages como origen autorizado): conectar el canal, subir y programar videos, leer la retención.

Las dos se sacan gratis en console.cloud.google.com (activa *YouTube Data API v3* y *YouTube Analytics API*) y se guardan solo en ese navegador. El canal en sí se crea con tu cuenta de Google en youtube.com/create_channel.

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
