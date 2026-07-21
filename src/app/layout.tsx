import type { Metadata } from "next";
import { Manrope, Literata } from "next/font/google";
import { PostHogProviderWrapper } from "@/lib/posthog/PostHogProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

// Serif brand/heading font. Fraunces (CLAUDE.md §6's original pick) has no
// Cyrillic glyphs on Google Fonts — Literata is the closest-character serif
// that does (warm, humanist book serif, real italics). See Decision Log D24.
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://rootsnfroots.com";
const DESCRIPTION = "Опора — не ресурс, а ресурс — не цель";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Дерево Опоры",
  description: DESCRIPTION,
  openGraph: {
    title: "Дерево Опоры",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Дерево Опоры",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Дерево Опоры",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${literata.variable} h-full`}>
      <body className="h-full font-sans text-ink antialiased select-none">
        <PostHogProviderWrapper>{children}</PostHogProviderWrapper>
      </body>
    </html>
  );
}
