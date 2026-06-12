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
  frameType?: string;
};

type OverlayLike = {
  text?: string;
  body?: string;
  start?: number;
  end?: number;
  frameItems?: string[];
  frameType?: string;
  frameText?: string;
  frameLabel?: string;
  frameValue?: string;
  layout?: string;
  layoutType?: string;
  visual?: string;
  assetBrief?: string;
};

const BAD_TEXT_PATTERNS = [
  /ctaframe/i,
  /show a/i,
  /focused on/i,
  /visualplan/i,
  /assetbrief/i,
  /frameitems/i,
  /layouttype/i,
  /overlaytimeline/i,
  /render/i,
  /template/i,
  /component/i,
  /instruction/i,
  /prompt/i,
];

const DOMAIN_HOSTING_PATTERNS = [
  /domain/i,
  /hosting/i,
  /website address/i,
  /server/i,
  /www\./i,
  /\.com/i,
];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const isBadText = (value?: string) => {
  const text = String(value || "").trim();

  if (!text) return true;

  return BAD_TEXT_PATTERNS.some((pattern) => pattern.test(text));
};

const cleanText = (value: string) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s₹$%+.,:/=-]/g, "")
    .replace(/\bI\s+(?=Here|This|That|Domain|Hosting|Website)/gi, "")
    .replace(/\bHere is the\b/gi, "")
    .replace(/\bwhat is\b/gi, "")
    .trim();
};

const shortText = (value: string, maxWords = 4) => {
  const cleaned = cleanText(value);

  if (!cleaned || isBadText(cleaned)) return "";

  const words = cleaned.split(" ").filter(Boolean);
  return words.slice(0, maxWords).join(" ");
};

const getOverlayTextPool = (overlay?: OverlayLike, visualPlan?: unknown) => {
  const plan = visualPlan as any;

  return [
    overlay?.text,
    overlay?.body,
    overlay?.frameText,
    overlay?.frameLabel,
    overlay?.frameValue,
    overlay?.visual,
    overlay?.assetBrief,
    overlay?.frameType,
    overlay?.layout,
    overlay?.layoutType,
    plan?.title,
    plan?.frameType,
    ...(Array.isArray(overlay?.frameItems) ? overlay?.frameItems || [] : []),
    ...(Array.isArray(plan?.nodes)
      ? plan.nodes.map((node: any) => node?.label || node?.text || "")
      : []),
  ]
    .filter(Boolean)
    .join(" ");
};

const looksLikeDomainHosting = (overlay?: OverlayLike, visualPlan?: unknown) => {
  const pool = getOverlayTextPool(overlay, visualPlan);
  const hits = DOMAIN_HOSTING_PATTERNS.filter((pattern) => pattern.test(pool));
  return hits.length >= 2;
};

const buildDomainHostingNodes = (_overlay?: OverlayLike): SimpleNode[] => {
  return [
    {
      id: "domain-name",
      label: "Domain Name",
      start: 0,
    },
    {
      id: "website-address",
      label: "Website Address",
      start: 1.4,
    },
    {
      id: "hosting-server",
      label: "Hosting Server",
      start: 2.8,
    },
    {
      id: "stores-files",
      label: "Stores Website Files",
      start: 4.2,
    },
  ];
};

const splitOverlayToNodes = (overlay?: OverlayLike): SimpleNode[] => {
  const start = typeof overlay?.start === "number" ? overlay.start : 0;
  const end = typeof overlay?.end === "number" ? overlay.end : start + 6;

  const frameItems = Array.isArray(overlay?.frameItems)
    ? overlay.frameItems.filter((item) => !isBadText(item))
    : [];

  if (frameItems.length >= 2) {
    const step = Math.max(0.85, (end - start) / frameItems.length);

    return frameItems.slice(0, 4).map((item, index) => ({
      id: `item-${index + 1}`,
      label: shortText(item, 4) || `Point ${index + 1}`,
      start: start + index * step,
    }));
  }

  const bodyParts = String(overlay?.body || "")
    .split(/\n|•|\||;/)
    .map((item) => shortText(item, 4))
    .filter((item) => item.length > 1 && !isBadText(item));

  if (bodyParts.length >= 2) {
    const step = Math.max(0.85, (end - start) / bodyParts.length);

    return bodyParts.slice(0, 4).map((item, index) => ({
      id: `body-${index + 1}`,
      label: item,
      start: start + index * step,
    }));
  }

  const cleanedText = cleanText(overlay?.text || "");

  if (isBadText(cleanedText)) {
    return [
      { id: "point-1", label: "Key Point", start },
      { id: "point-2", label: "Simple Meaning", start: start + 1.2 },
      { id: "point-3", label: "Final Takeaway", start: start + 2.4 },
    ];
  }

  const words = cleanedText.split(" ").filter(Boolean);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += 4) {
    const chunk = shortText(words.slice(i, i + 4).join(" "), 4);
    if (chunk && !isBadText(chunk)) chunks.push(chunk);
  }

  const safeChunks =
    chunks.length >= 2 ? chunks.slice(0, 4) : ["Key Point", "Simple Meaning", "Final Takeaway"];

  const step = Math.max(0.85, (end - start) / safeChunks.length);

  return safeChunks.map((item, index) => ({
    id: `chunk-${index + 1}`,
    label: item,
    start: start + index * step,
  }));
};

const normalizeVisualPlanNodes = (
  visualPlan: unknown,
  overlay?: OverlayLike
): SimpleNode[] => {
  const plan = visualPlan as any;

  if (plan?.nodes && Array.isArray(plan.nodes) && plan.nodes.length > 0) {
    const overlayStart = typeof overlay?.start === "number" ? overlay.start : 0;

    const cleanedPlanNodes = plan.nodes
      .map((node: any, index: number) => {
        const rawLabel = node?.label || node?.text || node?.shortLabel || "";

        return {
          id: node?.id || `plan-${index + 1}`,
          label: shortText(rawLabel, 4),
          start:
            typeof node?.start === "number"
              ? node.start
              : overlayStart + index * 1.1,
        };
      })
      .filter((node: SimpleNode) => node.label && !isBadText(node.label))
      .slice(0, 4);

    if (cleanedPlanNodes.length >= 2) {
      return cleanedPlanNodes;
    }
  }

  return splitOverlayToNodes(overlay);
};

const forceFirstNodeVisibleEarly = (nodes: SimpleNode[], overlay?: OverlayLike) => {
  const overlayStart = typeof overlay?.start === "number" ? overlay.start : 0;

  return nodes.map((node, index) => {
    if (index === 0) {
      return {
        ...node,
        start: overlayStart,
      };
    }

    return node;
  });
};

const dedupeNodes = (nodes: SimpleNode[]) => {
  const seen = new Set<string>();

  return nodes.filter((node) => {
    const key = node.label.toLowerCase();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const layoutFor = (count: number) => {
  if (count <= 3) {
    return [
      { x: 210, y: 350 },
      { x: 540, y: 220 },
      { x: 870, y: 350 },
    ];
  }

  return [
    { x: 210, y: 230 },
    { x: 870, y: 230 },
    { x: 210, y: 500 },
    { x: 870, y: 500 },
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
        width: 315,
        minHeight: 138,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderRadius: 32,
        padding: "22px 24px",
        background:
          index === 0
            ? "linear-gradient(135deg, #ffdf5d, #ff9f1c)"
            : "linear-gradient(135deg, #ffffff, #eaf0ff)",
        border: "5px solid rgba(255,255,255,0.92)",
        boxShadow:
          index === 0
            ? "0 26px 58px rgba(255,185,0,0.42), 0 12px 30px rgba(0,0,0,0.36)"
            : "0 22px 46px rgba(0,0,0,0.36)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -24,
          left: -20,
          width: 58,
          height: 58,
          borderRadius: 999,
          background: "#0f172a",
          color: "#ffffff",
          border: "4px solid #ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 29,
          fontWeight: 950,
        }}
      >
        {index + 1}
      </div>

      <div
        style={{
          fontSize: label.length > 24 ? 28 : 34,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: "-0.05em",
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
          id={`arrow-${Math.round(from.x)}-${Math.round(to.x)}`}
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
        markerEnd={`url(#arrow-${Math.round(from.x)}-${Math.round(to.x)})`}
        opacity="0.95"
      />
    </svg>
  );
};

const getTitle = (overlay?: OverlayLike, visualPlan?: unknown) => {
  const plan = visualPlan as any;
  const rawTitle = plan?.title || overlay?.frameLabel || overlay?.text || "Visual Explanation";
  const title = shortText(rawTitle, 5);

  if (!title || isBadText(title)) {
    return "Visual Explanation";
  }

  if (/alert/i.test(title) && !/warning|scam|risk|danger|mistake/i.test(getOverlayTextPool(overlay, visualPlan))) {
    return "Key Explanation";
  }

  return title;
};


const applyGenericRevealTiming = (nodes: SimpleNode[], overlay?: OverlayLike): SimpleNode[] => {
  const overlayStart = typeof overlay?.start === "number" ? Math.max(0, overlay.start) : 0;
  const overlayEnd = typeof overlay?.end === "number" && overlay.end > overlayStart
    ? overlay.end
    : overlayStart + 7;

  const duration = Math.max(3.5, overlayEnd - overlayStart);
  const maxNodes = Math.min(4, Math.max(2, nodes.length));
  const revealGap = Math.min(1.35, Math.max(0.85, duration / (maxNodes + 1)));

  return nodes.slice(0, 4).map((node, index) => ({
    ...node,
    start: overlayStart + index * revealGap,
  }));
};

export const SimpleInfographicRenderer: React.FC<{
  overlay?: OverlayLike;
  visualPlan?: unknown;
  time: number;
}> = ({ overlay, visualPlan, time }) => {
  const nodes = applyGenericRevealTiming(
    dedupeNodes(
      forceFirstNodeVisibleEarly(
        normalizeVisualPlanNodes(visualPlan, overlay),
        overlay
      )
    ).slice(0, 4),
    overlay
  );

  const safeNodes =
    nodes.length >= 2
      ? nodes
      : forceFirstNodeVisibleEarly(
          [
            { id: "fallback-1", label: "Key Point", start: overlay?.start || 0 },
            { id: "fallback-2", label: "Simple Meaning", start: (overlay?.start || 0) + 1.2 },
            { id: "fallback-3", label: "Final Takeaway", start: (overlay?.start || 0) + 2.4 },
          ],
          overlay
        );

  const positions = layoutFor(safeNodes.length);
  const title = getTitle(overlay, visualPlan);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(255,223,93,0.22), transparent 42%), linear-gradient(180deg, #08111f, #020617)",
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
            background: "rgba(255,255,255,0.13)",
            border: "2px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 950,
            letterSpacing: "-0.045em",
            textAlign: "center",
            boxShadow: "0 15px 34px rgba(0,0,0,0.28)",
          }}
        >
          {title}
        </div>
      </div>

      {safeNodes.slice(0, -1).map((node, index) => {
        const nextNode = safeNodes[index + 1];
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

      {safeNodes.map((node, index) => {
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
