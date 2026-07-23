import { headers } from "next/headers";
import { isMobileUserAgent } from "@/lib/isMobileUserAgent";

export default async function Home() {
  const userAgent = (await headers()).get("user-agent");
  const mobile = isMobileUserAgent(userAgent);
  // TEMPORARY — isolating the gate mismatch: same conditional, no imports.
  if (mobile) {
    return <div>MOBILE_BRANCH</div>;
  }
  return <div>DESKTOP_BRANCH</div>;
}
