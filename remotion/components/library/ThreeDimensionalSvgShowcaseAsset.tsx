import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface ThreeDimensionalSvgShowcaseAssetProps {
  title?: string;
  subtitle?: string;
  presetType?: "coin" | "shield" | "rocket" | "device" | "customSvg";
  customSvgPath?: string;
  depthLayers?: number;
  rotationSpeed?: number;
  metalnessColor?: string;
  edgeBevelColor?: string;
  highlightGlow?: string;
  metricLabel?: string;
  metricValue?: string;
  badgeText?: string;
  isDark?: boolean;
}

export const ThreeDimensionalSvgShowcaseAsset: React.FC<ThreeDimensionalSvgShowcaseAssetProps> = ({
  title = "3D EXTENDED SVG & VALUE ASSET",
  subtitle = "Native 3D Extrusion • Beveled Lighting • Dynamic Z-Depth Camera Orbit",
  presetType = "coin",
  customSvgPath,
  depthLayers = 14,
  rotationSpeed = 1,
  metalnessColor = "#f59e0b", // Gold / Amber
  edgeBevelColor = "#b45309", // Deep Amber
  highlightGlow = "rgba(245,158,11,0.35)",
  metricLabel = "3D Asset Perception Lift",
  metricValue = "+4.2x Engagement",
  badgeText = "GPU 3D RENDER ENGINE",
  isDark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 3D Continuous Orbit Calculation
  const spinAngle = (frame * 1.5 * rotationSpeed) % 360;
  const tiltY = Math.sin((frame * 0.05 * rotationSpeed)) * 18;
  const bobbingZ = Math.sin((frame * 0.08 * rotationSpeed)) * 14;

  // Preset SVG Shapes
  const renderSvgShape = () => {
    switch (presetType) {
      case "coin":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
            <circle cx="50" cy="50" r="46" fill="currentColor" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <text
              x="50"
              y="60"
              fontSize="34"
              fontWeight="900"
              fill="#ffffff"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              $
            </text>
          </svg>
        );
      case "shield":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
            <path
              d="M50 8 L85 24 V50 C85 72 50 92 50 92 C50 92 15 72 15 50 V24 Z"
              fill="currentColor"
            />
            <path
              d="M50 16 L77 30 V50 C77 67 50 82 50 82 C50 82 23 67 23 50 V30 Z"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2.5"
            />
            <path
              d="M36 48 L46 58 L66 38"
              fill="none"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "rocket":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
            <path
              d="M50 10 C50 10 32 32 32 60 H68 C68 32 50 10 50 10 Z"
              fill="currentColor"
            />
            <path d="M32 60 L18 74 L28 78 L34 68 Z" fill={edgeBevelColor} />
            <path d="M68 60 L82 74 L72 78 L66 68 Z" fill={edgeBevelColor} />
            <circle cx="50" cy="42" r="8" fill="#ffffff" />
            <path d="M42 66 L50 84 L58 66 Z" fill="#ef4444" />
          </svg>
        );
      case "device":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
            <rect x="24" y="10" width="52" height="80" rx="10" fill="currentColor" />
            <rect x="28" y="16" width="44" height="66" rx="6" fill="#09090b" />
            <circle cx="50" cy="86" r="2.5" fill="rgba(255,255,255,0.4)" />
            <rect x="42" y="12" width="16" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
            <path d={customSvgPath || "M50 10 L90 90 H10 Z"} fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 42px",
        backgroundColor: isDark ? "#09090b" : "#f8fafc",
        color: isDark ? "#f8fafc" : "#0f172a",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        borderRadius: "28px",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)",
        boxShadow: isDark
          ? "0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 20px 45px -10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Background Volumetric Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "450px",
          height: "450px",
          background: `radial-gradient(circle, ${highlightGlow} 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* TOP HEADER SECTION */}
      <div
        style={{
          opacity: headerOpacity,
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingBottom: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: metalnessColor,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <span>💎 3D MOTION EXTENSION</span>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)",
                fontSize: "11px",
              }}
            >
              {badgeText}
            </span>
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "13px",
              margin: "4px 0 0 0",
              color: isDark ? "#94a3b8" : "#64748b",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            backgroundColor: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
            border: `1px solid ${metalnessColor}40`,
            padding: "8px 16px",
            borderRadius: "14px",
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: metalnessColor,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {metricLabel}
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 900,
              color: isDark ? "#fef3c7" : "#78350f",
              marginTop: "2px",
            }}
          >
            {metricValue}
          </div>
        </div>
      </div>

      {/* CORE 3D PERSPECTIVE VIEWPORT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: "1200px",
          position: "relative",
        }}
      >
        {/* Floating 3D Object Group */}
        <div
          style={{
            width: "200px",
            height: "200px",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `translateY(${bobbingZ}px) rotateX(${22 + tiltY}deg) rotateY(${spinAngle}deg)`,
            transition: "none",
          }}
        >
          {/* Layered Extrusion Stack (Z-Depth Slices) */}
          {Array.from({ length: depthLayers }).map((_, i) => {
            const zOffset = i * -2.2;
            const isFront = i === 0;
            const isBack = i === depthLayers - 1;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${zOffset}px)`,
                  color: isFront
                    ? metalnessColor
                    : isBack
                    ? edgeBevelColor
                    : edgeBevelColor,
                  filter: isFront
                    ? "brightness(1.15) drop-shadow(0 0 18px rgba(245,158,11,0.4))"
                    : `brightness(${0.7 + (i / depthLayers) * 0.3})`,
                  pointerEvents: "none",
                }}
              >
                {renderSvgShape()}
              </div>
            );
          })}
        </div>

        {/* 3D Simulated Ground Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: "35px",
            width: "220px",
            height: "50px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, transparent 75%)",
            transform: `scale(${1 - bobbingZ * 0.015})`,
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />

        {/* Floating Orbiting Feature Pills */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: "40%",
            backgroundColor: isDark ? "rgba(18,18,22,0.85)" : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)",
            borderRadius: "14px",
            padding: "8px 14px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>📐</span>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 800, color: isDark ? "#ffffff" : "#0f172a" }}>
              Extrude Geometry
            </div>
            <div style={{ fontSize: "10px", color: isDark ? "#94a3b8" : "#64748b" }}>
              {depthLayers} Dynamic Z-Depth Slices
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "40%",
            backgroundColor: isDark ? "rgba(18,18,22,0.85)" : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)",
            borderRadius: "14px",
            padding: "8px 14px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>💡</span>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 800, color: isDark ? "#ffffff" : "#0f172a" }}>
              Specular Lighting
            </div>
            <div style={{ fontSize: "10px", color: isDark ? "#94a3b8" : "#64748b" }}>
              Metallic Sheen & Shadow Tilt
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER: SPECS */}
      <div
        style={{
          opacity: headerOpacity,
          borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
          paddingTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: isDark ? "#cbd5e1" : "#475569",
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: "13px" }}>⚡</span>
          <span>Zero External NPM Overhead • 60 FPS Frame-Accurate Cloud Rendering</span>
        </div>

        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: metalnessColor,
            backgroundColor: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
            padding: "4px 10px",
            borderRadius: "999px",
            border: `1px solid ${metalnessColor}30`,
          }}
        >
          THREE.JS / SVG EXTENSION COMPATIBLE
        </div>
      </div>
    </div>
  );
};
