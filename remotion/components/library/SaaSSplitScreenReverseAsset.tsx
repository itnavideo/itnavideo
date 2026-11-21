import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface SaaSSplitScreenReverseAssetProps {
  topSourceTag?: string;
  topSliderProgress?: number;
  centerBannerLine1?: string;
  centerBannerLine2?: string;
  centerHighlightWord?: string;
  subPillBadge?: string;
  cardTitle?: string;
  cardIssuer?: string;
  commentTriggerCTA?: string;
  isDark?: boolean;
}

export const SaaSSplitScreenReverseAsset: React.FC<SaaSSplitScreenReverseAssetProps> = ({
  topSourceTag = "STRIPE.COM ORIGINAL",
  topSliderProgress = 0.65,
  centerBannerLine1 = "REVERSE ENGINEER",
  centerBannerLine2 = "ANY ANIMATION",
  centerHighlightWord = "ANIMATION",
  subPillBadge = "CLAUDE SKILL",
  cardTitle = "Create a card issuing program",
  cardIssuer = "VISA",
  commentTriggerCTA = "Comment “Animate” for the link 💬",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const topEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const bannerEntrance = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  const cardEntrance = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  // Card continuous floating 3D tilt & gradient shimmer
  const floatY = Math.sin(frame / 18) * 8;
  const rotateZ = Math.sin(frame / 24) * 1.5;
  const shimmerShift = (frame * 2.5) % 360;

  // Scrubber animation
  const animatedProgress = interpolate(
    Math.sin(frame / 30),
    [-1, 1],
    [0.3, 0.85]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP 50% STAGE (1080x960): Companion UI / Animation Showcase ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "960px",
          backgroundColor: isDark ? "#0f1117" : "#ffffff",
          backgroundImage: isDark
            ? "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)"
            : "radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "54px 44px 30px 44px",
          boxSizing: "border-box",
          zIndex: 5,
        }}
      >
        {/* Top Header Bar: Source Tag + Scrubber Slider */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: topEntrance,
            transform: `translateY(${interpolate(topEntrance, [0, 1], [-20, 0])}px)`,
          }}
        >
          {/* Source Tag (e.g. ▶ STRIPE.COM ORIGINAL) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "19px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDark ? "#f8fafc" : "#0f172a",
            }}
          >
            <span style={{ fontSize: "16px", color: isDark ? "#60a5fa" : "#2563eb" }}>▶</span>
            <span>{topSourceTag}</span>
          </div>

          {/* Minimalist Scrubber Slider */}
          <div
            style={{
              width: "280px",
              height: "4px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.15)",
              borderRadius: "2px",
              position: "relative",
            }}
          >
            {/* Active progress */}
            <div
              style={{
                width: `${animatedProgress * 100}%`,
                height: "100%",
                backgroundColor: isDark ? "#ffffff" : "#0f172a",
                borderRadius: "2px",
              }}
            />
            {/* Scrubber Ball */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${animatedProgress * 100}%`,
                transform: "translate(-50%, -50%)",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: isDark ? "#ffffff" : "#0f172a",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>

        {/* Floating SaaS Card Showcase (e.g. Stripe Card Issuing) */}
        <div
          style={{
            width: "360px",
            height: "560px",
            borderRadius: "24px",
            backgroundColor: isDark ? "#1e2230" : "#ffffff",
            border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
            boxShadow: isDark
              ? "0 30px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(96, 165, 250, 0.1)"
              : "0 25px 60px rgba(0, 0, 0, 0.12)",
            padding: "32px 28px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `translateY(${floatY}px) rotate(${rotateZ}deg) scale(${interpolate(cardEntrance, [0, 1], [0.85, 1])})`,
            opacity: cardEntrance,
          }}
        >
          {/* Card Top Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: isDark ? "#cbd5e1" : "#475569",
                lineHeight: 1.3,
                maxWidth: "200px",
              }}
            >
              {cardTitle}
            </span>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "14px",
              }}
            >
              ✦
            </div>
          </div>

          {/* Central Holographic Credit Card Graphic */}
          <div
            style={{
              width: "100%",
              height: "360px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #fce7f3 0%, #e9d5ff 35%, #fed7aa 70%, #dbeafe 100%)",
              position: "relative",
              overflow: "hidden",
              padding: "24px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 14px 34px rgba(168, 85, 247, 0.2)",
            }}
          >
            {/* Shimmering gloss sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-50%",
                width: "200%",
                height: "100%",
                background: `linear-gradient(${shimmerShift}deg, transparent 40%, rgba(255, 255, 255, 0.45) 50%, transparent 60%)`,
                pointerEvents: "none",
              }}
            />
            {/* Golden Chip */}
            <div
              style={{
                width: "44px",
                height: "34px",
                borderRadius: "6px",
                backgroundColor: "#fbbf24",
                border: "1px solid #d97706",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
            {/* Visa Brand Logo */}
            <div
              style={{
                alignSelf: "flex-end",
                fontSize: "26px",
                fontWeight: 900,
                fontStyle: "italic",
                color: "#1e3a8a",
                letterSpacing: "0.04em",
              }}
            >
              {cardIssuer}
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTER DIVIDER ZONE (Height: 160px): High-Contrast Title Banner ── */}
      <div
        style={{
          position: "absolute",
          top: "920px", // Centered directly across the 960px boundary
          left: 0,
          width: "100%",
          height: "160px",
          backgroundColor: "#18181b",
          borderTop: "3px solid #27272a",
          borderBottom: "3px solid #27272a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8)",
          zIndex: 20,
          opacity: bannerEntrance,
          transform: `scale(${interpolate(bannerEntrance, [0, 1], [0.95, 1])})`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "44px",
            fontWeight: 900,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          {centerBannerLine1} <br />
          {centerBannerLine2.replace(centerHighlightWord, "")}
          <span style={{ color: "#a1a1aa" }}>{centerHighlightWord}</span>
        </h1>

        {/* Feature Sub-Pill (e.g. CLAUDE SKILL) */}
        <div
          style={{
            position: "absolute",
            bottom: "-18px",
            padding: "6px 20px",
            borderRadius: "6px",
            backgroundColor: "#09090b",
            border: "1.5px solid #3f3f46",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.6)",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            {subPillBadge}
          </span>
        </div>
      </div>

      {/* ── BOTTOM 50% STAGE (1080x960): Presenter Talking-Head Space ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "960px",
          backgroundColor: isDark ? "#090a0f" : "#f1f5f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "220px", // Clears Instagram Reels actions
          boxSizing: "border-box",
          zIndex: 5,
        }}
      >
        {/* Comment Trigger CTA Bubble */}
        <div
          style={{
            padding: "12px 26px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
            border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.14)"}`,
            backdropFilter: "blur(14px)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: isDark ? "#f8fafc" : "#0f172a",
            }}
          >
            {commentTriggerCTA}
          </span>
        </div>
      </div>
    </div>
  );
};
