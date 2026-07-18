"use client";

import { useState } from "react";
import { ROOT_SLOTS } from "@/lib/tree/constants";
import type { RootItemData } from "@/lib/tree/types";
import { DeleteBtn } from "./DeleteBtn";
import { useDraggable } from "./useDraggable";

interface RootItemProps {
  item: RootItemData;
  containerRef: React.RefObject<HTMLElement | null>;
  onEdit: (item: RootItemData) => void;
  onDelete: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
}

export function RootItem({ item, containerRef, onEdit, onDelete, onDrag }: RootItemProps) {
  const [hover, setHover] = useState(false);
  const slot = ROOT_SLOTS.find((s) => s.id === item.slotId);
  const x = item.x ?? slot?.x ?? 50;
  const y = item.y ?? slot?.y ?? 95;
  const { dragging, handleMouseDown } = useDraggable({
    id: item.id,
    containerRef,
    onDrag,
    onClick: () => onEdit(item),
  });

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="absolute max-w-[120px] rounded-[10px] px-[13px] py-[7px]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${dragging ? 1.05 : hover ? 1.03 : 1})`,
        background: "linear-gradient(135deg, #B8896B, #A07958)",
        cursor: dragging ? "grabbing" : "grab",
        transition: dragging ? "none" : "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
        boxShadow: dragging
          ? "0 12px 28px rgba(139,99,68,0.4)"
          : hover
            ? "0 4px 12px rgba(139,99,68,0.3)"
            : "0 2px 6px rgba(0,0,0,0.15)",
        zIndex: dragging ? 1000 : hover ? 100 : 10,
      }}
    >
      <span className="pointer-events-none block text-center text-[13px] leading-[1.3] font-medium tracking-[0.01em] break-words text-white">
        {item.text}
      </span>
      {hover && !dragging && (
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
