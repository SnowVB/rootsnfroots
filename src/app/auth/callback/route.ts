import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { reportServerError } from "@/lib/posthog/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    await reportServerError(error, "Google OAuth exchangeCodeForSession failed");
  } else {
    await reportServerError(
      new Error("OAuth callback hit with no code param"),
      "Google OAuth callback missing code",
    );
  }

  return NextResponse.redirect(
    `${origin}/auth?error=${encodeURIComponent("Не удалось подтвердить вход, попробуй ещё раз")}`,
  );
}
