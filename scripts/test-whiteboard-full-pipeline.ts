import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { planWhiteboardVideo, buildWhiteboardSegments, validateWhiteboardLayout, wrapWhiteboardText } from '../services/ai/whiteboardPlanner';
import { WHITEBOARD_VECTOR_DRAWINGS } from '../lib/whiteboard/vectorDrawings';
import { WB_CANVAS_WIDTH, WB_CANVAS_HEIGHT, WB_USABLE_WIDTH, WB_USABLE_HEIGHT, WB_MAX_CHARS_PER_LINE } from '../lib/whiteboard/whiteboardConstants';

async function runFullPipelineAudit() {
  console.log('=== STEP 1: AUDIT USER AUDIO (1.mp3) ===');
  const audioPath = 'C:\\Users\\Akram Editor Studio\\Downloads\\1.mp3';
  if (!fs.existsSync(audioPath)) {
    throw new Error(`User audio file not found at: ${audioPath}`);
  }
  const stat = fs.statSync(audioPath);
  console.log(`Audio exists: ${audioPath} (${(stat.size / 1024).toFixed(1)} KB)`);

  console.log('\n=== STEP 2: TRANSCRIBE SPEECH (Groq Whisper Cloud API) ===');
  const fileBuffer = fs.readFileSync(audioPath);
  const blob = new Blob([fileBuffer], { type: 'audio/mpeg' });
  const form = new FormData();
  form.append('file', blob, '1.mp3');
  form.append('model', 'whisper-large-v3-turbo');
  form.append('response_format', 'verbose_json');
  form.append('temperature', '0');
  form.append('timestamp_granularities[]', 'segment');
  form.append('timestamp_granularities[]', 'word');

  const whisperRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: form,
  });

  if (!whisperRes.ok) {
    throw new Error(`Whisper transcription failed: ${whisperRes.status} ${await whisperRes.text()}`);
  }

  const whisperData = await whisperRes.json();
  const words = (whisperData.words || []).map((w: any) => ({
    word: String(w.word || ''),
    start: Number(w.start || 0),
    end: Number(w.end || 0),
  }));
  const duration = Number(whisperData.duration || 23.6);
  const transcript = whisperData.text.trim();

  console.log(`Transcript Length: ${transcript.length} chars, Words: ${words.length}, Duration: ${duration.toFixed(2)}s`);
  console.log(`Transcript: "${transcript}"`);

  console.log('\n=== STEP 3: SEGMENTATION & STORYBOARD BLUEPRINT ===');
  const segments = buildWhiteboardSegments(words, duration);
  console.log(`Built ${segments.length} sentence segments from transcript.`);

  console.log('\n=== STEP 4: AI WHITEBOARD DIRECTOR PLANNING ===');
  const plan = await planWhiteboardVideo({
    transcript,
    segments: segments.map(s => ({ start: s.start, end: s.end, text: s.text })),
    words,
    durationSeconds: duration,
    topicTitle: 'Master Your Money',
    aspectRatio: '9:16',
  });

  console.log(`Planner Source: ${plan.source}`);
  console.log(`Video Title: "${plan.title}"`);
  console.log(`Total Points: ${plan.points.length}`);
  console.log(`Conclusion: "${plan.conclusion}" at ${plan.conclusionTime}s`);

  console.log('\n=== STEP 5: VERIFY SCENE STORYBOARD & DRAWINGS ===');
  let hasDrawingErrors = false;
  plan.points.forEach((p, idx) => {
    const drawingExists = Boolean(p.drawingId && WHITEBOARD_VECTOR_DRAWINGS[p.drawingId]);
    if (!drawingExists) {
      console.error(`❌ Point ${idx} drawingId "${p.drawingId}" does not exist in registry!`);
      hasDrawingErrors = true;
    }
    console.log(`  Point ${idx} [Board ${p.boardIndex}]: "${p.text}"`);
    console.log(`    Time: ${p.startTime}s - ${p.endTime}s | Focus: ${p.focusStartTime}s - ${p.focusEndTime}s`);
    console.log(`    Drawing: ${p.drawingId} (${drawingExists ? '✓ Valid Vector' : '❌ INVALID'}) | Color: ${p.markerColor} | Focus: ${p.focusType}`);
  });

  if (hasDrawingErrors) {
    throw new Error('Some points have invalid vector drawings!');
  }

  console.log('\n=== STEP 6: VERIFY TEXT WRAPPING & CARD HEIGHTS (9:16) ===');
  let hasOverflow = false;
  const wrappedTitle = wrapWhiteboardText(plan.title, WB_MAX_CHARS_PER_LINE, 2);
  console.log(`Title Wrapped:\n"${wrappedTitle}"`);

  plan.points.forEach((p, idx) => {
    const wrapped = wrapWhiteboardText(p.text, WB_MAX_CHARS_PER_LINE, 2);
    const lines = wrapped.split('\n');
    console.log(`  Point ${idx} Lines (${lines.length}):\n    ${lines.map(l => `"${l}"`).join('\n    ')}`);
    if (lines.length > 2) {
      console.error(`❌ Point ${idx} exceeds 2 lines: ${lines.length} lines!`);
      hasOverflow = true;
    }
  });

  console.log('\n=== STEP 7: VALIDATE COMPLETE WHITEBOARD LAYOUT ===');
  const diag = validateWhiteboardLayout(plan.title, plan.points, plan.conclusion);
  console.log(`Layout Valid: ${diag.isValid ? '✓ YES' : '❌ NO'}`);
  if (!diag.isValid) {
    console.error('Layout Issues:', diag.issues);
    hasOverflow = true;
  }
  console.log('Board Diagnostics:', JSON.stringify(diag.boardDiagnostics, null, 2));

  // Save the complete props payload
  const remotionProps = {
    mediaSrc: audioPath,
    mediaType: 'audio',
    sourceAudioVolume: 1,
    durationSeconds: duration,
    title: plan.title,
    titleColor: plan.titleColor,
    layoutType: plan.layoutType,
    language: plan.language,
    direction: plan.direction,
    points: plan.points,
    conclusion: plan.conclusion,
    conclusionTime: plan.conclusionTime,
    aspectRatio: '9:16',
    enableSfx: true,
  };

  const outputPropsPath = 'scripts/scratch-whiteboard-props.json';
  fs.writeFileSync(outputPropsPath, JSON.stringify(remotionProps, null, 2));
  console.log(`\n✓ Remotion Props successfully verified and saved to ${outputPropsPath}`);

  if (hasOverflow) {
    throw new Error('Pipeline audit found layout overflow issues.');
  }

  console.log('\n=============================================');
  console.log('🎉 AUDIT COMPLETE: 100% CLEAN & VERIFIED!');
  console.log('=============================================');
}

runFullPipelineAudit().catch(err => {
  console.error('\n❌ PIPELINE AUDIT FAILED:', err);
  process.exit(1);
});
