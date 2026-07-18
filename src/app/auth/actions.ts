"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

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
    redirect(
      "/auth?error=" +
        encodeURIComponent(error?.message ?? "Не удалось начать вход через Google"),
    );
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
