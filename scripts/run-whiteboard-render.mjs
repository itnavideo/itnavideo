import path from 'node:path';

// Set relative path as expected by render-reel.mjs path.resolve
process.env.REEL_PLAN = 'public/renders/whiteboard-test-plan.json';
process.env.REEL_OUTPUT = 'public/renders/whiteboard-test-output.mp4';

console.log(`[RENDER_WRAPPER] Setting REEL_PLAN to: ${process.env.REEL_PLAN}`);
console.log(`[RENDER_WRAPPER] Setting REEL_OUTPUT to: ${process.env.REEL_OUTPUT}`);

// Trigger the official render script
await import('./render-reel.mjs');
