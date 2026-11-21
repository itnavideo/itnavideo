import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface RagArchitectureExplainerAssetProps {
  brandHandle?: string;
  brandTag?: string;
  pageCount?: string;
  queryTime?: string;
  documentName?: string;
  userQuestion?: string;
  aiAnswer?: string;
  citedPage?: string;
  accentGoldColor?: string;
  isDarkCanvas?: boolean;
}

export const RagArchitectureExplainerAsset: React.FC<RagArchitectureExplainerAssetProps> = ({
  brandHandle = "@devmonk.preetam",
  brandTag = "SYSTEM DESIGN • RAG",
  pageCount = "500 Pages",
  queryTime = "3 Sec?",
  documentName = "HR_Policy.pdf",
  userQuestion = "Notice period kitne din?",
  aiAnswer = "90 din.",
  citedPage = "page 312",
  accentGoldColor = "#F59E0B",
  isDarkCanvas = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const topEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const visualEntrance = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  const chatEntrance = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 13, stiffness: 105 },
  });

  // Glowing pulse on the retrieved chunk / page
  const chunkGlow = 0.65 + Math.sin(frame / 10) * 0.35;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "120px 36px 200px 36px", // 9:16 safe vertical boundaries
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDarkCanvas ? "#0D1117" : "#161B22",
        fontFamily:
          "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── TOP SECTION: Brand Avatar & 500 Pages Hook ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          opacity: topEntrance,
          transform: `translateY(${interpolate(topEntrance, [0, 1], [-25, 0])}px)`,
        }}
      >
        {/* Top Header Pill with Monk Avatar */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "rgba(22, 27, 34, 0.85)",
            border: `1px solid ${accentGoldColor}44`,
            boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 16px ${accentGoldColor}22`,
            marginBottom: "20px",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Meditating Monk Avatar */}
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accentGoldColor}44, #1E1B18)`,
              border: `1.5px solid ${accentGoldColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            🧘
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: accentGoldColor,
              textTransform: "uppercase",
            }}
          >
            {brandTag}
          </span>
          <span style={{ color: "#475569" }}>•</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0" }}>
            {brandHandle}
          </span>
        </div>

        {/* Master Headline: [500 Pages] [3 Sec?] */}
        <h1
          style={{
            fontSize: "66px",
            fontWeight: 950,
            color: "#FFFFFF",
            margin: "0 0 4px 0",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          {pageCount}
        </h1>
        <h2
          style={{
            fontSize: "72px",
            fontWeight: 950,
            color: accentGoldColor,
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textShadow: `0 0 30px ${accentGoldColor}66`,
          }}
        >
          {queryTime}
        </h2>
      </div>

      {/* ── CENTER SECTION: Visual Stage (500-Page Stack & Smartphone Mockup) ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          zIndex: 15,
          opacity: visualEntrance,
          transform: `scale(${interpolate(visualEntrance, [0, 1], [0.93, 1])})`,
          height: "640px",
        }}
      >
        {/* LEFT: 500-Page Physical Document Stack with Golden Retrieved Chunks */}
        <div
          style={{
            width: "185px",
            height: "460px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          {/* Top PDF Bookmark Tag */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              padding: "4px 10px",
              borderRadius: "4px",
              background: "#EF4444",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
              zIndex: 10,
            }}
          >
            PDF 500p
          </div>

          {/* Stacked Paper Sheets Simulation (24 layered lines) */}
          {Array.from({ length: 24 }).map((_, i) => {
            // Specific pages light up gold (e.g. index 7, 13, 19 = semantic chunks)
            const isRetrievedChunk = i === 6 || i === 12 || i === 18 || i === 22;

            return (
              <div
                key={i}
                style={{
                  width: `${165 + (i % 3) * 6}px`,
                  height: "14px",
                  borderRadius: "3px",
                  marginBottom: "4px",
                  backgroundColor: isRetrievedChunk ? accentGoldColor : "#F8FAFC",
                  boxShadow: isRetrievedChunk
                    ? `0 0 16px ${accentGoldColor}, 0 0 28px ${accentGoldColor}88`
                    : "0 2px 4px rgba(0, 0, 0, 0.2)",
                  opacity: isRetrievedChunk ? chunkGlow : 0.9,
                  transition: "all 0.3s ease",
                  borderLeft: isRetrievedChunk ? "4px solid #FFFFFF" : "none",
                }}
              />
            );
          })}
        </div>

        {/* RIGHT: Smartphone Mockup Running ChatGPT App */}
        <div
          style={{
            width: "230px",
            height: "480px",
            borderRadius: "36px",
            background: "#16181D",
            border: "4px solid #2D333B",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(0, 0, 0, 0.8)",
            padding: "16px 14px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            opacity: chatEntrance,
          }}
        >
          {/* Dynamic Island Notch */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "12px",
              borderRadius: "999px",
              background: "#000000",
            }}
          />

          {/* ChatGPT App Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              paddingBottom: "10px",
              borderBottom: "1px solid #22272E",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#10A37F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: "#FFFFFF",
              }}
            >
              ✦
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              ChatGPT
            </span>
          </div>

          {/* Main Chat Conversation Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            {/* Attached Document Capsule */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 10px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "2px 5px",
                  borderRadius: "3px",
                  background: "#EF4444",
                  color: "#FFFFFF",
                }}
              >
                PDF
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF" }}>
                  {documentName}
                </span>
                <span style={{ fontSize: "9px", color: "#64748B" }}>500 pages indexed</span>
              </div>
            </div>

            {/* User Prompt Message Bubble */}
            <div
              style={{
                alignSelf: "flex-end",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px 12px 2px 12px",
                padding: "8px 12px",
                maxWidth: "88%",
              }}
            >
              <span style={{ fontSize: "11px", color: "#E2E8F0", fontWeight: 600 }}>
                {userQuestion}
              </span>
            </div>

            {/* ChatGPT Grounded Response */}
            <div
              style={{
                alignSelf: "flex-start",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                maxWidth: "95%",
              }}
            >
              <div
                style={{
                  background: "#21262D",
                  borderRadius: "12px 12px 12px 2px",
                  padding: "10px 12px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    display: "block",
                  }}
                >
                  {aiAnswer}
                </span>
              </div>

              {/* Exact Page Citation Pill (Gold Border) */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: `1.5px solid ${accentGoldColor}`,
                  background: `${accentGoldColor}18`,
                  boxShadow: `0 0 10px ${accentGoldColor}33`,
                  width: "fit-content",
                }}
              >
                <span style={{ fontSize: "10px" }}>📄</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: accentGoldColor,
                    letterSpacing: "0.04em",
                  }}
                >
                  {citedPage}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Chat Input Bar Mock */}
          <div
            style={{
              height: "28px",
              borderRadius: "14px",
              background: "#21262D",
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <span style={{ fontSize: "10px", color: "#64748B" }}>Ask follow up...</span>
          </div>
        </div>
      </div>

      {/* ── LOWER SECTION: RAG Pipeline Summary Pill ── */}
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
            gap: "8px",
            padding: "12px 22px",
            borderRadius: "14px",
            background: "rgba(22, 27, 34, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8" }}>
            Chunking
          </span>
          <span style={{ color: accentGoldColor }}>→</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8" }}>
            Embeddings
          </span>
          <span style={{ color: accentGoldColor }}>→</span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: accentGoldColor }}>
            Vector Search (Page 312)
          </span>
          <span style={{ color: accentGoldColor }}>→</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
            LLM Answer
          </span>
        </div>
      </div>
    </div>
  );
};
