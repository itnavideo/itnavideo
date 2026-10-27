// scripts/run-audit-cycle2.mjs
import { evaluateVideoBlueprint } from './evaluate-faceless-output.mjs';

async function main() {
  console.log('Auditing Iteration 2 (The Power of Never Giving Up)...');
  const audit = await evaluateVideoBlueprint({
    title: 'The Power of Never Giving Up',
    durationSeconds: 81.45,
    transcript: "The power of never giving up imagine waking up every morning with a dream that nobody believes in. You have a great idea but no money, you have the motivation but no support. And every time you try something new, life finds another way to challenge you. This is where most people quit. But what if failure isn't the opposite of success? What if it's actually a part of the journey? Think about a small seed buried deep beneath the soil. Nobody sees it. Nobody notices it. but underground something incredible is happening. Its roots are growing stronger preparing for the moment it finally breaks through the surface. Your journey works the same way, some days you'll feel unstoppable, other days even getting out of bed will feel like a victory. You'll watch others succeed faster, make more money and reach milestones you once dreamed about, don't let their timeline destroy your confidence. A mountain isn't climbed in a single step, every small action moves you closer to the top, every mistake teaches you something valuable. Every setback gives you another opportunity to become stronger, so stop waiting for the perfect moment, start with what you have, learn as you go, improve a little every day, because one day the same people who doubted your journey might ask you how you did it, and your answer will be simple. You kept going when quitting seemed easier.",
    scenes: [
      { sceneNumber: 1, layoutType: 'hook_scene', heading: 'The Power of Never Giving Up', durationSeconds: 5.68 },
      { sceneNumber: 2, layoutType: 'split_screen', heading: 'No Money, No Support', durationSeconds: 4.0 },
      { sceneNumber: 3, layoutType: 'full_bleed_visual', heading: 'Life Will Challenge You', durationSeconds: 4.38 },
      { sceneNumber: 4, layoutType: 'card_concept', heading: 'Where Most People Quit', durationSeconds: 1.62 },
      { sceneNumber: 5, layoutType: 'split_screen', heading: 'Failure Is Part of the Journey', durationSeconds: 4.64 },
      { sceneNumber: 6, layoutType: 'full_bleed_visual', heading: 'A Small Seed Beneath the Soil', durationSeconds: 3.06 },
      { sceneNumber: 7, layoutType: 'split_screen', heading: 'Nobody Notices It', durationSeconds: 2.46 },
      { sceneNumber: 8, layoutType: 'full_bleed_visual', heading: 'Something Incredible Is Happening', durationSeconds: 6.24 },
      { sceneNumber: 9, layoutType: 'card_concept', heading: 'Breaking Through the Surface', durationSeconds: 6.0 },
      { sceneNumber: 10, layoutType: 'split_screen', heading: 'Some Days You Feel Unstoppable', durationSeconds: 5.92 },
      { sceneNumber: 11, layoutType: 'full_bleed_visual', heading: 'Others Succeed Faster', durationSeconds: 5.68 },
      { sceneNumber: 12, layoutType: 'card_concept', heading: "Don't Let Their Timeline Win", durationSeconds: 5.92 },
      { sceneNumber: 13, layoutType: 'split_screen', heading: 'A Mountain in a Single Step', durationSeconds: 4.88 },
      { sceneNumber: 14, layoutType: 'full_bleed_visual', heading: 'Every Mistake Teaches You', durationSeconds: 4.66 },
      { sceneNumber: 15, layoutType: 'split_screen', heading: 'Stop Waiting for the Perfect Moment', durationSeconds: 5.44 },
      { sceneNumber: 16, layoutType: 'card_concept', heading: 'Start With What You Have', durationSeconds: 4.36 },
      { sceneNumber: 17, layoutType: 'conclusion_scene', heading: 'You Kept Going', durationSeconds: 4.12 }
    ],
    captions: new Array(69).fill(0),
    sfxEvents: [
      { sfxType: 'cinematic-boom', startFrame: 0 },
      { sfxType: 'whoosh', startFrame: 170 },
      { sfxType: 'transition-sweep', startFrame: 290 },
      { sfxType: 'hit-strong', startFrame: 420 },
      { sfxType: 'whoosh-fast', startFrame: 560 }
    ],
    videoUrl: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/renders/3-days-1u0pk0po5z/renders/final/founder-test-admin/1792278046012-the-power-of-never-giving-up.mp4'
  });
  console.log('\n================ AUDIT SUMMARY ================');
  console.log('Score:', audit.overallScore);
  console.log('Verdict:', audit.verdict);
}

main().catch(console.error);
