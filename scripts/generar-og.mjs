// Genera imágenes de marca de forma reproducible:
//   public/og.png               (1200×630)  → og:image / twitter:image por defecto
//   public/apple-touch-icon.png (180×180)   → apple-touch-icon
//
// Uso: node scripts/generar-og.mjs
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const PUBLIC = fileURLToPath(new URL("../public/", import.meta.url));
await mkdir(PUBLIC, { recursive: true });

// Foto base de la OG: un plato apetitoso de data.json (Bandeja Paisa).
// Se descarga AQUÍ (en build/local), nunca en runtime.
const data = JSON.parse(await readFile(new URL("../src/data.json", import.meta.url), "utf-8"));
const plato = data.menu.find((p) => p.nombre === "Bandeja Paisa") ?? data.menu[0];
// Pedimos una versión más grande de la misma foto para que rinda a 1200px de ancho
const fotoUrl = plato.imagen
  .replace(/([?&])width=\d+/, "$1width=1600")
  .replace(/([?&])w=\d+/, "$1w=1600");

console.log(`Descargando foto base: ${plato.nombre}`);
const resp = await fetch(fotoUrl);
if (!resp.ok) throw new Error(`No se pudo descargar la foto (${resp.status}): ${fotoUrl}`);
const fotoBuf = Buffer.from(await resp.arrayBuffer());

// Recorte a 1200×630 (cover) como fondo de la OG
const fondoOg = await sharp(fotoBuf)
  .resize(1200, 630, { fit: "cover", position: "center" })
  .toBuffer();

// Paleta de marca (ámbar Tailwind sobre marrón cálido)
const STONE_900 = "#1c1917";
const AMBER_900 = "#78350f";
const AMBER_700 = "#b45309";
const AMBER_500 = "#f59e0b";
const AMBER_200 = "#fde68a";
const FUENTE = "Georgia, 'Times New Roman', serif";
const FUENTE_SANS = "Arial, Helvetica, sans-serif";

// Cubiertos (tenedor + cuchillo) dibujados como path → sin depender de emojis/fuentes
const cubiertos = (x, y, escala, color) => `
  <g transform="translate(${x} ${y}) scale(${escala})" fill="${color}">
    <!-- tenedor -->
    <rect x="-26" y="-44" width="5" height="20" rx="2.5"/>
    <rect x="-16" y="-44" width="5" height="20" rx="2.5"/>
    <rect x="-6"  y="-44" width="5" height="20" rx="2.5"/>
    <path d="M-26 -24 q0 8 8 9 l0 59 q0 5 5 5 q5 0 5 -5 l0 -59 q8 -1 8 -9 z"/>
    <!-- cuchillo -->
    <path d="M16 -44 q14 2 14 26 q0 14 -9 16 l0 46 q0 5 5 5 q5 0 5 -5 l0 -88 q0 -6 -6 -6 z"/>
  </g>`;

// Overlay semitransparente: oscurece la foto (para que el texto se lea) y dibuja la marca.
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1c1917" stop-opacity="0.55"/>
      <stop offset="45%"  stop-color="#1c1917" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#1c1917" stop-opacity="0.82"/>
    </linearGradient>
    <radialGradient id="tint" cx="50%" cy="42%" r="65%">
      <stop offset="0%"   stop-color="${AMBER_900}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${AMBER_900}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#scrim)"/>
  <rect width="1200" height="630" fill="url(#tint)"/>
  <!-- marco -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="${AMBER_200}" stroke-opacity="0.45" stroke-width="2"/>

  ${cubiertos(600, 158, 1.1, AMBER_200)}

  <text x="600" y="300" text-anchor="middle" font-family="${FUENTE_SANS}" font-size="30" font-weight="700"
        letter-spacing="10" fill="${AMBER_200}">R E S T A U R A N T E</text>

  <text x="600" y="424" text-anchor="middle" font-family="${FUENTE}" font-size="132" font-weight="700"
        fill="#ffffff" style="paint-order:stroke" stroke="#000000" stroke-opacity="0.25" stroke-width="3">La Esquina</text>

  <text x="600" y="496" text-anchor="middle" font-family="${FUENTE_SANS}" font-size="40" font-weight="400"
        fill="#ffffff">Comida paisa en Medellín</text>
</svg>`;

const iconSvg = `
<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ic" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${AMBER_700}"/>
      <stop offset="100%" stop-color="${AMBER_900}"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="url(#ic)"/>
  ${cubiertos(90, 96, 0.95, "#ffffff")}
</svg>`;

await sharp(fondoOg)
  .composite([{ input: Buffer.from(ogSvg), top: 0, left: 0 }])
  .png()
  .toFile(join(PUBLIC, "og.png"));
await sharp(Buffer.from(iconSvg)).png().toFile(join(PUBLIC, "apple-touch-icon.png"));

console.log("✓ Generadas: public/og.png (1200×630) y public/apple-touch-icon.png (180×180)");
