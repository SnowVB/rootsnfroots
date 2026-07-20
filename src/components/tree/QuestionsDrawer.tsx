"use client";

import { useState } from "react";
import { ZONE_INFO, ZONE_KEYS } from "@/lib/tree/constants";
import { QUESTION_LEVEL_INFO, ZONE_QUESTIONS, type QuestionLevel } from "@/lib/tree/copy";
import type { ZoneKey } from "@/lib/tree/types";

const LEVELS: QuestionLevel[] = ["start", "deep", "body"];

interface QuestionsDrawerProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function QuestionsDrawer({ open, onOpen, onClose }: QuestionsDrawerProps) {
  const [activeZone, setActiveZone] = useState<ZoneKey>("roots");
  const [openSection, setOpenSection] = useState<QuestionLevel | null>("start");
  // Reset the open section when the zone tab changes — adjusted during
  // render (React's recommended pattern for this) rather than in an effect,
  // so it doesn't trigger an extra commit/repaint.
  const [prevZone, setPrevZone] = useState(activeZone);
  if (activeZone !== prevZone) {
    setPrevZone(activeZone);
    setOpenSection("start");
  }

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="absolute inset-0 z-[400] bg-black/15"
          style={{ animation: "fadeIn 0.2s" }}
        />
      )}
      <div
        className="absolute top-0 bottom-0 left-0 z-[450] flex w-[380px] flex-col border-r border-line bg-cream transition-transform duration-300"
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
          boxShadow: open ? "4px 0 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div className="flex items-center justify-between border-b border-line p-[20px_24px_16px]">
          <div>
            <h3 className="font-serif text-xl font-medium tracking-[-0.01em] text-ink">
              Вопросы для рефлексии
            </h3>
            <p className="mt-0.5 text-xs text-ink-muted">Не торопись. Прислушивайся.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-sm text-ink-soft"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="flex gap-1 border-b border-line px-3">
          {ZONE_KEYS.map((zone) => {
            const info = ZONE_INFO[zone];
            const isActive = activeZone === zone;
            return (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className="-mb-px flex-1 px-2.5 py-3 text-xs transition-colors"
                style={{
                  color: isActive ? "var(--ink)" : "var(--ink-muted)",
                  fontWeight: isActive ? 600 : 500,
                  borderBottom: `2px solid ${isActive ? info.bg : "transparent"}`,
                }}
              >
                {info.name}
              </button>
            );
          })}
        </div>

        <div className="scrollable flex-1 p-[16px_24px]">
          <p className="mb-4 border-b border-dashed border-line pb-3 text-xs text-ink-muted italic">
            {ZONE_INFO[activeZone].tagline}
          </p>

          {LEVELS.map((level) => {
            const questions = ZONE_QUESTIONS[activeZone][level];
            const levelInfo = QUESTION_LEVEL_INFO[level];
            const isOpen = openSection === level;
            return (
              <div key={level} className="mb-2">
                <button
                  onClick={() => setOpenSection(isOpen ? null : level)}
                  className={`flex w-full items-center justify-between rounded-[10px] border px-3.5 py-3 text-left text-[13px] font-medium text-ink transition-colors ${
                    isOpen ? "border-line bg-white" : "border-transparent hover:bg-black/[0.02]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 font-serif text-[11px] text-ink-muted">
                      {levelInfo.icon}
                    </span>
                    {levelInfo.label}
                  </span>
                  <span
                    className="text-xs text-ink-muted transition-transform"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  >
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <ul
                    className="list-none py-2 pr-3.5 pl-[44px]"
                    style={{ animation: "fadeIn 0.2s" }}
                  >
                    {questions.map((q, i) => (
                      <li key={i} className="py-1.5 text-[13px] leading-[1.6] text-ink-soft">
                        {q}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!open && (
        <button
          onClick={onOpen}
          className="absolute top-1/2 left-0 z-[350] flex h-[110px] w-8 items-center justify-center rounded-r-xl border border-l-0 border-line bg-[rgba(253,251,247,0.92)] text-[11px] font-medium tracking-[0.08em] text-ink-soft shadow-[2px_0_8px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-colors hover:bg-white"
          style={{
            transform: "translateY(-50%) rotate(180deg)",
            writingMode: "vertical-rl",
          }}
        >
          Вопросы для рефлексии
        </button>
      )}
    </>
  );
}
