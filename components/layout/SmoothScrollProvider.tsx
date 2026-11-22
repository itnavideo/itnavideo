"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * PremiumSmoothScrollProvider
 * 
 * Provides buttery-smooth, physics-based inertia scrolling across the Itnavideo platform.
 * 
 * Key Features:
 * - Damped lerp (linear interpolation) physics with 60-120fps requestAnimationFrame.
 * - Touch device exemption: Preserves native 120Hz/60Hz mobile inertia.
 * - Accessibility safeguard: Respects `prefers-reduced-motion`.
 * - Inner scroll containment: Never captures scroll inside textareas, inputs,
 *   dialogs/modals, horizontal audio scrubbers/timelines, or elements marked with
 *   `.overflow-y-auto`, `[data-lenis-prevent]`, or `[data-no-smooth-scroll]`.
 * - Anchor Link gliding: Smoothly navigates to `#section` targets with 88px navbar clearance.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const rafId = useRef<number | null>(null);
  const currentY = useRef<number>(0);
  const targetY = useRef<number>(0);
  const isRunning = useRef<boolean>(false);

  useEffect(() => {
    // 1. Accessibility check
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // 2. Touch screen detection: Mobile devices already have hardware 120Hz smooth scrolling
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    // Sync initial position
    currentY.current = window.scrollY;
    targetY.current = window.scrollY;

    // 3. Helper to detect if element or its parents are inner scrollable containers
    const isScrollableContainer = (el: HTMLElement | null): boolean => {
      let current = el;
      while (current && current !== document.body && current !== document.documentElement) {
        // Explicit bypass attribute
        if (
          current.hasAttribute("data-no-smooth-scroll") ||
          current.hasAttribute("data-lenis-prevent") ||
          current.getAttribute("role") === "dialog"
        ) {
          return true;
        }

        // Form elements
        const tagName = current.tagName.toLowerCase();
        if (tagName === "textarea" || tagName === "input" || tagName === "select") {
          return true;
        }

        // Computed overflow check for nested scrollable lists/containers
        const style = window.getComputedStyle(current);
        const overflowY = style.overflowY;
        const overflowX = style.overflowX;

        // If inner container is vertically scrollable and actually has scrollable content
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          current.scrollHeight > current.clientHeight + 2
        ) {
          return true;
        }

        // If user is scrolling horizontally inside a timeline, waveform, or carousel
        if (
          (overflowX === "auto" || overflowX === "scroll") &&
          current.scrollWidth > current.clientWidth + 2
        ) {
          return true;
        }

        current = current.parentElement;
      }
      return false;
    };

    // 4. Animation loop using critically damped lerp
    const DAMPING = 0.095; // Buttery smooth response factor (0.08 - 0.10 gives luxury feel)
    const EPSILON = 0.4;   // Snap threshold in pixels

    const updateScroll = () => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      // Clamp target within scroll bounds
      targetY.current = Math.max(0, Math.min(targetY.current, maxScroll));

      const diff = targetY.current - currentY.current;

      if (Math.abs(diff) > EPSILON) {
        currentY.current += diff * DAMPING;
        window.scrollTo(0, Math.round(currentY.current));
        rafId.current = requestAnimationFrame(updateScroll);
      } else {
        currentY.current = targetY.current;
        window.scrollTo(0, Math.round(currentY.current));
        isRunning.current = false;
        rafId.current = null;
      }
    };

    const startAnimation = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        rafId.current = requestAnimationFrame(updateScroll);
      }
    };

    // 5. Wheel Event Handler (Desktop only)
    const onWheel = (e: WheelEvent) => {
      // If user is holding Ctrl (zoom) or Shift (horizontal), allow native
      if (e.ctrlKey) return;

      // Pure horizontal scroll event (e.g. trackpad swipe sideways)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Check if mouse is over an inner scroll container
      if (isScrollableContainer(e.target as HTMLElement)) {
        return;
      }

      // Synchronize currentY if external scroll occurred (e.g. user dragged scrollbar)
      if (!isRunning.current) {
        currentY.current = window.scrollY;
        targetY.current = window.scrollY;
      }

      // Prevent native abrupt notch jump
      e.preventDefault();

      // Normalize delta across browsers
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        // Line mode (Firefox)
        delta *= 36;
      } else if (e.deltaMode === 2) {
        // Page mode
        delta *= window.innerHeight;
      }

      // Accumulate target
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetY.current = Math.max(0, Math.min(targetY.current + delta, maxScroll));

      startAnimation();
    };

    // 6. Keyboard navigation (PageUp, PageDown, Space, Arrows)
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in form fields
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      let delta = 0;
      if (e.key === "ArrowDown") delta = 100;
      else if (e.key === "ArrowUp") delta = -100;
      else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) delta = window.innerHeight * 0.85;
      else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) delta = -window.innerHeight * 0.85;
      else if (e.key === "Home") delta = -targetY.current;
      else if (e.key === "End") {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        delta = maxScroll - targetY.current;
      }

      if (delta !== 0) {
        e.preventDefault();
        if (!isRunning.current) {
          currentY.current = window.scrollY;
          targetY.current = window.scrollY;
        }
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        targetY.current = Math.max(0, Math.min(targetY.current + delta, maxScroll));
        startAnimation();
      }
    };

    // 7. Synchronize if user drags native scrollbar thumb
    const onScroll = () => {
      if (!isRunning.current) {
        currentY.current = window.scrollY;
        targetY.current = window.scrollY;
      }
    };

    // 8. In-page Anchor click gliding (#pricing, #workflow, etc.)
    const onAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const elementId = href.substring(1);
        const destination = document.getElementById(elementId);
        if (destination) {
          e.preventDefault();
          const NAVBAR_HEIGHT = 88; // 5.5rem offset for sticky header
          const elemRect = destination.getBoundingClientRect();
          const targetOffset = window.scrollY + elemRect.top - NAVBAR_HEIGHT;
          const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

          currentY.current = window.scrollY;
          targetY.current = Math.max(0, Math.min(targetOffset, maxScroll));
          startAnimation();

          // Push to history without immediate jump
          window.history.pushState(null, "", href);
        }
      }
    };

    // Register desktop event listeners (touch screens keep 100% native hardware momentum)
    if (!isTouchDevice) {
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKeyDown);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onAnchorClick);

    return () => {
      if (!isTouchDevice) {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKeyDown);
      }
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onAnchorClick);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // When pathname changes (route navigation), reset scroll state cleanly
  useEffect(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
      isRunning.current = false;
    }
    currentY.current = 0;
    targetY.current = 0;
  }, [pathname]);

  return <>{children}</>;
}
