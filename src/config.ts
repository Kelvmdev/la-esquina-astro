import data from './data.json';

export const menu = data.menu;
export const testimonios = data.testimonios;
export const sitio = data.sitio;
export const galeria = data.galeria;
export const sobre = data.sobre;

// Anchos para el srcset responsive del hero
const ANCHOS_HERO = [640, 1024, 1280, 1920];

/**
 * Genera un srcset responsive a partir de la URL del hero, según el CDN:
 * - Cloudinary (res.cloudinary.com/.../upload/): inserta f_auto,q_auto,w_<n> tras /upload/.
 * - Pexels (?w= o &w=): reemplaza el valor de w= por cada ancho.
 * - Cualquier otra: devuelve "" → Hero usa solo la URL tal cual como src (sin srcset).
 */
export function heroSrcset(url: string): string {
  if (!url) return "";

  if (/res\.cloudinary\.com\/.*\/upload\//.test(url)) {
    return ANCHOS_HERO
      .map((w) => `${url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`)} ${w}w`)
      .join(", ");
  }

  if (/[?&]w=\d+/.test(url)) {
    return ANCHOS_HERO
      .map((w) => `${url.replace(/([?&]w=)\d+/, `$1${w}`)} ${w}w`)
      .join(", ");
  }

  return "";
}