import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface PropertyHighlightItem {
  icon: string;
  text: string;
}

export interface FloatingPalmCardAssetProps {
  cardTitle?: string;
  cardBadge?: string;
  cardImageUrl?: string;
  cardPositionX?: number; // X position where palm is extended (default ~720)
  cardPositionY?: number; // Y position above palm (default ~580)
  cardWidth?: number;
  cardHeight?: number;
  locationTitle?: string;
  priceTag?: string;
  specPills?: string[];
  highlights?: PropertyHighlightItem[];
  agentName?: string;
  agentTitle?: string;
  agentPhone?: string;
  ctaText?: string;
  showPalmCard?: boolean;
  showHighlightsCard?: boolean;
  activeHighlightIndex?: number;
  autoCycleFrames?: number;
  watermark?: boolean;
}

const DEFAULT_HIGHLIGHTS: PropertyHighlightItem[] = [
  { icon: "🪵", text: "Brand-New White Oak Flooring Throughout" },
  { icon: "🍷", text: "Remodeled Kitchen with Island Beverage Fridge" },
  { icon: "🛁", text: "Expanded Primary Spa Suite with Tile Shower" },
  { icon: "🚗", text: "Oversized 2-Car Garage & Concrete Driveway" },
  { icon: "🌲", text: "Flat 0.5-Acre Usable Lot • No HOA • No City Taxes" },
];

export const FloatingPalmCardAsset: React.FC<FloatingPalmCardAssetProps> = ({
  cardTitle = "EAST RIDGE SANCTUARY",
  cardBadge = "$399,000",
  cardImageUrl,
  cardPositionX = 720,
  cardPositionY = 560,
  cardWidth = 300,
  cardHeight = 440,
  locationTitle = "Lincolnton, NC • Eastridge Subdivision",
  priceTag = "Newly Offered at $399,000",
  specPills = ["3 BED | 2 BATH", "1,540 SQ FT", "0.5 ACRES", "NO HOA"],
  highlights = DEFAULT_HIGHLIGHTS,
  agentName = "Kelsie Blevins",
  agentTitle = "Top 1% REALTOR® • Realty Executives Lake Norman",
  agentPhone = "828-221-6070",
  ctaText = "DM or Call/Text 828-221-6070 to Schedule Your Private Showing 🔑",
  showPalmCard = true,
  showHighlightsCard = true,
  activeHighlightIndex = -1,
  autoCycleFrames = 60,
  watermark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active highlight calculation
  const calculatedIndex =
    activeHighlightIndex >= 0 && activeHighlightIndex < highlights.length
      ? activeHighlightIndex
      : Math.floor((frame / autoCycleFrames) % highlights.length);

  const activeHighlight = highlights[calculatedIndex] || highlights[0];

  // Springs
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const headerEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 105 },
  });

  const highlightEntrance = spring({
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

  // Continuous subtle floating hover animation above palm
  const floatY = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [-12, 12]
  );

  const floatRotate = interpolate(
    Math.sin((frame / 24) * Math.PI * 2),
    [-1, 1],
    [-1.5, 1.5]
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
      {/* TOP LOCATION & PRICE HEADER CAPSULE */}
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
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>📍</span>
            <div>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                {locationTitle}
              </div>
              <div
                style={{
                  color: "#34D399",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {priceTag}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.18)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#34D399",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Move-In Ready
          </div>
        </div>

        {/* Spec Pills */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          {specPills.map((pill, idx) => (
            <div
              key={idx}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(15, 23, 42, 0.82)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#E2E8F0",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 0.8,
                backdropFilter: "blur(12px)",
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>

      {/* SIGNATURE FLOATING PALM CARD (Hovering over presenter's open palm) */}
      {showPalmCard && (
        <div
          style={{
            position: "absolute",
            left: cardPositionX,
            top: cardPositionY,
            width: cardWidth,
            height: cardHeight,
            zIndex: 15,
            opacity: cardEntrance,
            transform: `translate(-50%, -50%) translateY(${floatY}px) rotate(${floatRotate}deg) scale(${cardEntrance})`,
          }}
        >
          {/* Glowing Aura Ring around palm card */}
          <div
            style={{
              position: "absolute",
              inset: -15,
              borderRadius: 32,
              background:
                "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(16, 185, 129, 0) 70%)",
              filter: "blur(18px)",
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 24,
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 0.35)",
              boxShadow:
                "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.3)",
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              zIndex: 1,
            }}
          >
            {/* Card Image / Drone Overhead Footage */}
            {cardImageUrl ? (
              <Img
                src={cardImageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 10 }}>🛸</div>
                <div
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Overhead Drone
                </div>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Aerial Lot & Boundary
                </div>
              </div>
            )}

            {/* Gradient Dark Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
              }}
            />

            {/* Price Badge on Card */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                padding: "8px 14px",
                borderRadius: 12,
                background: "rgba(15, 23, 42, 0.9)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Offered At
              </span>
              <span
                style={{
                  color: "#10B981",
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                {cardBadge}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MID-SCREEN ROTATING PROPERTY HIGHLIGHT CARD */}
      {showHighlightsCard && (
        <div
          style={{
            position: "absolute",
            top: 980,
            left: 60,
            right: 60,
            zIndex: 10,
            opacity: highlightEntrance,
            transform: `scale(${highlightEntrance})`,
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.92)",
              backdropFilter: "blur(24px)",
              borderRadius: 26,
              border: "2px solid rgba(16, 185, 129, 0.6)",
              padding: "24px 30px",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(16, 185, 129, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                boxShadow: "0 6px 18px rgba(16, 185, 129, 0.35)",
                flexShrink: 0,
              }}
            >
              {activeHighlight.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#34D399",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                PROPERTY HIGHLIGHT • {calculatedIndex + 1}/{highlights.length}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: 0.5,
                  lineHeight: 1.25,
                }}
              >
                {activeHighlight.text}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AGENT AUTHORITY BADGE */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
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
                background: "linear-gradient(135deg, #10B981 0%, #38BDF8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              KB
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
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#34D399",
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
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: 18,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
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
