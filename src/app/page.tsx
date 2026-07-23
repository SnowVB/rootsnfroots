import { headers } from "next/headers";
import { isMobileUserAgent } from "@/lib/isMobileUserAgent";

export default async function Home() {
  const userAgent = (await headers()).get("user-agent");
  const mobile = isMobileUserAgent(userAgent);
  // TEMPORARY — remove once the gate mismatch is diagnosed.
  return <pre>{JSON.stringify({ userAgent, mobile }, null, 2)}</pre>;
}
