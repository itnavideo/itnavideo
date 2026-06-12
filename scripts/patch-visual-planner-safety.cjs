const fs = require("fs");

const path = "services/ai/visualPlanner.ts";
let text = fs.readFileSync(path, "utf8");

function replaceOrFail(from, to, label) {
  if (!text.includes(from)) {
    console.error(`Could not find block: ${label}`);
    process.exit(1);
  }
  text = text.replace(from, to);
}

// 1) Do not force last scene into CTAFrame unless explicit CTA words exist.
replaceOrFail(
  "  if (index === total - 1) return 'CTAFrame';",
  `  if (
    index === total - 1 &&
    /\\b(follow|subscribe|share|comment|save|download|try now|start now|visit|sign up|signup|join|click|learn more|call now|book now)\\b/.test(value)
  ) {
    return 'CTAFrame';
  }`,
  "last scene CTAFrame rule"
);

// 2) Make warning frame label conditional; normal explainers should not say ALERT.
replaceOrFail(
  "  if (visualType === 'warning') return 'ALERT';",
  `  if (visualType === 'warning') return 'RISK CHECK';`,
  "warning label"
);

// 3) Replace user-facing instruction phrases with clean semantic labels.
replaceOrFail(
  "  if (visualType === 'timeline') return `Show a ${items.length}-step frame: ${items.join(' -> ')}.`;\n  if (visualType === 'checklist') return `Show a checklist frame with ${items.join(', ')}.`;\n  if (visualType === 'comparison') return `Show a comparison frame for ${items.slice(0, 2).join(' vs ')}.`;\n  return `Show a ${frameType} focused on ${frameText}.`;",
  `  if (visualType === 'timeline') return items.slice(0, 4).join(' → ');
  if (visualType === 'checklist') return items.slice(0, 4).join(' • ');
  if (visualType === 'comparison') return items.slice(0, 2).join(' vs ');
  if (visualType === 'cta') return trimPlannerWords(frameText, 6);
  return trimPlannerWords(frameText, 7);`,
  "buildShowWhat instruction text"
);

// 4) Prevent urgent emotion on first scene unless actually warning.
replaceOrFail(
  "  if (visualType === 'warning' || index === 0) return 'urgent';",
  "  if (visualType === 'warning') return 'urgent';\n  if (index === 0) return 'informative';",
  "selectEmotion first scene"
);

fs.writeFileSync(path, text, "utf8");
console.log("Visual planner safety patch applied.");
