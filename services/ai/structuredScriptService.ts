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
 * Token similarity score between two phrases (0.0 to 1.0)
 */
function tokenSimilarity(a: string, b: string): number {
  const normA = a.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  const normB = b.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
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
 * Aligns audio transcript segments with user's pasted script.
 * - Matches spoken segments against the user's canonical script.
 * - Flags extra takes, false starts, and repeated stumbles in audio as 'cut'.
 * - GUARANTEE: Never cuts canonical script sentences by mistake.
 */
export function alignPastedScriptWithAudio(
  pastedScript: string,
  segments: AudioCleanSegment[]
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

  for (const item of targetItems) {
    const targetText = item.sentence.text;
    let bestSegIdx = -1;
    let bestScore = 0;

    // Search forward in speech segments (lookahead up to 10 segments)
    const maxLookahead = Math.min(updatedSegments.length, curSegmentIndex + 10);
    for (let i = curSegmentIndex; i < maxLookahead; i++) {
      const score = tokenSimilarity(targetText, updatedSegments[i].text);
      if (score > bestScore) {
        bestScore = score;
        bestSegIdx = i;
      }
    }

    if (bestSegIdx !== -1 && bestScore >= 0.25) {
      // Any speech segments skipped between curSegmentIndex and bestSegIdx are retakes / stumbles
      for (let k = curSegmentIndex; k < bestSegIdx; k++) {
        if (updatedSegments[k].action !== 'cut') {
          updatedSegments[k].action = 'cut';
          updatedSegments[k].reason = 'repeat';
        }
      }

      // Best take is kept and synchronized
      updatedSegments[bestSegIdx].action = 'keep';
      item.sentence.start = updatedSegments[bestSegIdx].start;
      item.sentence.end = updatedSegments[bestSegIdx].end;
      item.sentence.action = 'keep';

      if (!item.block.segmentIds.includes(updatedSegments[bestSegIdx].id)) {
        item.block.segmentIds.push(updatedSegments[bestSegIdx].id);
      }

      curSegmentIndex = bestSegIdx + 1;
    } else {
      // USER MANDATE: AI does NOT accidentally cut valid script sentences!
      // Keep canonical sentence preserved even if exact match not found.
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
