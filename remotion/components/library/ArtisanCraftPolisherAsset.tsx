import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface ArtisanCraftPolisherAssetProps {
  spiritualTopicBadge?: string;
  hadithArabicCalligraphy?: string;
  spokenTransliteration?: string;
  urduTranslation?: string;
  craftActionTag?: string;
  artisanBrandPill?: string;
  websiteDomain?: string;
  craftTelemetry?: {
    material: string;
    stitching: string;
    artisanTime: string;
  };
  accentCognacColor?: string;
  accentGoldColor?: string;
  isDark?: boolean;
}

export const ArtisanCraftPolisherAsset: React.FC<ArtisanCraftPolisherAssetProps> = ({
  spiritualTopicBadge = "DUROOD SHARIF • PART 1 OF 3",
  hadithArabicCalligraphy = "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا",
  spokenTransliteration = "\"Jo mujh par ek martaba Durood bhejta hai...\"",
  urduTranslation = "Allah Ta'ala us shakhs par 10 rehmatein naazil farmata hai aur 10 darjaat buland karta hai. (Sahih Muslim 408)",
  craftActionTag = "ASMR HAND-STITCHED FULL GRAIN LEATHER",
  artisanBrandPill = "ABD LEATHER CRAFTSMANSHIP",
  websiteDomain = "abdleather.com | WhatsApp: +92 330 2560005",
  craftTelemetry = {
    material: "Full Grain Tuscan Leather",
    stitching: "Traditional Saddle Stitch (Waxed Thread)",
    artisanTime: "3.5 Hours Handcrafted",
  },
  accentCognacColor = "#c18a56",
  accentGoldColor = "#d4af37",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrances
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const headerEntrance = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const calligraphyEntrance = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 13, stiffness: 85 },
  });

  const translationEntrance = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { damping: 12, stiffness: 95 },
  });

  const footerEntrance = spring({
    frame: Math.max(0, frame - 32),
    fps,
    config: { damping: 11, stiffness: 90 },
  });

  // Subtle natural camera breathing & artisan texture shimmer
  const slowSway = Math.sin(frame / 20) * 4;
  const pulseScale = 1 + Math.sin(frame / 25) * 0.012;

  // Theming
  const bgColor = isDark ? "#0f0e0c" : "#faf8f5";
  const cardBg = isDark ? "rgba(28, 25, 23, 0.85)" : "rgba(255, 255, 255, 0.94)";
  const textColor = isDark ? "#fef3c7" : "#1c1917";
  const mutedText = isDark ? "#a8a29e" : "#57534e";
  const cardBorder = isDark ? "rgba(193, 138, 86, 0.35)" : "rgba(193, 138, 86, 0.4)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "150px 50px 240px 50px", // 9:16 vertical safe margins
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: bgColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Layer 1: Warm Artisan Leather Ambient Glow ── */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: `translate(-50%, ${slowSway}px)`,
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentCognacColor}25 0%, ${accentGoldColor}12 45%, transparent 75%)`,
          filter: "blur(75px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 2: Top Floating Spiritual Topic & Craft Pill ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          width: "100%",
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [-20, 0])}px)`,
          zIndex: 10,
        }}
      >
        {/* Topic Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 26px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(193, 138, 86, 0.18)" : "rgba(193, 138, 86, 0.15)",
            border: `1.5px solid ${accentCognacColor}`,
            backdropFilter: "blur(10px)",
            boxShadow: `0 8px 24px ${accentCognacColor}26`,
          }}
        >
          <span style={{ fontSize: "18px" }}>📿</span>
          <span
            style={{
              fontSize: "19px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accentGoldColor,
            }}
          >
            {spiritualTopicBadge}
          </span>
        </div>

        {/* Craft Action Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "6px",
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.05)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
          }}
        >
          <span style={{ fontSize: "14px" }}>✂️</span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: mutedText,
            }}
          >
            {craftActionTag}
          </span>
        </div>
      </div>

      {/* ── Layer 3: Central Hadith & Wisdom Callout Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          borderRadius: "28px",
          padding: "50px 42px",
          backgroundColor: cardBg,
          border: `1.5px solid ${cardBorder}`,
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(193, 138, 86, 0.12)"
            : "0 20px 45px rgba(120, 53, 15, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          transform: `scale(${pulseScale})`,
          zIndex: 10,
        }}
      >
        {/* Arabic Hadith Typography */}
        <div
          style={{
            opacity: calligraphyEntrance,
            transform: `translateY(${interpolate(calligraphyEntrance, [0, 1], [25, 0])}px)`,
            textAlign: "center",
            direction: "rtl",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "'Traditional Arabic', 'Scheherazade New', 'Amiri', serif",
              fontSize: "48px",
              lineHeight: 1.6,
              margin: 0,
              color: isDark ? "#fffbeb" : "#1c1917",
              textShadow: isDark ? `0 0 20px ${accentGoldColor}40` : "none",
              fontWeight: 700,
            }}
          >
            {hadithArabicCalligraphy}
          </p>
        </div>

        {/* Stitching Line Visual Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "85%",
          }}
        >
          <div style={{ flex: 1, borderTop: `2px dashed ${accentCognacColor}66` }} />
          <span style={{ fontSize: "14px", color: accentCognacColor }}>🪡</span>
          <div style={{ flex: 1, borderTop: `2px dashed ${accentCognacColor}66` }} />
        </div>

        {/* Spoken Narration Transliteration */}
        <div
          style={{
            opacity: translationEntrance,
            transform: `translateY(${interpolate(translationEntrance, [0, 1], [20, 0])}px)`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: 800,
              lineHeight: 1.35,
              margin: 0,
              color: textColor,
              fontStyle: "italic",
            }}
          >
            {spokenTransliteration}
          </p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: 1.5,
              marginTop: "16px",
              marginBottom: 0,
              color: mutedText,
            }}
          >
            {urduTranslation}
          </p>
        </div>

        {/* Craft Telemetry Metrics Grid */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              padding: "16px 12px",
              borderRadius: "14px",
              backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(245, 245, 244, 0.7)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", textTransform: "uppercase", color: mutedText, fontWeight: 700 }}>Material</div>
            <div style={{ fontSize: "15px", color: textColor, fontWeight: 700, marginTop: "4px" }}>{craftTelemetry.material}</div>
          </div>
          <div
            style={{
              padding: "16px 12px",
              borderRadius: "14px",
              backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(245, 245, 244, 0.7)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", textTransform: "uppercase", color: mutedText, fontWeight: 700 }}>Technique</div>
            <div style={{ fontSize: "15px", color: textColor, fontWeight: 700, marginTop: "4px" }}>{craftTelemetry.stitching}</div>
          </div>
          <div
            style={{
              padding: "16px 12px",
              borderRadius: "14px",
              backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(245, 245, 244, 0.7)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", textTransform: "uppercase", color: mutedText, fontWeight: 700 }}>Patience</div>
            <div style={{ fontSize: "15px", color: textColor, fontWeight: 700, marginTop: "4px" }}>{craftTelemetry.artisanTime}</div>
          </div>
        </div>
      </div>

      {/* ── Layer 4: Brand Watermark & E-Commerce Bio Footer (Reels Safe-Zone) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          opacity: footerEntrance,
          transform: `translateY(${interpolate(footerEntrance, [0, 1], [25, 0])}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 28px",
            borderRadius: "9999px",
            backgroundColor: `${accentCognacColor}22`,
            border: `1.5px solid ${accentCognacColor}`,
            boxShadow: `0 6px 20px ${accentCognacColor}26`,
          }}
        >
          <span style={{ fontSize: "18px" }}>🏷️</span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: accentCognacColor,
              textTransform: "uppercase",
            }}
          >
            {artisanBrandPill}
          </span>
        </div>

        <p
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: mutedText,
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          {websiteDomain}
        </p>
      </div>
    </div>
  );
};
