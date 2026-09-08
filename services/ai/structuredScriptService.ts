/**
 * Structured Script Service for AI Audio Cleaner
 *
 * Turns raw speech transcripts into a structured script:
 * - Headings (# H1, ## H2)
 * - Steps (Step 1, Step 2, etc.)
 * - Explanations & Dialogue grouped into clean sections (NOT hundreds of individual micro-cards)
 *
 * Also provides alignment between user-pasted pre-written scripts and spoken audio,
 * ensuring NO canonical script sentences are cut by mistake.
 */

import type { AudioCleanSegment } from './audioCleanService';

export type ScriptBlockType = 'heading' | 'step' | 'explanation';

export type ScriptBlockSentence = {
  id: string;
  text: string;
  start?: number;
  end?: number;
  action?: 'keep' | 'cut';
  reason?: 'repeat' | 'mistake' | 'silence' | 'filler' | 'stumble' | 'false-start' | 'user' | 'custom';
};

export type StructuredScriptBlock = {
  id: string;
  type: ScriptBlockType;
  title?: string;
  headingLevel?: 1 | 2 | 3; // # H1, ## H2, ### H3
  stepNumber?: number; // 1, 2, 3...
  text: string;
  segmentIds: string[];
  sentences?: ScriptBlockSentence[];
  start?: number;
  end?: number;
  action?: 'keep' | 'cut';
  reason?: 'repeat' | 'mistake' | 'silence' | 'filler' | 'stumble' | 'false-start' | 'user' | 'custom';
};

export type StructuredScriptResult = {
  blocks: StructuredScriptBlock[];
  markdown: string;
};

// Patterns that indicate a Step / Point in English and Hinglish
const STEP_PATTERNS = [
  /^(?:step|point|phase|tip|rule)\s*([0-9]+|[a-z]+)[\s:.-]/i,
  /^(?:number|no\.?)\s*([0-9]+)[\s:.-]/i,
  /^(?:pehla|pehli|first)\s+(?:step|tarika|point|kaam|baat)?[\s:.-]/i,
  /^(?:dusra|dusri|second)\s+(?:step|tarika|point|kaam|baat)?[\s:.-]/i,
  /^(?:teesra|teesri|third)\s+(?:step|tarika|point|kaam|baat)?[\s:.-]/i,
  /^(?:chautha|chauthi|fourth)\s+(?:step|tarika|point|kaam|baat)?[\s:.-]/i,
  /^(?:panchwa|panchwi|fifth)\s+(?:step|tarika|point|kaam|baat)?[\s:.-]/i,
  /^(?:sabse pehle|sabse pehla|to begin with|first of all)[\s:.-]/i,
  /^(?:finally|aakhri me|in conclusion|lastly)[\s:.-]/i,
];

// Patterns that indicate a major topic heading or question
const HEADING_PATTERNS = [
  /^(?:kya aap|agar aap|how to|why|what is|learn how|kaise karein|aaj hum baat karenge)[\s:.-]/i,
  /^(?:introduction|intro|conclusion|summary|overview|outro)[\s:.-]/i,
];

/**
 * Split a chunk of text into clean individual sentences
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const raw = text.split(/(?<=[.!?])\s+|\n+/);
  return raw
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^[-*_#]+$/.test(s));
}

/**
 * Automatically analyze transcript segments and organize them into
 * clean structured blocks (Headings, Steps, and Explanations).
 * Segments are grouped into their parent Step or Heading section,
 * avoiding hundreds of tiny cards.
 */
export function structureTranscriptIntoBlocks(
  segments: AudioCleanSegment[],
  fullTranscriptText?: string
): StructuredScriptResult {
  if (!segments || segments.length === 0) {
    const fallbackText = String(fullTranscriptText || '').trim();
    if (!fallbackText) {
      return { blocks: [], markdown: '' };
    }
    const sentences = splitIntoSentences(fallbackText).map((s, idx) => ({
      id: `sent-0-${idx}`,
      text: s,
      action: 'keep' as const,
    }));
    const singleBlock: StructuredScriptBlock = {
      id: 'block-0',
      type: 'explanation',
      title: 'Voiceover Script',
      text: fallbackText,
      segmentIds: [],
      sentences,
      action: 'keep',
    };
    return {
      blocks: [singleBlock],
      markdown: `# Audio Script\n\n${fallbackText}`,
    };
  }

  const blocks: StructuredScriptBlock[] = [];
  let currentStepCount = 0;
  let blockIndex = 0;
  let activeBlock: StructuredScriptBlock | null = null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const text = seg.text.trim();
    if (!text) continue;

    // Check if this segment represents a Step
    let isStep = false;
    let stepNum = 0;
    for (const pat of STEP_PATTERNS) {
      const match = text.match(pat);
      if (match) {
        isStep = true;
        currentStepCount++;
        stepNum = currentStepCount;
        break;
      }
    }

    // Check if this segment represents a Section Heading
    let isHeading = false;
    let headingLevel: 1 | 2 | 3 = 2;
    if (i === 0) {
      isHeading = true;
      headingLevel = 1;
    } else {
      for (const pat of HEADING_PATTERNS) {
        if (pat.test(text) && text.split(' ').length <= 12) {
          isHeading = true;
          headingLevel = 2;
          break;
        }
      }
    }

    const sentenceItem: ScriptBlockSentence = {
      id: seg.id,
      text: text,
      start: seg.start,
      end: seg.end,
      action: seg.action,
      reason: seg.reason,
    };

    if (isStep) {
      const stepBlock: StructuredScriptBlock = {
        id: `block-${blockIndex++}`,
        type: 'step',
        stepNumber: stepNum,
        title: text.length > 60 ? text.slice(0, 58) + '...' : text,
        text: text,
        segmentIds: [seg.id],
        sentences: [sentenceItem],
        start: seg.start,
        end: seg.end,
        action: seg.action,
        reason: seg.reason,
      };
      activeBlock = stepBlock;
      blocks.push(stepBlock);
    } else if (isHeading) {
      const headingBlock: StructuredScriptBlock = {
        id: `block-${blockIndex++}`,
        type: 'heading',
        headingLevel,
        title: text,
        text: text,
        segmentIds: [seg.id],
        sentences: [sentenceItem],
        start: seg.start,
        end: seg.end,
        action: seg.action,
        reason: seg.reason,
      };
      activeBlock = headingBlock;
      blocks.push(headingBlock);
    } else {
      if (!activeBlock) {
        activeBlock = {
          id: `block-${blockIndex++}`,
          type: 'explanation',
          title: 'Introduction',
          text: '',
          segmentIds: [],
          sentences: [],
          action: 'keep',
        };
        blocks.push(activeBlock);
      }

      activeBlock.segmentIds.push(seg.id);
      activeBlock.sentences!.push(sentenceItem);
      activeBlock.text = activeBlock.text ? `${activeBlock.text} ${text}` : text;
      activeBlock.end = seg.end;
    }
  }

  const markdown = blocksToMarkdown(blocks);

  return {
    blocks,
    markdown,
  };
}

/**
 * Convert structured blocks to readable Markdown.
 */
export function blocksToMarkdown(blocks: StructuredScriptBlock[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    if (block.type === 'heading') {
      const prefix = block.headingLevel === 1 ? '# ' : '## ';
      lines.push(`${prefix}${block.title || block.text}`);
      if (block.sentences && block.sentences.length > 0) {
        for (const sent of block.sentences) {
          if (sent.text !== block.title) {
            lines.push(sent.action === 'cut' ? `~~${sent.text}~~ [CUT - RETAKE]` : sent.text);
          }
        }
      }
      lines.push('');
    } else if (block.type === 'step') {
      const cleanStep = (block.title || '')
        .replace(/^(?:##\s*)?(?:step|point)\s*[0-9]+[\s:.-]*/i, '')
        .replace(/^[-—–:]\s*/, '')
        .trim();
      lines.push(`## Step ${block.stepNumber || 1}: ${cleanStep || block.title || ''}`);
      if (block.sentences && block.sentences.length > 0) {
        for (const sent of block.sentences) {
          if (sent.text !== block.title) {
            lines.push(sent.action === 'cut' ? `~~${sent.text}~~ [CUT - RETAKE]` : sent.text);
          }
        }
      } else if (block.text && block.text !== block.title) {
        lines.push(block.text);
      }
      lines.push('');
    } else {
      if (block.title && block.title !== 'Introduction' && block.title !== 'Voiceover Script') {
        lines.push(`### ${block.title}`);
      }
      if (block.sentences && block.sentences.length > 0) {
        for (const sent of block.sentences) {
          lines.push(sent.action === 'cut' ? `~~${sent.text}~~ [CUT - RETAKE]` : sent.text);
        }
      } else {
        lines.push(block.text);
      }
      lines.push('');
    }
  }

  return lines.join('\n').trim();
}

/**
 * Parse Markdown or user-pasted text into structured blocks
 * with Headings (#, ##), Steps, and Explanations.
 *
 * CRITICAL FIX: Groups all explanation lines under their parent Step or Heading,
 * so pasting a 10-step, 250-line script creates ~10-12 clean sections,
 * NOT 250 separate cards!
 */
export function parsePastedScriptToBlocks(pastedText: string): StructuredScriptBlock[] {
  const rawLines = pastedText.split('\n').map((l) => l.trim());
  const blocks: StructuredScriptBlock[] = [];
  let blockIdx = 0;
  let stepCounter = 0;
  let activeBlock: StructuredScriptBlock | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line) continue;

    // Check Heading: # or ## or ###
    const isHeading1 = line.startsWith('# ');
    const isHeading2 = line.startsWith('## ') || line.startsWith('### ');
    const stepMatch =
      line.match(/^(?:##\s*)?(?:step|point)\s*([0-9]+)[\s:.-]+(.*)/i) ||
      line.match(/^step\s*([0-9]+)\b/i);

    if (stepMatch) {
      stepCounter++;
      const stepNum = parseInt(stepMatch[1], 10) || stepCounter;
      const cleanTitle = line.replace(/^###?\s+/, '').trim();
      activeBlock = {
        id: `block-${blockIdx++}`,
        type: 'step',
        stepNumber: stepNum,
        title: cleanTitle,
        text: cleanTitle,
        segmentIds: [],
        sentences: [],
        action: 'keep',
      };
      blocks.push(activeBlock);
    } else if (isHeading1 || isHeading2) {
      const cleanTitle = line.replace(/^#+\s*/, '').trim();
      activeBlock = {
        id: `block-${blockIdx++}`,
        type: 'heading',
        headingLevel: isHeading1 ? 1 : 2,
        title: cleanTitle,
        text: cleanTitle,
        segmentIds: [],
        sentences: [],
        action: 'keep',
      };
      blocks.push(activeBlock);
    } else {
      // Normal explanation / sentence line
      if (!activeBlock) {
        activeBlock = {
          id: `block-${blockIdx++}`,
          type: 'explanation',
          title: 'Introduction',
          text: '',
          segmentIds: [],
          sentences: [],
          action: 'keep',
        };
        blocks.push(activeBlock);
      }

      const sentences = splitIntoSentences(line);
      for (const sent of sentences) {
        activeBlock.sentences!.push({
          id: `sent-${blockIdx}-${activeBlock.sentences!.length}`,
          text: sent,
          action: 'keep', // Default: preserve user's intended script
        });
      }
      activeBlock.text = activeBlock.text ? `${activeBlock.text} ${line}` : line;
    }
  }

  // Fallback if no blocks were parsed
  if (blocks.length === 0 && pastedText.trim()) {
    const sentences = splitIntoSentences(pastedText.trim()).map((s, idx) => ({
      id: `sent-0-${idx}`,
      text: s,
      action: 'keep' as const,
    }));
    blocks.push({
      id: `block-${blockIdx++}`,
      type: 'explanation',
      title: 'Pasted Script',
      text: pastedText.trim(),
      segmentIds: [],
      sentences,
      action: 'keep',
    });
  }

  return blocks;
}

/**
 * Normalize and tokenize a phrase into clean word tokens
 */
function normalizeTokens(text: string): string[] {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Token similarity score between two phrases (0.0 to 1.0)
 */
function tokenSimilarity(a: string, b: string): number {
  const normA = normalizeTokens(a);
  const normB = normalizeTokens(b);
  if (!normA.length || !normB.length) return 0;

  const setA = new Set(normA);
  const setB = new Set(normB);
  let match = 0;
  for (const w of setA) {
    if (setB.has(w)) match++;
  }
  const union = new Set([...normA, ...normB]).size;
  return union > 0 ? match / union : 0;
}

/**
 * Deeply evaluate a candidate spoken take against an intended canonical script sentence.
 * Calculates completeness, accuracy, stumble presence, and recency.
 */
export function evaluateTakeAgainstScript(
  scriptSentence: string,
  candidateText: string,
  takeRank: number,
  totalCandidates: number
): {
  score: number;
  tokenSim: number;
  completeness: number;
  accuracy: number;
  isFalseStart: boolean;
  hasMistake: boolean;
} {
  const scriptTokens = normalizeTokens(scriptSentence);
  const candTokens = normalizeTokens(candidateText);

  if (!scriptTokens.length || !candTokens.length) {
    return { score: 0, tokenSim: 0, completeness: 0, accuracy: 0, isFalseStart: true, hasMistake: true };
  }

  // 1. Jaccard Token similarity
  const setScript = new Set(scriptTokens);
  const setCand = new Set(candTokens);
  let matchedTokens = 0;
  for (const t of setCand) {
    if (setScript.has(t)) matchedTokens++;
  }
  const unionCount = new Set([...scriptTokens, ...candTokens]).size;
  const tokenSim = unionCount > 0 ? matchedTokens / unionCount : 0;

  // 2. Completeness: how much of the script sentence did this candidate cover?
  let scriptCoverage = 0;
  for (const t of scriptTokens) {
    if (setCand.has(t)) scriptCoverage++;
  }
  const completeness = scriptCoverage / scriptTokens.length;

  // 3. Length match ratio
  const lengthRatio = Math.min(candTokens.length, scriptTokens.length) / Math.max(candTokens.length, scriptTokens.length);

  // 4. Sequence alignment (Longest Common Subsequence in order)
  let lcs = 0;
  let sIdx = 0;
  for (const c of candTokens) {
    const foundIdx = scriptTokens.indexOf(c, sIdx);
    if (foundIdx !== -1) {
      lcs++;
      sIdx = foundIdx + 1;
    }
  }
  const accuracy = lcs / scriptTokens.length;

  // 5. False start / Incomplete sentence detection:
  // Short fragment relative to script (< 55% coverage) or candidate trailing off before completing
  const isFalseStart = completeness < 0.55 && scriptTokens.length >= 5;

  // 6. Mistake / deviation detection:
  // Spoken words that deviate from canonical script text
  let strayWords = 0;
  for (const c of candTokens) {
    if (!setScript.has(c)) strayWords++;
  }
  const hasMistake = strayWords >= 2 || (candTokens.length >= 4 && accuracy < 0.60);

  // 7. Composite score:
  // Completeness and accuracy are prioritized.
  // Recency bonus: voiceover performers redo mistakes; later complete take is preferred.
  const recencyBonus = totalCandidates > 1 && takeRank === totalCandidates - 1 ? 0.08 : 0;
  const lengthPenalty = isFalseStart ? -0.35 : 0;

  const score = (
    0.40 * accuracy +
    0.35 * completeness +
    0.15 * tokenSim +
    0.10 * lengthRatio +
    recencyBonus +
    lengthPenalty
  );

  return {
    score: Math.max(0, score),
    tokenSim,
    completeness,
    accuracy,
    isFalseStart,
    hasMistake,
  };
}

/**
 * Aligns audio transcript segments with user's pasted script.
 * - Matches spoken segments against the user's canonical script.
 * - Flags extra takes, false starts, and repeated stumbles in audio as 'cut'.
 * - Preserves the most complete, natural, and accurate take.
 * - GUARANTEE: Never cuts canonical script sentences by mistake.
 */
export function alignPastedScriptWithAudio(
  pastedScript: string,
  segments: AudioCleanSegment[],
  words?: Array<{ word: string; start: number; end: number }>,
  options?: { removeRepeats?: boolean; removeFalseStarts?: boolean; removeFillers?: boolean }
): {
  blocks: StructuredScriptBlock[];
  updatedSegments: AudioCleanSegment[];
  alignedMarkdown: string;
} {
  const scriptBlocks = parsePastedScriptToBlocks(pastedScript);
  if (scriptBlocks.length === 0 || segments.length === 0) {
    const res = structureTranscriptIntoBlocks(segments);
    return {
      blocks: res.blocks,
      updatedSegments: segments,
      alignedMarkdown: res.markdown,
    };
  }

  const updatedSegments = segments.map((s) => ({ ...s }));

  // Collect all target sentences across all script blocks
  type TargetItem = {
    block: StructuredScriptBlock;
    sentence: ScriptBlockSentence;
  };
  const targetItems: TargetItem[] = [];

  for (const block of scriptBlocks) {
    if (block.sentences && block.sentences.length > 0) {
      for (const sent of block.sentences) {
        targetItems.push({ block, sentence: sent });
      }
    } else {
      const titleSentence: ScriptBlockSentence = {
        id: `title-${block.id}`,
        text: block.title || block.text,
        action: 'keep',
      };
      if (!block.sentences) block.sentences = [];
      block.sentences.push(titleSentence);
      targetItems.push({ block, sentence: titleSentence });
    }
  }

  let curSegmentIndex = 0;

  for (let tIdx = 0; tIdx < targetItems.length; tIdx++) {
    const item = targetItems[tIdx];
    const targetText = item.sentence.text;

    // 1. Gather all candidate spoken segments for this target sentence
    type CandidateTake = {
      segIdx: number;
      segment: AudioCleanSegment;
      evalResult: ReturnType<typeof evaluateTakeAgainstScript>;
    };

    const candidateTakes: CandidateTake[] = [];
    const maxLookahead = Math.min(updatedSegments.length, curSegmentIndex + 14);

    for (let i = curSegmentIndex; i < maxLookahead; i++) {
      const segText = updatedSegments[i].text;
      const tSim = tokenSimilarity(targetText, segText);
      const scriptTokens = normalizeTokens(targetText);
      const segTokens = normalizeTokens(segText);

      // Check if this segment is a viable take candidate
      const isViableCandidate = (
        tSim >= 0.28 ||
        (scriptTokens.length <= 4 && tSim >= 0.20) ||
        (segTokens.length >= 3 && segTokens.filter(t => scriptTokens.includes(t)).length >= 2)
      );

      if (isViableCandidate) {
        // Evaluate take quality
        const evalRes = evaluateTakeAgainstScript(
          targetText,
          segText,
          candidateTakes.length,
          1 // temporary rank
        );
        candidateTakes.push({
          segIdx: i,
          segment: updatedSegments[i],
          evalResult: evalRes,
        });
      }
    }

    if (candidateTakes.length > 0) {
      // Re-evaluate with final candidate count to give recency bonus to later takes
      for (let c = 0; c < candidateTakes.length; c++) {
        candidateTakes[c].evalResult = evaluateTakeAgainstScript(
          targetText,
          candidateTakes[c].segment.text,
          c,
          candidateTakes.length
        );
      }

      // Pick the take with highest composite quality (most complete, accurate, natural)
      candidateTakes.sort((a, b) => b.evalResult.score - a.evalResult.score);
      const bestCandidate = candidateTakes[0];
      const bestSegIdx = bestCandidate.segIdx;

      // Mark earlier skipped segments between curSegmentIndex and bestSegIdx
      for (let k = curSegmentIndex; k < bestSegIdx; k++) {
        if (updatedSegments[k].action !== 'cut') {
          // Check if this was an incomplete false start or mistake
          const evalSkipped = evaluateTakeAgainstScript(targetText, updatedSegments[k].text, 0, 1);
          updatedSegments[k].action = 'cut';
          if (evalSkipped.isFalseStart) {
            updatedSegments[k].reason = 'false-start';
          } else if (evalSkipped.hasMistake) {
            updatedSegments[k].reason = 'mistake';
          } else {
            updatedSegments[k].reason = 'repeat';
          }
        }
      }

      // Other flawed candidate takes for this same sentence must also be cut
      for (let c = 1; c < candidateTakes.length; c++) {
        const otherTake = candidateTakes[c];
        if (otherTake.segIdx !== bestSegIdx && updatedSegments[otherTake.segIdx].action !== 'cut') {
          updatedSegments[otherTake.segIdx].action = 'cut';
          if (otherTake.evalResult.isFalseStart) {
            updatedSegments[otherTake.segIdx].reason = 'false-start';
          } else if (otherTake.evalResult.hasMistake) {
            updatedSegments[otherTake.segIdx].reason = 'mistake';
          } else {
            updatedSegments[otherTake.segIdx].reason = 'repeat';
          }
        }
      }

      // Designate best take as KEEPER and synchronize timestamps
      updatedSegments[bestSegIdx].action = 'keep';
      delete updatedSegments[bestSegIdx].reason;

      item.sentence.start = updatedSegments[bestSegIdx].start;
      item.sentence.end = updatedSegments[bestSegIdx].end;
      item.sentence.action = 'keep';

      if (!item.block.segmentIds.includes(updatedSegments[bestSegIdx].id)) {
        item.block.segmentIds.push(updatedSegments[bestSegIdx].id);
      }

      curSegmentIndex = bestSegIdx + 1;
    } else {
      // USER MANDATE: AI does NOT accidentally cut valid script sentences!
      // Keep canonical sentence preserved even if exact match not found in audio.
      item.sentence.action = 'keep';
    }
  }

  const alignedMarkdown = blocksToMarkdown(scriptBlocks);

  return {
    blocks: scriptBlocks,
    updatedSegments,
    alignedMarkdown,
  };
}
