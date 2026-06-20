# La Esquina — Sitio de restaurante

Sitio web de restaurante de comida paisa (Medellín) con **menú editable** desde un panel propio, **mapa interactivo**, **reservas por formulario** y **SEO local** completo (JSON-LD `Restaurant` con geocoordenadas).

🔗 **En vivo:** https://la-esquina-astro.vercel.app

---

## Qué es

**La Esquina** es la página de un restaurante: hero, historia, menú destacado, galería con lightbox, testimonios, mapa y formulario de reservas. Todo el contenido (menú, datos del local, testimonios, galería) se edita desde un **panel `/admin`** y se guarda en GitHub vía API, sin tocar código.

## Características

- **Menú editable** — platos con nombre, precio, descripción, categoría e imagen, gestionados desde el panel.
- **Galería con lightbox accesible** — sobre `<dialog>`/inert, con foco atrapado y navegación por teclado (Esc / flechas).
- **Mapa interactivo anti-hijack** — Google Maps embed que exige **doble toque** (móvil) o doble clic (desktop) antes de capturar el scroll, y se **re-bloquea** al hacer scroll en la página; incluye botón "Cómo llegar".
- **Reservas por formulario** — envío con **Formspree**, con `aria-live` para el feedback de éxito/error.
- **Panel `/admin`** — edita datos del sitio, sección "sobre", menú, testimonios y galería; **subida de imágenes a Cloudinary**.
- **SEO local** — **JSON-LD `Restaurant`** solo en la home, con `servesCuisine`, `priceRange`, `openingHours`, dirección con `addressRegion` y **`geo` (latitud/longitud)**; Open Graph (`og.png` 1200×630 generado en build con Sharp), Twitter Card, canonical y `sitemap` (excluye `/admin`).
- **Accesible** — skip-link, foco visible, navbar con `aria-expanded`/`aria-controls`, contraste AA y `prefers-reduced-motion`.
- **Rendimiento** — **PageSpeed 96**; hero responsivo con `srcset`, `preconnect`/`preload` y lazy-loading en el resto.

## Stack

- **Astro 6** (SSR híbrido con adapter de Vercel)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **@astrojs/sitemap** + **Sharp** (generación de la imagen OG en build)
- **GitHub Contents API** como almacén de datos · **Cloudinary** para imágenes · **Formspree** para el formulario
- Deploy en **Vercel** · Node ≥ 22.12

## Decisiones técnicas

- **Datos en `src/data.json`:** única fuente de verdad (menú, testimonios, galería, sitio, sobre). `src/config.ts` la importa y expone helpers (p. ej. `srcset` responsivo del hero según el CDN).
- **Render híbrido:** las rutas públicas son estáticas; `/admin` y `/api/guardar` usan `prerender = false` (SSR) para autenticar y escribir en GitHub.
- **OG en build:** `scripts/generar-og.mjs` (Sharp) genera `public/og.png` a partir de una foto del `data.json` con overlay de marca → la tarjeta social siempre refleja el contenido actual.
- **Mapa sin secuestro de scroll:** detecta puntero `coarse` y escucha `wheel`/`scroll` para bloquear/desbloquear la interacción del iframe.

## Correr en local

```bash
git clone https://github.com/Kelvmdev/la-esquina-astro.git
cd la-esquina-astro
npm install
npm run dev
```

Abre http://localhost:4321

### Variables de entorno

Crea un `.env` (no se versiona):

```
ADMIN_PASSWORD=<contraseña del panel /admin>
GITHUB_TOKEN=<PAT con scope repo:contents>
GITHUB_OWNER=Kelvmdev
GITHUB_REPO=la-esquina-astro
GITHUB_BRANCH=main
```

El `cloud name` y el `upload preset` de Cloudinary se usan en el panel para la subida sin firma.

## Scripts

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo (`localhost:4321`) |
| `npm run build` | Build de producción |
| `node scripts/generar-og.mjs` | Regenera la imagen OG (`public/og.png`) |
| `npm run preview` | Previsualiza el build |

---

Hecho por [Kervin Martínez](https://mi-portafolio-eta-hazel.vercel.app) · Asistido con Claude Code.
