import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const providedKey = formData.get("secret-key")?.toString();

  const secretKey = import.meta.env.SECRET_KEY;

  if (providedKey === secretKey) {
    cookies.set("secret-key", providedKey, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return redirect("/");
  } else {
    return redirect("/login");
  }
};
