const fs = require("fs");

const path = "services/ai/visualPlanner.ts";
let text = fs.readFileSync(path, "utf8");

function replaceOrFail(from, to, label) {
  if (!text.includes(from)) {
    console.error(`Could not find: ${label}`);
    process.exit(1);
  }
  text = text.replace(from, to);
}

function replaceIfFound(from, to, label) {
  if (text.includes(from)) {
    text = text.replace(from, to);
    console.log(`Updated: ${label}`);
  } else {
    console.log(`Skipped missing exact block: ${label}`);
  }
}

// 1) Expand visualType union so TS accepts professional renderer types.
text = text.replace(
  "visualType: 'question' | 'stat' | 'checklist' | 'timeline' | 'comparison' | 'warning' | 'quote' | 'cta' | 'concept' | 'ACCUMULATIVE_FLOWCHART' | 'STEP_BY_STEP_LIST' | 'COMPARISON_SPLIT' | 'WARNING_RISK_MAP' | 'SIMPLE_STAT_CARD';",
  "visualType: 'question' | 'stat' | 'checklist' | 'timeline' | 'comparison' | 'warning' | 'quote' | 'cta' | 'concept' | 'ACCUMULATIVE_FLOWCHART' | 'STEP_BY_STEP_LIST' | 'COMPARISON_SPLIT' | 'WARNING_RISK_MAP' | 'SIMPLE_STAT_CARD' | 'CONCEPT_CARD' | 'STEP_FLOW' | 'RISK_MAP' | 'STAT_CARD' | 'CHECKLIST' | 'CAUSE_EFFECT';"
);

// 2) Remove auto-last-scene CTA condition only.
text = text.replace(
  /index === total - 1\s*\|\|\s*\n\s*/g,
  ""
);

// 3) Return professional visualType names from detectVisualType.
text = text
  .replaceAll("return 'WARNING_RISK_MAP';", "return 'RISK_MAP';")
  .replaceAll("return 'ACCUMULATIVE_FLOWCHART';", "return 'STEP_FLOW';")
  .replaceAll("return 'STEP_BY_STEP_LIST';", "return 'STEP_FLOW';")
  .replaceAll("return 'SIMPLE_STAT_CARD';", "return 'STAT_CARD';")
  .replaceAll("return 'checklist';", "return 'CHECKLIST';")
  .replaceAll("return 'question';", "return 'CONCEPT_CARD';")
  .replaceAll("return 'concept';", "return 'CONCEPT_CARD';");

// 4) Make selectFrameType support professional names.
replaceIfFound(
  "  if (visualType === 'ACCUMULATIVE_FLOWCHART') return 'ProcessFlow';\n  if (visualType === 'STEP_BY_STEP_LIST') return /\\b(apply|application|form|submit|upload|register)\\b/.test(value) ? 'ApplicationFlow' : 'ProcessFlow';\n  if (visualType === 'COMPARISON_SPLIT') return /\\bbefore|after\\b/.test(value) ? 'BeforeAfter' : 'ComparisonCard';\n  if (visualType === 'WARNING_RISK_MAP') return 'AlertCard';\n  if (visualType === 'SIMPLE_STAT_CARD') return /\\b(growth|profit|revenue|income|roi|stock|market|investment|return)\\b/.test(value) ? 'MoneyGrowthGraph' : 'BigNumberReveal';",
  "  if (visualType === 'ACCUMULATIVE_FLOWCHART' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST') {\n    return /\\b(apply|application|form|submit|upload|register)\\b/.test(value) ? 'ApplicationFlow' : 'ProcessFlow';\n  }\n  if (visualType === 'COMPARISON_SPLIT') return /\\bbefore|after\\b/.test(value) ? 'BeforeAfter' : 'ComparisonCard';\n  if (visualType === 'WARNING_RISK_MAP' || visualType === 'RISK_MAP') return 'AlertCard';\n  if (visualType === 'SIMPLE_STAT_CARD' || visualType === 'STAT_CARD') return /\\b(growth|profit|revenue|income|roi|stock|market|investment|return)\\b/.test(value) ? 'MoneyGrowthGraph' : 'BigNumberReveal';",
  "selectFrameType top professional branches"
);

text = text.replaceAll("visualType === 'checklist'", "visualType === 'checklist' || visualType === 'CHECKLIST'");
text = text.replaceAll("visualType === 'warning'", "visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP'");
text = text.replaceAll("visualType === 'stat'", "visualType === 'stat' || visualType === 'STAT_CARD' || visualType === 'SIMPLE_STAT_CARD'");
text = text.replaceAll("visualType === 'timeline'", "visualType === 'timeline' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST' || visualType === 'ACCUMULATIVE_FLOWCHART'");
text = text.replaceAll("visualType === 'comparison'", "visualType === 'comparison' || visualType === 'COMPARISON_SPLIT'");
text = text.replaceAll("visualType === 'question'", "visualType === 'question' || visualType === 'CONCEPT_CARD'");

// 5) Clean frameItems after raw split.
replaceIfFound(
  "  const items = raw.slice(0, limit);",
  "  const items = raw\n    .map((item) => trimPlannerWords(item, 4))\n    .filter((item) => item.length > 1)\n    .filter((item) => !/\\b(show|frame|visual|asset|template|component|focused|cta|prompt|json)\\b/i.test(item))\n    .slice(0, limit);",
  "clean buildFrameItems items"
);

// 6) Make splitPlannerItems stricter.
replaceIfFound(
  "    .filter((item) => item.split(/\\s+/).length <= 7)\n    .filter((item) => item.length > 2);",
  "    .map((item) => trimPlannerWords(item, 5))\n    .filter((item) => item.split(/\\s+/).length <= 5)\n    .filter((item) => item.length > 2)\n    .filter((item) => !/\\b(show|frame|visual|asset|template|component|focused|cta|prompt|json)\\b/i.test(item));",
  "strict splitPlannerItems"
);

// 7) Remove prompt-like output from buildShowWhat.
replaceIfFound(
  "  if (value) return `Show ${value} as the hero number with ${frameText} context.`;",
  "  if (value) return [value, frameText].filter(Boolean).join(' • ');",
  "clean buildShowWhat value"
);

replaceIfFound(
  "  return `${visualType} frame matches this script window because the spoken line says: ${trimPlannerWords(scriptText, 12)}.`;",
  "  return `${visualType} matches spoken idea: ${trimPlannerWords(scriptText, 10)}.`;",
  "clean whyMatchesScript"
);

// 8) Make last scene not always bell.
text = text.replaceAll("if (index === total - 1 || visualType === 'cta') return 'bell';", "if (visualType === 'cta') return 'bell';");

fs.writeFileSync(path, text, "utf8");
console.log("visualPlanner robust professional sync applied.");
