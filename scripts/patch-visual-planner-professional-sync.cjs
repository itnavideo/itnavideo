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

// 1) Do NOT auto-convert last scene to CTA.
// CTA should happen only when script clearly asks follow/save/share/subscribe/etc.
replaceOrFail(
`  if (
    index === total - 1 ||
    seed.purpose === 'cta' ||
    /\\b(follow|save|comment|share|subscribe|download|try now|start now|call to action)\\b/.test(value)
  ) {
    return 'cta';
  }`,
`  if (
    seed.purpose === 'cta' ||
    /\\b(follow|save|comment|share|subscribe|download|try now|start now|call to action|visit|sign up|signup|join|click|learn more|call now|book now)\\b/.test(value)
  ) {
    return 'cta';
  }`,
"detectVisualType CTA rule"
);

// 2) Return renderer-friendly professional visual type names.
text = text
  .replaceAll("return 'WARNING_RISK_MAP';", "return 'RISK_MAP' as VisualPlanScene['visualType'];")
  .replaceAll("return 'COMPARISON_SPLIT';", "return 'COMPARISON_SPLIT' as VisualPlanScene['visualType'];")
  .replaceAll("return 'ACCUMULATIVE_FLOWCHART';", "return 'STEP_FLOW' as VisualPlanScene['visualType'];")
  .replaceAll("return 'STEP_BY_STEP_LIST';", "return 'STEP_FLOW' as VisualPlanScene['visualType'];")
  .replaceAll("return 'SIMPLE_STAT_CARD';", "return 'STAT_CARD' as VisualPlanScene['visualType'];")
  .replaceAll("return 'checklist';", "return 'CHECKLIST' as VisualPlanScene['visualType'];")
  .replaceAll("return 'question';", "return 'CONCEPT_CARD' as VisualPlanScene['visualType'];")
  .replaceAll("return 'concept';", "return 'CONCEPT_CARD' as VisualPlanScene['visualType'];");

// 3) selectFrameType must understand professional visualType names.
replaceOrFail(
`  if (visualType === 'ACCUMULATIVE_FLOWCHART') return 'ProcessFlow';
  if (visualType === 'STEP_BY_STEP_LIST') return /\\b(apply|application|form|submit|upload|register)\\b/.test(value) ? 'ApplicationFlow' : 'ProcessFlow';
  if (visualType === 'COMPARISON_SPLIT') return /\\bbefore|after\\b/.test(value) ? 'BeforeAfter' : 'ComparisonCard';
  if (visualType === 'WARNING_RISK_MAP') return 'AlertCard';
  if (visualType === 'SIMPLE_STAT_CARD') return /\\b(growth|profit|revenue|income|roi|stock|market|investment|return)\\b/.test(value) ? 'MoneyGrowthGraph' : 'BigNumberReveal';`,
`  if (visualType === 'ACCUMULATIVE_FLOWCHART' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST') {
    return /\\b(apply|application|form|submit|upload|register)\\b/.test(value) ? 'ApplicationFlow' : 'ProcessFlow';
  }
  if (visualType === 'COMPARISON_SPLIT') return /\\bbefore|after\\b/.test(value) ? 'BeforeAfter' : 'ComparisonCard';
  if (visualType === 'WARNING_RISK_MAP' || visualType === 'RISK_MAP') return 'AlertCard';
  if (visualType === 'SIMPLE_STAT_CARD' || visualType === 'STAT_CARD') return /\\b(growth|profit|revenue|income|roi|stock|market|investment|return)\\b/.test(value) ? 'MoneyGrowthGraph' : 'BigNumberReveal';`,
"selectFrameType professional branches"
);

// 4) checklist branch should also support uppercase CHECKLIST.
replaceOrFail(
`  if (visualType === 'checklist') {`,
`  if (visualType === 'checklist' || visualType === 'CHECKLIST') {`,
"checklist branch"
);

// 5) Build clean frame items: never output long transcript lines or prompt-like text.
replaceOrFail(
`  const items = raw.slice(0, limit);`,
`  const items = raw
    .map((item) => trimPlannerWords(item, 4))
    .filter((item) => item.length > 1)
    .filter((item) => !/\\b(show|frame|visual|asset|template|component|focused|cta)\\b/i.test(item))
    .slice(0, limit);`,
"clean frameItems items"
);

// 6) Make splitPlannerItems stricter for clean infographic labels.
replaceOrFail(
`    .filter((item) => item.split(/\\s+/).length <= 7)
    .filter((item) => item.length > 2);`,
`    .map((item) => trimPlannerWords(item, 5))
    .filter((item) => item.split(/\\s+/).length <= 5)
    .filter((item) => item.length > 2)
    .filter((item) => !/\\b(show|frame|visual|asset|template|component|focused|cta|prompt|json)\\b/i.test(item));`,
"splitPlannerItems strict filter"
);

// 7) Frame label should support professional names.
replaceOrFail(
`  if (visualType === 'question') return 'QUESTION';
  if (visualType === 'stat') return 'KEY NUMBER';
  if (visualType === 'timeline') return 'ROADMAP';
  if (visualType === 'comparison') return 'comparisonImages';
  if (visualType === 'warning') return 'RISK CHECK';
  if (visualType === 'cta') return 'NEXT STEP';`,
`  if (visualType === 'question' || visualType === 'CONCEPT_CARD') return 'VISUAL EXPLANATION';
  if (visualType === 'stat' || visualType === 'STAT_CARD' || visualType === 'SIMPLE_STAT_CARD') return 'KEY NUMBER';
  if (visualType === 'timeline' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST' || visualType === 'ACCUMULATIVE_FLOWCHART') return 'STEP BY STEP';
  if (visualType === 'comparison' || visualType === 'COMPARISON_SPLIT') return 'QUICK COMPARISON';
  if (visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP') return 'RISK CHECK';
  if (visualType === 'checklist' || visualType === 'CHECKLIST') return 'IMPORTANT POINTS';
  if (visualType === 'cta') return 'NEXT STEP';`,
"buildFrameLabel professional labels"
);

// 8) Spoken meaning should support professional names.
replaceOrFail(
`  const prefix = visualType === 'stat'
    ? 'This line is explaining a measurable number'
    : visualType === 'timeline'
      ? 'This line is explaining a sequence'
      : visualType === 'checklist'
        ? 'This line is listing what matters'
        : visualType === 'warning'
          ? 'This line warns the viewer'
          : 'This line introduces the key idea';`,
`  const prefix = visualType === 'stat' || visualType === 'STAT_CARD' || visualType === 'SIMPLE_STAT_CARD'
    ? 'This line is explaining a measurable number'
    : visualType === 'timeline' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST' || visualType === 'ACCUMULATIVE_FLOWCHART'
      ? 'This line is explaining a sequence'
      : visualType === 'checklist' || visualType === 'CHECKLIST'
        ? 'This line is listing what matters'
        : visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP'
          ? 'This line warns the viewer'
          : 'This line introduces the key idea';`,
"buildSpokenMeaning professional prefix"
);

// 9) buildShowWhat should output clean semantic text only.
replaceOrFail(
`  if (value) return \`Show \${value} as the hero number with \${frameText} context.\`;
  if (visualType === 'timeline') return items.slice(0, 4).join(' → ');
  if (visualType === 'checklist') return items.slice(0, 4).join(' • ');
  if (visualType === 'comparison') return items.slice(0, 2).join(' vs ');
  if (visualType === 'cta') return trimPlannerWords(frameText, 6);
  return trimPlannerWords(frameText, 7);`,
`  if (value) return [value, frameText].filter(Boolean).join(' • ');
  if (visualType === 'timeline' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST' || visualType === 'ACCUMULATIVE_FLOWCHART') return items.slice(0, 4).join(' → ');
  if (visualType === 'checklist' || visualType === 'CHECKLIST') return items.slice(0, 4).join(' • ');
  if (visualType === 'comparison' || visualType === 'COMPARISON_SPLIT') return items.slice(0, 2).join(' vs ');
  if (visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP') return items.slice(0, 4).join(' → ');
  if (visualType === 'cta') return trimPlannerWords(frameText, 6);
  return trimPlannerWords(frameText, 5);`,
"buildShowWhat professional clean output"
);

// 10) sfx/animation/emotion should understand professional visual types.
replaceOrFail(
`  if (index === total - 1 || visualType === 'cta') return 'bell';
  if (visualType === 'warning') return 'warning';
  if (visualType === 'stat' && /[₹$]|\\b(cash|money|salary|profit|revenue)\\b/i.test(text)) return 'cash';
  if (visualType === 'timeline' || visualType === 'checklist') return 'softTick';`,
`  if (visualType === 'cta') return 'bell';
  if (visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP') return 'warning';
  if ((visualType === 'stat' || visualType === 'STAT_CARD' || visualType === 'SIMPLE_STAT_CARD') && /[₹$]|\\b(cash|money|salary|profit|revenue)\\b/i.test(text)) return 'cash';
  if (visualType === 'timeline' || visualType === 'STEP_FLOW' || visualType === 'STEP_BY_STEP_LIST' || visualType === 'ACCUMULATIVE_FLOWCHART' || visualType === 'checklist' || visualType === 'CHECKLIST') return 'softTick';`,
"selectSfx professional types"
);

replaceOrFail(
`  if (visualType === 'stat' || frameType === 'BigNumberReveal') return 'countUp';
  if (visualType === 'warning') return 'warningPulse';
  if (visualType === 'question') return 'popIn';`,
`  if (visualType === 'stat' || visualType === 'STAT_CARD' || visualType === 'SIMPLE_STAT_CARD' || frameType === 'BigNumberReveal') return 'countUp';
  if (visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP') return 'warningPulse';
  if (visualType === 'question' || visualType === 'CONCEPT_CARD') return 'popIn';`,
"selectAnimation professional types"
);

replaceOrFail(
`  if (visualType === 'warning') return 'urgent';
  if (index === 0) return 'informative';
  if (visualType === 'cta') return 'motivational';
  if (visualType === 'stat' || visualType === 'comparison') return 'serious';`,
`  if (visualType === 'warning' || visualType === 'RISK_MAP' || visualType === 'WARNING_RISK_MAP') return 'urgent';
  if (index === 0) return 'informative';
  if (visualType === 'cta') return 'motivational';
  if (visualType === 'stat' || visualType === 'STAT_CARD' || visualType === 'SIMPLE_STAT_CARD' || visualType === 'comparison' || visualType === 'COMPARISON_SPLIT') return 'serious';`,
"selectEmotion professional types"
);

fs.writeFileSync(path, text, "utf8");
console.log("visualPlanner professional infographic sync applied.");
