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
  const words = combinedText.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const candidateScores: Map<string, { comp: VideoComponentMeta; score: number }> = new Map();

  for (const word of words) {
    const matches = KEYWORD_INDEX.get(word);
    if (matches) {
      for (const m of matches) {
        const existing = candidateScores.get(m.component.id);
        const weight = m.weight * (heading && heading.toLowerCase().includes(word) ? 2.0 : 1.0);
        if (existing) {
          existing.score += weight;
        } else {
          candidateScores.set(m.component.id, { comp: m.component, score: weight });
        }
      }
    }
  }

  let bestMatch: { comp: VideoComponentMeta; score: number } | null = null;
  for (const entry of candidateScores.values()) {
    if (!bestMatch || entry.score > bestMatch.score) {
      bestMatch = entry;
    }
  }

  if (!bestMatch || bestMatch.score < minConfidenceScore) {
    return null;
  }

  // Extract contextual numbers or metrics from text to customize props
  const customizedProps = { ...(bestMatch.comp.defaultProps || {}) };
  if (heading && customizedProps.title) {
    customizedProps.title = heading;
  }

  return {
    componentId: bestMatch.comp.id,
    name: bestMatch.comp.name,
    category: bestMatch.comp.category,
    description: bestMatch.comp.description,
    props: customizedProps,
    score: bestMatch.score,
  };
}
