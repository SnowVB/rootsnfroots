"use client";

export function FruitMenuItem({
  onClick,
  children,
  danger,
  accent,
}: {
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${
        danger
          ? "text-[#C43B3B] hover:bg-[#dc5050]/[0.06]"
          : accent
            ? "font-semibold text-coral-dark hover:bg-coral-dark/[0.08]"
            : "font-medium text-ink hover:bg-black/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}
