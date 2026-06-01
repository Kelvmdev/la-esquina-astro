import type { APIRoute } from "astro";

export const prerender = false;

const OWNER = import.meta.env.GITHUB_OWNER;
const REPO = import.meta.env.GITHUB_REPO;
const BRANCH = import.meta.env.GITHUB_BRANCH;
const TOKEN = import.meta.env.GITHUB_TOKEN;
const RUTA = "src/data.json"; // ruta del archivo dentro del repo

const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${RUTA}`;

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Seguridad: solo con sesión activa
  if (cookies.get("sesion")?.value !== "ok") {
    return new Response("No autorizado", { status: 401 });
  }

  // 2. Leer el contenido nuevo que mandó el panel
  const nuevaData = await request.json();
  const contenido = JSON.stringify(nuevaData, null, 2);

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "la-esquina-cms",
  };

  try {
    // 3. Traer el SHA actual del archivo en GitHub
    const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (!getRes.ok) {
      return new Response("No se pudo leer el archivo en GitHub", { status: 502 });
    }
    const archivo = await getRes.json();

    // 4. Commitear la nueva versión (Base64 + UTF-8 para los acentos)
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "Actualizar contenido desde el panel",
        content: Buffer.from(contenido, "utf-8").toString("base64"),
        sha: archivo.sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) {
      return new Response("GitHub rechazó el guardado", { status: 502 });
    }

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Error de red", { status: 502 });
  }
};