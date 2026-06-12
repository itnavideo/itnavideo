const fs = require("fs");

const path = "remotion/templates/VIDEO_EXPLAINER/SimpleInfographicRenderer.tsx";
let text = fs.readFileSync(path, "utf8");

function replaceAllLiteral(from, to) {
  text = text.split(from).join(to);
}

function insertBefore(marker, code, label) {
  if (text.includes(code.trim().split("\n")[0])) {
    console.log(`${label} already exists`);
    return;
  }

  if (!text.includes(marker)) {
    console.error(`Could not find marker: ${label}`);
    process.exit(1);
  }

  text = text.replace(marker, code + "\n" + marker);
}

// Remove Domain/Hosting-specific constants and helpers. This makes renderer generic.
text = text.replace(
`const DOMAIN_HOSTING_PATTERNS = [
  /domain/i,
  /hosting/i,
  /website address/i,
  /server/i,
  /www\\./i,
  /\\.com/i,
];

`,
""
);

text = text.replace(
`const looksLikeDomainHosting = (overlay?: OverlayLike, visualPlan?: unknown) => {
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

`,
""
);

// Add professional visual type + helper functions before layoutFor.
insertBefore(
"const layoutFor = (count: number) => {",
`type ProfessionalVisualType =
  | "CONCEPT_CARD"
  | "STEP_FLOW"
  | "COMPARISON_SPLIT"
  | "RISK_MAP"
  | "STAT_CARD"
  | "CHECKLIST";

const getProfessionalVisualType = (
  overlay?: OverlayLike,
  visualPlan?: unknown
): ProfessionalVisualType => {
  const plan = visualPlan as any;
  const explicit = String(
    plan?.visualType ||
      plan?.frameType ||
      overlay?.frameType ||
      overlay?.layoutType ||
      overlay?.layout ||
      overlay?.visual ||
      ""
  ).toLowerCase();

  const pool = getOverlayTextPool(overlay, visualPlan).toLowerCase();

  if (/comparison|compare|versus| vs |beforeafter|before after|split/.test(explicit + " " + pool)) {
    return "COMPARISON_SPLIT";
  }

  if (/warning|risk|scam|fraud|danger|mistake|avoid|alert|fake|loss|reject|problem/.test(explicit + " " + pool)) {
    return "RISK_MAP";
  }

  if (/stat|number|salary|income|money|price|cost|revenue|profit|growth|percent|%|₹|\\$/.test(explicit + " " + pool)) {
    return "STAT_CARD";
  }

  if (/checklist|document|requirement|required|tips|list|points/.test(explicit + " " + pool)) {
    return "CHECKLIST";
  }

  if (/step|process|timeline|roadmap|flow|application|apply|register|submit/.test(explicit + " " + pool)) {
    return "STEP_FLOW";
  }

  return "CONCEPT_CARD";
};

const getNodeIcon = (visualType: ProfessionalVisualType, index: number) => {
  if (visualType === "RISK_MAP") return ["!", "⚠", "✕", "!"][index] || "!";
  if (visualType === "STAT_CARD") return ["₹", "%", "+", "↗"][index] || "#";
  if (visualType === "CHECKLIST") return "✓";
  if (visualType === "COMPARISON_SPLIT") return index === 0 ? "A" : "B";
  return String(index + 1);
};

const getProfessionalTitle = (
  title: string,
  visualType: ProfessionalVisualType
) => {
  if (title !== "Visual Explanation" && title !== "Key Explanation") return title;

  if (visualType === "COMPARISON_SPLIT") return "Quick Comparison";
  if (visualType === "RISK_MAP") return "Risk Check";
  if (visualType === "STAT_CARD") return "Key Number";
  if (visualType === "CHECKLIST") return "Important Points";
  if (visualType === "STEP_FLOW") return "Step By Step";

  return title;
};

`,
"professional visual helpers"
);

// Replace node number badge with icon-aware badge.
replaceAllLiteral(
`        {index + 1}`,
`        {getNodeIcon("STEP_FLOW", index)}`
);

// Add visualType prop to AnimatedNode.
text = text.replace(
`const AnimatedNode: React.FC<{
  label: string;
  index: number;
  startSecond: number;
  x: number;
  y: number;
}> = ({ label, index, startSecond, x, y }) => {`,
`const AnimatedNode: React.FC<{
  label: string;
  index: number;
  startSecond: number;
  x: number;
  y: number;
  visualType?: ProfessionalVisualType;
}> = ({ label, index, startSecond, x, y, visualType = "STEP_FLOW" }) => {`
);

replaceAllLiteral(
`        {getNodeIcon("STEP_FLOW", index)}`,
`        {getNodeIcon(visualType, index)}`
);

// Make node color vary by visualType.
text = text.replace(
`        background:
          index === 0
            ? "linear-gradient(135deg, #ffdf5d, #ff9f1c)"
            : "linear-gradient(135deg, #ffffff, #eaf0ff)",`,
`        background:
          visualType === "RISK_MAP"
            ? index === 0
              ? "linear-gradient(135deg, #ff5d5d, #ff9f1c)"
              : "linear-gradient(135deg, #fff1f2, #ffe4e6)"
            : visualType === "STAT_CARD"
              ? index === 0
                ? "linear-gradient(135deg, #34d399, #facc15)"
                : "linear-gradient(135deg, #ecfdf5, #fefce8)"
              : index === 0
                ? "linear-gradient(135deg, #ffdf5d, #ff9f1c)"
                : "linear-gradient(135deg, #ffffff, #eaf0ff)",`
);

// Add visualType in component.
text = text.replace(
`  const positions = layoutFor(safeNodes.length);
  const title = getTitle(overlay, visualPlan);`,
`  const visualType = getProfessionalVisualType(overlay, visualPlan);
  const positions = layoutFor(
    visualType === "COMPARISON_SPLIT" ? Math.min(2, safeNodes.length) : safeNodes.length
  );
  const title = getProfessionalTitle(getTitle(overlay, visualPlan), visualType);`
);

// Pass visualType prop to AnimatedNode call.
replaceAllLiteral(
`              y={positions[index].y}
            />`,
`              y={positions[index].y}
              visualType={visualType}
            />`
);

// Add visual type badge near title.
text = text.replace(
`          {title}
        </div>
      </div>`,
`          {title}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 96,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "rgba(255,255,255,0.72)",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {visualType.replace(/_/g, " ")}
      </div>`
);

fs.writeFileSync(path, text, "utf8");
console.log("Professional infographic renderer patch applied.");
