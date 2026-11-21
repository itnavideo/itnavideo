import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface VcFundItem {
  name: string;
  checkSize: string;
  focus: string;
}

export interface MiniMicStartupFundingAssetProps {
  topHeadlinePre?: string;
  giantFinancialStat?: string;
  topHeadlinePost?: string;
  funds?: VcFundItem[];
  bottomPillCTA?: string;
  commentTrigger?: string;
  accentNeonLimeColor?: string;
  isDark?: boolean;
}

const DEFAULT_FUNDS: VcFundItem[] = [
  { name: "TinySeed", checkSize: "$50K - $120K", focus: "Bootstrapped B2B SaaS" },
  { name: "Calm Company Fund", checkSize: "$100K - $250K", focus: "Profitable Tech / Shared Earnings" },
  { name: "Hustle Fund", checkSize: "$50K - $150K", focus: "Speed & Execution First" },
  { name: "Antler Global", checkSize: "$100K - $250K", focus: "Day-Zero / First-Time Founders" },
  { name: "Techstars Anywhere", checkSize: "$120K Checks", focus: "Global Pre-Seed Accelerator" },
];

export const MiniMicStartupFundingAsset: React.FC<MiniMicStartupFundingAssetProps> = ({
  topHeadlinePre = "5 funds writing checks up to",
  giantFinancialStat = "$250K",
  topHeadlinePost = "to founders just starting out",
  funds = DEFAULT_FUNDS,
  bottomPillCTA = "pitch them now",
  commentTrigger = "Comment FUNDS for the full list of 62 pre-seed funds 💬",
  accentNeonLimeColor = "#c6ff00",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const topEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const statEntrance = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.7 },
  });

  const cardsEntrance = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 13, stiffness: 90 },
  });

  const bottomEntrance = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Neon pulse & micro-scale
  const statPulse = 1 + Math.sin(frame / 16) * 0.025;
  const statScale = interpolate(statEntrance, [0, 1], [0.85, 1]) * statPulse;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "130px 44px 220px 44px", // 9:16 vertical safe margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Neon Lime High-Voltage Hook Headline ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: topEntrance,
          transform: `translateY(${interpolate(topEntrance, [0, 1], [-20, 0])}px)`,
        }}
      >
        {/* Pre-Header Line */}
        <span
          style={{
            fontSize: "36px",
            fontWeight: 900,
            color: "#ffffff",
            WebkitTextStroke: "2.5px #000000",
            textShadow: "0 4px 12px rgba(0, 0, 0, 0.9)",
            letterSpacing: "-0.01em",
            textTransform: "lowercase",
          }}
        >
          {topHeadlinePre}
        </span>

        {/* GIANT NEON LIME STAT ($250K) */}
        <h1
          style={{
            margin: "4px 0",
            fontSize: "110px",
            fontWeight: 900,
            lineHeight: 1,
            color: accentNeonLimeColor,
            WebkitTextStroke: "4px #000000",
            textShadow: `0 8px 30px ${accentNeonLimeColor}66, 0 4px 0 #000000`,
            letterSpacing: "-0.04em",
            transform: `scale(${statScale})`,
          }}
        >
          {giantFinancialStat}
        </h1>

        {/* Post-Header Line */}
        <span
          style={{
            fontSize: "34px",
            fontWeight: 900,
            color: "#ffffff",
            WebkitTextStroke: "2.5px #000000",
            textShadow: "0 4px 12px rgba(0, 0, 0, 0.9)",
            letterSpacing: "-0.01em",
            textTransform: "lowercase",
          }}
        >
          {topHeadlinePost}
        </span>
      </div>

      {/* ── MIDDLE SECTION: 5 Pre-Seed VC Fund Badges Carousel ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "920px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 10,
          opacity: cardsEntrance,
        }}
      >
        {funds.map((fund, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - (14 + idx * 4)),
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderRadius: "14px",
                backgroundColor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.92)",
                border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                backdropFilter: "blur(14px)",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.4)",
                opacity: itemSpring,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [-25, 0])}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px", color: accentNeonLimeColor }}>✦</span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: isDark ? "#ffffff" : "#0f172a",
                  }}
                >
                  {fund.name}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  ({fund.focus})
                </span>
              </div>

              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  backgroundColor: `${accentNeonLimeColor}22`,
                  border: `1px solid ${accentNeonLimeColor}55`,
                  fontSize: "14px",
                  fontWeight: 800,
                  color: accentNeonLimeColor,
                }}
              >
                {fund.checkSize}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM SECTION: "PITCH THEM NOW" Subtitle & ManyChat Comment Trigger ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          zIndex: 10,
          opacity: bottomEntrance,
          transform: `translateY(${interpolate(bottomEntrance, [0, 1], [25, 0])}px)`,
        }}
      >
        {/* Kinetic "pitch them now" Subtitle Pill */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: accentNeonLimeColor,
            WebkitTextStroke: "3px #000000",
            textShadow: `0 4px 16px ${accentNeonLimeColor}55, 0 2px 0 #000000`,
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
          }}
        >
          {bottomPillCTA}
        </div>

        {/* Comment Trigger CTA Capsule */}
        <div
          style={{
            padding: "10px 24px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(2, 6, 23, 0.85)" : "rgba(241, 245, 249, 0.9)",
            border: `1.5px solid ${accentNeonLimeColor}55`,
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.4)`,
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: isDark ? "#f8fafc" : "#0f172a",
              letterSpacing: "0.02em",
            }}
          >
            {commentTrigger}
          </span>
        </div>
      </div>
    </div>
  );
};
