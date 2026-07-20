import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT_TEXT } from "@/lib/tree/copy";
import { CoachLink } from "./CoachLink";
import { PageViewTracker } from "./PageViewTracker";

export const metadata: Metadata = {
  title: "О подходе — Дерево Опоры",
  description: ABOUT_TEXT.tagline,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-serif text-2xl font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <div className="space-y-3.5 text-[15px] leading-[1.75] text-ink-soft">{children}</div>
    </section>
  );
}

function ResearchCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="mb-3 flex gap-4 rounded-xl border border-line bg-white p-[18px_20px]">
      <div className="min-w-6 font-serif text-2xl leading-none font-medium text-ink-muted">
        {num}
      </div>
      <div>
        <h4 className="mb-1.5 text-sm font-semibold text-ink">{title}</h4>
        <p className="text-[13px] leading-[1.6] text-ink-soft">{body}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-full bg-cream">
      <PageViewTracker />
      <div className="sticky top-0 z-10 border-b border-line bg-[rgba(253,251,247,0.92)] p-[16px_32px] backdrop-blur-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-ink-soft transition-colors hover:bg-black/[0.04]"
        >
          {ABOUT_TEXT.backLink}
        </Link>
      </div>

      <article className="mx-auto max-w-[680px] p-[48px_32px_80px]">
        <p className="mb-2 font-serif text-sm text-ink-muted italic">{ABOUT_TEXT.tagline}</p>
        <h1 className="mb-10 font-serif text-[44px] leading-[1.1] font-medium tracking-[-0.02em] text-ink">
          {ABOUT_TEXT.title}
        </h1>

        <Section title={ABOUT_TEXT.why.title}>
          <p>{ABOUT_TEXT.why.p1}</p>
          <p>
            {ABOUT_TEXT.why.p2Before}
            <em>{ABOUT_TEXT.why.p2Emphasis}</em>
            {ABOUT_TEXT.why.p2After}
          </p>
        </Section>

        <Section title={ABOUT_TEXT.structure.title}>
          <p className="my-2 rounded-xl border-l-2 border-terracotta bg-terracotta/[0.08] p-[16px_20px] font-serif text-[17px] leading-normal text-ink-soft italic">
            {ABOUT_TEXT.structure.highlight}
          </p>
          {ABOUT_TEXT.structure.parts.map((part) => (
            <p key={part.lead}>
              <strong>{part.lead}</strong> {part.text}
            </p>
          ))}
        </Section>

        <Section title={ABOUT_TEXT.research.title}>
          {ABOUT_TEXT.research.cards.map((card) => (
            <ResearchCard key={card.num} {...card} />
          ))}
        </Section>

        <Section title={ABOUT_TEXT.alive.title}>
          {ABOUT_TEXT.alive.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Section>

        <Section title={ABOUT_TEXT.deeper.title}>
          <ul className="list-none p-0">
            {ABOUT_TEXT.deeper.items.map((item) => (
              <li
                key={item.topic}
                className="flex gap-5 border-b border-line-soft py-3.5 last:border-b-0"
              >
                <span className="min-w-[160px] text-sm font-medium text-ink">{item.topic}</span>
                <span className="text-sm text-ink-soft">{item.ref}</span>
              </li>
            ))}
          </ul>
        </Section>

        <section className="mt-14 rounded-2xl border-l-2 border-terracotta bg-terracotta/[0.06] p-[32px_28px]">
          <div className="mb-5 text-[11px] font-semibold tracking-[0.08em] text-terracotta-dark uppercase">
            {ABOUT_TEXT.author.label}
          </div>
          <div className="space-y-4 text-[15px] leading-[1.75] text-ink-soft">
            {ABOUT_TEXT.author.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              {ABOUT_TEXT.author.contactBefore}
              <CoachLink
                href={ABOUT_TEXT.author.contactUrl}
                className="border-b border-terracotta-dark/30 font-semibold text-terracotta-dark"
              >
                {ABOUT_TEXT.author.contactHandle}
              </CoachLink>
            </p>
            <p className="mt-6 text-right font-serif text-[15px] text-ink-muted italic">
              {ABOUT_TEXT.author.signature}
            </p>
          </div>
        </section>

        <div className="mt-[60px] rounded-2xl border border-line bg-white p-6 text-center">
          <p className="mb-3 text-[13px] text-ink-muted">{ABOUT_TEXT.backToTree.prompt}</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-ink px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
          >
            {ABOUT_TEXT.backToTree.button}
          </Link>
        </div>
      </article>
    </div>
  );
}
