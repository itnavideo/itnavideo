import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface PlaybookStrategyItem {
  number: string;
  action: string;
  outcome: string;
}

export interface RealEstateListingTurnaroundAssetProps {
  agentName?: string;
  agentBrokerage?: string;
  leadInText?: string;
  heroActionText?: string;
  originalDaysOnMarket?: string;
  finalVerdict?: string;
  strategies?: PlaybookStrategyItem[];
  activeStrategyIndex?: number;
  accentGoldColor?: string;
  isOverlayMode?: boolean;
}

const DEFAULT_STRATEGIES: PlaybookStrategyItem[] = [
  {
    number: "01",
    action: "Exterior Paint Refresh",
    outcome: "Updated the home's curb appeal with fresh modern color",
  },
  {
    number: "02",
    action: "Professional Staging",
    outcome: "Transformed interior spaces into magazine-ready layouts",
  },
  {
    number: "03",
    action: "Lifestyle Storytelling",
    outcome: "Highlighted community amenities rather than just square footage",
  },
  {
    number: "04",
    action: "Weekly Open Houses",
    outcome: "Maximized buyer walk-throughs across multi-platform video pushes",
  },
];

export const RealEstateListingTurnaroundAsset: React.FC<RealEstateListingTurnaroundAssetProps> = ({
  agentName = "Emily Nelson",
  agentBrokerage = "REALTOR® • @parkandalleyco",
  leadInText = "Here's",
  heroActionText = "how I sold",
  originalDaysOnMarket = "240+ DAYS ON MARKET",
  finalVerdict = "GENERATED MULTIPLE OFFERS & SOLD!",
  strategies = DEFAULT_STRATEGIES,
  activeStrategyIndex,
  accentGoldColor = "#F59E0B",
  isOverlayMode = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active strategy cycle
  const computedActiveIndex =
    activeStrategyIndex !== undefined
      ? activeStrategyIndex
      : Math.floor(frame / 75) % strategies.length;

  const currentStrategy = strategies[computedActiveIndex] || strategies[0];

  // Springs
  const hookEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const cardEntrance = spring({
    frame: frame % 75,
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  const bannerEntrance = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 13, stiffness: 105 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "135px 36px 210px 36px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isOverlayMode ? "transparent" : "#111827",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Agent Credential & Signature "Here's how I sold" Typography ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 15,
          opacity: hookEntrance,
          transform: `translateY(${interpolate(hookEntrance, [0, 1], [-25, 0])}px)`,
        }}
      >
        {/* Days on Market Alert Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "rgba(239, 68, 68, 0.9)",
            color: "#FFFFFF",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.35)",
            marginBottom: "14px",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em" }}>
            ⏱ {originalDaysOnMarket}
          </span>
        </div>

        {/* Signature Big-Text Hook: [Here's] [how I sold] */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: "76px",
              fontWeight: 950,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.8)",
            }}
          >
            {leadInText}
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Newsreader', Georgia, serif",
              fontStyle: "italic",
              fontSize: "44px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              marginTop: "2px",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.85)",
            }}
          >
            {heroActionText}
          </span>
        </div>
      </div>

      {/* ── CENTER SECTION: 4-Point Turnaround Strategy Card ── */}
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
            background: "rgba(15, 23, 42, 0.88)",
            borderRadius: "24px",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.04)",
            padding: "24px 22px",
            backdropFilter: "blur(16px)",
            color: "#FFFFFF",
          }}
        >
          {/* Card Step Badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: accentGoldColor,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Strategy {currentStrategy.number} of 0{strategies.length}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              ✓ TESTED PLAYBOOK
            </span>
          </div>

          <h3
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            {currentStrategy.action}
          </h3>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.45,
              color: "#CBD5E1",
              margin: "0 0 18px 0",
              fontWeight: 500,
            }}
          >
            {currentStrategy.outcome}
          </p>

          {/* Strategy Indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {strategies.map((_, sIdx) => (
              <div
                key={sIdx}
                style={{
                  width: sIdx === computedActiveIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor:
                    sIdx === computedActiveIndex ? accentGoldColor : "rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Multiple Offers Sold Result Banner & Agent Bio ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 25,
          opacity: bannerEntrance,
          transform: `translateY(${interpolate(bannerEntrance, [0, 1], [20, 0])}px)`,
        }}
      >
        {/* Result Callout */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "16px",
            background: "#10B981",
            color: "#0F172A",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "0.04em" }}>
            🏆 {finalVerdict}
          </span>
        </div>

        {/* Agent Info Tag */}
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#FFFFFF",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.9)",
          }}
        >
          {agentName} • {agentBrokerage}
        </span>
      </div>
    </div>
  );
};
