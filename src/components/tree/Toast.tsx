"use client";

import { Portal } from "./Portal";

export function Toast({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <Portal>
      <div
        className="fixed bottom-6 left-1/2 isolate z-[1500] flex min-w-[280px] max-w-[420px] -translate-x-1/2 items-start gap-3 rounded-xl bg-[rgba(43,42,38,0.95)] p-[14px_18px] text-white shadow-[0_12px_32px_rgba(0,0,0,0.25)] backdrop-blur-md"
        style={{ animation: "fadeIn 0.2s" }}
      >
        <div className="flex-1">
          <div className="mb-0.5 text-[13px] font-semibold text-white/95">{title}</div>
          <div className="text-xs leading-[1.5] text-white/70">{body}</div>
        </div>
        <button
          onClick={onClose}
          className="px-1 text-base leading-none text-white/50"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
    </Portal>
  );
}
