"use client";

import { useEffect } from "react";
import { capture } from "@/lib/posthog/capture";

// The rest of this route is a static Server Component — this is the one
// small client island needed to fire an event on page load.
export function PageViewTracker() {
  useEffect(() => {
    capture("about_page_opened");
  }, []);
  return null;
}
