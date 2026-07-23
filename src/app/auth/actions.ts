"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { reportServerError } from "@/lib/posthog/server";

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect("/auth?error=" + encodeURIComponent("Введи email"));
  }

  const supabase = await createClient();

  // No emailRedirectTo: the email template links to our own /auth/confirm
  // with a token_hash, not Supabase's hosted verify endpoint — see D27.
  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    await reportServerError(error, "signInWithEmail failed");
    redirect("/auth?error=" + encodeURIComponent(error.message));
  }

  redirect("/auth?sent=1");
}

export async function confirmMagicLink(formData: FormData) {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "email") as EmailOtpType;

  if (!tokenHash) {
    redirect("/auth?error=" + encodeURIComponent("Ссылка повреждена, запроси новую"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  // Deliberately not reported to PostHog Errors — an expired/reused token
  // here is expected, routine friction (email-scanner bots prefetching
  // links, double-clicks, genuinely old links — see D27), not a bug.
  // Reporting every instance would just be noise.
  if (error) {
    redirect(
      "/auth?error=" + encodeURIComponent("Ссылка уже использована или устарела, запроси новую"),
    );
  }

  redirect("/");
}

export async function signInWithGoogle() {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    await reportServerError(
      error ?? new Error("signInWithOAuth returned no redirect URL"),
      "signInWithGoogle failed",
    );
    redirect(
      "/auth?error=" +
        encodeURIComponent(error?.message ?? "Не удалось начать вход через Google"),
    );
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    await reportServerError(error, "signOut failed");
  }
  redirect("/");
}
