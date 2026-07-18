"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthStatusProps {
  email: string | null;
}

export function AuthStatus({ email }: AuthStatusProps) {
  const router = useRouter();

  if (!email) {
    return (
      <Link href="/auth" className="text-xs font-medium text-accent hover:underline">
        Войти →
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate text-xs text-ink-muted" title={email}>
        {email}
      </span>
      <button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.refresh();
        }}
        className="flex-shrink-0 text-xs font-medium text-ink-soft hover:underline"
      >
        Выйти
      </button>
    </div>
  );
}
