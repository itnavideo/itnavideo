import { REMOTION_COMPONENT_REGISTRY, VideoComponentMeta } from '../../remotion/library/registry';

export interface ComponentMatchResult {
  componentId: string;
  name: string;
  category: string;
  description: string;
  props: Record<string, any>;
  score: number;
}

// Inverted keyword index for fast O(1) keyword lookup across 1,282 components
interface IndexedKeyword {
  component: VideoComponentMeta;
  weight: number;
}

const KEYWORD_INDEX: Map<string, IndexedKeyword[]> = new Map();
let isIndexBuilt = false;

function buildKeywordIndex(): void {
  if (isIndexBuilt) return;

  for (const comp of REMOTION_COMPONENT_REGISTRY) {
    const tokens = new Set<string>();

    // High weight for ID and Name tokens (2.0)
    comp.id.toLowerCase().split('-').forEach(t => {
      if (t.length > 2 && !STOP_WORDS.has(t)) {
        addToken(t, comp, 2.0);
      }
    });

    comp.name.replace(/([A-Z])/g, ' $1').toLowerCase().split(/\s+/).forEach(t => {
      if (t.length > 2 && !STOP_WORDS.has(t)) {
        addToken(t, comp, 2.0);
      }
    });

    // Medium weight for Category tokens (1.5)
    if (comp.category) {
      comp.category.toLowerCase().split('-').forEach(t => {
        if (t.length > 2 && !STOP_WORDS.has(t)) {
          addToken(t, comp, 1.5);
        }
      });
    }

    // Lower weight for Description tokens (0.8)
    if (comp.description) {
      comp.description.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).forEach(t => {
        if (t.length > 3 && !STOP_WORDS.has(t)) {
          addToken(t, comp, 0.8);
        }
      });
    }
  }

  isIndexBuilt = true;
}

function addToken(token: string, component: VideoComponentMeta, weight: number): void {
  let list = KEYWORD_INDEX.get(token);
  if (!list) {
    list = [];
    KEYWORD_INDEX.set(token, list);
  }
  // Check if component already added for this token
  const existing = list.find(item => item.component.id === component.id);
  if (existing) {
    if (weight > existing.weight) existing.weight = weight;
  } else {
    list.push({ component, weight });
  }
}

const STOP_WORDS = new Set([
  'with', 'from', 'that', 'this', 'have', 'more', 'your', 'will', 'card', 'view',
  'show', 'data', 'user', 'time', 'text', 'line', 'list', 'item', 'display'
]);

export interface SceneStructuredContext {
  heading?: string;
  supportingText?: string;
  listItems?: string[];
  timelineSteps?: string[];
  comparisonItems?: { left?: string; right?: string };
  chartItems?: Array<{ label: string; value: number; formattedValue?: string }>;
  statValue?: string;
  statLabel?: string;
}

/**
 * Intelligent Semantic Matcher:
 * Scans narration text, headings, and structured scene points to identify a genuinely relevant
 * Motion Graphic component and populate it with real script-derived data.
 */
export function matchComponentForScene(
  text: string,
  heading?: string,
  minConfidenceScore = 1.8,
  structuredContext?: SceneStructuredContext
): ComponentMatchResult | null {
  buildKeywordIndex();

  const combinedText = `${heading || ''} ${text}`.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const uniqueWords = Array.from(new Set(combinedText.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w))));

  const candidateScores: Map<string, { comp: VideoComponentMeta; score: number; distinctMatches: number }> = new Map();

  for (const word of uniqueWords) {
    const matches = KEYWORD_INDEX.get(word);
    if (matches) {
      for (const m of matches) {
        const existing = candidateScores.get(m.component.id);
        const weight = m.weight * (heading && heading.toLowerCase().includes(word) ? 1.5 : 1.0);
        if (existing) {
          existing.score += weight;
          existing.distinctMatches += 1;
        } else {
          candidateScores.set(m.component.id, { comp: m.component, score: weight, distinctMatches: 1 });
        }
      }
    }
  }

  const hasNumbers =
    /\d+%|\$\d+|\d+x\b|\b\d{2,}\b/i.test(combinedText) ||
    Boolean(structuredContext?.statValue) ||
    Boolean(structuredContext?.chartItems && structuredContext.chartItems.length >= 2);
  const hasSteps =
    /\b(step|first|second|third|phase|stage|process|workflow|how\s+to|roadmap|timeline|milestone|history|then|finally|guide)\b/i.test(combinedText) ||
    (structuredContext?.timelineSteps?.length || 0) >= 2 ||
    (structuredContext?.listItems?.length || 0) >= 2;
  const hasComparison =
    /\b(vs|versus|compare|comparison|before|after|pros|cons|better|worse|difference|instead|rank|top\s*\d)\b/i.test(combinedText) ||
    Boolean(structuredContext?.comparisonItems?.left || structuredContext?.comparisonItems?.right);

  let bestMatch: { comp: VideoComponentMeta; score: number } | null = null;
  for (const entry of candidateScores.values()) {
    const cat = String(entry.comp.category || '').toLowerCase();
    const cid = String(entry.comp.id || '').toLowerCase();
    const hasStructuredTimeline = Boolean(structuredContext?.timelineSteps && structuredContext.timelineSteps.length >= 2);
    const hasStructuredChart = Boolean(structuredContext?.chartItems && structuredContext.chartItems.length >= 2);
    const hasStructuredCompare = Boolean(structuredContext?.comparisonItems?.left || structuredContext?.comparisonItems?.right);

    // Require at least 2 distinct keyword matches unless structured script evidence directly backs the category
    const minDistinct =
      (cat === 'timelines' && hasStructuredTimeline) ||
      (cat === 'charts' && hasStructuredChart) ||
      (cat === 'comparisons' && hasStructuredCompare)
        ? 1
        : 2;
    if (entry.distinctMatches < minDistinct) continue;

    // Domain-clash & semantic suitability guards
    if ((cat.includes('outlook') || cid.includes('email')) && !/\b(email|inbox|outlook|gmail|newsletter|mail)\b/i.test(combinedText)) {
      continue;
    }
    if ((cat.includes('database') || cid.includes('sql') || cid === 'terminal' || cid === 'code-editor') && !/\b(database|sql|postgres|terminal|cli|code|coding|script|programming|server|developer|api)\b/i.test(combinedText)) {
      continue;
    }
    if (cat === 'scientific' && !/\b(atom|molecule|dna|gene|cell|biology|chemistry|physics|circuit|voltage|anatomy|cardiac|medical|science)\b/i.test(combinedText)) {
      continue;
    }
    if (cat === 'mathematics' && !/\b(math|equation|formula|theorem|proof|calculus|algebra|venn|subset|intersection|graph|function)\b/i.test(combinedText)) {
      continue;
    }
    if (cat === 'geography' && !/\b(world|global|country|map|route|flight|travel|city|region|territory|location|market)\b/i.test(combinedText)) {
      continue;
    }
    if (cat === 'finance' && !/\b(stock|crypto|bitcoin|trading|portfolio|candlestick|earnings|ebitda|revenue|margin|market|invest|finance)\b/i.test(combinedText)) {
      continue;
    }
    if (cat === 'ui-mockups' && !/\b(app|website|browser|dashboard|saas|software|phone|mobile|chat|message|notification|search|pricing|plan|code|terminal|ui)\b/i.test(combinedText)) {
      continue;
    }
    if ((cat === 'charts' || cat === 'statistics' || cat === 'radial') && !hasNumbers && !/\b(chart|graph|growth|trend|metric|rate|percent|percentage|roi|ratio|score|kpi)\b/i.test(combinedText)) {
      continue;
    }
    if (cat === 'comparisons' && !hasComparison) {
      continue;
    }
    if ((cat === 'timelines' || cat === 'diagrams') && !hasSteps && !/\b(flow|diagram|cycle|hierarchy|network|system|architecture|structure|branch)\b/i.test(combinedText)) {
      continue;
    }

    // Boost components that match structured script evidence
    let adjustedScore = entry.score;
    if ((cat === 'charts' || cat === 'statistics') && (structuredContext?.chartItems?.length || structuredContext?.statValue)) {
      adjustedScore += 2.5;
    }
    if ((cat === 'timelines' || cat === 'diagrams') && (structuredContext?.timelineSteps?.length || structuredContext?.listItems?.length)) {
      adjustedScore += 2.0;
    }
    if (cat === 'comparisons' && (structuredContext?.comparisonItems?.left || structuredContext?.comparisonItems?.right)) {
      adjustedScore += 2.5;
    }

    if (!bestMatch || adjustedScore > bestMatch.score) {
      bestMatch = { comp: entry.comp, score: adjustedScore };
    }
  }

  if (!bestMatch || bestMatch.score < minConfidenceScore) {
    return null;
  }

function extractDynamicClauses(text: string, heading?: string, maxItems = 4): Array<{ title: string; description: string }> {
  const clean = String(text || '').trim();
  const rawParts = clean
    .split(/(?:\b(?:first|second|third|fourth|next|then|finally|step\s*\d+)\b[:,.-]?|[,;•]|(?:\s+and\s+)|(?:\s+while\s+)|(?:\s+because\s+))/i)
    .map((p) => p.replace(/[.!?]+$/g, '').trim())
    .filter((p) => p.split(/\s+/).length >= 2);

  const phrases = rawParts.length >= 2
    ? rawParts.slice(0, maxItems)
    : (() => {
        const words = clean.split(/\s+/).filter(Boolean);
        if (words.length < 4) return [heading || clean || 'Key Insight'];
        const count = Math.min(maxItems, Math.max(2, Math.ceil(words.length / 6)));
        const step = Math.ceil(words.length / count);
        const out: string[] = [];
        for (let i = 0; i < words.length; i += step) {
          out.push(words.slice(i, i + step).join(' ').replace(/[.!?]+$/g, ''));
        }
        return out.slice(0, maxItems);
      })();

  return phrases.map((phrase, idx) => {
    const words = phrase.split(/\s+/).filter(Boolean);
    const title = words.slice(0, 4).join(' ');
    const description = words.slice(4).join(' ');
    return {
      title: title ? title.charAt(0).toUpperCase() + title.slice(1) : `${heading || 'Point'} ${idx + 1}`,
      description,
    };
  });
}

function buildDynamicComponentProps(
  comp: VideoComponentMeta,
  text: string,
  heading?: string,
  structuredContext?: SceneStructuredContext
): Record<string, any> {
  const compWithDefaults = comp as VideoComponentMeta & { defaultProps?: Record<string, any> };
  const props: Record<string, any> = { ...(compWithDefaults.defaultProps || {}) };
  const id = comp.id.toLowerCase();
  const cat = comp.category.toLowerCase();
  const cleanHeading = (structuredContext?.heading || heading || '').trim();
  const structuredPoints = (structuredContext?.timelineSteps?.length
    ? structuredContext.timelineSteps
    : structuredContext?.listItems?.length
      ? structuredContext.listItems
      : []
  ).map((p) => ({ title: String(p).trim(), description: '' })).filter((p) => p.title);
  const clauses = structuredPoints.length >= 2 ? structuredPoints.slice(0, 5) : extractDynamicClauses(text, cleanHeading, 4);

  if (cleanHeading) {
    props.title = cleanHeading;
    props.heading = cleanHeading;
  }
  if (structuredContext?.supportingText || text) {
    const sub = structuredContext?.supportingText || text;
    props.subtitle = sub.length > 90 ? `${sub.slice(0, 87).trim()}...` : sub;
  }

  // Dynamic Steps / Timelines / Diagrams
  if (cat === 'timelines' || id.includes('step') || id.includes('roadmap') || id.includes('timeline')) {
    props.steps = clauses.map((c, idx) => ({
      stepNumber: `0${idx + 1}`,
      title: c.title,
      description: c.description || c.title,
      status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'upcoming',
    }));
    props.events = clauses.map((c, idx) => ({
      timeOrDate: `Step ${idx + 1}`,
      title: c.title,
      description: c.description,
    }));
    props.phases = clauses.map((c, idx) => ({
      phase: `Phase ${idx + 1}`,
      title: c.title,
      deliverables: [c.description || c.title],
      status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'upcoming',
    }));
    props.milestones = clauses.map((c, idx) => ({
      metric: `0${idx + 1}`,
      label: c.title,
      description: c.description || c.title,
    }));
    props.history = clauses.map((c, idx) => ({
      year: `Stage ${idx + 1}`,
      title: c.title,
      description: c.description || c.title,
    }));
  }

  if (cat === 'diagrams' || id.includes('flowchart') || id.includes('mindmap') || id.includes('tree')) {
    props.nodes = clauses.map((c, idx) => ({
      id: String(idx + 1),
      type: idx === 0 ? 'start' : idx === clauses.length - 1 ? 'end' : 'process',
      title: c.title,
      label: c.title,
      description: c.description,
    }));
    props.centralIdea = cleanHeading || clauses[0]?.title || 'Core Concept';
    props.branches = clauses.map((c) => ({
      title: c.title,
      items: c.description ? [c.description] : [c.title],
    }));
    props.steps = clauses.map((c, idx) => ({
      number: idx + 1,
      label: c.title,
      title: c.title,
      description: c.description || c.title,
    }));
    props.root = {
      label: cleanHeading || 'Core Topic',
      children: clauses.map((c) => ({
        label: c.title,
        children: c.description ? [{ label: c.description }] : [],
      })),
    };
    props.leader = { name: cleanHeading || 'Core System', role: 'Primary Driver' };
    props.executives = clauses.map((c) => ({ name: c.title, role: c.description || 'Key Pillar' }));
  }

  // Dynamic Charts & Statistics
  const numMatches = Array.from(String(text || '').matchAll(/(\$?\d+(?:[.,]\d+)?\s*(?:%|x|k|m|b)?)/gi)).map((m) => m[1]);
  if (cat === 'charts' || cat === 'statistics' || cat === 'radial' || cat === 'business' || cat === 'finance' || id.includes('chart') || id.includes('counter') || id.includes('kpi')) {
    const resolvedData =
      structuredContext?.chartItems && structuredContext.chartItems.length >= 2
        ? structuredContext.chartItems
        : clauses.map((c, idx) => ({
            label: c.title.split(/\s+/).slice(0, 3).join(' '),
            value: numMatches[idx] ? (parseFloat(numMatches[idx].replace(/[^0-9.]/g, '')) || (idx + 2) * 22) : (idx + 2) * 24,
          }));
    props.data = resolvedData;
    props.slices = resolvedData.map((d) => ({ label: d.label, value: d.value }));
    props.metrics = resolvedData.map((d, idx) => ({
      label: d.label,
      value: Math.min(100, d.value),
      benchmark: Math.max(20, Math.min(90, 50 + idx * 10)),
    }));
    props.stages = resolvedData.map((d) => ({ label: d.label, value: d.value }));
    props.tiers = resolvedData.map((d) => ({ label: d.label, description: String(d.value) }));

    if (structuredContext?.statValue || numMatches.length > 0) {
      const rawNum = structuredContext?.statValue || numMatches[0];
      const numeric = parseFloat(String(rawNum).replace(/[^0-9.]/g, '')) || 75;
      props.toValue = numeric;
      props.value = numeric;
      props.percentage = Math.min(100, Math.max(5, Math.round(numeric)));
      props.label = structuredContext?.statLabel || cleanHeading || clauses[0]?.title || 'Key Metric';
      props.targetValueText = String(rawNum);
      props.centerHeadline = String(rawNum);
      props.centerSubline = cleanHeading || clauses[0]?.title || 'Key Metric';
    }
  }

  // Dynamic Comparisons (BeforeAfter, ComparisonTable, ProsCons, RankingList, Splitscreen)
  if (cat === 'comparisons' || id.includes('before-after') || id.includes('pros-cons') || id.includes('comparison')) {
    if (structuredContext?.comparisonItems?.left || structuredContext?.comparisonItems?.right) {
      const leftText = structuredContext.comparisonItems.left || 'Previous approach';
      const rightText = structuredContext.comparisonItems.right || 'Improved approach';
      props.leftTitle = 'Before / Option A';
      props.rightTitle = 'After / Option B';
      props.leftHeadline = 'Option A';
      props.rightHeadline = 'Option B';
      props.leftBody = leftText;
      props.rightBody = rightText;
      props.beforeHeadline = 'Before';
      props.afterHeadline = 'After';
      props.beforePoints = [leftText];
      props.afterPoints = [rightText];
      props.leftItems = [leftText];
      props.rightItems = [rightText];
      props.pros = [rightText];
      props.cons = [leftText];
    } else {
      const mid = Math.max(1, Math.ceil(clauses.length / 2));
      const leftClauses = clauses.slice(0, mid);
      const rightClauses = clauses.slice(mid);
      const leftList = leftClauses.map((c) => c.title);
      const rightList = (rightClauses.length > 0 ? rightClauses : leftClauses).map((c) => c.description || c.title);
      props.leftTitle = cleanHeading ? `${cleanHeading} — Before` : 'Before';
      props.rightTitle = cleanHeading ? `${cleanHeading} — After` : 'After';
      props.leftHeadline = props.leftTitle;
      props.rightHeadline = props.rightTitle;
      props.leftBody = leftList.join(' • ');
      props.rightBody = rightList.join(' • ');
      props.beforeHeadline = 'Before';
      props.afterHeadline = 'After';
      props.beforePoints = leftList;
      props.afterPoints = rightList;
      props.leftItems = leftList;
      props.rightItems = rightList;
      props.pros = rightList;
      props.cons = leftList;
    }
    props.columnAHeader = props.leftHeadline || 'Option A';
    props.columnBHeader = props.rightHeadline || 'Option B';
    props.rows = clauses.map((c) => ({
      feature: c.title,
      a: true,
      b: Boolean(c.description),
    }));
    props.rankings = clauses.map((c, idx) => ({
      rank: idx + 1,
      title: c.title,
      value: numMatches[idx] || `#${idx + 1}`,
      description: c.description || c.title,
    }));
    props.items = clauses.map((c, idx) => ({
      id: String(idx + 1),
      label: c.title,
      title: c.title,
      description: c.description || c.title,
      value: numMatches[idx] || `${(idx + 1) * 25}%`,
    }));
  }

  // Dynamic Mathematics (VennDiagram, MathEquation, MathProof)
  if (cat === 'mathematics') {
    props.setALabel = clauses[0]?.title || 'Factor A';
    props.setBLabel = clauses[1]?.title || 'Factor B';
    props.intersectionLabel = cleanHeading || clauses[2]?.title || 'Shared Result';
  }

  // Dynamic Editorial (BreakingNewsBanner, HeadlineAnimation, QuoteLayout, Newspaper, ArticleCards, MagazineLayout)
  if (cat === 'editorial') {
    props.headline = cleanHeading || clauses[0]?.title || 'Key Takeaway';
    props.quote = text || cleanHeading;
    props.tickerText = clauses.map((c) => c.title.toUpperCase()).join('  •  ');
    props.location = 'STUDIO BRIEF';
    props.articles = clauses.map((c, idx) => ({
      id: String(idx + 1),
      title: c.title,
      summary: c.description || c.title,
    }));
    props.cards = props.articles;
  }

  // Dynamic Conceptual Graphics (IcebergDiagram, ProblemSolutionVisual, FunnelTransformation, StaircaseGrowth, etc.)
  if (cat === 'graphics') {
    props.headline = cleanHeading || clauses[0]?.title || 'Core Concept';
    props.visibleTipText = cleanHeading || clauses[0]?.title || 'Surface Outcome';
    props.submergedItems = clauses.map((c) => c.description || c.title);
    props.items = clauses.map((c, idx) => ({
      id: String(idx + 1),
      label: c.title,
      title: c.title,
      description: c.description || c.title,
    }));
    props.steps = clauses.map((c, idx) => ({
      step: idx + 1,
      title: c.title,
      description: c.description || c.title,
    }));
  }

  // Dynamic UI Mockups (BrowserWindow, MobileMockup, ChatBubble, Notification, CodeEditor, Terminal, SearchBar)
  if (cat === 'ui-mockups') {
    props.query = cleanHeading || clauses[0]?.title || '';
    props.message = text || cleanHeading;
    props.lines = clauses.map((c) => `> ${c.title}${c.description ? `: ${c.description}` : ''}`);
  }

  return props;
}

  const customizedProps = buildDynamicComponentProps(bestMatch.comp, text, heading, structuredContext);

  return {
    componentId: bestMatch.comp.id,
    name: bestMatch.comp.name,
    category: bestMatch.comp.category,
    description: bestMatch.comp.description,
    props: customizedProps,
    score: bestMatch.score,
  };
}
