import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type ProfessionalVisualType =
  | "CONCEPT_CARD"
  | "STEP_FLOW"
  | "COMPARISON_SPLIT"
  | "RISK_MAP"
  | "STAT_CARD"
  | "CHECKLIST"
  | "CAUSE_EFFECT";

type SimpleNode = {
  id: string;
  label: string;
  sublabel?: string;
  iconHint?: string;
  start: number;
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
  visualType?: string;
  assetBrief?: string;
  title?: string;
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
  /json/i,
];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const isBadText = (value?: string) => {
  const text = String(value || "").trim();
  if (!text) return true;
  return BAD_TEXT_PATTERNS.some((pattern) => pattern.test(text));
};

const cleanText = (value?: string) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s₹$%+.,:/=-]/g, "")
    .replace(/\bI\s+(?=Here|This|That|Domain|Hosting|Website|Explain)/gi, "")
    .replace(/\bHere is the\b/gi, "")
    .replace(/\bwhat is\b/gi, "")
    .replace(/\bshow\b/gi, "")
    .replace(/\bfocused on\b/gi, "")
    .trim();
};

const titleCase = (value: string) => {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 2 && !/ai|ui|ux|rbi|upi|seo/i.test(word)) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const shortText = (value?: string, maxWords = 4, maxChars = 34) => {
  const cleaned = cleanText(value);

  if (!cleaned || isBadText(cleaned)) return "";

  const words = cleaned.split(" ").filter(Boolean);
  const short = words.slice(0, maxWords).join(" ").slice(0, maxChars).trim();

  return titleCase(short);
};

const shortSubtext = (value?: string, maxWords = 7, maxChars = 58) => {
  const cleaned = cleanText(value);

  if (!cleaned || isBadText(cleaned)) return "";

  const words = cleaned.split(" ").filter(Boolean);
  return words.slice(0, maxWords).join(" ").slice(0, maxChars).trim();
};

const getOverlayTextPool = (overlay?: OverlayLike, visualPlan?: unknown) => {
  const plan = visualPlan as any;

  return [
    overlay?.title,
    overlay?.text,
    overlay?.body,
    overlay?.frameText,
    overlay?.frameLabel,
    overlay?.frameValue,
    overlay?.visual,
    overlay?.visualType,
    overlay?.assetBrief,
    overlay?.frameType,
    overlay?.layout,
    overlay?.layoutType,
    plan?.title,
    plan?.visualType,
    plan?.frameType,
    plan?.layout,
    plan?.layoutType,
    ...(Array.isArray(overlay?.frameItems) ? overlay?.frameItems || [] : []),
    ...(Array.isArray(plan?.nodes)
      ? plan.nodes.map((node: any) => `${node?.label || ""} ${node?.sublabel || ""} ${node?.text || ""}`)
      : []),
  ]
    .filter(Boolean)
    .join(" ");
};

const detectVisualType = (
  overlay?: OverlayLike,
  visualPlan?: unknown
): ProfessionalVisualType => {
  const plan = visualPlan as any;
  const explicit = String(
    plan?.visualType ||
      plan?.frameType ||
      overlay?.visualType ||
      overlay?.frameType ||
      overlay?.layoutType ||
      overlay?.layout ||
      overlay?.visual ||
      ""
  ).toLowerCase();

  const pool = `${explicit} ${getOverlayTextPool(overlay, visualPlan).toLowerCase()}`;

  if (/comparison|compare|versus| vs |beforeafter|before after|split|difference|different/.test(pool)) {
    return "COMPARISON_SPLIT";
  }

  if (/warning|risk|scam|fraud|danger|mistake|avoid|alert|fake|loss|reject|problem|careful/.test(pool)) {
    return "RISK_MAP";
  }

  if (/stat|number|salary|income|money|price|cost|revenue|profit|growth|percent|%|₹|\$|amount|pay/.test(pool)) {
    return "STAT_CARD";
  }

  if (/checklist|document|requirement|required|tips|list|points|prepare|ready/.test(pool)) {
    return "CHECKLIST";
  }

  if (/step|process|timeline|roadmap|flow|application|apply|register|submit|how to|kaise/.test(pool)) {
    return "STEP_FLOW";
  }

  if (/cause|effect|because|result|impact|leads to|why/.test(pool)) {
    return "CAUSE_EFFECT";
  }

  return "CONCEPT_CARD";
};

const inferIcon = (label: string, visualType: ProfessionalVisualType, index: number) => {
  const value = label.toLowerCase();

  if (visualType === "RISK_MAP") return ["⚠", "!", "✕", "⚡"][index] || "!";
  if (visualType === "STAT_CARD") return /₹|money|salary|pay|income|cost|price/.test(value) ? "₹" : ["#", "%", "+", "↗"][index] || "#";
  if (visualType === "CHECKLIST") return "✓";
  if (visualType === "COMPARISON_SPLIT") return index === 0 ? "A" : "B";

  if (/domain|website|web|url|link/.test(value)) return "🌐";
  if (/hosting|server|storage|file/.test(value)) return "▣";
  if (/money|salary|income|price|cost|pay/.test(value)) return "₹";
  if (/risk|scam|fraud|fake|danger/.test(value)) return "!";
  if (/job|career|interview|work/.test(value)) return "★";
  if (/document|form|apply|submit/.test(value)) return "□";

  return String(index + 1);
};

const splitToParts = (value?: string) => {
  return String(value || "")
    .split(/\n|•|\||;|\. /)
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildNodesFromOverlay = (overlay?: OverlayLike): SimpleNode[] => {
  const start = typeof overlay?.start === "number" ? overlay.start : 0;
  const end = typeof overlay?.end === "number" ? overlay.end : start + 7;

  const frameItems = Array.isArray(overlay?.frameItems)
    ? overlay.frameItems.filter((item) => !isBadText(item))
    : [];

  const sourceParts =
    frameItems.length >= 2
      ? frameItems
      : splitToParts(overlay?.body).length >= 2
        ? splitToParts(overlay?.body)
        : splitToParts(overlay?.text);

  const cleanParts = sourceParts
    .map((item) => ({
      label: shortText(item, 4, 34),
      sublabel: shortSubtext(item, 8, 58),
    }))
    .filter((item) => item.label && !isBadText(item.label));

  const safeParts =
    cleanParts.length >= 2
      ? cleanParts.slice(0, 4)
      : [
          { label: "Key Point", sublabel: "Main idea from this beat" },
          { label: "Simple Meaning", sublabel: "Easy visual explanation" },
          { label: "Final Takeaway", sublabel: "What viewer should remember" },
        ];

  const step = Math.max(0.85, (end - start) / Math.max(2, safeParts.length + 1));

  return safeParts.map((item, index) => ({
    id: `node-${index + 1}`,
    label: item.label,
    sublabel: item.sublabel && item.sublabel !== item.label ? item.sublabel : undefined,
    start: start + index * step,
  }));
};

const normalizeVisualPlanNodes = (
  visualPlan: unknown,
  overlay?: OverlayLike
): SimpleNode[] => {
  const plan = visualPlan as any;
  const overlayStart = typeof overlay?.start === "number" ? overlay.start : 0;

  if (Array.isArray(plan?.nodes) && plan.nodes.length > 0) {
    const nodes = plan.nodes
      .map((node: any, index: number) => {
        const rawLabel = node?.label || node?.shortLabel || node?.text || node?.title || "";
        const rawSublabel = node?.sublabel || node?.description || node?.caption || node?.body || "";

        return {
          id: node?.id || `plan-${index + 1}`,
          label: shortText(rawLabel, 4, 34),
          sublabel: shortSubtext(rawSublabel, 8, 58),
          iconHint: node?.iconHint || node?.icon || node?.assetHint,
          start:
            typeof node?.start === "number"
              ? node.start
              : overlayStart + index * 1.1,
        };
      })
      .filter((node: SimpleNode) => node.label && !isBadText(node.label))
      .slice(0, 4);

    if (nodes.length >= 2) return nodes;
  }

  return buildNodesFromOverlay(overlay);
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

const applyAccumulativeRevealTiming = (nodes: SimpleNode[], overlay?: OverlayLike): SimpleNode[] => {
  const overlayStart = typeof overlay?.start === "number" ? Math.max(0, overlay.start) : 0;
  const overlayEnd = typeof overlay?.end === "number" && overlay.end > overlayStart
    ? overlay.end
    : overlayStart + 7;

  const duration = Math.max(3.5, overlayEnd - overlayStart);
  const count = Math.min(4, Math.max(2, nodes.length));
  const revealGap = Math.min(1.35, Math.max(0.75, duration / (count + 1)));

  return nodes.slice(0, 4).map((node, index) => ({
    ...node,
    start: overlayStart + index * revealGap,
  }));
};

const getTitle = (
  overlay?: OverlayLike,
  visualPlan?: unknown,
  visualType?: ProfessionalVisualType
) => {
  const plan = visualPlan as any;
  const rawTitle =
    plan?.title ||
    overlay?.title ||
    overlay?.frameLabel ||
    overlay?.frameText ||
    overlay?.text ||
    "";

  const title = shortText(rawTitle, 5, 46);

  if (title && !isBadText(title) && !/^alert$/i.test(title)) {
    return title;
  }

  if (visualType === "COMPARISON_SPLIT") return "Quick Comparison";
  if (visualType === "RISK_MAP") return "Risk Check";
  if (visualType === "STAT_CARD") return "Key Number";
  if (visualType === "CHECKLIST") return "Important Points";
  if (visualType === "STEP_FLOW") return "Step By Step";
  if (visualType === "CAUSE_EFFECT") return "Cause And Effect";

  return "Visual Explanation";
};

const getLayout = (visualType: ProfessionalVisualType, count: number) => {
  if (visualType === "COMPARISON_SPLIT") {
    return [
      { x: 290, y: 365 },
      { x: 790, y: 365 },
    ];
  }

  if (visualType === "CHECKLIST") {
    return [
      { x: 540, y: 210 },
      { x: 540, y: 330 },
      { x: 540, y: 450 },
      { x: 540, y: 570 },
    ];
  }

  if (visualType === "STAT_CARD") {
    return [
      { x: 540, y: 260 },
      { x: 310, y: 500 },
      { x: 540, y: 540 },
      { x: 770, y: 500 },
    ];
  }

  if (visualType === "RISK_MAP") {
    return [
      { x: 230, y: 270 },
      { x: 540, y: 360 },
      { x: 850, y: 270 },
      { x: 540, y: 540 },
    ];
  }

  if (count <= 3) {
    return [
      { x: 210, y: 370 },
      { x: 540, y: 245 },
      { x: 870, y: 370 },
    ];
  }

  return [
    { x: 210, y: 240 },
    { x: 870, y: 240 },
    { x: 210, y: 515 },
    { x: 870, y: 515 },
  ];
};

const getTheme = (visualType: ProfessionalVisualType, index: number) => {
  if (visualType === "RISK_MAP") {
    return {
      primary: index === 0 ? "linear-gradient(135deg, #ff5d5d, #ff9f1c)" : "linear-gradient(135deg, #fff1f2, #ffe4e6)",
      accent: "#fb7185",
      text: "#7f1d1d",
      badge: "#991b1b",
    };
  }

  if (visualType === "STAT_CARD") {
    return {
      primary: index === 0 ? "linear-gradient(135deg, #34d399, #facc15)" : "linear-gradient(135deg, #ecfdf5, #fefce8)",
      accent: "#34d399",
      text: "#064e3b",
      badge: "#065f46",
    };
  }

  if (visualType === "CHECKLIST") {
    return {
      primary: index === 0 ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "linear-gradient(135deg, #eff6ff, #f5f3ff)",
      accent: "#60a5fa",
      text: "#172554",
      badge: "#1d4ed8",
    };
  }

  return {
    primary: index === 0 ? "linear-gradient(135deg, #ffdf5d, #ff9f1c)" : "linear-gradient(135deg, #ffffff, #eaf0ff)",
    accent: "#ffdf5d",
    text: "#0f172a",
    badge: "#0f172a",
  };
};

const AnimatedNode: React.FC<{
  node: SimpleNode;
  index: number;
  visualType: ProfessionalVisualType;
  x: number;
  y: number;
}> = ({ node, index, visualType, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.round(node.start * fps);
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

  const theme = getTheme(visualType, index);
  const icon = node.iconHint || inferIcon(node.label, visualType, index);
  const isChecklist = visualType === "CHECKLIST";
  const width = isChecklist ? 680 : visualType === "COMPARISON_SPLIT" ? 390 : 320;
  const minHeight = isChecklist ? 92 : visualType === "STAT_CARD" && index === 0 ? 165 : 142;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        minHeight,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderRadius: isChecklist ? 28 : 34,
        padding: isChecklist ? "18px 26px 18px 88px" : "22px 24px",
        background: theme.primary,
        border: "5px solid rgba(255,255,255,0.92)",
        boxShadow:
          index === 0
            ? `0 26px 58px ${visualType === "RISK_MAP" ? "rgba(255,90,90,0.34)" : "rgba(255,185,0,0.38)"}, 0 12px 30px rgba(0,0,0,0.34)`
            : "0 22px 46px rgba(0,0,0,0.34)",
        display: "flex",
        flexDirection: "column",
        alignItems: isChecklist ? "flex-start" : "center",
        justifyContent: "center",
        textAlign: isChecklist ? "left" : "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: isChecklist ? 18 : -24,
          left: isChecklist ? 24 : -20,
          width: 58,
          height: 58,
          borderRadius: 999,
          background: theme.badge,
          color: "#ffffff",
          border: "4px solid #ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: icon.length > 1 ? 24 : 29,
          fontWeight: 950,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: node.label.length > 24 ? 27 : isChecklist ? 33 : 35,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: "-0.05em",
          color: theme.text,
        }}
      >
        {node.label}
      </div>

      {node.sublabel ? (
        <div
          style={{
            marginTop: 9,
            maxWidth: isChecklist ? 520 : 260,
            fontSize: node.sublabel.length > 38 ? 18 : 21,
            lineHeight: 1.12,
            fontWeight: 800,
            color: "rgba(15,23,42,0.72)",
          }}
        >
          {node.sublabel}
        </div>
      ) : null}
    </div>
  );
};

const Connector: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  visible: boolean;
  revealSecond: number;
  visualType: ProfessionalVisualType;
}> = ({ from, to, visible, revealSecond, visualType }) => {
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
  const color = visualType === "RISK_MAP" ? "#fb7185" : visualType === "STAT_CARD" ? "#34d399" : "#ffdf5d";

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
          id={`arrow-${visualType}-${Math.round(from.x)}-${Math.round(to.x)}`}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M2,2 L10,6 L2,10 Z" fill={color} />
        </marker>
      </defs>

      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd={`url(#arrow-${visualType}-${Math.round(from.x)}-${Math.round(to.x)})`}
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
  const visualType = detectVisualType(overlay, visualPlan);
  const rawNodes = dedupeNodes(normalizeVisualPlanNodes(visualPlan, overlay));
  const nodes = applyAccumulativeRevealTiming(rawNodes, overlay);

  const safeNodes =
    nodes.length >= 2
      ? nodes
      : applyAccumulativeRevealTiming(
          [
            { id: "fallback-1", label: "Key Point", sublabel: "Main idea from this beat", start: overlay?.start || 0 },
            { id: "fallback-2", label: "Simple Meaning", sublabel: "Easy visual explanation", start: (overlay?.start || 0) + 1.2 },
            { id: "fallback-3", label: "Final Takeaway", sublabel: "What viewer should remember", start: (overlay?.start || 0) + 2.4 },
          ],
          overlay
        );

  const displayNodes =
    visualType === "COMPARISON_SPLIT" ? safeNodes.slice(0, 2) : safeNodes.slice(0, 4);

  const positions = getLayout(visualType, displayNodes.length);
  const title = getTitle(overlay, visualPlan, visualType);
  const showConnectors =
    visualType !== "CHECKLIST" && visualType !== "COMPARISON_SPLIT";

  return (
    <AbsoluteFill
      style={{
        background:
          visualType === "RISK_MAP"
            ? "radial-gradient(circle at 50% 0%, rgba(251,113,133,0.26), transparent 42%), linear-gradient(180deg, #190b12, #020617)"
            : visualType === "STAT_CARD"
              ? "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.24), transparent 42%), linear-gradient(180deg, #071a15, #020617)"
              : "radial-gradient(circle at 50% 0%, rgba(255,223,93,0.22), transparent 42%), linear-gradient(180deg, #08111f, #020617)",
        overflow: "hidden",
        borderRadius: 34,
        border: "2px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 46,
          right: 46,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 800,
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

      <div
        style={{
          position: "absolute",
          top: 95,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "rgba(255,255,255,0.72)",
          fontSize: 18,
          fontWeight: 850,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {visualType.replace(/_/g, " ")}
      </div>

      {visualType === "COMPARISON_SPLIT" ? (
        <div
          style={{
            position: "absolute",
            top: 345,
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ffdf5d",
            fontSize: 44,
            fontWeight: 1000,
            textShadow: "0 8px 26px rgba(0,0,0,0.45)",
          }}
        >
          VS
        </div>
      ) : null}

      {showConnectors
        ? displayNodes.slice(0, -1).map((node, index) => {
            const nextNode = displayNodes[index + 1];
            const visible = time >= nextNode.start;

            return (
              <Connector
                key={`line-${node.id}-${nextNode.id}`}
                from={positions[index]}
                to={positions[index + 1]}
                visible={visible}
                revealSecond={nextNode.start}
                visualType={visualType}
              />
            );
          })
        : null}

      {displayNodes.map((node, index) => {
        if (time < node.start) return null;

        return (
          <AnimatedNode
            key={node.id}
            node={node}
            index={index}
            visualType={visualType}
            x={positions[index].x}
            y={positions[index].y}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 38,
          right: 38,
          bottom: 24,
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clamp(((time - (overlay?.start || 0)) / Math.max(1, (overlay?.end || 7) - (overlay?.start || 0))) * 100, 0, 100)}%`,
            height: "100%",
            background:
              visualType === "RISK_MAP"
                ? "linear-gradient(90deg, #fb7185, #f97316)"
                : visualType === "STAT_CARD"
                  ? "linear-gradient(90deg, #34d399, #facc15)"
                  : "linear-gradient(90deg, #ffdf5d, #ff9f1c)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export default SimpleInfographicRenderer;
