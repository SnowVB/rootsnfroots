"use client";

import { useState } from "react";
import { BRANCH_SLOTS } from "@/lib/tree/constants";
import type { BranchItemData } from "@/lib/tree/types";
import { DeleteBtn } from "./DeleteBtn";

interface BranchItemProps {
  item: BranchItemData;
  onEdit: (item: BranchItemData) => void;
  onDelete: (id: string) => void;
}

// Branches sit in fixed slots — not draggable, per CLAUDE.md D8 (they reflect
// crown structure, not freeform content).
export function BranchItem({ item, onEdit, onDelete }: BranchItemProps) {
  const [hover, setHover] = useState(false);
  const slot = BRANCH_SLOTS.find((s) => s.id === item.slotId);
  if (!slot) return null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onEdit(item)}
      className="absolute cursor-pointer rounded-full border border-white/40 px-4 py-[7px] backdrop-blur-[6px]"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: `translate(-50%, -50%) rotate(${slot.angle}deg) scale(${hover ? 1.05 : 1})`,
        background: "linear-gradient(135deg, rgba(205,225,155,0.9), rgba(174,213,129,0.8))",
        transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
        boxShadow: hover ? "0 4px 12px rgba(139,175,92,0.35)" : "0 2px 6px rgba(0,0,0,0.12)",
        zIndex: hover ? 100 : 20,
      }}
    >
      <span className="text-xs font-semibold tracking-[0.02em] whitespace-nowrap text-[#3D5228]">
        {item.text}
      </span>
      {hover && (
        <DeleteBtn
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        />
      )}
    </div>
  );
}
