"use client";

import { createPortal } from "react-dom";

// Renders children directly into document.body, outside the tree scene's DOM
// subtree entirely — sidesteps ancestor backdrop-filter/stacking-context bugs
// (see CLAUDE.md L13) instead of fighting them with z-index/isolation.
export function Portal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}
