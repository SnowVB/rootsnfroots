"use client";

export function DeleteBtn({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className="absolute -top-[7px] -right-[7px] z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#e05050] text-[11px] leading-none font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#d93838]"
      aria-label="Удалить"
    >
      ×
    </button>
  );
}
