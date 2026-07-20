"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ZONE_INFO, ZONE_KEYS, BRANCH_LIMIT } from "@/lib/tree/constants";
import { HORIZON_LABELS } from "@/lib/tree/copy";
import { capture } from "@/lib/posthog/capture";
import type { Horizon, TreeItems, ZoneKey } from "@/lib/tree/types";
import { AddButton } from "./AddButton";
import { AuthStatus } from "./AuthStatus";

export interface ModalState {
  zone: ZoneKey;
  mode: "new" | "edit";
  id?: string;
}

interface RightPanelProps {
  items: TreeItems;
  modal: ModalState | null;
  inputText: string;
  userEmail: string | null;
  horizon: Horizon | null;
  onInputChange: (text: string) => void;
  onOpenAdd: (zone: ZoneKey) => void;
  onSave: () => void;
  onCancel: () => void;
  onShowExample: (zone: ZoneKey) => void;
  onOpenHorizon: () => void;
}

export function RightPanel({
  items,
  modal,
  inputText,
  userEmail,
  horizon,
  onInputChange,
  onOpenAdd,
  onSave,
  onCancel,
  onShowExample,
  onOpenHorizon,
}: RightPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [popoverZone, setPopoverZone] = useState<ZoneKey | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modal) inputRef.current?.focus();
  }, [modal]);

  return (
    <div
      className="relative flex flex-shrink-0 flex-col border-l border-line bg-cream transition-[width] duration-300"
      style={{ width: collapsed ? "40px" : "340px" }}
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute top-6 -left-4 z-[200] flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-sm text-ink-soft shadow-[0_2px_8px_rgba(43,42,38,0.08)]"
        aria-label={collapsed ? "Развернуть панель" : "Свернуть панель"}
      >
        {collapsed ? "←" : "→"}
      </button>

      {!collapsed && (
        <div className="scrollable flex min-h-0 flex-1 flex-col overflow-y-auto p-[24px_22px]">
          <div className="mb-6">
            <h1 className="font-serif text-[26px] leading-[1.15] font-medium tracking-[-0.01em] text-ink">
              Дерево Опоры
            </h1>
            <p className="mt-1 text-xs text-ink-muted">Roots &amp; Fruits</p>
            {horizon && (
              <button
                onClick={onOpenHorizon}
                title="Поменять горизонт"
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-terracotta/[0.18] bg-terracotta/[0.08] px-3 py-1 text-[11px] font-medium text-terracotta-dark transition-colors hover:bg-terracotta/[0.14]"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-terracotta" />
                Период реализации: {HORIZON_LABELS[horizon]}
              </button>
            )}
          </div>

          <div className="mb-5">
            <h3 className="mb-2.5 text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
              Добавить
            </h3>
            <div className="flex flex-col gap-1.5">
              {ZONE_KEYS.map((zone) => {
                const info = ZONE_INFO[zone];
                const count = items[zone].length;
                const limit = zone === "branches" ? BRANCH_LIMIT : undefined;
                const harvestedCount =
                  zone === "crown" ? items.crown.filter((f) => f.harvested).length : 0;
                return (
                  <AddButton
                    key={zone}
                    zone={zone}
                    bg={info.bg}
                    label={info.label}
                    count={count}
                    limit={limit}
                    harvestedCount={harvestedCount}
                    popoverOpen={popoverZone === zone}
                    onClick={() => onOpenAdd(zone)}
                    onToggleInfo={() =>
                      setPopoverZone((z) => {
                        const next = z === zone ? null : zone;
                        if (next) capture("zone_info_clicked", { zone: next });
                        return next;
                      })
                    }
                    onShowExample={() => {
                      capture("example_viewed", { zone });
                      onShowExample(zone);
                      setPopoverZone(null);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {modal && (
            <div className="mb-5 rounded-[14px] border border-line bg-white p-[18px] shadow-[0_2px_4px_rgba(43,42,38,0.04),0_4px_12px_rgba(43,42,38,0.08)]">
              <div className="mb-3.5 flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: ZONE_INFO[modal.zone].bg }}
                />
                <span className="text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
                  {modal.mode === "new" ? "Новая" : "Редактирование"} · {ZONE_INFO[modal.zone].label}
                </span>
              </div>
              <input
                ref={inputRef}
                className="app-input mb-3"
                type="text"
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Название..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSave();
                  if (e.key === "Escape") onCancel();
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="flex-1 rounded-lg bg-ink px-3.5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
                >
                  Сохранить
                </button>
                <button
                  onClick={onCancel}
                  className="rounded-lg border border-line px-3.5 py-2.5 text-[13px] font-medium text-ink-soft"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="mb-5 rounded-[10px] bg-terracotta/[0.06] p-3.5">
            <div className="mb-1.5 text-[11px] font-semibold tracking-[0.08em] text-terracotta-dark uppercase">
              Подсказка
            </div>
            <p className="text-xs leading-[1.55] text-ink-soft">
              Кликни{" "}
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-line align-middle font-serif text-[9px] font-semibold text-ink-soft italic">
                i
              </span>{" "}
              чтобы узнать про каждый тип. Опоры, ресурсы и плоды можно перетаскивать мышкой.
            </p>
          </div>

          <div className="mt-auto border-t border-line pt-4">
            <Link
              href="/about"
              className="mb-3 flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              О подходе →
            </Link>
            <AuthStatus email={userEmail} />
          </div>
        </div>
      )}
    </div>
  );
}
