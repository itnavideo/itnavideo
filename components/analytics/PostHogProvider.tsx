"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useAuth } from "@/components/auth/AuthContext";

let isPostHogInitialized = false;

export function getPostHogClient() {
  if (typeof window === "undefined") return null;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  if (!isPostHogInitialized) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // Handled explicitly on App Router route changes
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: true,
      },
    });
    isPostHogInitialized = true;

    // Capture unhandled browser errors & promise rejections into PostHog Error Tracking
    window.addEventListener("error", (event) => {
      try {
        posthog.captureException(event.error || new Error(event.message || "Unhandled error"), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      } catch {
        // Non-blocking
      }
    });

    window.addEventListener("unhandledrejection", (event) => {
      try {
        posthog.captureException(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason || "Unhandled promise rejection")),
          { type: "unhandledrejection" }
        );
      } catch {
        // Non-blocking
      }
    });
  }
  return posthog;
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  const client = getPostHogClient();
  if (!client) return;
  try {
    client.capture(eventName, properties);
  } catch {
    // Non-blocking analytics
  }
}

function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Initialize & track route changes
  useEffect(() => {
    const client = getPostHogClient();
    if (!client || !pathname) return;

    const search = searchParams?.toString();
    const url = search ? `${window.location.origin}${pathname}?${search}` : `${window.location.origin}${pathname}`;
    client.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  // Identify logged-in user (and reset on logout)
  useEffect(() => {
    const client = getPostHogClient();
    if (!client) return;

    if (user && user.id && user.id !== "dev-user-001") {
      client.identify(user.id, {
        email: user.email || undefined,
        name: user.displayName || undefined,
        role: user.role || undefined,
      });
    } else if (!user) {
      client.reset();
    }
  }, [user]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getPostHogClient();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      {children}
    </>
  );
}

