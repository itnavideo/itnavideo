import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface SaasFeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface OrganicSaaSPromoCardAssetProps {
  brandHandle?: string;
  brandBadge?: string;
  hookLine1?: string;
  hookLine2?: string;
  beforeHeadline?: string;
  features?: SaasFeatureItem[];
  ctaText?: string;
  pastelPinkColor?: string;
  isOverlayMode?: boolean;
}

const DEFAULT_FEATURES: SaasFeatureItem[] = [
  {
    icon: "📝",
    title: "Unlimited Meeting Notes",
    desc: "Auto-joins or transcribes audio with instant structured summaries",
  },
  {
    icon: "🧠",
    title: "Deeper Contextual Memory",
    desc: "Remembers past client calls, projects, and deadlines automatically",
  },
  {
    icon: "⚡",
    title: "Always Caught Up",
    desc: "Instant catch-up briefs before every call so you never prep unprepared",
  },
];

export const OrganicSaaSPromoCardAsset: React.FC<OrganicSaaSPromoCardAssetProps> = ({
  brandHandle = "@littlebird.ai",
  brandBadge = "AI EXECUTIVE ASSISTANT",
  hookLine1 = "I used to spend",
  hookLine2 = "every Sunday",
  beforeHeadline = "Manually organizing meeting notes & weekly client follow-ups...",
  features = DEFAULT_FEATURES,
  ctaText = "Get an assistant that actually works ✦ littlebird.ai",
  pastelPinkColor = "#FBCFE8",
  isOverlayMode = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const cardEntrance = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  const ctaEntrance = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  // Soft breathing animation for pastel card
  const cardFloatY = Math.sin(frame / 14) * 2;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "135px 36px 220px 36px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isOverlayMode ? "transparent" : "#FAF8F5",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Creator Brand Pill & Signature Pink Pastel Hook Card ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 15,
          opacity: hookEntrance,
          transform: `translateY(${interpolate(hookEntrance, [0, 1], [-25, 0]) + cardFloatY}px)`,
        }}
      >
        {/* Creator Brand Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
            marginBottom: "16px",
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#9D174D",
              textTransform: "uppercase",
            }}
          >
            {brandBadge}
          </span>
          <span style={{ color: "#CBD5E1" }}>•</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#475569",
            }}
          >
            {brandHandle}
          </span>
        </div>

        {/* Signature Pastel Pink Serif Subtitle Card */}
        <div
          style={{
            background: pastelPinkColor,
            borderRadius: "14px",
            padding: "16px 28px",
            boxShadow: "0 14px 30px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "92%",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif",
              fontSize: "32px",
              fontWeight: 800,
              color: "#18181B",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {hookLine1}
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif",
              fontSize: "36px",
              fontWeight: 900,
              color: "#000000",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {hookLine2}
          </span>
        </div>
      </div>

      {/* ── CENTER SECTION: Transformation & Feature Highlights Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          zIndex: 20,
          opacity: cardEntrance,
          transform: `translateY(${interpolate(cardEntrance, [0, 1], [30, 0])}px) scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Top Transformation Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
              paddingBottom: "12px",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: "6px",
                background: "#FCE7F3",
                color: "#BE185D",
              }}
            >
              UPGRADE TO PLUS
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              Solopreneur Workflow
            </span>
          </div>

          {/* Feature List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {features.map((feat, fIdx) => (
              <div
                key={fIdx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                    flexShrink: 0,
                  }}
                >
                  {feat.icon}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#0F172A",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {feat.title}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#64748B",
                      lineHeight: 1.35,
                      marginTop: "2px",
                    }}
                  >
                    {feat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Soft Pink High-Conversion CTA Banner ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 25,
          opacity: ctaEntrance,
          transform: `translateY(${interpolate(ctaEntrance, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 26px",
            borderRadius: "16px",
            background: "#0F172A",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}
          >
            {ctaText}
          </span>
        </div>
      </div>
    </div>
  );
};
