import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async ({ cookies, redirect, url }) => {
  const secretKey = import.meta.env.SECRET_KEY;
  const providedKey = cookies.get("secret-key")?.value;

  if (url.pathname.startsWith("/api/login")) {
    return;
  }

  if (url.pathname.startsWith("/login")) {
    return;
  }

  if (providedKey !== secretKey) {
    return redirect("/login");
  }
});
