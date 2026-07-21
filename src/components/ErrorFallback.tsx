"use client";

// Deliberately calm, not alarming — matches CLAUDE.md §1 voice principles
// (no exclamation marks, no panic). Reassures that data isn't lost, since
// an error appearing in a reflection tool could otherwise read as "you lost
// your tree," which is a much worse feeling here than in a typical app.
export function ErrorFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="mb-2 font-serif text-xl font-medium text-ink">Что-то пошло не так</p>
      <p className="mb-6 max-w-sm text-sm leading-[1.6] text-ink-soft">
        Дерево сохранено — ничего не потеряется. Попробуй обновить страницу.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
      >
        Обновить страницу
      </button>
    </div>
  );
}
