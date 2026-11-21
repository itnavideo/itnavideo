import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface SaaSFeatureBullet {
  icon: string;
  title: string;
  desc: string;
}

export interface SaaSProductPromoTeaserAssetProps {
  appName?: string;
  platformTag?: string;
  headline?: string;
  privacyBadge?: string;
  features?: SaaSFeatureBullet[];
  offerPill?: string;
  ctaText?: string;
  accentCyanColor?: string;
  accentIndigoColor?: string;
  isDark?: boolean;
}

const DEFAULT_FEATURES: SaaSFeatureBullet[] = [
  {
    icon: "🎤",
    title: "Instant Voice Dictation",
    desc: "Hold fn key and talk. Wavren types into whatever app you're in — faster than typing.",
  },
  {
    icon: "📋",
    title: "9-Slot Power Clipboard",
    desc: "Your last nine copies stay ready. ⌘⇧1 pastes latest, all the way to ⌘⇧9.",
  },
  {
    icon: "📝",
    title: "Zero-Lag Meeting Notes",
    desc: "Join any call; pop-up offers notes. Live transcript + structured action items.",
  },
];

export const SaaSProductPromoTeaserAsset: React.FC<SaaSProductPromoTeaserAssetProps> = ({
  appName = "Wavren AI",
  platformTag = "MAC APP • LOCAL ON-DEVICE AI",
  headline = "Turns Your Voice into Text & Meetings into Notes",
  privacyBadge = "🔒 100% Local Privacy • Data Never Leaves Your Mac",
  features = DEFAULT_FEATURES,
  offerPill = "EARLY-BIRD: 6 MONTHS PRO FREE",
  ctaText = "👉 Link in Bio · wavren.ai (No Card Needed)",
  accentCyanColor = "#06b6d4",
  accentIndigoColor = "#6366f1",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrances
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const headlineEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 12, stiffness: 105 },
  });

  const footerEntrance = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 11, stiffness: 100 },
  });

  // Breathing and glowing shimmer
  const pulseScale = 1 + Math.sin(frame / 20) * 0.012;

  // Theming tokens
  const bgColor = isDark ? "#090d16" : "#f8fafc";
  const cardBg = isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.95)";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const mutedText = isDark ? "#94a3b8" : "#64748b";
  const borderColor = isDark ? "rgba(6, 182, 212, 0.28)" : "rgba(6, 182, 212, 0.35)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "140px 48px 230px 48px", // 9:16 safe vertical margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bgColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Background Ambient AI Nebulae ── */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "720px",
          height: "720px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentCyanColor}22 0%, ${accentIndigoColor}18 50%, transparent 75%)`,
          filter: "blur(75px)",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP SECTION: App Pill Badge & Main Value Headline ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          zIndex: 10,
        }}
      >
        {/* Platform & App Tag Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 26px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(6, 182, 212, 0.15)" : "rgba(6, 182, 212, 0.12)",
            border: `1.5px solid ${accentCyanColor}`,
            boxShadow: `0 8px 24px ${accentCyanColor}26`,
            opacity: headerEntrance,
            transform: `translateY(${interpolate(headerEntrance, [0, 1], [-25, 0])}px)`,
          }}
        >
          <span style={{ fontSize: "18px" }}>⚡</span>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accentCyanColor,
            }}
          >
            {appName} • {platformTag}
          </span>
        </div>

        {/* Dynamic High-Converting Headline */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "960px",
            opacity: headlineEntrance,
            transform: `scale(${interpolate(headlineEntrance, [0, 1], [0.94, 1])})`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "44px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: textColor,
              textShadow: "0 4px 18px rgba(0, 0, 0, 0.8)",
            }}
          >
            {headline}
          </h1>
        </div>
      </div>

      {/* ── MIDDLE SECTION: 3 Core Features Stack ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "940px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 10,
        }}
      >
        {features.map((feat, idx) => {
          const featEntrance = spring({
            frame: Math.max(0, frame - (10 + idx * 7)),
            fps,
            config: { damping: 12, stiffness: 95 },
          });

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                padding: "20px 24px",
                borderRadius: "20px",
                backgroundColor: cardBg,
                border: `1.5px solid ${borderColor}`,
                backdropFilter: "blur(20px)",
                boxShadow: isDark
                  ? "0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.08)"
                  : "0 10px 25px rgba(0, 0, 0, 0.06)",
                opacity: featEntrance,
                transform: `translateX(${interpolate(featEntrance, [0, 1], [-25, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "14px",
                  backgroundColor: `${accentCyanColor}1f`,
                  border: `1px solid ${accentCyanColor}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    margin: 0,
                    color: textColor,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    margin: "4px 0 0 0",
                    color: mutedText,
                    lineHeight: 1.4,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* On-Device Privacy Guarantee Pill */}
        <div
          style={{
            alignSelf: "center",
            padding: "8px 20px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#10b981", fontWeight: 700 }}>
            {privacyBadge}
          </span>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Early Bird Offer & CTA Safe Zone ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "940px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          opacity: footerEntrance,
          transform: `translateY(${interpolate(footerEntrance, [0, 1], [25, 0])}px)`,
          zIndex: 10,
        }}
      >
        {/* Early-Bird Offer Pill */}
        <div
          style={{
            padding: "12px 32px",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, #06b6d4, #6366f1)",
            boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)",
            transform: `scale(${pulseScale})`,
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ffffff",
            }}
          >
            {offerPill}
          </span>
        </div>

        {/* Free Plan / Link in Bio Callout */}
        <p
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: mutedText,
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          {ctaText}
        </p>
      </div>
    </div>
  );
};
