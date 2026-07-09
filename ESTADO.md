# La Esquina — sitio de restaurante paisa con menú editable

`estado: 🟢 terminado` · `en vivo: https://la-esquina-astro.vercel.app`

**Stack:** Astro 6 (SSR híbrido) · Tailwind v4 · Vercel adapter · Sharp/sitemap · GitHub Contents API · Cloudinary
**Dev:** `npm run dev` → :4321

## Hecho
menú editable /admin, mapa anti-hijack, galería lightbox, reservas Formspree, SEO JSON-LD, OG en build, PageSpeed 96

## Pendiente
nada bloqueante

## Gotchas
- Datos en `src/data.json` (fuente única) vía GitHub Contents API
- `/admin` y `/api` con `prerender=false` (SSR)
- Env: ADMIN_PASSWORD, GITHUB_TOKEN, Cloudinary sin firma

<sub>actualizado 2026-07-07 · último commit 2026-06-20</sub>
