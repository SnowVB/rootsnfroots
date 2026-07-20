"use client";

import { useRef } from "react";
import type { ZoneKey } from "@/lib/tree/types";
import { InfoPopover } from "./InfoPopover";

interface AddButtonProps {
  zone: ZoneKey;
  bg: string;
  label: string;
  count: number;
  limit?: number;
  harvestedCount?: number;
  popoverOpen: boolean;
  onClick: () => void;
  onToggleInfo: () => void;
  onShowExample: () => void;
}

export function AddButton({
  zone,
  bg,
  label,
  count,
  limit,
  harvestedCount = 0,
  popoverOpen,
  onClick,
  onToggleInfo,
  onShowExample,
}: AddButtonProps) {
  const infoIconRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex w-full items-center gap-2.5 rounded-xl border border-transparent bg-[#FAF6EC] px-3.5 py-3 text-left text-[13px] font-medium text-ink transition-all hover:-translate-y-px hover:border-line hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
      >
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-base font-semibold text-white"
          style={{ background: bg }}
        >
          +
        </span>
        <span className="flex-1">{label}</span>
        <span className="text-[11px] font-medium text-ink-muted tabular-nums">
          {harvestedCount > 0 && (
            <span className="font-semibold text-[#5B8C4A]">✓{harvestedCount} · </span>
          )}
          {count}
          {limit ? `/${limit}` : ""}
        </span>
        <span
          ref={infoIconRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggleInfo();
          }}
          role="button"
          aria-label={`Что такое «${label}»`}
          className={`flex h-5 w-5 items-center justify-center rounded-full font-serif text-[11px] font-semibold text-ink-muted italic transition-colors ${
            popoverOpen ? "bg-line" : "hover:bg-line hover:text-ink"
          }`}
        >
          i
        </span>
      </button>
      {popoverOpen && (
        <InfoPopover
          zone={zone}
          anchorRef={infoIconRef}
          onClose={onToggleInfo}
          onShowExample={onShowExample}
        />
      )}
    </div>
  );
}
