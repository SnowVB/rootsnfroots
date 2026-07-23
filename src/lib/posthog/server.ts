import { PostHog } from "posthog-node";

let client: PostHog | null = null;

// Same project API key as the client (src/lib/posthog/PostHogProvider.tsx) —
// it's a write-only ingest key, not the sensitive Personal API Key (see
// CLAUDE.md §19), so reusing it server-side needs no new secret.
function getClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      // Serverless functions can end before posthog-node's default batching
      // interval fires — flush every event immediately instead of risking
      // losing it when the function terminates.
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

export async function reportServerError(error: unknown, context: string) {
  console.error(context, error);
  const ph = getClient();
  if (!ph) return;
  // Awaited, not fire-and-forget: a Vercel function can terminate right
  // after the response is sent, before a background flush would run.
  await ph.captureExceptionImmediate(error, "server", { context });
}
