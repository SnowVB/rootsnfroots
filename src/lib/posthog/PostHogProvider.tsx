"use client";

import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { capture } from "./capture";

let initialized = false;

function initPostHog() {
  if (initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // No project created yet — stay silent rather than error.
  initialized = true;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    // Only creates a full person profile once someone is identified (post
    // sign-in) — anonymous browsing stays on the cheaper event-only tier.
    person_profiles: "identified_only",
    capture_pageview: false, // captured manually below — App Router has no router-level page-change event to hook automatically.
    // We only want the events we deliberately name in src/lib/posthog/capture.ts
    // calls (CLAUDE.md §12) — not generic "clicked button with text ..." /
    // "changed input" noise mixed in alongside them.
    autocapture: false,
    capture_pageleave: false,
    capture_performance: false, // no $web_vitals events
    // Tree content is deeply personal (CLAUDE.md product principle #1) —
    // session replay would screen-record it. Pinned off in code rather than
    // left to a dashboard toggle that could get flipped on by accident.
    disable_session_recording: true,
  });
}

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    let url = `${window.origin}${pathname}`;
    const query = searchParams.toString();
    if (query) url += `?${query}`;
    capture("$pageview", { $current_url: url });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchParams is a URLSearchParams; its .toString() is what actually matters, not identity
  }, [pathname, searchParams.toString()]);

  return null;
}

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PHProvider>
  );
}
