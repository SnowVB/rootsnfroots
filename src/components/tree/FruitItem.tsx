"use client";

import { useEffect, useRef, useState } from "react";
import type { FruitItemData } from "@/lib/tree/types";
import { DeleteBtn } from "./DeleteBtn";
import { FruitMenuItem } from "./FruitMenuItem";
import { useDraggable } from "./useDraggable";

interface FruitItemProps {
  item: FruitItemData;
  containerRef: React.RefObject<HTMLElement | null>;
  onEdit: (item: FruitItemData) => void;
  onDelete: (id: string) => void;
  onHarvest: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
}

export function FruitItem({ item, containerRef, onEdit, onDelete, onHarvest, onDrag }: FruitItemProps) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const harvested = item.harvested;

  const { dragging, handleMouseDown } = useDraggable({
    id: item.id,
    containerRef,
    onDrag: (id, x, y) => {
      setMenuOpen(false);
      onDrag(id, x, y);
    },
    onClick: () => setMenuOpen(true),
  });

  useEffect(() => {
    if (!menuOpen) return;
    // Check target containment rather than relying on stopPropagation from
    // menu buttons to prevent this from firing — that pattern turned out to
    // be unreliable (see CLAUDE.md); this is the same fix already proven to
    // work in InfoPopover.
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", close), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", close);
    };
  }, [menuOpen]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="absolute"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: `translate(-50%, -50%) scale(${dragging ? 1.08 : hover ? 1.04 : 1})`,
        zIndex: dragging ? 1000 : hover || menuOpen ? 100 : 15,
      }}
    >
      <div
        className="relative flex min-h-[62px] min-w-[62px] items-center justify-center rounded-full p-[10px]"
        style={{
          background: harvested
            ? "radial-gradient(circle at 32% 28%, #C9A89B 0%, #B0897C 55%, #8F6A5C 100%)"
            : "radial-gradient(circle at 32% 28%, #F2A088 0%, #E8876B 55%, #C76A4F 100%)",
          cursor: dragging ? "grabbing" : "grab",
          transition: dragging ? "none" : "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, background 0.3s",
          boxShadow: dragging
            ? "0 16px 32px rgba(199,106,79,0.45)"
            : hover
              ? "0 6px 18px rgba(199,106,79,0.35)"
              : "0 3px 8px rgba(0,0,0,0.18)",
          opacity: harvested ? 0.92 : 1,
          WebkitMaskImage: harvested
            ? "radial-gradient(circle at 86% 16%, transparent 13px, black 13.5px)"
            : "none",
          maskImage: harvested
            ? "radial-gradient(circle at 86% 16%, transparent 13px, black 13.5px)"
            : "none",
        }}
      >
        <span
          className="pointer-events-none max-w-[72px] text-center text-[11px] leading-[1.25] font-semibold tracking-[0.01em] break-words text-white"
          style={{
            textShadow: "0 1px 2px rgba(139,50,30,0.3)",
            textDecoration: harvested ? "line-through" : "none",
            opacity: harvested ? 0.85 : 1,
          }}
        >
          {item.text}
        </span>
      </div>

      {harvested && (
        <div className="pointer-events-none absolute -bottom-1 -left-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white bg-[#5B8C4A] shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
          <span className="text-xs leading-none font-bold text-white">✓</span>
        </div>
      )}

      {hover && !dragging && !menuOpen && (
        <DeleteBtn
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        />
      )}

      {menuOpen && (
        <div
          ref={menuRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-[calc(100%+8px)] left-1/2 z-[1100] min-w-[150px] -translate-x-1/2 rounded-[10px] border border-line bg-white p-1 shadow-[0_8px_24px_rgba(43,42,38,0.18)]"
          style={{ animation: "scaleIn 0.12s" }}
        >
          <FruitMenuItem
            onClick={() => {
              onEdit(item);
              setMenuOpen(false);
            }}
          >
            Редактировать
          </FruitMenuItem>
          <FruitMenuItem
            onClick={() => {
              onHarvest(item.id);
              setMenuOpen(false);
            }}
            accent={!harvested}
          >
            {harvested ? "Вернуть (не сорван)" : "🍂 Сорвать плод"}
          </FruitMenuItem>
          <div className="my-1 h-px bg-line" />
          <FruitMenuItem
            onClick={() => {
              onDelete(item.id);
              setMenuOpen(false);
            }}
            danger
          >
            Удалить
          </FruitMenuItem>
        </div>
      )}
    </div>
  );
}
