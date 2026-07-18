"use client";

interface AddButtonProps {
  bg: string;
  label: string;
  count: number;
  limit?: number;
  harvestedCount?: number;
  onClick: () => void;
}

export function AddButton({ bg, label, count, limit, harvestedCount = 0, onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl border border-transparent bg-[#FAF6EC] px-3.5 py-3 text-left text-[13px] font-medium text-ink transition-all hover:-translate-y-px hover:border-line hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
    >
      <span
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-base font-semibold text-white"
        style={{ background: bg }}
      >
        +
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-[11px] font-medium text-ink-muted tabular-nums">
        {harvestedCount > 0 && (
          <span className="font-semibold text-[#5B8C4A]">✓{harvestedCount} · </span>
        )}
        {count}
        {limit ? `/${limit}` : ""}
      </span>
    </button>
  );
}
