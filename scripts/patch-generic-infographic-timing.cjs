const fs = require("fs");

const path = "remotion/templates/VIDEO_EXPLAINER/SimpleInfographicRenderer.tsx";
let text = fs.readFileSync(path, "utf8");

function replaceOrFail(from, to, label) {
  if (!text.includes(from)) {
    console.error(`Could not find: ${label}`);
    process.exit(1);
  }
  text = text.replace(from, to);
}

// 1) Stop forcing Domain/Hosting custom nodes.
// Keep the helper in file harmlessly, but do not use it.
replaceOrFail(
`  if (looksLikeDomainHosting(overlay, visualPlan)) {
    return buildDomainHostingNodes(overlay);
  }

`,
``,
"domain hosting forced node branch"
);

// 2) Stop forcing title "Domain vs Hosting".
// Title should come from topic/visualPlan/overlay generically.
replaceOrFail(
`  if (looksLikeDomainHosting(overlay, visualPlan)) {
    return "Domain vs Hosting";
  }

`,
``,
"domain hosting forced title branch"
);

// 3) Add generic timing helper before export component.
const marker = `export const SimpleInfographicRenderer: React.FC<{`;

if (!text.includes("const applyGenericRevealTiming =")) {
  const helper = `
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

`;

  if (!text.includes(marker)) {
    console.error("Could not find export component marker");
    process.exit(1);
  }

  text = text.replace(marker, helper + marker);
}

// 4) Apply generic timing to all nodes before rendering.
replaceOrFail(
`  const nodes = dedupeNodes(
    forceFirstNodeVisibleEarly(
      normalizeVisualPlanNodes(visualPlan, overlay),
      overlay
    )
  ).slice(0, 4);`,
`  const nodes = applyGenericRevealTiming(
    dedupeNodes(
      forceFirstNodeVisibleEarly(
        normalizeVisualPlanNodes(visualPlan, overlay),
        overlay
      )
    ).slice(0, 4),
    overlay
  );`,
"nodes timing block"
);

fs.writeFileSync(path, text, "utf8");
console.log("Generic infographic timing patch applied.");
