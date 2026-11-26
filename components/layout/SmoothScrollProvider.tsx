"use client";

import React, { useEffect } from "react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * SmoothScrollProvider
 * Uses native hardware-accelerated compositor scrolling for zero-lag wheel/trackpad
 * responsiveness, and handles smooth anchor-link navigation with navbar offset.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;
      const dest = document.getElementById(href.slice(1));
      if (!dest) return;
      e.preventDefault();
      const top = dest.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    document.addEventListener("click", onAnchorClick);
    return () => document.removeEventListener("click", onAnchorClick);
  }, []);

  return <>{children}</>;
}
