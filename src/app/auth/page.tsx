import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithEmail, signInWithGoogle } from "./actions";

interface AuthPageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

  const params = await searchParams;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-medium text-ink">Дерево Опоры</h1>
        <p className="mt-1.5 text-sm leading-[1.5] text-ink-soft">
          Войди, чтобы дерево сохранялось и было доступно с других устройств.
        </p>

        {params.sent ? (
          <div className="mt-6 rounded-xl border border-line bg-white p-4 text-sm leading-[1.5] text-ink-soft">
            Письмо со ссылкой для входа отправлено. Проверь почту.
          </div>
        ) : (
          <form action={signInWithEmail} className="mt-6 flex flex-col gap-2">
            <input
              type="email"
              name="email"
              required
              placeholder="Твой email"
              className="app-input"
            />
            <button
              type="submit"
              className="rounded-lg bg-ink px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
            >
              Получить ссылку для входа
            </button>
          </form>
        )}

        <div className="my-4 flex items-center gap-3 text-xs text-ink-muted">
          <div className="h-px flex-1 bg-line" />
          или
          <div className="h-px flex-1 bg-line" />
        </div>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-cream-2"
          >
            Продолжить с Google
          </button>
        </form>

        {params.error && <p className="mt-4 text-xs text-[#C43B3B]">{params.error}</p>}
      </div>
    </div>
  );
}
