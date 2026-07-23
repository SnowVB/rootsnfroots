import { headers } from "next/headers";
import { TreeApp } from "@/components/tree/TreeApp";
import { MobileGate } from "@/components/MobileGate";
import { createClient } from "@/lib/supabase/server";
import { isMobileUserAgent } from "@/lib/isMobileUserAgent";

// Without this, Next's cache-components/PPR heuristics were prerendering
// the TreeApp branch as a static shell at build time and serving it
// regardless of the runtime User-Agent check — headers() alone wasn't
// enough to force full per-request dynamic rendering once a heavy client
// component subtree was one of the branches. Confirmed by isolating the
// same conditional with plain <div> branches (worked) vs with the real
// <TreeApp>/<MobileGate> components (didn't, until this was added).
export const dynamic = "force-dynamic";

export default async function Home() {
  const userAgent = (await headers()).get("user-agent");
  if (isMobileUserAgent(userAgent)) {
    return <MobileGate />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <TreeApp userId={user?.id ?? null} userEmail={user?.email ?? null} />;
}
