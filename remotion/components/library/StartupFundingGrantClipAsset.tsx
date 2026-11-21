import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface FundingTier {
  program: string;
  stage: string;
  amount: string;
  incentive: string;
}

export interface StartupFundingGrantClipAssetProps {
  brandHandle?: string;
  topHookTitle?: string;
  countryFlag?: string;
  activeTierIndex?: number;
  tiers?: FundingTier[];
  activeSubtitleWord?: string;
  subtitlePhrase?: string;
  commentKeyword?: string;
  accentEmeraldColor?: string;
  isClipOverlay?: boolean;
}

const DEFAULT_TIERS: FundingTier[] = [
  {
    program: "START",
    stage: "Early Launch",
    amount: "Up to $1.1 Million",
    incentive: "Tranches tied to agreed product milestones",
  },
  {
    program: "GROW",
    stage: "Expansion",
    amount: "Up to $5.5 Million",
    incentive: "For established startups scaling into the GCC",
  },
  {
    program: "QFC INCENTIVE",
    stage: "0% Fees",
    amount: "100% Fee Waiver",
    incentive: "0 registration & renewal fees for first 3 years",
  },
  {
    program: "RESIDENCY",
    stage: "Fast-Track",
    amount: "Executive Visa",
    incentive: "Dedicated founder residency pathway",
  },
];

export const StartupFundingGrantClipAsset: React.FC<StartupFundingGrantClipAssetProps> = ({
  brandHandle = "@defensibleconsultancy",
  topHookTitle = "Qatar will fund your start up",
  countryFlag = "🇶🇦",
  activeTierIndex,
  tiers = DEFAULT_TIERS,
  activeSubtitleWord = "million",
  subtitlePhrase = "up to 5.5 million dollars to grow",
  commentKeyword = "DOHA",
  accentEmeraldColor = "#10B981",
  isClipOverlay = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active Tier cycle based on frame (approx 75 frames = 2.5 sec per tier)
  const computedActiveIndex =
    activeTierIndex !== undefined
      ? activeTierIndex
      : Math.floor(frame / 75) % tiers.length;

  const currentTier = tiers[computedActiveIndex] || tiers[0];

  // Springs for smooth entrance animations
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const cardEntrance = spring({
    frame: frame % 75,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const ctaEntrance = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Gentle floating oscillation for top hook card
  const hookFloatY = Math.sin(frame / 16) * 3;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "135px 36px 220px 36px", // 9:16 safe vertical area
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isClipOverlay ? "transparent" : "#0A0D14",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Floating Rounded White Hook Card ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 15,
          opacity: hookEntrance,
          transform: `translateY(${interpolate(hookEntrance, [0, 1], [-30, 0]) + hookFloatY}px)`,
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "22px",
            padding: "18px 30px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)",
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "92%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontFamily: "'Newsreader', 'Playfair Display', Georgia, serif",
                fontSize: "34px",
                fontWeight: 900,
                color: "#000000",
                margin: 0,
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
              }}
            >
              {topHookTitle}
            </h1>
            <span style={{ fontSize: "32px", lineHeight: 1 }}>{countryFlag}</span>
          </div>

          {/* Subtitle tag */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#64748B",
              textTransform: "uppercase",
              marginTop: "6px",
            }}
          >
            {brandHandle} • STARTUP QATAR PROGRAM
          </span>
        </div>
      </div>

      {/* ── MID-CHEST SECTION: Executive Funding Metric Card ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 20,
          opacity: cardEntrance,
          transform: `translateY(${interpolate(cardEntrance, [0, 1], [25, 0])}px) scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.45)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            width: "90%",
            maxWidth: "460px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Emerald Vertical Accent Bar */}
          <div
            style={{
              width: "6px",
              height: "44px",
              borderRadius: "4px",
              backgroundColor: accentEmeraldColor,
              flexShrink: 0,
              boxShadow: `0 0 12px ${accentEmeraldColor}88`,
            }}
          />

          {/* Text Stack: Giant Stat & Explanatory Subtitle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: 900,
                  color: "#0F172A",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                {currentTier.amount.includes("Million") ? currentTier.amount.split(" ")[2] : currentTier.amount}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: accentEmeraldColor,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: `${accentEmeraldColor}18`,
                }}
              >
                {currentTier.program}
              </span>
            </div>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
                marginTop: "3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTier.amount} ({currentTier.stage})
            </span>
          </div>
        </div>

        {/* Small Incentive Description Pill */}
        <div
          style={{
            marginTop: "10px",
            padding: "5px 16px",
            borderRadius: "999px",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#E2E8F0",
            }}
          >
            ✦ {currentTier.incentive}
          </span>
        </div>
      </div>

      {/* ── LOWER SECTION: Kinetic Subtitle & Comment Trigger Pill ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 25,
        }}
      >
        {/* Kinetic Word-by-Word Subtitle */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "18px",
            padding: "0 20px",
          }}
        >
          <span
            style={{
              fontSize: "44px",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.95), 0 2px 4px rgba(0, 0, 0, 0.9)",
              WebkitTextStroke: "1.5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {activeSubtitleWord}
          </span>
        </div>

        {/* Viral ManyChat Comment Trigger Badge (Generated 3,640+ comments) */}
        <div
          style={{
            opacity: ctaEntrance,
            transform: `translateY(${interpolate(ctaEntrance, [0, 1], [20, 0])}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 24px",
            borderRadius: "16px",
            background: "rgba(15, 23, 42, 0.92)",
            border: `1.5px solid ${accentEmeraldColor}66`,
            boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${accentEmeraldColor}22`,
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ fontSize: "16px" }}>💬</span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Comment{" "}
            <span
              style={{
                color: accentEmeraldColor,
                fontWeight: 900,
                textDecoration: "underline",
                letterSpacing: "0.06em",
              }}
            >
              {commentKeyword}
            </span>{" "}
            for the full application guide
          </span>
        </div>
      </div>
    </div>
  );
};
