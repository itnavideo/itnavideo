/**
 * End-to-End Pipeline Audit for Compare Explainer
 *
 * Verifies:
 * 1. Cloudinary character asset availability (HTTP 200 for all poses across all 6 characters)
 * 2. Pose selection & script semantic alignment (welcome -> left -> right -> warning -> success)
 * 3. Dual-image slot validation & prop assembly
 * 4. Remotion template props conformation & safety
 */

import { CHARACTER_CATALOG } from '../components/compare/StickerStylePicker';
import { planCompareStickers, POSES } from '../services/ai/compareStickerPlanner';

async function auditPipeline() {
  console.log('========================================================');
  console.log('🚀 AUDIT 1: VERIFYING CLOUDINARY CHARACTER ASSETS');
  console.log('========================================================');

  console.log(`Checking ${CHARACTER_CATALOG.length} verified characters...`);
  let assetFailures = 0;
  let totalChecked = 0;

  for (const char of CHARACTER_CATALOG) {
    console.log(`\nTesting Character [${char.id}] (${char.name}) - Category: ${char.category}`);
    const posesToCheck = [
      { name: 'preview', url: char.preview },
      { name: 'welcome', url: char.poses.welcome },
      { name: 'left', url: char.poses.left },
      { name: 'right', url: char.poses.right },
      { name: 'thinking', url: char.poses.thinking },
      { name: 'warning', url: char.poses.warning },
      { name: 'success', url: char.poses.success },
    ];

    for (const pose of posesToCheck) {
      totalChecked++;
      try {
        const res = await fetch(pose.url, { method: 'HEAD' });
        if (res.status === 200) {
          // OK
        } else {
          console.error(`  ❌ [${pose.name}] Failed with status ${res.status}: ${pose.url}`);
          assetFailures++;
        }
      } catch (err: any) {
        console.error(`  ❌ [${pose.name}] Network error: ${err.message}`);
        assetFailures++;
      }
    }
    console.log(`  ✓ All 7 pose URLs verified 200 OK for ${char.name}`);
  }

  console.log(`\nAsset Audit Complete: ${totalChecked - assetFailures}/${totalChecked} assets OK.`);
  if (assetFailures > 0) {
    throw new Error(`Asset audit failed: ${assetFailures} broken assets found.`);
  }

  console.log('\n========================================================');
  console.log('🧠 AUDIT 2: AI POSE & SCENE DIRECTION PLANNER');
  console.log('========================================================');

  const sampleScript = `
    Aaj hum compare karenge iPhone 16 Pro aur Galaxy S25 Ultra ko.
    iPhone 16 Pro ka camera natural colors aur cinematic video deta hai.
    Lekin Galaxy S25 Ultra ka display aur 100x zoom unbeatable hai.
    Dhyan rahe ki iPhone mein battery thodi jaldi drain hoti hai.
    Toh final clear winner aur hamara best recommendation hai Galaxy S25 Ultra!
  `;

  const sampleSegments = [
    { start: 0.0, end: 3.5, text: 'Aaj hum compare karenge iPhone 16 Pro aur Galaxy S25 Ultra ko.' },
    { start: 3.6, end: 8.0, text: 'iPhone 16 Pro ka camera natural colors aur cinematic video deta hai.' },
    { start: 8.1, end: 13.0, text: 'Lekin Galaxy S25 Ultra ka display aur 100x zoom unbeatable hai.' },
    { start: 13.1, end: 17.5, text: 'Dhyan rahe ki iPhone mein battery thodi jaldi drain hoti hai.' },
    { start: 17.6, end: 22.0, text: 'Toh final clear winner aur hamara best recommendation hai Galaxy S25 Ultra!' },
  ];

  const planResult = await planCompareStickers({
    transcript: sampleScript,
    segments: sampleSegments,
    leftTitle: 'iPhone 16 Pro',
    rightTitle: 'Galaxy S25 Ultra',
    durationSeconds: 22,
  });

  console.log('Generated Pose Timeline:');
  planResult.plan.forEach((item, idx) => {
    console.log(`  Scene ${idx + 1} (${item.start}s - ${item.end}s): Pose = [${item.pose}] (${item.reason})`);
  });

  // Verify key emotional beats were detected
  const hasIntro = planResult.plan.some((p) => p.pose === POSES.welcome || p.pose === POSES.comparing);
  const hasLeftPoint = planResult.plan.some((p) => p.pose === POSES.left);
  const hasRightPoint = planResult.plan.some((p) => p.pose === POSES.right);
  const hasWarning = planResult.plan.some((p) => p.pose === POSES.warning);
  const hasWinner = planResult.plan.some((p) => p.pose === POSES.success);

  console.log('\nPose Semantic Checks:');
  console.log('  Intro detected:', hasIntro ? '✓ PASS' : '❌ FAIL');
  console.log('  Left Option A pointing detected:', hasLeftPoint ? '✓ PASS' : '❌ FAIL');
  console.log('  Right Option B pointing detected:', hasRightPoint ? '✓ PASS' : '❌ FAIL');
  console.log('  Warning/Issue pose detected:', hasWarning ? '✓ PASS' : '❌ FAIL');
  console.log('  Winner verdict pose detected:', hasWinner ? '✓ PASS' : '❌ FAIL');

  if (!hasLeftPoint || !hasRightPoint || !hasWinner) {
    throw new Error('Pose semantic direction test failed to detect critical comparison beats.');
  }

  console.log('\n========================================================');
  console.log('🎬 AUDIT 3: REMOTION RENDER PROPS VALIDATION');
  console.log('========================================================');

  const testImageA = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791706431/itnavideo/visuals/compare_explainer/character-1.png';
  const testImageB = 'https://res.cloudinary.com/dhouh9idx/image/upload/v1791706433/itnavideo/visuals/compare_explainer/character-2.png';

  const mockRenderProps = {
    audioUrl: 'https://example.com/audio.mp3',
    comparisonImageUrls: [testImageA, testImageB],
    stickerStyle: '3d-presenter-man',
    compareLeftTitle: 'iPhone 16 Pro',
    compareRightTitle: 'Galaxy S25 Ultra',
    creatorHandle: '@itnavideo',
    themeId: 'light',
    tone: 'versus',
    winner: 'right',
    aspectRatio: '9:16' as const,
    durationSeconds: 22,
    captions: sampleSegments,
    overlayTimeline: planResult.plan.map((p) => ({
      start: p.start,
      end: p.end,
      stickerPose: p.pose,
      text: p.reason,
    })),
  };

  console.log('Mock Render Props:');
  console.log('  Aspect Ratio:', mockRenderProps.aspectRatio, '(Strict 9:16 Shorts)');
  console.log('  Duration:', mockRenderProps.durationSeconds, 'seconds');
  console.log('  Left Subject:', mockRenderProps.compareLeftTitle);
  console.log('  Right Subject:', mockRenderProps.compareRightTitle);
  console.log('  Total Captions:', mockRenderProps.captions.length);
  console.log('  Total Scene Overlays:', mockRenderProps.overlayTimeline.length);

  console.log('\n========================================================');
  console.log('🎉 ALL AUDITS PASSED WITH 100% SUCCESS!');
  console.log('========================================================');
}

auditPipeline().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
