/**
 * Structured Script Service for AI Audio Cleaner
 *
 * Turns raw speech transcripts into a structured script:
 * - Headings (# H1, ## H2)
 * - Steps (Step 1, Step 2, etc.)
 * - Explanations & Dialogue (with timestamps & cut/keep actions)
 *
 * Also provides alignment between user-pasted pre-written scripts and spoken audio.
 */

import type { AudioCleanSegment } from './audioCleanService';

export type ScriptBlockType = 'heading' | 'step' | 'explanation';

export type StructuredScriptBlock = {
  id: string;
  type: ScriptBlockType;
  title?: string;
  headingLevel?: 1 | 2 | 3; // # H1, ## H2, ### H3
  stepNumber?: number; // 1, 2, 3...
  text: string;
  segmentIds: string[];
  start?: number;
  end?: number;
  action?: 'keep' | 'cut';
  reason?: 'repeat' | 'mistake' | 'silence' | 'filler' | 'custom';
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
 * Automatically analyze transcript segments and organize them into
 * clean structured blocks (Headings, Steps, and Explanations).
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
    const singleBlock: StructuredScriptBlock = {
      id: 'block-0',
      type: 'explanation',
      text: fallbackText,
      segmentIds: [],
    };
    return {
      blocks: [singleBlock],
      markdown: `# Audio Script\n\n${fallbackText}`,
    };
  }

  const blocks: StructuredScriptBlock[] = [];
  let currentStepCount = 0;

  // 1. Initial Hook / Introduction block if speech starts with a topic
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
      // First sentence is often the Hook / Intro
      isHeading = true;
      headingLevel = 1;
    } else {
      for (const pat of HEADING_PATTERNS) {
        if (pat.test(text)) {
          isHeading = true;
          headingLevel = 2;
          break;
        }
      }
    }

    if (isStep) {
      // Create Step Block
      activeBlock = {
        id: `block-${blockIndex++}`,
        type: 'step',
        stepNumber: stepNum,
        title: text.length > 50 ? text.slice(0, 48) + '...' : text,
        text: text,
        segmentIds: [seg.id],
        start: seg.start,
        end: seg.end,
        action: seg.action,
        reason: seg.reason,
      };
      blocks.push(activeBlock);
    } else if (isHeading && (i === 0 || text.split(' ').length <= 12)) {
      // Create Heading Block
      activeBlock = {
        id: `block-${blockIndex++}`,
        type: 'heading',
        headingLevel: headingLevel,
        title: text,
        text: text,
        segmentIds: [seg.id],
        start: seg.start,
        end: seg.end,
        action: seg.action,
        reason: seg.reason,
      };
      blocks.push(activeBlock);
    } else {
      // Explanation / Dialogue block
      // Group contiguous explanation segments under the active block or create a new explanation block
      if (activeBlock && activeBlock.type === 'explanation' && activeBlock.action === seg.action) {
        // Append to existing explanation block
        activeBlock.text += ` ${text}`;
        activeBlock.segmentIds.push(seg.id);
        activeBlock.end = seg.end;
      } else {
        activeBlock = {
          id: `block-${blockIndex++}`,
          type: 'explanation',
          text: text,
          segmentIds: [seg.id],
          start: seg.start,
          end: seg.end,
          action: seg.action,
          reason: seg.reason,
        };
        blocks.push(activeBlock);
      }
    }
  }

  // Generate clean Markdown output
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
    const isCut = block.action === 'cut';
    const cutPrefix = isCut ? '~~' : '';
    const cutSuffix = isCut ? '~~ [CUT]' : '';

    if (block.type === 'heading') {
      const hashes = '#'.repeat(block.headingLevel || 1);
      lines.push(`${hashes} ${cutPrefix}${block.title || block.text}${cutSuffix}\n`);
    } else if (block.type === 'step') {
      const rawText = block.title || block.text || '';
      const cleanStepText = rawText.replace(/^(?:step|point)\s*[0-9]+[\s:.-]*/i, '').trim() || rawText;
      lines.push(`## Step ${block.stepNumber || 1}: ${cutPrefix}${cleanStepText}${cutSuffix}\n`);
    } else {
      lines.push(`${cutPrefix}${block.text}${cutSuffix}\n`);
    }
  }

  return lines.join('\n').trim();
}

/**
 * Parse Markdown or user-pasted text into structured blocks
 * with Headings (#, ##), Steps, and Explanations.
 */
export function parsePastedScriptToBlocks(pastedText: string): StructuredScriptBlock[] {
  const lines = pastedText.split('\n').map((l) => l.trim()).filter(Boolean);
  const blocks: StructuredScriptBlock[] = [];
  let blockIdx = 0;
  let stepCounter = 0;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      blocks.push({
        id: `pasted-block-${blockIdx++}`,
        type: 'heading',
        headingLevel: 1,
        title: line.replace(/^#\s+/, ''),
        text: line.replace(/^#\s+/, ''),
        segmentIds: [],
        action: 'keep',
      });
    } else if (line.startsWith('## ') || line.startsWith('### ')) {
      const isSubHeading = line.startsWith('### ');
      const cleanTitle = line.replace(/^###?\s+/, '');
      const stepMatch = cleanTitle.match(/^step\s*([0-9]+)[\s:.-](.*)/i);

      if (stepMatch) {
        stepCounter++;
        blocks.push({
          id: `pasted-block-${blockIdx++}`,
          type: 'step',
          stepNumber: parseInt(stepMatch[1], 10) || stepCounter,
          title: cleanTitle,
          text: stepMatch[2].trim() || cleanTitle,
          segmentIds: [],
          action: 'keep',
        });
      } else {
        blocks.push({
          id: `pasted-block-${blockIdx++}`,
          type: 'heading',
          headingLevel: isSubHeading ? 3 : 2,
          title: cleanTitle,
          text: cleanTitle,
          segmentIds: [],
          action: 'keep',
        });
      }
    } else if (/^(?:step|point)\s*([0-9]+)[\s:.-]/i.test(line)) {
      stepCounter++;
      blocks.push({
        id: `pasted-block-${blockIdx++}`,
        type: 'step',
        stepNumber: stepCounter,
        title: line,
        text: line,
        segmentIds: [],
        action: 'keep',
      });
    } else {
      blocks.push({
        id: `pasted-block-${blockIdx++}`,
        type: 'explanation',
        text: line,
        segmentIds: [],
        action: 'keep',
      });
    }
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
 * - Matches which spoken segments match the user's intended script.
 * - Flags extra takes, false starts, and out-of-script stumbles as 'cut'.
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

  // For each block in the user's intended script, find the best-matching spoken segment(s)
  let curSegmentIndex = 0;

  for (const block of scriptBlocks) {
    const blockText = block.text;
    let bestSegIdx = -1;
    let bestScore = 0;

    // Search forward from curSegmentIndex in audio segments
    for (let i = curSegmentIndex; i < Math.min(updatedSegments.length, curSegmentIndex + 8); i++) {
      const score = tokenSimilarity(blockText, updatedSegments[i].text);
      if (score > bestScore) {
        bestScore = score;
        bestSegIdx = i;
      }
    }

    if (bestSegIdx !== -1 && bestScore >= 0.25) {
      // Any segments between curSegmentIndex and bestSegIdx that were discarded are likely stumbles/retakes
      for (let k = curSegmentIndex; k < bestSegIdx; k++) {
        if (updatedSegments[k].action !== 'cut') {
          updatedSegments[k].action = 'cut';
          updatedSegments[k].reason = 'repeat';
        }
      }

      // Mark this segment as kept and associate with block
      updatedSegments[bestSegIdx].action = 'keep';
      block.segmentIds.push(updatedSegments[bestSegIdx].id);
      block.start = updatedSegments[bestSegIdx].start;
      block.end = updatedSegments[bestSegIdx].end;
      curSegmentIndex = bestSegIdx + 1;
    }
  }

  const alignedMarkdown = blocksToMarkdown(scriptBlocks);

  return {
    blocks: scriptBlocks,
    updatedSegments,
    alignedMarkdown,
  };
}
