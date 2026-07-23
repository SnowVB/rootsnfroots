// Coarse, server-side phone detection for the mobile gate (src/app/page.tsx).
// Deliberately simple regex, not a full UA-parsing library — we only need
// "is this unambiguously a phone" (catches Telegram/Threads in-app browser
// clicks), not device-farm-grade precision. Tablets are intentionally not
// matched — their viewports are closer to the range the current layout
// already tolerates.
const MOBILE_UA_PATTERN = /iphone|ipod|android.*mobile|windows phone/i;

export function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_PATTERN.test(userAgent);
}
