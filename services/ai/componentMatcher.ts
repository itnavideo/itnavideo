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

/**
 * Intelligent Semantic Matcher:
 * Scans narration text, headings, and keywords to identify the single most relevant
 * Motion Graphic component from the 1,282 Remotion library components.
 */
export function matchComponentForScene(
  text: string,
  heading?: string,
  minConfidenceScore = 1.8
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

  let bestMatch: { comp: VideoComponentMeta; score: number } | null = null;
  for (const entry of candidateScores.values()) {
    // Require at least 2 distinct keyword matches so single ambiguous words like "delivery" or "focus" never false-trigger
    if (entry.distinctMatches < 2) continue;

    // Domain-clash guard: prevent email/outlook widgets on non-email scripts & DB/code widgets on non-tech scripts
    const cat = String(entry.comp.category || '').toLowerCase();
    const cid = String(entry.comp.id || '').toLowerCase();
    if ((cat.includes('outlook') || cid.includes('email')) && !/\b(email|inbox|outlook|gmail|newsletter|mail)\b/i.test(combinedText)) {
      continue;
    }
    if ((cat.includes('database') || cid.includes('sql') || cid.includes('terminal')) && !/\b(database|sql|postgres|terminal|cli|code|programming|server)\b/i.test(combinedText)) {
      continue;
    }

    if (!bestMatch || entry.score > bestMatch.score) {
      bestMatch = { comp: entry.comp, score: entry.score };
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
  heading?: string
): Record<string, any> {
  const compWithDefaults = comp as VideoComponentMeta & { defaultProps?: Record<string, any> };
  const props: Record<string, any> = { ...(compWithDefaults.defaultProps || {}) };
  const id = comp.id.toLowerCase();
  const cat = comp.category.toLowerCase();
  const cleanHeading = (heading || '').trim();
  const clauses = extractDynamicClauses(text, cleanHeading, 4);

  if (cleanHeading) {
    props.title = cleanHeading;
    props.heading = cleanHeading;
  }
  if (text) {
    props.subtitle = text.length > 90 ? `${text.slice(0, 87).trim()}...` : text;
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
      timeOrDate: `Part ${idx + 1}`,
      title: c.title,
      description: c.description,
    }));
  }

  if (cat === 'diagrams' || id.includes('flowchart') || id.includes('mindmap') || id.includes('tree')) {
    props.nodes = clauses.map((c, idx) => ({
      id: String(idx + 1),
      type: idx === 0 ? 'start' : idx === clauses.length - 1 ? 'end' : 'process',
      title: c.title,
      description: c.description,
    }));
  }

  // Dynamic Charts & Statistics
  const numMatches = Array.from(String(text || '').matchAll(/(\$?\d+(?:[.,]\d+)?\s*(?:%|x|k|m|b)?)/gi)).map((m) => m[1]);
  if (cat === 'charts' || cat === 'statistics' || cat === 'business' || cat === 'finance' || id.includes('chart') || id.includes('counter') || id.includes('kpi')) {
    if (numMatches.length > 0) {
      const numeric = parseFloat(numMatches[0].replace(/[^0-9.]/g, '')) || 75;
      props.toValue = numeric;
      props.value = numeric;
      props.percentage = Math.min(100, Math.max(5, Math.round(numeric)));
      props.label = cleanHeading || clauses[0]?.title || 'Key Metric';
    }
    props.data = clauses.map((c, idx) => ({
      label: c.title.split(/\s+/).slice(0, 2).join(' '),
      value: numMatches[idx] ? (parseFloat(numMatches[idx].replace(/[^0-9.]/g, '')) || (idx + 2) * 22) : (idx + 2) * 24,
    }));
  }

  // Dynamic Comparisons (BeforeAfter, ComparisonTable, ProsCons, RankingList, Splitscreen)
  if (cat === 'comparisons' || id.includes('before-after') || id.includes('pros-cons') || id.includes('comparison')) {
    const mid = Math.max(1, Math.ceil(clauses.length / 2));
    const leftClauses = clauses.slice(0, mid);
    const rightClauses = clauses.slice(mid);
    props.leftTitle = cleanHeading ? `${cleanHeading} — Before` : 'Before';
    props.rightTitle = cleanHeading ? `${cleanHeading} — After` : 'After';
    props.leftItems = leftClauses.map((c) => c.title);
    props.rightItems = (rightClauses.length > 0 ? rightClauses : leftClauses).map((c) => c.description || c.title);
    props.pros = leftClauses.map((c) => c.title);
    props.cons = (rightClauses.length > 0 ? rightClauses : leftClauses).map((c) => c.description || c.title);
    props.items = clauses.map((c, idx) => ({
      id: String(idx + 1),
      label: c.title,
      title: c.title,
      description: c.description || c.title,
      value: numMatches[idx] || `${(idx + 1) * 25}%`,
    }));
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

  const customizedProps = buildDynamicComponentProps(bestMatch.comp, text, heading);

  return {
    componentId: bestMatch.comp.id,
    name: bestMatch.comp.name,
    category: bestMatch.comp.category,
    description: bestMatch.comp.description,
    props: customizedProps,
    score: bestMatch.score,
  };
}
