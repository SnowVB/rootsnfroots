"use client";

import { useEffect, useRef } from "react";
import { ZONE_INFO } from "@/lib/tree/constants";
import { ZONE_DEFINITIONS } from "@/lib/tree/copy";
import type { ZoneKey } from "@/lib/tree/types";

interface InfoPopoverProps {
  zone: ZoneKey;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onShowExample: () => void;
}

export function InfoPopover({ zone, anchorRef, onClose, onShowExample }: InfoPopoverProps) {
  const popRef = useRef<HTMLDivElement>(null);
  const info = ZONE_INFO[zone];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        if (anchorRef.current && anchorRef.current.contains(e.target as Node)) return;
        onClose();
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [anchorRef, onClose]);

  return (
    <div
      ref={popRef}
      className="absolute top-[calc(100%+8px)] right-0 z-[500] w-[296px] rounded-xl border border-line bg-white p-4 shadow-[0_12px_32px_rgba(43,42,38,0.15)]"
      style={{ animation: "scaleIn 0.15s cubic-bezier(0.4,0,0.2,1)", transformOrigin: "top right" }}
    >
      <div className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 border-t border-l border-line bg-white" />
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ background: info.bg }} />
        <span className="font-serif text-[15px] font-medium text-ink">{info.name}</span>
        <span className="ml-auto text-[11px] text-ink-muted">{info.tagline}</span>
      </div>
      <p className="mb-3 text-[13px] leading-[1.55] text-ink-soft">{ZONE_DEFINITIONS[zone]}</p>
      <button
        onClick={onShowExample}
        className="flex items-center gap-1 text-xs font-medium text-accent"
      >
        Показать пример →
      </button>
    </div>
  );
}
