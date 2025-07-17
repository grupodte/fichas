import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("secret-key", {
    path: "/",
  });
  return redirect("/login");
};
