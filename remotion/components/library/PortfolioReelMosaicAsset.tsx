import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface PortfolioMiniCard {
  id: string;
  badge: string;
  subtitle: string;
  tag: string;
  imageUrl?: string;
  accentColor?: string;
}

export interface TransitionReasonItem {
  icon: string;
  title: string;
  desc: string;
}

export interface PortfolioReelMosaicAssetProps {
  hookWord1?: string;
  hookWord2?: string;
  hookWord3?: string;
  topicEyebrow?: string;
  portfolioCards?: PortfolioMiniCard[];
  reasons?: TransitionReasonItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  ctaText?: string;
  showMosaic?: boolean;
  showReasonsCard?: boolean;
  activeReasonIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_CARDS: PortfolioMiniCard[] = [
  {
    id: "card-1",
    badge: "$14,000,000",
    subtitle: "SOLD IT IN 2024",
    tag: "LUXURY WIN",
    accentColor: "#38BDF8", // Sky blue
  },
  {
    id: "card-2",
    badge: "5-STAR",
    subtitle: "CLIENT TRANSITIONS",
    tag: "RELATIONSHIPS",
    accentColor: "#EC4899", // Magenta pink
  },
  {
    id: "card-3",
    badge: "14 DAYS",
    subtitle: "AVG DAYS ON MARKET",
    tag: "PROVEN RECORD",
    accentColor: "#10B981", // Emerald green
  },
];

const DEFAULT_REASONS: TransitionReasonItem[] = [
  {
    icon: "👨‍👩‍👧",
    title: "A Growing Family",
    desc: "Needing more space, safe yards, and neighborhoods with top-rated schools.",
  },
  {
    icon: "🌱",
    title: "A Fresh New Chapter",
    desc: "Navigating life transitions, relocations, and new beginnings with compassion.",
  },
  {
    icon: "💫",
    title: "A Dream Finally Reality",
    desc: "Turning years of saving and sacrifice into the keys to your forever home.",
  },
  {
    icon: "📈",
    title: "Building Generational Wealth",
    desc: "Smart investments and equity compounding that protect your family's future.",
  },
];

export const PortfolioReelMosaicAsset: React.FC<PortfolioReelMosaicAssetProps> = ({
  hookWord1 = "There",
  hookWord2 = "are thousands of",
  hookWord3 = "agents.",
  topicEyebrow = "WHY CLIENTS CHOOSE HOMES BY BREYAN",
  portfolioCards = DEFAULT_CARDS,
  reasons = DEFAULT_REASONS,
  agentName = "Breyan Lallas",
  agentTitle = "Homes By Breyan • Minnesota REALTOR®",
  agentPhone = "651-235-3405",
  ctaText = "Real Relationships Over Quick Commissions 🤍 DMs Open",
  showMosaic = true,
  showReasonsCard = true,
  activeReasonIndex = -1,
  autoCycleFrames = 75,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active reason index calculation
  const calculatedIndex =
    activeReasonIndex >= 0 && activeReasonIndex < reasons.length
      ? activeReasonIndex
      : Math.floor((frame / autoCycleFrames) % reasons.length);

  const activeReason = reasons[calculatedIndex] || reasons[0];

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

  const mosaicEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const cardEntrance = spring({
    frame: frame % autoCycleFrames,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const lowerThirdEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const ctaEntrance = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Floating hover physics for mosaic cards
  const bob1 = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [-8, 8]
  );
  const bob2 = interpolate(
    Math.sin(((frame + 12) / 22) * Math.PI * 2),
    [-1, 1],
    [-10, 10]
  );
  const bob3 = interpolate(
    Math.sin(((frame + 24) / 20) * Math.PI * 2),
    [-1, 1],
    [-7, 7]
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
      {/* TOP HEADER CAPSULE */}
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
            <span style={{ fontSize: 24 }}>✨</span>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                {topicEyebrow}
              </div>
              <div
                style={{
                  color: "#38BDF8",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Non-Transactional Real Estate
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(56, 189, 248, 0.18)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#38BDF8",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Client Proof
          </div>
        </div>
      </div>

      {/* TOP BIG-TEXT HOOK (Reel @breyanmarie) */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          opacity: hookEntrance,
          transform: `scale(${hookEntrance})`,
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 0.95,
            letterSpacing: 2,
            textShadow: "0 6px 25px rgba(0, 0, 0, 0.9)",
            textAlign: "center",
          }}
        >
          {hookWord1}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#CBD5E1",
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: "0 4px 14px rgba(0, 0, 0, 0.8)",
            marginTop: 4,
          }}
        >
          {hookWord2}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#38BDF8",
            letterSpacing: 1,
            lineHeight: 1,
            textShadow:
              "0 4px 20px rgba(56, 189, 248, 0.6), 0 8px 30px rgba(0, 0, 0, 0.9)",
          }}
        >
          {hookWord3}
        </div>
      </div>

      {/* SIGNATURE 3-CARD FLOATING REEL PORTFOLIO MOSAIC (Hovering in front of presenter) */}
      {showMosaic && (
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 50,
            right: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            zIndex: 15,
            opacity: mosaicEntrance,
            transform: `scale(${mosaicEntrance})`,
          }}
        >
          {portfolioCards.map((card, idx) => {
            const bobs = [bob1, bob2, bob3];
            const currentBob = bobs[idx % 3];
            const rotations = [-4, 0, 4];
            const currentRot = rotations[idx % 3];
            const isCenter = idx === 1;

            return (
              <div
                key={card.id}
                style={{
                  width: isCenter ? 260 : 230,
                  height: isCenter ? 380 : 340,
                  borderRadius: 22,
                  overflow: "hidden",
                  border: isCenter
                    ? "2.5px solid rgba(255, 255, 255, 0.45)"
                    : "1.5px solid rgba(255, 255, 255, 0.25)",
                  boxShadow:
                    "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5)",
                  background:
                    "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
                  position: "relative",
                  transform: `translateY(${currentBob}px) rotate(${currentRot}deg)`,
                  zIndex: isCenter ? 3 : 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 16,
                }}
              >
                {/* Background image or dark aesthetic fill */}
                {card.imageUrl ? (
                  <Img
                    src={card.imageUrl}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at 50% 30%, ${card.accentColor || "#38BDF8"}33 0%, rgba(15, 23, 42, 0.95) 80%)`,
                    }}
                  />
                )}

                {/* Top Tag */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: "rgba(15, 23, 42, 0.85)",
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${card.accentColor || "#38BDF8"}`,
                      color: card.accentColor || "#38BDF8",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {card.tag}
                  </div>
                </div>

                {/* Bottom Proof Metrics */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(14px)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div
                    style={{
                      color: "#FFFFFF",
                      fontSize: isCenter ? 24 : 20,
                      fontWeight: 900,
                      letterSpacing: 0.5,
                      lineHeight: 1.1,
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {card.badge}
                  </div>
                  <div
                    style={{
                      color: "#CBD5E1",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      marginTop: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    {card.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MID-SCREEN LIFE TRANSITION REASON CARD */}
      {showReasonsCard && (
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
              border: "2px solid rgba(56, 189, 248, 0.6)",
              padding: "28px 34px",
              boxShadow:
                "0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.2)",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    background:
                      "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: "0 6px 18px rgba(56, 189, 248, 0.35)",
                  flexShrink: 0,
                }}
              >
                {activeReason.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#38BDF8",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  DEEPLY PERSONAL • {calculatedIndex + 1}/{reasons.length}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    letterSpacing: 0.5,
                  }}
                >
                  {activeReason.title}
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
            {activeReason.desc}
          </div>
        </div>
      </div>
      )}

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
                  "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              BL
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
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#38BDF8",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {agentPhone}
          </div>
        </div>
      </div>

      {/* BOTTOM RELATIONSHIP OVER TRANSACTION CTA BANNER */}
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
              "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(14, 165, 233, 0.45)",
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
