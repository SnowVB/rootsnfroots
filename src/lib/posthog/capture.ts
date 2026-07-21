import posthog from "posthog-js";

// Single chokepoint for firing events (CLAUDE.md §12 event names). A no-op
// when NEXT_PUBLIC_POSTHOG_KEY isn't set (e.g. local dev before the founder
// creates a PostHog project) — posthog-js queues/no-ops calls made before
// init() runs, so this is safe to call unconditionally from anywhere.
export function capture(event: string, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}

// For errors we already catch (e.g. a failed Supabase write) — these never
// hit posthog's autocaptureExceptions since that only sees uncaught errors.
// Client-side only: this covers browser code, not Server Actions/middleware.
export function reportError(error: unknown, context: string) {
  console.error(context, error);
  posthog.captureException(error, { context });
}
