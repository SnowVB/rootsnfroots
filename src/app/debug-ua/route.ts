import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isMobileUserAgent } from "@/lib/isMobileUserAgent";

// TEMPORARY debug route — remove after diagnosing the mobile-gate issue.
export async function GET() {
  const ua = (await headers()).get("user-agent");
  return NextResponse.json({ userAgent: ua, isMobile: isMobileUserAgent(ua) });
}
