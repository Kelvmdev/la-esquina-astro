import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const clave = form.get("clave");

  if (clave !== import.meta.env.ADMIN_PASSWORD) {
    return redirect("/admin?error=1");
  }

  cookies.set("sesion", "ok", {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return redirect("/admin");
};