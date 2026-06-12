import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type SimpleNode = {
  id: string;
  label: string;
  start: number;
};

type SimpleInfographicPlan = {
  title?: string;
  nodes?: SimpleNode[];
};

type OverlayLike = {
  text?: string;
  body?: string;
  start?: number;
  end?: number;
  frameItems?: string[];
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const cleanText = (value: string) => {
  return value
    .replace(/\s+/g, " ")
    .replace(/[^\w\s₹$%+.,:/-]/g, "")
    .trim();
};

const shortText = (value: string, maxWords = 5) => {
  const words = cleanText(value).split(" ").filter(Boolean);
  return words.slice(0, maxWords).join(" ");
};

const splitOverlayToNodes = (overlay?: OverlayLike): SimpleNode[] => {
  const start = typeof overlay?.start === "number" ? overlay.start : 0;
  const end = typeof overlay?.end === "number" ? overlay.end : start + 6;

  const frameItems = Array.isArray(overlay?.frameItems)
    ? overlay.frameItems.filter(Boolean)
    : [];

  if (frameItems.length >= 2) {
    const step = Math.max(0.7, (end - start) / frameItems.length);

    return frameItems.slice(0, 5).map((item, index) => ({
      id: `item-${index + 1}`,
      label: shortText(item, 5),
      start: start + index * step,
    }));
  }

  const bodyParts = String(overlay?.body || "")
    .split(/\n|•|-|\|/)
    .map((item) => shortText(item, 5))
    .filter((item) => item.length > 1);

  if (bodyParts.length >= 2) {
    const step = Math.max(0.7, (end - start) / bodyParts.length);

    return bodyParts.slice(0, 5).map((item, index) => ({
      id: `body-${index + 1}`,
      label: item,
      start: start + index * step,
    }));
  }

  const words = cleanText(overlay?.text || "Problem Reason Solution")
    .split(" ")
    .filter(Boolean);

  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += 4) {
    chunks.push(words.slice(i, i + 4).join(" "));
  }

  const safeChunks =
    chunks.length >= 2 ? chunks.slice(0, 5) : ["Problem", "Reason", "Solution"];

  const step = Math.max(0.8, (end - start) / safeChunks.length);

  return safeChunks.map((item, index) => ({
    id: `chunk-${index + 1}`,
    label: shortText(item, 5),
    start: start + index * step,
  }));
};

const normalizeVisualPlanNodes = (
  visualPlan: unknown,
  overlay?: OverlayLike
): SimpleNode[] => {
  const plan = visualPlan as SimpleInfographicPlan | undefined;

  if (plan?.nodes && Array.isArray(plan.nodes) && plan.nodes.length > 0) {
    return plan.nodes
      .map((node, index) => ({
        id: node.id || `plan-${index + 1}`,
        label: shortText(node.label || (node as any).text || `Point ${index + 1}`, 5),
        start:
          typeof node.start === "number"
            ? node.start
            : typeof overlay?.start === "number"
              ? overlay.start + index * 1.2
              : index * 1.2,
      }))
      .slice(0, 5);
  }

  return splitOverlayToNodes(overlay);
};

const layoutFor = (count: number) => {
  if (count <= 3) {
    return [
      { x: 210, y: 340 },
      { x: 540, y: 210 },
      { x: 870, y: 340 },
    ];
  }

  if (count === 4) {
    return [
      { x: 210, y: 210 },
      { x: 870, y: 210 },
      { x: 210, y: 470 },
      { x: 870, y: 470 },
    ];
  }

  return [
    { x: 160, y: 210 },
    { x: 540, y: 150 },
    { x: 920, y: 210 },
    { x: 330, y: 490 },
    { x: 750, y: 490 },
  ];
};

const AnimatedNode: React.FC<{
  label: string;
  index: number;
  startSecond: number;
  x: number;
  y: number;
}> = ({ label, index, startSecond, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.round(startSecond * fps);
  const localFrame = frame - startFrame;

  const pop = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 170,
      mass: 0.8,
    },
  });

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(pop, [0, 1], [0.68, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 270,
        minHeight: 120,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderRadius: 30,
        padding: "20px 22px",
        background:
          index === 0
            ? "linear-gradient(135deg, #ffdf5d, #ff9f1c)"
            : "linear-gradient(135deg, #ffffff, #eaf0ff)",
        border: "4px solid rgba(255,255,255,0.9)",
        boxShadow:
          index === 0
            ? "0 24px 55px rgba(255,185,0,0.38), 0 12px 30px rgba(0,0,0,0.35)"
            : "0 22px 46px rgba(0,0,0,0.34)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -22,
          left: -18,
          width: 52,
          height: 52,
          borderRadius: 999,
          background: "#0f172a",
          color: "#ffffff",
          border: "4px solid #ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          fontWeight: 950,
        }}
      >
        {index + 1}
      </div>

      <div
        style={{
          fontSize: label.length > 24 ? 25 : 30,
          lineHeight: 1.05,
          fontWeight: 950,
          letterSpacing: "-0.045em",
          color: "#0f172a",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Connector: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  visible: boolean;
  revealSecond: number;
}> = ({ from, to, visible, revealSecond }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  const localFrame = frame - Math.round(revealSecond * fps);
  const progress = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const startX = from.x;
  const startY = from.y;
  const endX = from.x + (to.x - from.x) * progress;
  const endY = from.y + (to.y - from.y) * progress;

  return (
    <svg
      width={1080}
      height={650}
      viewBox="0 0 1080 650"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        opacity: clamp(progress, 0, 1),
      }}
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M2,2 L10,6 L2,10 Z" fill="#ffdf5d" />
        </marker>
      </defs>

      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#ffdf5d"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#arrow)"
        opacity="0.95"
      />
    </svg>
  );
};

export const SimpleInfographicRenderer: React.FC<{
  overlay?: OverlayLike;
  visualPlan?: unknown;
  time: number;
}> = ({ overlay, visualPlan, time }) => {
  const nodes = normalizeVisualPlanNodes(visualPlan, overlay).slice(0, 5);
  const positions = layoutFor(nodes.length);

  const title =
    shortText((visualPlan as any)?.title || overlay?.text || "Visual Explanation", 6) ||
    "Visual Explanation";

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(255,223,93,0.2), transparent 42%), linear-gradient(180deg, #08111f, #020617)",
        overflow: "hidden",
        borderRadius: 34,
        border: "2px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 46,
          right: 46,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            padding: "13px 28px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.18)",
            color: "#ffffff",
            fontSize: 27,
            fontWeight: 950,
            letterSpacing: "-0.04em",
            textAlign: "center",
            boxShadow: "0 15px 34px rgba(0,0,0,0.28)",
          }}
        >
          {title}
        </div>
      </div>

      {nodes.slice(0, -1).map((node, index) => {
        const nextNode = nodes[index + 1];
        const visible = time >= nextNode.start;

        return (
          <Connector
            key={`line-${node.id}-${nextNode.id}`}
            from={positions[index]}
            to={positions[index + 1]}
            visible={visible}
            revealSecond={nextNode.start}
          />
        );
      })}

      {nodes.map((node, index) => {
        if (time < node.start) return null;

        return (
          <AnimatedNode
            key={node.id}
            label={node.label}
            index={index}
            startSecond={node.start}
            x={positions[index].x}
            y={positions[index].y}
          />
        );
      })}
    </AbsoluteFill>
  );
};
