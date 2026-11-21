import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface LaptopSpecItem {
  id: string;
  stepNumber: string;
  title: string;
  emoji: string;
  keyRule: string;
  badge: string;
  subSpecs: { label: string; desc: string; isHighlight?: boolean }[];
}

export interface TechLaptopChecklistAssetProps {
  brandHandle?: string;
  brandBadge?: string;
  headlinePre?: string;
  headlineMid?: string;
  headlineMain?: string;
  specs?: LaptopSpecItem[];
  activeSpecIndex?: number;
  accentCyanColor?: string;
  accentAmberColor?: string;
  isOverlayMode?: boolean;
}

const DEFAULT_SPECS: LaptopSpecItem[] = [
  {
    id: "cpu",
    stepNumber: "01",
    title: "Processor & Suffix",
    emoji: "⚡",
    keyRule: "Don't just look at i5 / i7 / i9. Check Generation & Suffix!",
    badge: "CPU Architecture",
    subSpecs: [
      { label: "P / U Series", desc: "Everyday tasks, thin & light, 8-12h battery life" },
      { label: "H / HX Series", desc: "Gaming, 4K video editing, heavy workloads", isHighlight: true },
    ],
  },
  {
    id: "ssd",
    stepNumber: "02",
    title: "SSD Generation",
    emoji: "💾",
    keyRule: "SSD isn't just GB capacity! Check the PCIe Gen speed.",
    badge: "Storage Speed",
    subSpecs: [
      { label: "PCIe Gen 3", desc: "Older standard (~3,500 MB/s read)" },
      { label: "PCIe Gen 4", desc: "Sweet spot for speed (~7,000 MB/s)", isHighlight: true },
      { label: "PCIe Gen 5", desc: "Ultra-fast flagship (~10,000+ MB/s)" },
    ],
  },
  {
    id: "ram",
    stepNumber: "03",
    title: "RAM Speed & Type",
    emoji: "🚀",
    keyRule: "Don't just check 16GB! MT/s speed & slots matter.",
    badge: "Memory Bus",
    subSpecs: [
      { label: "3200 MT/s", desc: "Standard DDR4 memory" },
      { label: "4800 - 5600 MT/s", desc: "High-speed DDR5 multitasking", isHighlight: true },
      { label: "Upgradability", desc: "Avoid 8GB soldered RAM" },
    ],
  },
  {
    id: "gpu",
    stepNumber: "04",
    title: "GPU TGP Wattage",
    emoji: "🎮",
    keyRule: "Buying a gaming laptop? Check Total Graphics Power (TGP)!",
    badge: "Graphics Power",
    subSpecs: [
      { label: "Low TGP (45W-60W)", desc: "Underpowered RTX, thermal throttling" },
      { label: "Full TGP (100W-140W)", desc: "Maximum FPS & sustained boost clocks", isHighlight: true },
    ],
  },
];

export const TechLaptopChecklistAsset: React.FC<TechLaptopChecklistAssetProps> = ({
  brandHandle = "@techsavvyyukti",
  brandBadge = "TECH TIPS • 73K LIKES",
  headlinePre = "Must-Check",
  headlineMid = "Before Buying a",
  headlineMain = "Laptop",
  specs = DEFAULT_SPECS,
  activeSpecIndex,
  accentCyanColor = "#38BDF8",
  accentAmberColor = "#F59E0B",
  isOverlayMode = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic active spec card: cycles every 80 frames (approx 2.6 sec)
  const computedActiveIndex =
    activeSpecIndex !== undefined
      ? activeSpecIndex
      : Math.floor(frame / 80) % specs.length;

  const activeSpec = specs[computedActiveIndex] || specs[0];

  // Springs
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 110 },
  });

  const cardEntrance = spring({
    frame: frame % 80,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const laptopIconBounce = 1 + Math.sin(frame / 10) * 0.05;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "135px 40px 220px 40px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isOverlayMode ? "transparent" : "#0B0F19",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── BACKGROUND LIGHTING RIG: Amber & Blue Studio Warmth ── */}
      {!isOverlayMode && (
        <>
          {/* Cool Blue Left Rim Glow */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "-20%",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${accentCyanColor}22 0%, transparent 65%)`,
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />
          {/* Warm Amber Right Rim Glow */}
          <div
            style={{
              position: "absolute",
              bottom: "25%",
              right: "-20%",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${accentAmberColor}22 0%, transparent 65%)`,
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* ── TOP SECTION: Creator Brand Pill & Signature Hook Headline ── */}
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
        {/* Top Tag Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 22px",
            borderRadius: "999px",
            background: "rgba(15, 23, 42, 0.85)",
            border: `1px solid rgba(255, 255, 255, 0.15)`,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
            marginBottom: "18px",
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: accentCyanColor,
              textTransform: "uppercase",
            }}
          >
            {brandBadge}
          </span>
          <span style={{ color: "#475569" }}>•</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#E2E8F0",
            }}
          >
            {brandHandle}
          </span>
        </div>

        {/* 💻 Laptop Vector Icon Badge */}
        <div
          style={{
            transform: `scale(${laptopIconBounce})`,
            fontSize: "44px",
            marginBottom: "6px",
            filter: `drop-shadow(0 4px 12px ${accentCyanColor}66)`,
          }}
        >
          💻
        </div>

        {/* Headline Lines: Must-Check / Before Buying a / Laptop */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              fontSize: "46px",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
            }}
          >
            {headlinePre}
          </span>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#E2E8F0",
              letterSpacing: "-0.02em",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
            }}
          >
            {headlineMid}
          </span>
          <span
            style={{
              fontSize: "66px",
              fontWeight: 950,
              color: "#FFFFFF",
              letterSpacing: "-0.04em",
              background: `linear-gradient(135deg, #FFFFFF 40%, ${accentCyanColor} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 6px 24px ${accentCyanColor}55)`,
              marginTop: "2px",
            }}
          >
            {headlineMain}
          </span>
        </div>
      </div>

      {/* ── CENTER SECTION: Interactive Spec Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          zIndex: 15,
          opacity: cardEntrance,
          transform: `translateY(${interpolate(cardEntrance, [0, 1], [30, 0])}px) scale(${interpolate(cardEntrance, [0, 1], [0.94, 1])})`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(165deg, rgba(15, 23, 42, 0.94) 0%, rgba(10, 14, 26, 0.98) 100%)",
            borderRadius: "26px",
            border: `2px solid ${accentCyanColor}66`,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px ${accentCyanColor}22`,
            padding: "28px 24px",
            backdropFilter: "blur(20px)",
            position: "relative",
          }}
        >
          {/* Card Header: Step & Category */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: `${accentCyanColor}18`,
                border: `1px solid ${accentCyanColor}44`,
              }}
            >
              <span style={{ fontSize: "16px" }}>{activeSpec.emoji}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: accentCyanColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {activeSpec.badge}
              </span>
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 800,
                color: "#64748B",
              }}
            >
              Step {activeSpec.stepNumber} of 0{specs.length}
            </span>
          </div>

          {/* Spec Title & Golden Rule */}
          <h3
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "#FFFFFF",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            {activeSpec.title}
          </h3>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: accentAmberColor,
              margin: "0 0 20px 0",
              lineHeight: 1.4,
            }}
          >
            {activeSpec.keyRule}
          </p>

          {/* Sub-Specs Comparison Rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {activeSpec.subSpecs.map((sub, sIdx) => {
              const isHL = sub.isHighlight;
              return (
                <div
                  key={sIdx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    background: isHL ? `${accentCyanColor}14` : "rgba(255, 255, 255, 0.04)",
                    border: isHL
                      ? `1.5px solid ${accentCyanColor}55`
                      : "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 800,
                        color: isHL ? accentCyanColor : "#FFFFFF",
                      }}
                    >
                      {sub.label}
                    </span>
                    {isHL && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: accentCyanColor,
                          color: "#0F172A",
                          textTransform: "uppercase",
                        }}
                      >
                        Recommended
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#94A3B8",
                      lineHeight: 1.35,
                    }}
                  >
                    {sub.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Dots Indicator */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            {specs.map((_, dotIdx) => (
              <div
                key={dotIdx}
                style={{
                  width: dotIdx === computedActiveIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor:
                    dotIdx === computedActiveIndex ? accentCyanColor : "rgba(255, 255, 255, 0.2)",
                  boxShadow:
                    dotIdx === computedActiveIndex ? `0 0 10px ${accentCyanColor}` : "none",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: Save This Reel Callout & Safe Margins ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 24px",
            borderRadius: "16px",
            background: "rgba(15, 23, 42, 0.9)",
            border: `1px solid rgba(255, 255, 255, 0.12)`,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ fontSize: "18px" }}>📌</span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
            }}
          >
            Save this reel before buying your next laptop!
          </span>
        </div>
      </div>
    </div>
  );
};
