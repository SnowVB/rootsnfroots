"use client";

import { useEffect } from "react";
import Link from "next/link";
import { reportError } from "@/lib/posthog/capture";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "Route error boundary");
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="mb-2 font-serif text-xl font-medium text-ink">Что-то пошло не так</p>
      <p className="mb-6 max-w-sm text-sm leading-[1.6] text-ink-soft">
        Дерево сохранено — ничего не потеряется.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
        >
          Попробовать снова
        </button>
        <Link
          href="/"
          className="rounded-lg border border-line px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-cream-2"
        >
          К дереву
        </Link>
      </div>
    </div>
  );
}
