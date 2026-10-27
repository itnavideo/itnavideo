import type {
  FacelessGraphicItem,
  FacelessGraphicPlan,
  SceneBlueprintItem,
} from './sceneBlueprintTypes';

const EXPLICIT_MEASURE =
  /(?:[$\u20B9\u20AC\u00A3]\s*)?\d[\d,]*(?:\.\d+)?\s*(?:%|percent|x\b|times\b|crore\b|lakhs?\b|million\b|billion\b|rupees?\b|rupaye\b|dollars?\b|usd\b|inr\b|rs\.?\b|[kmb]\b)?/gi;
const ALLOCATION_CONTEXT = /budget|allocate|allocation|split|divide|salary|income|spend|saving|savings|portion|50.{0,2}30.{0,2}20|needs|wants/i;
const STOP_WORDS = new Set([
  'about', 'after', 'again', 'also', 'because', 'being', 'between', 'could', 'does',
  'each', 'from', 'have', 'into', 'just', 'more', 'most', 'other', 'over', 'same',
  'should', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'very', 'what', 'when', 'where', 'which', 'while',
  'with', 'would', 'your', 'will', 'were', 'was', 'are', 'and', 'for', 'but', 'the',
  'you', 'our', 'out', 'use', 'using', 'used', 'has', 'had', 'can', 'not', 'its', 'is',
  'to', 'of', 'in', 'on', 'at', 'by', 'as', 'it', 'or', 'if', 'an', 'a', 'first', 'next', 'finally', 'step', 'mein', 'ka', 'ki', 'ke', 'se', 'ko', 'par', 'aur', 'hai', 'hain', 'tha', 'thi', 'nahi', 'toh', 'bhi', 'rupee', 'rupees', 'rupaye', 'rs', 'dollar', 'dollars',
]);

function measureValue(raw: string): number {
  const numeric = Number(raw.replace(/[^\d.]/g, ''));
  const lower = raw.toLowerCase();
  const multiplier = /\b(?:b|billion)\b/.test(lower) ? 1_000_000_000
    : /\b(?:m|million)\b/.test(lower) ? 1_000_000
    : /\b(?:k|thousand)\b/.test(lower) ? 1_000
    : /\bcrore\b/.test(lower) ? 10_000_000
    : /\blakhs?\b/.test(lower) ? 100_000
    : 1;
  return numeric * multiplier;
}

function cleanLabel(value: string, maxWords = 5): string {
  const words = value
    .replace(EXPLICIT_MEASURE, ' ')
    .replace(/[$\u20B9\u20AC\u00A3]/g, ' ')
    .replace(/[^\p{L}\p{N}' -]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word.toLowerCase()));
  return words.slice(-maxWords).join(' ').trim();
}

function explicitMeasures(text: string): string[] {
  return [...text.matchAll(EXPLICIT_MEASURE)]
    .map((match) => match[0].trim())
    .filter((value) => /\p{Sc}|%|percent|\b(?:x|times|crore|lakhs?|million|billion|rupees?|rupaye|dollars?|usd|inr|rs|k|m|b)\b/iu.test(value));
}

function allocationItems(text: string): FacelessGraphicItem[] {
  const financeContext = ALLOCATION_CONTEXT.test(text);
  if (!financeContext) return [];

  const ratio = text.match(/\b\d{1,3}(?:\s*\/\s*\d{1,3}){1,4}(?:%|percent)?/i);
  if (ratio) {
    const values = ratio[0].split('/').map((part) => Number(part.replace(/\D/g, ''))).filter(Number.isFinite);
    if (values.length >= 2) {
      const categories = ['needs', 'wants', 'savings', 'investment', 'tax', 'expenses', 'debt', 'housing', 'food', 'transport']
        .filter((category) => new RegExp('\b' + category + '\b', 'i').test(text));
      return values.slice(0, 5).map((value, index) => ({
        label: categories[index] || 'Part ' + (index + 1),
        displayValue: String(value),
        value,
      }));
    }
  }

  const clauses = text.split(/[,;]|\band\b/gi).map((part) => part.trim()).filter(Boolean);
  return clauses.flatMap((clause) => {
    const match = clause.match(/(?:[$\u20B9\u20AC\u00A3]\s*)?\d[\d,]*(?:\.\d+)?\s*(?:%|percent)/i);
    if (!match) return [];
    const label = cleanLabel(clause, 3) || 'Share';
    return [{ label, displayValue: match[0].trim(), value: measureValue(match[0]) }];
  });
}
function growthItems(text: string): FacelessGraphicItem[] {
  const years = [...text.matchAll(/\b(?:19|20)\d{2}\b/g)];
  if (years.length < 2) return [];
  return years.slice(0, 5).flatMap((yearMatch, index) => {
    const year = yearMatch[0];
    const start = (yearMatch.index || 0) + year.length;
    const nextStart = years[index + 1]?.index ?? text.length;
    const measure = explicitMeasures(text.slice(start, nextStart))[0];
    if (!measure) return [];
    return [{ label: year, displayValue: measure, value: measureValue(measure) }];
  });
}

function conceptItems(scene: SceneBlueprintItem, text: string): FacelessGraphicItem[] {
  const sourceWords = new Set(text.toLowerCase().match(/[\p{L}\p{N}']+/gu) || []);
  const emphasized = (scene.highlightedWords || [])
    .filter((word) => sourceWords.has(word.toLowerCase()))
    .map((word) => cleanLabel(word, 3))
    .filter(Boolean);
  const extracted = (text.match(/[\p{L}][\p{L}'-]{3,}/gu) || [])
    .filter((word) => !STOP_WORDS.has(word.toLowerCase()));
  return [...new Set([...emphasized, ...extracted])].slice(0, 4).map((label) => ({ label }));
}

function makePlan(
  scene: SceneBlueprintItem,
  kind: FacelessGraphicPlan['kind'],
  items: FacelessGraphicItem[],
  sourceText: string
): FacelessGraphicPlan {
  return {
    kind,
    title: cleanLabel(scene.heading || '', 7) || cleanLabel(sourceText, 7) || 'Key idea',
    sourceText,
    items,
  };
}

/**
 * Makes a transcript-grounded SVG visual plan for each scene.
 * Numeric visuals are emitted only for values stated in the spoken source.
 */
export function planFacelessGraphic(scene: SceneBlueprintItem): FacelessGraphicPlan | undefined {
  const sourceText = String(scene.narrationSegment?.text || '').trim();
  const lower = sourceText.toLowerCase();

  const timeSeries = growthItems(sourceText);
  if (timeSeries.length >= 2) return makePlan(scene, 'growth', timeSeries, sourceText);

  const spokenMeasures = explicitMeasures(sourceText).map((displayValue) => ({ displayValue, value: measureValue(displayValue) }));
  const plannedTimeSeries = (scene.chartItems || []).flatMap((item) => {
    const label = String(item.label || '').trim();
    const supported = spokenMeasures.find((measure) => measure.value === item.value && (!item.formattedValue || sourceText.includes(item.formattedValue)));
    if (!label || !/\b(?:19|20)\d{2}\b/.test(label) || !sourceText.includes(label) || !supported) return [];
    return [{ label, displayValue: item.formattedValue || supported.displayValue, value: supported.value }];
  }).slice(0, 5);
  if (plannedTimeSeries.length >= 2) return makePlan(scene, 'growth', plannedTimeSeries, sourceText);

  const aiSequenceLayouts = new Set(['timeline', 'numbered_steps', 'milestone_ladder', 'checklist', 'numbered_point']);
  const proposedSteps = scene.timelineSteps || (scene.layoutType === 'checklist' ? scene.checklistItems : undefined) || [];
  const verifiedSteps = proposedSteps.map((label) => String(label || '').trim())
    .filter((label) => label.length > 1 && sourceText.toLowerCase().includes(label.toLowerCase())).slice(0, 5);
  if (aiSequenceLayouts.has(scene.layoutType) && verifiedSteps.length >= 2) {
    return makePlan(scene, 'sequence', verifiedSteps.map((label) => ({ label })), sourceText);
  }
  const allocation = allocationItems(sourceText);
  if (
    allocation.length >= 2 &&
    ALLOCATION_CONTEXT.test(lower)
  ) {
    return makePlan(scene, 'allocation', allocation.slice(0, 5), sourceText);
  }

  const fromTo = sourceText.match(/\bfrom\s+(.{1,70}?)\s+to\s+(.{1,70}?)(?=[.!?]|$)/i);
  if (fromTo) {
    const beforeValue = explicitMeasures(fromTo[1])[0];
    const afterValue = explicitMeasures(fromTo[2])[0];
    return makePlan(scene, 'comparison', [
      { label: cleanLabel(fromTo[1], 4) || 'Before', displayValue: beforeValue, value: beforeValue ? measureValue(beforeValue) : undefined },
      { label: cleanLabel(fromTo[2], 4) || 'After', displayValue: afterValue, value: afterValue ? measureValue(afterValue) : undefined },
    ], sourceText);
  }

  const versus = sourceText.split(/\b(?:versus|vs\.?|compared with|rather than|instead of)\b/i);
  if (versus.length >= 2) {
    return makePlan(scene, 'comparison', [
      { label: cleanLabel(versus[0], 5) || 'Option A' },
      { label: cleanLabel(versus.slice(1).join(' '), 5) || 'Option B' },
    ], sourceText);
  }

  if (/\b(?:first|then|next|finally|step\s*\d|after that)\b/i.test(lower)) {
    const parts = sourceText
      .split(/\b(?:first|then|next|finally|after that|step\s*\d+)\b/gi)
      .map((part) => cleanLabel(part, 6))
      .filter((part) => part.length > 2)
      .slice(0, 5);
    if (parts.length >= 2) {
      return makePlan(scene, 'sequence', parts.map((label) => ({ label })), sourceText);
    }
  }

  const measures = explicitMeasures(sourceText);
  if (measures.length > 0) {
    const value = measures[0];
    const label = cleanLabel(sourceText.replace(value, ' '), 6) || 'Explicit figure';
    return makePlan(scene, 'metric', [{ label, displayValue: value, value: measureValue(value) }], sourceText);
  }

  return undefined;
}
/**
 * Plans a scene run so allocation rules and numbered steps can span transcript
 * sentence boundaries while keeping every label and value tied to spoken text.
 */
export function planFacelessGraphics(scenes: SceneBlueprintItem[]): SceneBlueprintItem[] {
  const planned = scenes.map((scene) => { const plan = planFacelessGraphic(scene); return plan ? { ...scene, graphicPlan: plan } : scene; });

  for (let index = 0; index < planned.length;) {
    const current = planned[index];
    const currentPlan = current.graphicPlan;
    const isAllocationContext = ALLOCATION_CONTEXT.test(
      String(current.narrationSegment?.text || '')
    );
    const hasPercent = isAllocationContext && currentPlan?.items.some((item) => item.displayValue && /%|percent/i.test(item.displayValue));
    if (hasPercent) {
      let end = index + 1;
      while (end < planned.length) {
        const next = planned[end].graphicPlan;
        const nextIsAllocationContext = ALLOCATION_CONTEXT.test(
          String(planned[end].narrationSegment?.text || '')
        );
        if (!nextIsAllocationContext || !next?.items.some((item) => item.displayValue && /%|percent/i.test(item.displayValue))) break;
        end++;
      }
      if (end - index >= 2) {
        const items = planned.slice(index, end).flatMap((scene) => scene.graphicPlan?.items || []).slice(0, 5);
        const sourceText = planned.slice(index, end).map((scene) => scene.narrationSegment?.text || '').join(' ');
        const title = currentPlan?.title || 'Budget allocation';
        for (let cursor = index; cursor < end; cursor++) {
          planned[cursor] = {
            ...planned[cursor],
            graphicPlan: { kind: 'allocation', title, sourceText, items },
          };
        }
        index = end;
        continue;
      }
    }

    const isOrderedStep = (scene: SceneBlueprintItem) =>
      /^\s*(?:(?:first|second|third|fourth|next|then|finally)\b|step\s*\d+\b|\d+[.)])/i
        .test(String(scene.narrationSegment?.text || ''));
    if (isOrderedStep(current)) {
      let end = index + 1;
      while (end < planned.length && isOrderedStep(planned[end])) end++;
      if (end - index >= 2) {
        const group = planned.slice(index, end);
        const items = group.map((scene) => {
          const text = String(scene.narrationSegment?.text || '');
          const content = text.replace(/^\s*(?:(?:first|second|third|fourth|next|then|finally)\b|step\s*\d+\b|\d+[.)])\s*[:,.-]?\s*/i, '');
          return { label: cleanLabel(content, 6) || scene.graphicPlan?.items[0]?.label || 'Step' };
        }).slice(0, 5);
        const sourceText = group.map((scene) => scene.narrationSegment?.text || '').join(' ');
        const title = currentPlan?.title || 'Step by step';
        for (let cursor = index; cursor < end; cursor++) {
          planned[cursor] = {
            ...planned[cursor],
            graphicPlan: { kind: 'sequence', title, sourceText, items },
          };
        }
        index = end;
        continue;
      }
    }
    index++;
  }

  return planned;
}
