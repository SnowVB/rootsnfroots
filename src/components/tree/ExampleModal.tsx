"use client";

import { ZONE_INFO } from "@/lib/tree/constants";
import { ZONE_EXAMPLES } from "@/lib/tree/copy";
import type { ZoneKey } from "@/lib/tree/types";
import { Portal } from "./Portal";

interface ExampleModalProps {
  zone: ZoneKey;
  onClose: () => void;
}

export function ExampleModal({ zone, onClose }: ExampleModalProps) {
  const example = ZONE_EXAMPLES[zone];
  const info = ZONE_INFO[zone];

  return (
    <Portal>
      <div
        className="fixed inset-0 isolate z-[1000] flex items-center justify-center bg-[rgba(20,30,45,0.55)] backdrop-blur-md"
        style={{ animation: "fadeIn 0.2s" }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="scrollable w-[90%] max-w-[520px] rounded-2xl bg-cream p-8 shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            animation: "scaleIn 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="mb-1 flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full" style={{ background: info.bg }} />
            <span className="text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
              Пример · {info.name}
            </span>
          </div>
          <h2 className="mb-5 font-serif text-2xl leading-[1.2] font-medium text-ink">
            {example.title}
          </h2>
          {example.body.map((p, i) => (
            <p
              key={i}
              className="mb-3 text-sm leading-[1.65] text-ink-soft"
              style={{ paddingLeft: p.startsWith("—") ? "16px" : 0 }}
            >
              {p}
            </p>
          ))}
          <button
            onClick={onClose}
            className="mt-4 rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-white"
          >
            Понятно
          </button>
        </div>
      </div>
    </Portal>
  );
}
