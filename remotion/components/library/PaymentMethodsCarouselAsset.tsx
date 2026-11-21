import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface PaymentMethodItem {
  id: string;
  name: string;
  category: string;
  limit: string;
  settlement: string;
  iconType: "upi" | "imps" | "neft" | "rtgs" | "nach" | "emandate" | "cheque" | "dd" | "card";
  badgeText: string;
  summary: string;
}

export interface PaymentMethodsCarouselAssetProps {
  brandHandle?: string;
  brandTitle?: string;
  headlinePrefix?: string;
  headlineSuffix?: string;
  headlineBadge?: string;
  methods?: PaymentMethodItem[];
  activeCardIndex?: number;
  captionText?: string;
  highlightWord?: string;
  themeCyanColor?: string;
  isDarkGrid?: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: "upi",
    name: "UPI",
    category: "Instant Mobile",
    limit: "₹1L - ₹5L / Day",
    settlement: "Real-Time (Instant)",
    iconType: "upi",
    badgeText: "Most Popular",
    summary: "Scan QR or send to VPA/Phone. 24×7×365 zero charges.",
  },
  {
    id: "imps",
    name: "IMPS",
    category: "Interbank Transfer",
    limit: "Up to ₹5 Lakh",
    settlement: "Immediate (< 5 sec)",
    iconType: "imps",
    badgeText: "24×7 Instant",
    summary: "Immediate Payment Service via mobile banking & net banking.",
  },
  {
    id: "neft",
    name: "NEFT",
    category: "Batch Clearance",
    limit: "No Minimum / Max",
    settlement: "Half-Hourly Batches",
    iconType: "neft",
    badgeText: "Nationwide",
    summary: "National Electronic Funds Transfer settled in 48 half-hour batches.",
  },
  {
    id: "rtgs",
    name: "RTGS",
    category: "High-Value Gross",
    limit: "Min ₹2 Lakhs",
    settlement: "Continuous Real-Time",
    iconType: "rtgs",
    badgeText: "High Value",
    summary: "Real-Time Gross Settlement for large commercial and business payments.",
  },
  {
    id: "nach",
    name: "NACH",
    category: "Automated Clearing",
    limit: "As Per Mandate",
    settlement: "Scheduled Clearing",
    iconType: "nach",
    badgeText: "Bulk & SIPs",
    summary: "National Automated Clearing House for salaries, EMIs, and mutual funds.",
  },
  {
    id: "emandate",
    name: "e-Mandate",
    category: "Digital Standing",
    limit: "Up to ₹15K / ₹1L",
    settlement: "Auto-Debit",
    iconType: "emandate",
    badgeText: "Paperless",
    summary: "Digital authorization for recurring subscriptions, bills, and SIP debits.",
  },
  {
    id: "cheque",
    name: "Cheque",
    category: "Negotiable Paper",
    limit: "Account Balance",
    settlement: "1 - 2 Business Days",
    iconType: "cheque",
    badgeText: "CTS-2010",
    summary: "Physical paper instrument verified via Cheque Truncation System.",
  },
  {
    id: "dd",
    name: "Demand Draft",
    category: "Banker's Cheque",
    limit: "Pre-Paid Balance",
    settlement: "Guaranteed Payout",
    iconType: "dd",
    badgeText: "Zero Bounce",
    summary: "Pre-funded banker's draft with zero risk of dishonour or bounce.",
  },
  {
    id: "card",
    name: "Debit vs Credit",
    category: "Plastic Cards",
    limit: "Balance vs Credit Line",
    settlement: "Instant Merchant POS",
    iconType: "card",
    badgeText: "Card Rails",
    summary: "Debit spends your savings; Credit gives 45-day interest-free bank funds.",
  },
];

export const PaymentMethodsCarouselAsset: React.FC<PaymentMethodsCarouselAssetProps> = ({
  brandHandle = "@genzfinancer",
  brandTitle = "GENZ FINANCER",
  headlinePrefix = "Payment",
  headlineSuffix = "Methods",
  headlineBadge = "EVERY INDIAN SHOULD KNOW",
  methods = DEFAULT_PAYMENT_METHODS,
  activeCardIndex,
  captionText = "different payment methods aur money transfers",
  highlightWord = "transfers",
  themeCyanColor = "#00F0FF",
  isDarkGrid = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine active card based on time if activeCardIndex is not specified
  // 30 fps * 2.5 sec = 75 frames per method cycle
  const computedActiveIndex =
    activeCardIndex !== undefined
      ? activeCardIndex
      : Math.floor(frame / 75) % methods.length;

  // Staggered entrances
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const carouselEntrance = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const subtitleEntrance = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Carousel track smooth horizontal scroll
  // The active card is kept horizontally centered in 1080px canvas
  // Card width = 340px, margin = 20px, total slot = 360px
  const targetOffset = -(computedActiveIndex * 360);
  const trackOffsetSpring = spring({
    frame: frame % 75,
    fps,
    config: { damping: 16, stiffness: 85 },
  });
  // Previous offset vs current target offset interpolation
  const previousOffset = -(((computedActiveIndex - 1 + methods.length) % methods.length) * 360);
  const carouselTranslateX =
    frame < 75
      ? targetOffset
      : interpolate(trackOffsetSpring, [0, 1], [previousOffset, targetOffset]);

  // Underline bar glow pulse
  const cyanGlowIntensity = 0.5 + Math.sin(frame / 12) * 0.35;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "130px 36px 210px 36px", // 9:16 safe vertical margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDarkGrid ? "#0A0D14" : "#111827",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── BACKGROUND BLUEPRINT GRID & RADIAL GLOW ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }}
      />
      {/* Top Cyan Ambient Spotlight */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "500px",
          background: `radial-gradient(ellipse at center, ${themeCyanColor}22 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP HEADER SECTION: Brand Pill & Cyan Hook Title ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-25, 0])}px)`,
        }}
      >
        {/* Author Brand Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "9px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "rgba(15, 23, 42, 0.75)",
            border: `1px solid ${themeCyanColor}44`,
            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 16px ${themeCyanColor}22`,
            marginBottom: "16px",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Bank / Vault SVG Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 4.5V10H3V7.5L12 3z"
              stroke={themeCyanColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            {brandTitle}
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: themeCyanColor,
              opacity: 0.85,
            }}
          >
            {brandHandle}
          </span>
        </div>

        {/* Master Headline: [Payment] [Methods] */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
            margin: "0",
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                fontSize: "56px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: themeCyanColor,
                textShadow: `0 0 24px ${themeCyanColor}66`,
              }}
            >
              {headlinePrefix}
            </span>
            {/* Glowing Cyan Underline Bar */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: 0,
                right: 0,
                height: "5px",
                borderRadius: "3px",
                backgroundColor: themeCyanColor,
                boxShadow: `0 0 14px ${themeCyanColor}, 0 0 28px ${themeCyanColor}`,
                opacity: cyanGlowIntensity,
              }}
            />
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            {headlineSuffix}
          </span>
        </div>

        {/* Headline Secondary Badge */}
        <div
          style={{
            marginTop: "16px",
            padding: "6px 18px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#94A3B8",
              textTransform: "uppercase",
            }}
          >
            {headlineBadge}
          </span>
        </div>
      </div>

      {/* ── CENTER SECTION: Horizontal Animated Cards Carousel ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 15,
          opacity: carouselEntrance,
          transform: `scale(${interpolate(carouselEntrance, [0, 1], [0.92, 1])})`,
          overflow: "visible",
          position: "relative",
          height: "640px",
        }}
      >
        {/* Carousel Track Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            transform: `translateX(${carouselTranslateX + 500}px)`, // center card align
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
            padding: "40px 0",
          }}
        >
          {methods.map((method, idx) => {
            const isActive = idx === computedActiveIndex;
            const cardScale = isActive ? 1.06 : 0.88;
            const cardOpacity = isActive ? 1 : 0.45;

            return (
              <div
                key={method.id}
                style={{
                  width: "340px",
                  height: "520px",
                  flexShrink: 0,
                  borderRadius: "26px",
                  background: isActive
                    ? "linear-gradient(165deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 13, 20, 0.98) 100%)"
                    : "rgba(15, 23, 42, 0.6)",
                  border: isActive
                    ? `2.5px solid ${themeCyanColor}`
                    : "1.5px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isActive
                    ? `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${themeCyanColor}44, inset 0 0 20px ${themeCyanColor}18`
                    : "0 10px 30px rgba(0, 0, 0, 0.5)",
                  padding: "30px 26px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `scale(${cardScale})`,
                  opacity: cardOpacity,
                  backdropFilter: "blur(16px)",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Active Top Tag */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: isActive ? `${themeCyanColor}22` : "rgba(255, 255, 255, 0.06)",
                      color: isActive ? themeCyanColor : "#94A3B8",
                      border: isActive
                        ? `1px solid ${themeCyanColor}66`
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {method.badgeText}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#64748B",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    0{idx + 1} / 0{methods.length}
                  </span>
                </div>

                {/* Card Icon & Method Name */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    margin: "12px 0",
                  }}
                >
                  {/* Glowing Icon Shield */}
                  <div
                    style={{
                      width: "84px",
                      height: "84px",
                      borderRadius: "22px",
                      background: isActive
                        ? `linear-gradient(135deg, ${themeCyanColor}22, rgba(15, 23, 42, 0.8))`
                        : "rgba(255, 255, 255, 0.04)",
                      border: isActive
                        ? `2px solid ${themeCyanColor}88`
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      boxShadow: isActive ? `0 0 25px ${themeCyanColor}33` : "none",
                    }}
                  >
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="3"
                        stroke={isActive ? themeCyanColor : "#94A3B8"}
                        strokeWidth="2"
                      />
                      <line
                        x1="3"
                        y1="10"
                        x2="21"
                        y2="10"
                        stroke={isActive ? themeCyanColor : "#94A3B8"}
                        strokeWidth="2"
                      />
                      <circle
                        cx="7"
                        cy="15"
                        r="1.5"
                        fill={isActive ? themeCyanColor : "#94A3B8"}
                      />
                    </svg>
                  </div>

                  <h3
                    style={{
                      fontSize: "36px",
                      fontWeight: 900,
                      color: "#FFFFFF",
                      margin: "0 0 4px 0",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {method.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: themeCyanColor,
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {method.category}
                  </p>
                </div>

                {/* Method Specs Stack */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.35)",
                    padding: "14px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#94A3B8", fontWeight: 600 }}>Limit:</span>
                    <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{method.limit}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#94A3B8", fontWeight: 600 }}>Speed:</span>
                    <span style={{ color: themeCyanColor, fontWeight: 700 }}>
                      {method.settlement}
                    </span>
                  </div>
                </div>

                {/* Brief Summary Explanation */}
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.45",
                    color: "#CBD5E1",
                    margin: "12px 0 0 0",
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {method.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Carousel Progress Dot Indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {methods.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === computedActiveIndex ? "24px" : "7px",
                height: "7px",
                borderRadius: "999px",
                backgroundColor: i === computedActiveIndex ? themeCyanColor : "rgba(255, 255, 255, 0.2)",
                boxShadow: i === computedActiveIndex ? `0 0 10px ${themeCyanColor}` : "none",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── LOWER SECTION: Kinetic Subtitle & Bottom Safe-Zone Pill ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 20,
          opacity: subtitleEntrance,
          transform: `translateY(${interpolate(subtitleEntrance, [0, 1], [25, 0])}px)`,
        }}
      >
        {/* Kinetic Word-by-Word Caption Strip */}
        <div
          style={{
            padding: "14px 28px",
            borderRadius: "16px",
            background: "rgba(10, 13, 20, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            maxWidth: "92%",
            textAlign: "center",
            marginBottom: "18px",
            backdropFilter: "blur(12px)",
          }}
        >
          <p
            style={{
              fontSize: "24px",
              fontWeight: 800,
              lineHeight: 1.35,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {captionText.split(" ").map((word, wIdx) => {
              const isHighlight =
                word.toLowerCase().replace(/[^a-z]/g, "") ===
                highlightWord.toLowerCase().replace(/[^a-z]/g, "");

              return (
                <span
                  key={wIdx}
                  style={{
                    color: isHighlight ? themeCyanColor : "#FFFFFF",
                    textShadow: isHighlight ? `0 0 16px ${themeCyanColor}` : "none",
                    fontWeight: isHighlight ? 900 : 800,
                    marginRight: "6px",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        </div>

        {/* Bottom FinTech Safety Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#64748B",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 8px #10B981",
            }}
          />
          <span>RBI Certified Payment Rails • 1080×1920 9:16 Shorts</span>
        </div>
      </div>
    </div>
  );
};
