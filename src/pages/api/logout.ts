import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("sesion", { path: "/" }); // borra la pulsera
  return redirect("/admin");               // de vuelta al login
};