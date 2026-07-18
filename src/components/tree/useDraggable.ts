"use client";

import { useEffect, useRef, useState } from "react";

interface UseDraggableArgs {
  id: string;
  containerRef: React.RefObject<HTMLElement | null>;
  onDrag: (id: string, x: number, y: number) => void;
  onClick: () => void;
}

/** Click vs. drag are disambiguated by a 3px movement threshold (CLAUDE.md §8.1). */
export function useDraggable({ id, containerRef, onDrag, onClick }: UseDraggableArgs) {
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, moved: false });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: false };
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
      onDrag(id, Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
    };

    const handleUp = () => {
      setDragging(false);
      if (!dragRef.current.moved) onClick();
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, id, containerRef, onDrag, onClick]);

  return { dragging, handleMouseDown };
}
