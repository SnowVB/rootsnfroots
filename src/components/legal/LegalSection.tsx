export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-serif text-xl font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <div className="space-y-3 text-[15px] leading-[1.75] text-ink-soft">{children}</div>
    </section>
  );
}
