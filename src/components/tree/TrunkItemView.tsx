"use client";

import { useState } from "react";
import type { TrunkItemData } from "@/lib/tree/types";
import { DeleteBtn } from "./DeleteBtn";
import { useDraggable } from "./useDraggable";

interface TrunkItemViewProps {
  item: TrunkItemData;
  autoX: number;
  autoY: number;
  containerRef: React.RefObject<HTMLElement | null>;
  onEdit: (item: TrunkItemData) => void;
  onDelete: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
}

export function TrunkItemView({
  item,
  autoX,
  autoY,
  containerRef,
  onEdit,
  onDelete,
  onDrag,
}: TrunkItemViewProps) {
  const [hover, setHover] = useState(false);
  const x = item.x ?? autoX;
  const y = item.y ?? autoY;
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
      className="absolute max-w-[110px] rounded-lg px-[11px] py-[5px]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${dragging ? 1.05 : hover ? 1.03 : 1})`,
        background: "linear-gradient(135deg, #7A8D6A, #5B6E4E)",
        cursor: dragging ? "grabbing" : "grab",
        transition: dragging ? "none" : "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s",
        boxShadow: dragging
          ? "0 12px 28px rgba(91,110,78,0.4)"
          : hover
            ? "0 4px 12px rgba(91,110,78,0.3)"
            : "0 2px 6px rgba(0,0,0,0.15)",
        zIndex: dragging ? 1000 : hover ? 100 : 10,
      }}
    >
      <span className="pointer-events-none block text-center text-xs leading-[1.3] font-medium tracking-[0.01em] break-words text-white">
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
