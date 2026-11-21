import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface HealthBioMetric {
  nutrient: string;
  benefit: string;
}

export interface ScrapbookPaperPosterAssetProps {
  questionHeader?: string;
  paperColor?: string;
  clipType?: "silver-binder" | "gold-paperclip" | "washi-tape";
  metrics?: HealthBioMetric[];
  voiceoverTakeaway?: string;
  authorTag?: string;
  isDark?: boolean;
}

const DEFAULT_METRICS: HealthBioMetric[] = [
  {
    nutrient: "EGCG Polyphenols",
    benefit: "Potent catechin antioxidants for cellular longevity & metabolic defense.",
  },
  {
    nutrient: "L-Theanine Amino Acid",
    benefit: "Promotes alpha brain waves for calm, steady focus without caffeine jitters.",
  },
  {
    nutrient: "Whole Ground Leaf",
    benefit: "137x more EGCG than standard steeped green tea bags.",
  },
];

export const ScrapbookPaperPosterAsset: React.FC<ScrapbookPaperPosterAssetProps> = ({
  questionHeader = "MATCHA FOR LONGEVITY?",
  paperColor = "#f472b6", // Vibrant bubblegum pink
  clipType = "silver-binder",
  metrics = DEFAULT_METRICS,
  voiceoverTakeaway = "Consuming the whole ground leaf gives you a concentrated surge of polyphenols for sustained energy.",
  authorTag = "@wellnessjosie • LONGEVITY WELLNESS",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const posterEntrance = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 90, mass: 0.9 },
  });

  const clipEntrance = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 11, stiffness: 120 },
  });

  const textEntrance = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const metricsEntrance = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 12, stiffness: 85 },
  });

  // Gentle physical paper sway
  const paperRotate = Math.sin(frame / 25) * 1.2;
  const paperSwayY = Math.sin(frame / 18) * 4;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "140px 48px 230px 48px", // 9:16 vertical safe margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "transparent",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── CENTRAL SUSPENDED SCRAPBOOK POSTER ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${paperSwayY}px) rotate(${paperRotate}deg) scale(${interpolate(posterEntrance, [0, 1], [0.88, 1])})`,
          opacity: posterEntrance,
          zIndex: 10,
        }}
      >
        {/* Metal Binder Clip / Paperclip at top center */}
        <div
          style={{
            position: "absolute",
            top: "-38px",
            zIndex: 30,
            opacity: clipEntrance,
            transform: `translateY(${interpolate(clipEntrance, [0, 1], [-20, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Wire loop */}
          <div
            style={{
              width: "44px",
              height: "48px",
              borderRadius: "22px 22px 0 0",
              border: "5px solid #d1d5db",
              borderBottom: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
            }}
          />
          {/* Black/Silver clamp body */}
          <div
            style={{
              width: "72px",
              height: "28px",
              borderRadius: "4px",
              backgroundColor: "#374151",
              boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
              border: "1px solid #4b5563",
            }}
          />
        </div>

        {/* The Folded / Torn Paper Sheet Surface */}
        <div
          style={{
            width: "100%",
            borderRadius: "16px",
            backgroundColor: paperColor,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
            boxShadow: "0 30px 70px rgba(0, 0, 0, 0.45), 0 10px 24px rgba(0,0,0,0.25)",
            padding: "48px 36px 36px 36px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Paper horizontal crease shadow */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: 0,
              width: "100%",
              height: "3px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Bold Curiosity Question Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "28px",
              opacity: textEntrance,
              transform: `scale(${interpolate(textEntrance, [0, 1], [0.94, 1])})`,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "52px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "#ffffff",
                lineHeight: 1.1,
                textShadow: "0 3px 12px rgba(0,0,0,0.25)",
              }}
            >
              {questionHeader}
            </h1>
          </div>

          {/* 3-Bullet Longevity Bio-Metrics Stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              opacity: metricsEntrance,
            }}
          >
            {metrics.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px 20px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>🍵</span>
                  <span
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "#166534", // Matcha Green
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.nutrient}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#334155",
                    lineHeight: 1.4,
                  }}
                >
                  {item.benefit}
                </p>
              </div>
            ))}
          </div>

          {/* Voiceover Takeaway Quote */}
          <div
            style={{
              marginTop: "20px",
              padding: "14px 18px",
              borderRadius: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.4,
                fontStyle: "italic",
              }}
            >
              "{voiceoverTakeaway}"
            </p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM AUTHOR & TOPIC WATERMARK PILL ── */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 24px",
          borderRadius: "9999px",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.9)",
          border: `1.5px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "14px" }}>🌿</span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isDark ? "#ffffff" : "#0f172a",
          }}
        >
          {authorTag}
        </span>
      </div>
    </div>
  );
};
