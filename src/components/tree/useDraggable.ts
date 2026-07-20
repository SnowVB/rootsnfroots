"use client";

import { useEffect, useRef, useState } from "react";

interface UseDraggableArgs {
  id: string;
  containerRef: React.RefObject<HTMLElement | null>;
  onDrag: (id: string, x: number, y: number) => void;
  /** Fires once, on mouseup, with the total distance moved — not on every tick. */
  onDragEnd?: (id: string, distancePct: number) => void;
  onClick: () => void;
}

/** Click vs. drag are disambiguated by a 3px movement threshold (CLAUDE.md §8.1). */
export function useDraggable({ id, containerRef, onDrag, onDragEnd, onClick }: UseDraggableArgs) {
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, moved: false });
  const startPctRef = useRef<{ x: number; y: number } | null>(null);
  const lastPctRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
    startPctRef.current = null;
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - dragRef.current.startX);
      const dy = Math.abs(e.clientY - dragRef.current.startY);
      if (dx > 3 || dy > 3) dragRef.current.moved = true;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;
      const clampedX = Math.max(0, Math.min(100, newX));
      const clampedY = Math.max(0, Math.min(100, newY));
      if (!startPctRef.current) startPctRef.current = { x: clampedX, y: clampedY };
      lastPctRef.current = { x: clampedX, y: clampedY };
      onDrag(id, clampedX, clampedY);
    };

    const handleUp = () => {
      setDragging(false);
      if (!dragRef.current.moved) {
        onClick();
      } else if (onDragEnd && startPctRef.current && lastPctRef.current) {
        const distancePct = Math.hypot(
          lastPctRef.current.x - startPctRef.current.x,
          lastPctRef.current.y - startPctRef.current.y,
        );
        onDragEnd(id, Math.round(distancePct));
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, id, containerRef, onDrag, onDragEnd, onClick]);

  return { dragging, handleMouseDown };
}
