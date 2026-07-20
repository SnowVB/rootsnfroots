"use client";

import { HORIZON_OPTIONS, HORIZON_TEXT } from "@/lib/tree/copy";
import type { Horizon } from "@/lib/tree/types";

interface HorizonDialogProps {
  currentValue: Horizon | null;
  isFirstTime: boolean;
  onChoose: (value: Horizon) => void;
  onClose: () => void;
}

export function HorizonDialog({ currentValue, isFirstTime, onChoose, onClose }: HorizonDialogProps) {
  return (
    <div
      className="absolute inset-0 isolate z-[1800] flex items-center justify-center bg-[rgba(20,30,45,0.55)] backdrop-blur-md"
      style={{ animation: "fadeIn 0.2s" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="scrollable w-[90%] max-w-[520px] rounded-[18px] bg-cream p-[32px_36px] shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
        style={{ maxHeight: "85vh", overflowY: "auto", animation: "scaleIn 0.25s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div className="mb-1.5 text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
          {isFirstTime ? HORIZON_TEXT.labelFirstTime : HORIZON_TEXT.labelChange}
        </div>
        <h2 className="mb-[18px] font-serif text-[26px] leading-[1.2] font-medium tracking-[-0.01em] text-ink">
          {HORIZON_TEXT.title}
        </h2>
        <p className="mb-3.5 text-sm leading-[1.65] text-ink-soft">{HORIZON_TEXT.intro}</p>
        <ul className="mb-5 list-none rounded-xl bg-terracotta/[0.06] p-[14px_18px]">
          {HORIZON_TEXT.questions.map((q, i) => (
            <li
              key={i}
              className={`relative pl-3.5 text-[13px] leading-[1.55] text-ink-soft ${
                i < HORIZON_TEXT.questions.length - 1 ? "mb-2" : ""
              }`}
            >
              <span className="absolute left-0 text-terracotta">·</span>
              {q}
            </li>
          ))}
        </ul>
        <p className="mb-6 font-serif text-[13px] leading-[1.55] text-ink-muted italic">
          {HORIZON_TEXT.note}
        </p>

        <div className="flex flex-col gap-2">
          {HORIZON_OPTIONS.map((opt) => {
            const isSelected = currentValue === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChoose(opt.value)}
                className={`flex w-full items-center justify-between rounded-[10px] border px-[18px] py-3.5 text-left text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink hover:border-ink-muted hover:bg-[#FAF6EC]"
                }`}
              >
                <span className="font-semibold">{opt.label}</span>
                <span
                  className={`text-xs font-normal italic ${isSelected ? "text-white/70" : "text-ink-muted"}`}
                >
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-4 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink-soft"
        >
          {isFirstTime ? HORIZON_TEXT.skipFirstTime : HORIZON_TEXT.skipChange}
        </button>

        <p className="mt-5 border-t border-line pt-4 font-serif text-xs leading-[1.55] text-ink-muted italic">
          {HORIZON_TEXT.footer}
        </p>
      </div>
    </div>
  );
}
