"use client";

import { useEffect } from "react";
import Link from "next/link";
import { capture } from "@/lib/posthog/capture";

// The tree scene's fixed-width side panel doesn't reflow on phone-sized
// viewports (see CLAUDE.md §17 "Базовая mobile responsive раскладка" and
// L15) — rather than let a phone visitor hit that broken layout, this shows
// a calm, on-brand message instead. Server-decided (src/app/page.tsx checks
// the User-Agent before rendering), so there's no flash of the real app
// first. `capture()` here is the one thing that needs to run client-side.
export function MobileGate() {
  useEffect(() => {
    capture("mobile_gate_shown");
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="mb-2 font-serif text-xl font-medium text-ink">Дерево Опоры</p>
      <p className="mb-1 max-w-xs text-sm leading-[1.6] text-ink-soft">
        Дерево пока лучше раскрывается на компьютере — мобильная версия в работе.
      </p>
      <p className="mb-6 max-w-xs text-sm leading-[1.6] text-ink-soft">
        Загляни с ноутбука или десктопа, чтобы поработать с ним.
      </p>
      <Link href="/about" className="text-xs font-medium text-accent hover:underline">
        Почитать о подходе →
      </Link>
    </div>
  );
}
