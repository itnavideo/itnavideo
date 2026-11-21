import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ConcessionItem {
  number: string;
  tag: string;
  title: string;
  desc: string;
  icon: string;
}

export interface BuyerConcessionsPlaybookAssetProps {
  hookLine1Prefix?: string;
  hookHeroWord?: string;
  amountSaved?: string;
  hookTrailingLine?: string;
  topicEyebrow?: string;
  concessions?: ConcessionItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  ctaText?: string;
  activeConcessionIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_CONCESSIONS: ConcessionItem[] = [
  {
    number: "01",
    tag: "CASH SAVINGS",
    title: "Seller-Paid Closing Costs",
    desc: "Walk in with less cash out of pocket. Negotiate 100% seller-covered closing costs and title fees.",
    icon: "💵",
  },
  {
    number: "02",
    tag: "MONTHLY PAYMENT",
    title: "Temporary or Permanent Rate Buydowns",
    desc: "Seller funds points to lower your interest rate for 1-2 years or the life of the mortgage.",
    icon: "📉",
  },
  {
    number: "03",
    tag: "INSPECTION REPAIRS",
    title: "Repair Credits & In-Lieu Cash",
    desc: "Never accept a home as-is. Demand direct closing credits or licensed contractor repairs.",
    icon: "🛠️",
  },
  {
    number: "04",
    tag: "YEAR 1 PROTECTION",
    title: "Seller-Paid 1-Year Home Warranty",
    desc: "Full warranty coverage on HVAC, water heater, and major kitchen appliances at zero cost to you.",
    icon: "🛡️",
  },
  {
    number: "05",
    tag: "FREE ASSETS",
    title: "Appliances & Patio Furniture",
    desc: "Writing high-end washer, dryer, refrigerator, and outdoor sets directly into the purchase contract.",
    icon: "🧺",
  },
  {
    number: "06",
    tag: "TIMELINE LEVERAGE",
    title: "Strategic Closing Dates",
    desc: "Timing the close to eliminate prepaid interest and avoid stressful double-rent overlaps.",
    icon: "📅",
  },
];

export const BuyerConcessionsPlaybookAsset: React.FC<BuyerConcessionsPlaybookAssetProps> = ({
  hookLine1Prefix = "My",
  hookHeroWord = "buyer",
  amountSaved = "45K",
  hookTrailingLine = "paid under",
  topicEyebrow = "THINGS YOUR AGENT SHOULD BE NEGOTIATING",
  concessions = DEFAULT_CONCESSIONS,
  agentName = "Rae'lynn Wetzel Hibbert",
  agentTitle = "Utah Luxury & Residential REALTOR®",
  agentPhone = "385-487-6763",
  ctaText = "Never Leave Money on the Table 🔑 DM or Call 385-487-6763",
  activeConcessionIndex = -1,
  autoCycleFrames = 70, // ~2.3s per concession
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active concession calculation
  const calculatedIndex =
    activeConcessionIndex >= 0 && activeConcessionIndex < concessions.length
      ? activeConcessionIndex
      : Math.floor((frame / autoCycleFrames) % concessions.length);

  const activeConcession =
    concessions[calculatedIndex] || concessions[0];

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
    config: { damping: 13, stiffness: 115 },
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

  // Breathing pulse on hook
  const hookPulse = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
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
      {/* Dynamic Golden Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 820,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(250, 204, 21, 0.25) 0%, rgba(234, 179, 8, 0.1) 40%, rgba(0,0,0,0) 70%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

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
            <span style={{ fontSize: 24 }}>⚖️</span>
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
                  color: "#FACC15",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Zero Closing Costs Strategy
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(250, 204, 21, 0.18)",
              border: "1px solid rgba(250, 204, 21, 0.4)",
              color: "#FDE047",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Tactical Playbook
          </div>
        </div>
      </div>

      {/* SIGNATURE GOLDEN 3D HOOK (Reel @yourrealtorraelynn) */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          opacity: hookEntrance,
          transform: `scale(${hookEntrance * hookPulse})`,
        }}
      >
        {/* Line 1: "My" (white) + "buyer" (giant 100px gold) */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 12,
            filter: "drop-shadow(0 6px 25px rgba(0, 0, 0, 0.85))",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 1,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine1Prefix}
          </span>
          <span
            style={{
              fontSize: 104,
              fontWeight: 900,
              color: "#FACC15",
              letterSpacing: 1,
              lineHeight: 0.9,
              textShadow:
                "0 6px 20px rgba(250, 204, 21, 0.5), 0 10px 35px rgba(0, 0, 0, 0.9)",
            }}
          >
            {hookHeroWord}
          </span>
        </div>

        {/* Line 2: "45K" (hollow golden stroke) + "paid under" (white) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginTop: 4,
          }}
        >
          {/* 45K with golden outline / stroke */}
          <span
            style={{
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: 2,
              color: "transparent",
              WebkitTextStroke: "3px #FDE047",
              filter: "drop-shadow(0 0 15px rgba(250, 204, 21, 0.6))",
            }}
          >
            {amountSaved}
          </span>

          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1,
              textTransform: "lowercase",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.85)",
            }}
          >
            {hookTrailingLine}
          </span>
        </div>
      </div>

      {/* MID-SCREEN CONCESSION TACTIC CARD */}
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
            border: "2px solid rgba(250, 204, 21, 0.6)",
            padding: "30px 36px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(250, 204, 21, 0.2)",
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
                    "linear-gradient(135deg, #FACC15 0%, #D97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: "0 6px 18px rgba(250, 204, 21, 0.4)",
                  flexShrink: 0,
                }}
              >
                {activeConcession.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: "#FDE047",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {activeConcession.tag} • CONCESSION {activeConcession.number}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 0.5,
                  }}
                >
                  {activeConcession.title}
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
              {calculatedIndex + 1}/{concessions.length}
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
            {activeConcession.desc}
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
                background:
                  "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0F172A",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              RH
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
              background: "rgba(250, 204, 21, 0.15)",
              border: "1px solid rgba(250, 204, 21, 0.35)",
              color: "#FDE047",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {agentPhone}
          </div>
        </div>
      </div>

      {/* BOTTOM CONVERSION CTA BANNER */}
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
            background:
              "linear-gradient(135deg, #CA8A04 0%, #854D0E 100%)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(202, 138, 4, 0.45)",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 0.5,
            }}
          >
            {ctaText}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
