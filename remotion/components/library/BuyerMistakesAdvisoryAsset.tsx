import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface BuyerTrapItem {
  number: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface BuyerMistakesAdvisoryAssetProps {
  countNumber?: string;
  topWord?: string;
  scriptWord?: string;
  topicEyebrow?: string;
  nicheTag?: string;
  traps?: BuyerTrapItem[];
  agentName?: string;
  agentTitle?: string;
  dmTriggerWord?: string;
  activeTrapIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_TRAPS: BuyerTrapItem[] = [
  {
    number: "01",
    title: "Shopping Before Full Pre-Approval",
    subtitle: "Falling in love with a home before having a verified rate-hold and stress-tested lender approval.",
    icon: "🏦",
  },
  {
    number: "02",
    title: "Underestimating Hidden Closing Costs",
    subtitle: "Forgetting legal fees, property transfer taxes, inspections, and moving costs (2-4% buffer needed).",
    icon: "💸",
  },
  {
    number: "03",
    title: "Skipping a Protective Offer Strategy",
    subtitle: "Writing unguided offers without comparative market analysis or essential financing & inspection conditions.",
    icon: "🛡️",
  },
];

export const BuyerMistakesAdvisoryAsset: React.FC<BuyerMistakesAdvisoryAssetProps> = ({
  countNumber = "3",
  topWord = "these",
  scriptWord = "mistakes",
  topicEyebrow = "FIRST-TIME BUYER ADVISORY",
  nicheTag = "CALGARY REAL ESTATE",
  traps = DEFAULT_TRAPS,
  agentName = "Kelynn McManus",
  agentTitle = "RE/MAX Key Calgary • Buyer Strategist",
  dmTriggerWord = "FIRST",
  activeTrapIndex = -1,
  autoCycleFrames = 75,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active trap index calculation
  const calculatedIndex =
    activeTrapIndex >= 0 && activeTrapIndex < traps.length
      ? activeTrapIndex
      : Math.floor((frame / autoCycleFrames) % traps.length);

  const activeTrap = traps[calculatedIndex] || traps[0];

  // Springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const headerEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 105 },
  });

  const cardEntrance = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const lowerThirdEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const ctaEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Breathing pulse on the hook
  const pulseScale = interpolate(
    Math.sin((frame / 22) * Math.PI * 2),
    [-1, 1],
    [0.985, 1.015]
  );

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "transparent",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* TOP TOPIC CAPSULE */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: 24,
            padding: "16px 26px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                {topicEyebrow}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {nicheTag}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.18)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#FCA5A5",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Costly Traps
          </div>
        </div>
      </div>

      {/* SIGNATURE DUAL-SCRIPT NUMBER HOOK (Reel @kelynnmcmanusrealtoryyc) */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          opacity: hookEntrance,
          transform: `scale(${hookEntrance * pulseScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            filter: "drop-shadow(0 6px 25px rgba(0, 0, 0, 0.85))",
          }}
        >
          {/* Giant Number 3 */}
          <div
            style={{
              fontSize: 130,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 0.85,
              fontFamily: "Georgia, 'Times New Roman', serif",
              textShadow: "0 8px 30px rgba(0, 0, 0, 0.9)",
            }}
          >
            {countNumber}
          </div>

          {/* Stacked "these" + cursive "mistakes" */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#F8FAFC",
                letterSpacing: 1.5,
                lineHeight: 1,
                textTransform: "lowercase",
              }}
            >
              {topWord}
            </div>
            <div
              style={{
                fontSize: 68,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                color: "#FFFFFF",
                lineHeight: 1.05,
                marginTop: -4,
                letterSpacing: 1,
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
              }}
            >
              {scriptWord}
            </div>
          </div>
        </div>
      </div>

      {/* MID-SCREEN WARNING TRAP CARD */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: cardEntrance,
          transform: `scale(${cardEntrance})`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(24px)",
            borderRadius: 28,
            border: "2px solid rgba(239, 68, 68, 0.55)",
            padding: "30px 36px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.2)",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: "0 6px 18px rgba(239, 68, 68, 0.4)",
                  flexShrink: 0,
                }}
              >
                {activeTrap.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#FCA5A5",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  BUYER MISTAKE {activeTrap.number} • {calculatedIndex + 1}/
                  {traps.length}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 0.5,
                  }}
                >
                  {activeTrap.title}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#E2E8F0",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              0{calculatedIndex + 1}
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.45,
              color: "#E2E8F0",
              fontWeight: 500,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: 16,
            }}
          >
            {activeTrap.subtitle}
          </div>
        </div>
      </div>

      {/* AGENT FOOTPRINT LOWER-THIRD */}
      <div
        style={{
          position: "absolute",
          bottom: 230,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: lowerThirdEntrance,
          transform: `translateY(${interpolate(lowerThirdEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.86)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 20,
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              KM
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                {agentName}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#94A3B8",
                  fontWeight: 600,
                }}
              >
                {agentTitle}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              color: "#93C5FD",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            Buyer Strategy
          </div>
        </div>
      </div>

      {/* BOTTOM DM KEYWORD FUNNEL BANNER */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          zIndex: 10,
          opacity: ctaEntrance,
          transform: `translateY(${interpolate(ctaEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "1.5px solid rgba(239, 68, 68, 0.45)",
            borderRadius: 20,
            padding: "16px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.55)",
          }}
        >
          <span style={{ fontSize: 22 }}>💬</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: 0.5,
            }}
          >
            Message{" "}
            <span
              style={{
                color: "#EF4444",
                background: "rgba(239, 68, 68, 0.18)",
                padding: "4px 12px",
                borderRadius: 8,
                border: "1px solid rgba(239, 68, 68, 0.4)",
                fontWeight: 900,
                letterSpacing: 1,
              }}
            >
              {dmTriggerWord}
            </span>{" "}
            for the First-Time Buyer Roadmap
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
