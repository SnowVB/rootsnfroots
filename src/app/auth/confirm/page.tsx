import { confirmMagicLink } from "../actions";

interface ConfirmPageProps {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}

// Deliberately NOT auto-verified on GET: email scanners (Gmail, Outlook Safe
// Links, etc.) prefetch links in incoming mail, which would silently burn a
// one-time token before the person ever clicks it. Verification only runs
// on an actual button click (a Server Action / POST), which bots don't do.
export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token_hash: tokenHash, type } = await searchParams;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-2xl font-medium text-ink">Дерево Опоры</h1>
        <p className="mt-1.5 text-sm leading-[1.5] text-ink-soft">
          Подтверди вход, чтобы продолжить.
        </p>

        {tokenHash ? (
          <form action={confirmMagicLink} className="mt-6">
            <input type="hidden" name="token_hash" value={tokenHash} />
            <input type="hidden" name="type" value={type ?? "email"} />
            <button
              type="submit"
              className="w-full rounded-lg bg-ink px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
            >
              Подтвердить вход
            </button>
          </form>
        ) : (
          <p className="mt-6 text-xs text-[#C43B3B]">Ссылка повреждена, запроси новую на странице входа.</p>
        )}
      </div>
    </div>
  );
}
