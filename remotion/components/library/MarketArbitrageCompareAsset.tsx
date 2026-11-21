import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface MarketItemSpec {
  city: string;
  badge: string;
  badgeColor: string;
  propertyType: string;
  sqft: string;
  pricePerSqft: string;
  features: string[];
}

export interface MarketArbitrageCompareAssetProps {
  budgetAmount?: string;
  hookLine1?: string;
  hookLine2Prefix?: string;
  hookLine2Script?: string;
  hookLine3Prefix?: string;
  hookLine3Suffix?: string;
  hookLine4Prefix?: string;
  hookLine4Script?: string;
  marketA?: MarketItemSpec;
  marketB?: MarketItemSpec;
  agentName?: string;
  agentBrokerage?: string;
  agentHandle?: string;
  ctaText?: string;
  showComparisonSplit?: boolean;
  watermark?: boolean;
}

const DEFAULT_MARKET_A: MarketItemSpec = {
  city: "Vancouver / Toronto",
  badge: "TRADE-OFFS",
  badgeColor: "#EF4444", // Crimson
  propertyType: "High-Rise Condo",
  sqft: "680 SQ FT",
  pricePerSqft: "$1,735 / sq ft",
  features: [
    "1 Bed + Den, 1 Bath",
    "$850/mo Strata Fees",
    "No private yard",
    "13% - 15% Sales Tax",
  ],
};

const DEFAULT_MARKET_B: MarketItemSpec = {
  city: "Calgary Inner-City",
  badge: "THE UPGRADE",
  badgeColor: "#10B981", // Emerald
  propertyType: "Modern Detached Infill",
  sqft: "2,850 SQ FT",
  pricePerSqft: "$414 / sq ft",
  features: [
    "4 Beds, 3.5 Baths",
    "$0 Strata Fees",
    "Private yard & double garage",
    "0% Provincial Sales Tax",
  ],
};

export const MarketArbitrageCompareAsset: React.FC<MarketArbitrageCompareAssetProps> = ({
  budgetAmount = "$1.18 Million",
  hookLine1 = "THIS",
  hookLine2Prefix = "is",
  hookLine2Script = "what",
  hookLine3Prefix = "$1.18",
  hookLine3Suffix = "million",
  hookLine4Prefix = "gets",
  hookLine4Script = "you",
  marketA = DEFAULT_MARKET_A,
  marketB = DEFAULT_MARKET_B,
  agentName = "Kelynn McManus",
  agentBrokerage = "RE/MAX Key Calgary",
  agentHandle = "@kelynnmcmanusrealtoryyc",
  ctaText = "Thinking about relocating? Let's map your move 📩",
  showComparisonSplit = true,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const hookSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const cardsSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const badgeSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const ctaSpring = spring({
    frame: frame - 32,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Breathing pulse on hook
  const hookPulse = interpolate(
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
      {/* SIGNATURE METALLIC + CURSIVE HYBRID HOOK (Reel @kelynnmcmanusrealtoryyc) */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 50,
          right: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: hookSpring,
          transform: `scale(${hookSpring * hookPulse}) translateY(${interpolate(hookSpring, [0, 1], [-40, 0])}px)`,
        }}
      >
        {/* Line 1: THIS in giant condensed metallic champagne */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: 6,
            lineHeight: 0.95,
            textTransform: "uppercase",
            background:
              "linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #B45309 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 15px rgba(0, 0, 0, 0.85))",
          }}
        >
          {hookLine1}
        </div>

        {/* Line 2: is what */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 12,
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1,
              textShadow: "0 3px 12px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine2Prefix}
          </span>
          <span
            style={{
              fontSize: 52,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              color: "#FDE68A",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine2Script}
          </span>
        </div>

        {/* Line 3: $1.18 million */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 10,
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 46,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 1,
              textShadow: "0 4px 14px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine3Prefix}
          </span>
          <span
            style={{
              fontSize: 50,
              fontWeight: 900,
              background:
                "linear-gradient(135deg, #FEF08A 0%, #EAB308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              filter: "drop-shadow(0 3px 12px rgba(0, 0, 0, 0.85))",
            }}
          >
            {hookLine3Suffix}
          </span>
        </div>

        {/* Line 4: gets you */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 10,
            marginTop: 2,
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: 1,
              textShadow: "0 3px 12px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine4Prefix}
          </span>
          <span
            style={{
              fontSize: 52,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              color: "#FDE68A",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {hookLine4Script}
          </span>
        </div>
      </div>

      {/* SIDE-BY-SIDE MARKET ARBITRAGE SPLIT CARDS */}
      {showComparisonSplit && (
        <div
          style={{
            position: "absolute",
            top: 920,
            left: 40,
            right: 40,
            display: "flex",
            gap: 20,
            zIndex: 10,
            opacity: cardsSpring,
            transform: `translateY(${interpolate(cardsSpring, [0, 1], [40, 0])}px)`,
          }}
        >
          {/* Market A Card (Vancouver / Toronto) */}
          <div
            style={{
              flex: 1,
              background: "rgba(15, 23, 42, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              border: "1.5px solid rgba(239, 68, 68, 0.5)",
              padding: "24px 20px",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Badge */}
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 8,
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#FCA5A5",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {marketA.badge}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                {marketA.city}
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "#94A3B8",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {marketA.propertyType}
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#F87171",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                {marketA.sqft}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#CBD5E1",
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                {marketA.pricePerSqft}
              </div>
            </div>

            {/* Feature Bullets */}
            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                paddingTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {marketA.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 13,
                    color: "#E2E8F0",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: "#EF4444" }}>✕</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market B Card (Calgary Inner-City) */}
          <div
            style={{
              flex: 1,
              background: "rgba(15, 23, 42, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              border: "2px solid rgba(16, 185, 129, 0.7)",
              padding: "24px 20px",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(16, 185, 129, 0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Badge */}
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.25)",
                  border: "1px solid rgba(16, 185, 129, 0.5)",
                  color: "#6EE7B7",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {marketB.badge}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: 4,
                }}
              >
                {marketB.city}
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "#94A3B8",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {marketB.propertyType}
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#34D399",
                  letterSpacing: 0.5,
                  marginBottom: 4,
                }}
              >
                {marketB.sqft}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#A7F3D0",
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                {marketB.pricePerSqft}
              </div>
            </div>

            {/* Feature Bullets */}
            <div
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                paddingTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {marketB.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 13,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: "#10B981" }}>✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AGENT FOOTPRINT LOWER-THIRD */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          left: 40,
          right: 40,
          zIndex: 10,
          opacity: badgeSpring,
          transform: `translateY(${interpolate(badgeSpring, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 20,
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
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
                {agentBrokerage} • {agentHandle}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#FCD34D",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Relocation Pro
          </div>
        </div>
      </div>

      {/* BOTTOM CTA BANNER */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 40,
          right: 40,
          zIndex: 10,
          opacity: ctaSpring,
          transform: `translateY(${interpolate(ctaSpring, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#F8FAFC",
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
