import React, {Fragment} from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

type CaptionItem = {
  start: number;
  end: number;
  text: string;
};

type SimpleManualVideoExplainerProps = {
  title?: string;
  mediaSrc?: string;
  mediaType?: "video" | "audio" | "image";
  mediaTrimStartSeconds?: number;
  explanationImageUrl?: string;
  bottomImageUrl?: string;
  visualImageUrl?: string;
  uploadedImageUrl?: string;
  captions?: CaptionItem[];
};

const cleanText = (value: unknown, fallback = "") =>
  String(value || fallback).replace(/\s+/g, " ").trim() || fallback;

const resolveSrc = (src?: string) => {
  if (!src) return "";
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ""));
};

const getActiveCaption = (captions: CaptionItem[] = [], time: number) =>
  captions.find((c) => time >= c.start && time < c.end);

const breakLines = (text: string): string[] => {
  const words = cleanText(text).split(/\s+/).filter(Boolean).slice(0, 14);
  if (words.length <= 6) return [words.join(" ")];
  return [words.slice(0, 7).join(" "), words.slice(7, 14).join(" ")];
};

// Layout constants for 1080x1920
const SIDE = 32;
const CONTENT_WIDTH = 1080 - SIDE * 2; // 1016

export const SimpleManualVideoExplainer: React.FC<SimpleManualVideoExplainerProps> = ({
  title,
  mediaSrc,
  mediaType = "video",
  mediaTrimStartSeconds = 0,
  explanationImageUrl,
  bottomImageUrl,
  visualImageUrl,
  uploadedImageUrl,
  captions = [],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;

  const creatorSrc = resolveSrc(mediaSrc);
  const imageSrc = resolveSrc(
    explanationImageUrl || bottomImageUrl || visualImageUrl || uploadedImageUrl,
  );
  const activeCaption = getActiveCaption(captions, time);
  const safeTitle = cleanText(title, "VIDEO EXPLAINER").toUpperCase().slice(0, 55);

  // Subtle animations
  const titleEnter = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});
  const subtitlePop = activeCaption
    ? interpolate(frame % (fps * 4), [0, 6], [0.97, 1], {extrapolateRight: "clamp"})
    : 1;

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0f",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Ambient gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse 80% 30% at 50% 100%, rgba(45,212,191,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* ─── 1. CREATOR VIDEO (TOP, 16:9) ─── */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: SIDE,
          width: CONTENT_WIDTH,
          height: Math.round(CONTENT_WIDTH * (9 / 16)), // 571
          borderRadius: 24,
          overflow: "hidden",
          background: "#111118",
          border: "2.5px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        }}
      >
        {creatorSrc && mediaType === "video" ? (
          <OffthreadVideo
            src={creatorSrc}
            muted
            startFrom={Math.max(0, Math.round(mediaTrimStartSeconds * fps))}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        ) : creatorSrc ? (
          <Img
            src={creatorSrc}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              fontSize: 34,
              fontWeight: 800,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 3,
            }}
          >
            CREATOR VIDEO
          </div>
        )}

        {/* Video progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, (time / 60) * 100)}%`,
              background: "linear-gradient(90deg, #6366f1, #06b6d4)",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      {/* ─── 2. SUBTITLE STRIP ─── */}
      <div
        style={{
          position: "absolute",
          top: 614,
          left: SIDE,
          right: SIDE,
          minHeight: 148,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        {activeCaption?.text ? (
          <div
            style={{
              width: "100%",
              padding: "24px 40px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
              boxShadow: "0 16px 48px rgba(99,102,241,0.3), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              textAlign: "center",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: -0.5,
              color: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
              transform: `scale(${subtitlePop})`,
            }}
          >
            {breakLines(activeCaption.text).map((line, i) => (
              <Fragment key={`${line}-${i}`}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: 100,
              borderRadius: 20,
              background: "rgba(99,102,241,0.06)",
              border: "1.5px dashed rgba(99,102,241,0.2)",
            }}
          />
        )}
      </div>

      {/* ─── 3. TITLE STRIP with brush highlight ─── */}
      <div
        style={{
          position: "absolute",
          top: 785,
          left: SIDE,
          right: SIDE,
          height: 88,
          borderRadius: 16,
          background: "#0f0f14",
          border: "1.5px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 36px",
          overflow: "hidden",
          opacity: titleEnter,
          transform: `translateY(${(1 - titleEnter) * 8}px)`,
        }}
      >
        {/* Brush stroke highlight */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-0.5deg)",
            width: "82%",
            height: 44,
            borderRadius: "6px 18px 8px 14px",
            background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 40%, #f59e0b 75%, #d97706 100%)",
            opacity: 0.88,
            clipPath: "polygon(2% 20%, 8% 5%, 16% 14%, 26% 3%, 36% 10%, 48% 2%, 58% 8%, 70% 3%, 80% 12%, 90% 5%, 96% 10%, 100% 38%, 99% 65%, 95% 90%, 88% 96%, 76% 92%, 64% 98%, 50% 94%, 36% 100%, 22% 93%, 10% 98%, 3% 88%, 0% 62%, 1% 35%)",
          }}
        />
        {/* Secondary brush for depth */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -48%) rotate(0.3deg)",
            width: "78%",
            height: 38,
            borderRadius: "8px 14px 6px 12px",
            background: "linear-gradient(90deg, #fbbf24 0%, #fde68a 50%, #fbbf24 100%)",
            opacity: 0.4,
            filter: "blur(1px)",
            clipPath: "polygon(4% 22%, 10% 8%, 20% 16%, 32% 5%, 42% 14%, 54% 4%, 64% 12%, 74% 6%, 84% 16%, 92% 8%, 98% 14%, 100% 40%, 97% 72%, 92% 92%, 82% 98%, 68% 94%, 54% 100%, 38% 95%, 24% 100%, 10% 92%, 2% 78%, 0% 50%)",
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 1.2,
            lineHeight: 1,
            color: "#0f0f14",
            textAlign: "center",
            textTransform: "uppercase",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {safeTitle}
        </span>
      </div>

      {/* ─── 4. BOTTOM EXPLANATION IMAGE ─── */}
      <div
        style={{
          position: "absolute",
          top: 895,
          left: SIDE,
          right: SIDE,
          bottom: 24,
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(180deg, #fafafa 0%, #f1f5f9 100%)",
          border: "2.5px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Subtle corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
            borderRadius: "24px 24px 0 0",
          }}
        />

        {imageSrc ? (
          <Img
            src={imageSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "#64748b",
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Upload one image for<br />visual explanation
          </div>
        )}
      </div>

      {/* Bottom fade for polish */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "linear-gradient(0deg, rgba(10,10,15,0.8) 0%, transparent 100%)",
          pointerEvents: "none",
          borderRadius: "0 0 0 0",
        }}
      />
    </AbsoluteFill>
  );
};
