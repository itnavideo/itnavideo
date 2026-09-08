/**
 * Generate local screenshots of all Compare Explainer stickers in actual template layout.
 * Usage: node scripts/test-compare-stickers.mjs
 *
 * Creates contact-sheet screenshots for each sticker style showing all canonical poses.
 * Also generates an HTML contact sheet for easy visual comparison.
 * No AWS credits used — all local Remotion still renders.
 */
import {execSync} from 'node:child_process';
import {writeFileSync, mkdirSync, existsSync, statSync} from 'node:fs';
import path from 'node:path';

const requestedStyles = process.argv
  .filter(arg => arg.startsWith('--style='))
  .flatMap(arg => arg.slice('--style='.length).split(',').map(value => value.trim()).filter(Boolean));
const requestedStyleSet = new Set(requestedStyles);

const OUTPUT_DIR = path.resolve('sticker-previews');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, {recursive: true});

const STICKER_DIR = path.resolve('public/assets/stickman');
// Map folder names to STICKER_SETS keys
const FOLDER_TO_STYLE = {
  '2d-teacher': '2d',
  'cartoon-teacher': 'cartoon',
  'stickman-explainer': 'explainer',
  'girl-teacher': 'girl-teacher',
  'girl-teacher-3d': 'girl-teacher-3d',
  'grandpa-teacher-3d': 'grandpa-teacher-3d',
  'young-presenter-3d': 'young-presenter-3d',
  'teacher-2d-pro': 'teacher-2d-pro',
  'chibi-boy-3d': 'chibi-boy-3d',
  'corporate-woman-3d': 'corporate-woman-3d',
  'indian-teacher-woman': 'indian-teacher-woman',
  'doctor-3d-half': 'doctor-3d-half',
  'banker-3d-half': 'banker-3d-half',
  'news-anchor-3d-half': 'news-anchor-3d-half',
  'lawyer-girl-3d': 'lawyer-girl-3d',
  'shia-moulana-3d': 'shia-moulana-3d',
};

const stickerFolders = Object.keys(FOLDER_TO_STYLE).filter(f => {
  const full = path.join(STICKER_DIR, f);
  try { return statSync(full).isDirectory(); }
  catch { return false; }
}).filter(f => {
  const style = FOLDER_TO_STYLE[f] || f;
  return requestedStyleSet.size === 0 || requestedStyleSet.has(style) || requestedStyleSet.has(f);
});

console.log(`Found ${stickerFolders.length} sticker styles to test\n`);

// Pose test frames — each activates a canonical sticker pose through explicit metadata.
const POSE_TESTS = [
  {pose: 'sticker_welcome_intro_explainer', frame: 12, label: 'Welcome'},
  {pose: 'sticker_pointing_left_side_explainer', frame: 78, label: 'Point Left'},
  {pose: 'sticker_pointing_right_side_explainer', frame: 144, label: 'Point Right'},
  {pose: 'sticker_thinking_analysis_explainer', frame: 210, label: 'Thinking'},
  {pose: 'sticker_warning_issue_explainer', frame: 276, label: 'Warning'},
  {pose: 'sticker_success_conclusion_explainer', frame: 342, label: 'Success'},
  {pose: 'sticker_questioning_surprised_explainer', frame: 408, label: 'Question'},
  {pose: 'sticker_general_explaining_key_point', frame: 474, label: 'Explain'},
  {pose: 'sticker_comparing_both_sides_explainer', frame: 540, label: 'Compare'},
  {pose: 'sticker_happy_celebrating_outro', frame: 606, label: 'Celebrate'},
];

function makeProps(stickerStyle) {
  const captions = POSE_TESTS.map((test, index) => ({
    start: index * 2.2,
    end: index * 2.2 + 2.1,
    text: test.label,
  }));
  const overlayTimeline = POSE_TESTS.map((test, index) => ({
    start: index * 2.2,
    end: index * 2.2 + 2.1,
    text: test.label,
    title: test.label,
    stickerPose: test.pose,
  }));

  return JSON.stringify({
    audioUrl: '',
    comparisonImageUrls: [],
    compareLeftTitle: 'Option A',
    compareRightTitle: 'Option B',
    creatorHandle: '@itnavideo',
    stickerStyle,
    durationSeconds: 22,
    captions,
    overlayTimeline,
  });
}

async function main() {
  const propsFile = path.resolve('test-sticker-props.json');
  let tested = 0;
  let failed = 0;
  const results = [];

  for (const folder of stickerFolders) {
    const style = FOLDER_TO_STYLE[folder] || folder;
    console.log(`--- Testing: ${style} (${folder}) ---`);

    const props = makeProps(style);
    writeFileSync(propsFile, props, 'utf-8');

    const styleResults = {style, folder, poses: []};

    for (const test of POSE_TESTS) {
      const output = path.join(OUTPUT_DIR, `${style}--${test.pose}.png`);
      try {
        execSync(
          `npx remotion still remotion/index.tsx comparisonImages --frame=${test.frame} --output="${output}" --props="${propsFile}"`,
          {cwd: process.cwd(), timeout: 45000, stdio: 'pipe'}
        );
        const size = statSync(output).size;
        styleResults.poses.push({pose: test.pose, frame: test.frame, file: output, size, ok: true});
        tested++;
        process.stdout.write(`  ✓ ${test.pose} (${Math.round(size/1024)}KB)\n`);
      } catch (err) {
        const errorText = [err.stderr?.toString(), err.stdout?.toString(), err.message].filter(Boolean).join('\n').slice(0, 800);
        styleResults.poses.push({pose: test.pose, frame: test.frame, file: output, size: 0, ok: false, error: errorText});
        failed++;
        process.stdout.write(`  ✗ ${test.pose} FAILED: ${errorText.replace(/\s+/g, ' ').slice(0, 180)}\n`);
      }
    }

    results.push(styleResults);
    console.log('');
  }

  // Cleanup props file
  try { writeFileSync(propsFile, '', 'utf-8'); } catch {}

  // Generate HTML contact sheet
  generateContactSheet(results);

  console.log(`\n=== RESULTS ===`);
  console.log(`Sticker styles: ${stickerFolders.length}`);
  console.log(`Frames rendered: ${tested}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}/`);
  console.log(`Contact sheet: ${OUTPUT_DIR}/contact-sheet.html`);
  console.log(`\nOpen contact-sheet.html in browser to visually check all stickers.`);
}

function generateContactSheet(results) {
  const poses = POSE_TESTS.map(t => t.pose);

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Compare Explainer Sticker Contact Sheet</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #111; color: #fff; font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
  h1 { text-align: center; margin-bottom: 8px; font-size: 28px; }
  .subtitle { text-align: center; color: #888; margin-bottom: 30px; font-size: 14px; }
  .grid { display: grid; grid-template-columns: 160px repeat(${poses.length}, 1fr); gap: 4px; margin-bottom: 40px; }
  .header { background: #222; padding: 8px; text-align: center; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; }
  .style-label { background: #1a1a2e; padding: 8px 12px; display: flex; align-items: center; font-weight: 600; font-size: 12px; border-radius: 4px; }
  .cell { background: #1a1a1a; border-radius: 4px; overflow: hidden; position: relative; aspect-ratio: 9/16; }
  .cell img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.2s; }
  .cell img:hover { transform: scale(1.02); }
  .cell.failed { background: #2a1010; display: flex; align-items: center; justify-content: center; color: #f87171; font-size: 11px; }
  .badge { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); color: #10b981; font-size: 9px; padding: 2px 6px; border-radius: 3px; }
  .badge.half { color: #f59e0b; }
  .legend { display: flex; gap: 16px; justify-content: center; margin-bottom: 20px; font-size: 12px; }
  .legend span { display: flex; align-items: center; gap: 4px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot.full { background: #10b981; }
  .dot.half { background: #f59e0b; }
  .notes { max-width: 800px; margin: 30px auto; background: #1a1a2e; border-radius: 8px; padding: 20px; font-size: 13px; line-height: 1.8; }
  .notes h3 { margin-bottom: 10px; color: #60a5fa; }
</style>
</head>
<body>
<h1>🎭 Compare Explainer — Sticker Contact Sheet</h1>
<p class="subtitle">All ${results.length} sticker characters × ${POSE_TESTS.length} canonical poses | Layout: 1080×1920 (9:16) | Zone starts at y=840</p>

<div class="legend">
  <span><span class="dot full"></span> Full Body</span>
  <span><span class="dot half"></span> Half Body</span>
</div>

<div class="grid">
  <div class="header">Character</div>
`;

  for (const p of poses) {
    html += `  <div class="header">${p}</div>\n`;
  }

  const HALF_BODY_STYLES = ['grandpa-teacher-3d', 'doctor-3d-half', 'banker-3d-half', 'news-anchor-3d-half'];

  for (const result of results) {
    const isHalf = HALF_BODY_STYLES.includes(result.style);
    html += `  <div class="style-label">${result.style}</div>\n`;
    for (const pose of poses) {
      const p = result.poses.find(x => x.pose === pose);
      if (p && p.ok) {
        const relPath = path.basename(p.file);
        html += `  <div class="cell"><img src="${relPath}" alt="${result.style} ${pose}" /><span class="badge${isHalf ? ' half' : ''}">${isHalf ? 'half' : 'full'}</span></div>\n`;
      } else {
        html += `  <div class="cell failed">✗</div>\n`;
      }
    }
  }

  html += `</div>

<div class="notes">
  <h3>Layout Info</h3>
  <p><strong>Canvas:</strong> 1080 × 1920 px (9:16 portrait reel)</p>
  <p><strong>Sticker Zone:</strong> top=840, bottom=20, left=30, right=30</p>
  <p><strong>Full Body:</strong> 720w × 980h max, scale 1.0</p>
  <p><strong>Half Body:</strong> 780w × 860h max, scale 1.08</p>
  <p><strong>Sticker Position:</strong> Aligned top of zone (just below explanation text box at y=735)</p>
  <p><strong>What to check:</strong></p>
  <ul style="margin-left: 20px; margin-top: 8px;">
    <li>Is the sticker clearly visible and large enough?</li>
    <li>Is the sticker close to the explanation text (not far below)?</li>
    <li>Is the sticker inside safe area (not cut from edges)?</li>
    <li>Does the sticker have transparent background (no white box)?</li>
    <li>Are the canonical poses visually different from each other where unique assets exist?</li>
    <li>Does the sticker feel like a presenter in the scene?</li>
  </ul>
</div>
</body>
</html>`;

  writeFileSync(path.join(OUTPUT_DIR, 'contact-sheet.html'), html, 'utf-8');
}

main().catch(console.error);
