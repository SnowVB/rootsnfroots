"use client";

import { capture } from "@/lib/posthog/capture";

export function CoachLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => capture("coach_link_clicked")}
    >
      {children}
    </a>
  );
}
