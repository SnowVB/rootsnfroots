import { headers } from "next/headers";
import { TreeApp } from "@/components/tree/TreeApp";
import { MobileGate } from "@/components/MobileGate";
import { createClient } from "@/lib/supabase/server";
import { isMobileUserAgent } from "@/lib/isMobileUserAgent";

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
