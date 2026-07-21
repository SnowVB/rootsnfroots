"use client";

import { useEffect } from "react";
import "./globals.css";
import { reportError } from "@/lib/posthog/capture";

// Catches errors thrown by the root layout itself — the one place
// error.tsx can't reach, since error.tsx only wraps what the layout
// renders as children. Has to define its own <html>/<body> because it
// fully replaces the root layout while active.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "Global error boundary");
  }, [error]);

  return (
    <html lang="ru">
      <body className="font-sans text-ink antialiased">
        <div className="flex h-screen flex-col items-center justify-center bg-cream px-6 text-center">
          <p className="mb-2 text-xl font-medium text-ink">Что-то пошло не так</p>
          <p className="mb-6 max-w-sm text-sm leading-[1.6] text-ink-soft">
            Дерево сохранено — ничего не потеряется. Попробуй обновить страницу.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
