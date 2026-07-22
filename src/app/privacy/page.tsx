import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY_TEXT } from "@/lib/tree/copy";
import { LegalSection } from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Дерево Опоры",
  description: PRIVACY_TEXT.tagline,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-cream">
      <div className="sticky top-0 z-10 border-b border-line bg-[rgba(253,251,247,0.92)] p-[16px_32px] backdrop-blur-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-ink-soft transition-colors hover:bg-black/[0.04]"
        >
          {PRIVACY_TEXT.backLink}
        </Link>
      </div>

      <article className="mx-auto max-w-[680px] p-[48px_32px_80px]">
        <p className="mb-2 font-serif text-sm text-ink-muted italic">{PRIVACY_TEXT.tagline}</p>
        <h1 className="mb-2 font-serif text-[36px] leading-[1.15] font-medium tracking-[-0.02em] text-ink">
          {PRIVACY_TEXT.title}
        </h1>
        <p className="mb-8 text-xs text-ink-muted">{PRIVACY_TEXT.lastUpdated}</p>
        <p className="mb-10 text-[15px] leading-[1.75] text-ink-soft">{PRIVACY_TEXT.intro}</p>

        {PRIVACY_TEXT.sections.map((section) => (
          <LegalSection key={section.title} title={section.title}>
            {section.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </LegalSection>
        ))}

        <section className="mt-12 rounded-xl border border-line bg-white p-[20px_22px]">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
            {PRIVACY_TEXT.contact.label}
          </div>
          <p className="text-sm text-ink-soft">
            {PRIVACY_TEXT.contact.before}
            <a
              href={PRIVACY_TEXT.contact.url}
              className="border-b border-accent/40 font-medium text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {PRIVACY_TEXT.contact.handle}
            </a>
          </p>
        </section>

        <div className="mt-[52px] rounded-2xl border border-line bg-white p-6 text-center">
          <p className="mb-3 text-[13px] text-ink-muted">{PRIVACY_TEXT.backToTree.prompt}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-ink px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
          >
            {PRIVACY_TEXT.backToTree.button}
          </Link>
        </div>
      </article>
    </div>
  );
}
