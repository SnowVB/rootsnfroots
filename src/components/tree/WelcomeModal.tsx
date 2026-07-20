"use client";

import { WELCOME_TEXT } from "@/lib/tree/copy";

export function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-[2000] flex items-center justify-center bg-[rgba(20,30,45,0.55)] backdrop-blur-[10px]"
      style={{ animation: "fadeIn 0.3s" }}
    >
      <div
        className="w-[90%] max-w-[540px] rounded-[20px] bg-cream p-[40px_44px] text-center shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
        style={{ animation: "scaleIn 0.35s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div className="mb-1 font-serif text-[15px] text-ink-muted italic">
          {WELCOME_TEXT.tagline}
        </div>
        <h1 className="mb-6 font-serif text-4xl leading-[1.1] font-medium tracking-[-0.02em] text-ink">
          {WELCOME_TEXT.title}
        </h1>
        <div className="text-left">
          {WELCOME_TEXT.paragraphs.map((p, i) => (
            <p key={i} className="mb-3.5 text-[15px] leading-[1.7] text-ink-soft">
              {p}
            </p>
          ))}
          <p className="rounded-xl border-l-2 border-terracotta bg-terracotta/[0.08] p-[14px_18px] font-serif text-sm leading-[1.6] text-ink-muted italic">
            {WELCOME_TEXT.highlight}
          </p>
          <p className="mt-3.5 text-[13px] leading-[1.6] text-ink-muted">{WELCOME_TEXT.footer}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-7 rounded-[10px] bg-ink px-7 py-3 text-sm font-medium tracking-[0.01em] text-white transition-colors hover:bg-black"
        >
          {WELCOME_TEXT.button}
        </button>
      </div>
    </div>
  );
}
