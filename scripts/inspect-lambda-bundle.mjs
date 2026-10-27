// scripts/inspect-lambda-bundle.mjs
async function inspectBundle() {
  const bundleUrl = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/bundle.js';
  console.log('Fetching bundle.js from Lambda site...');
  const res = await fetch(bundleUrl);
  if (!res.ok) {
    console.error('Failed to fetch bundle:', res.status);
    return;
  }
  const text = await res.text();
  console.log(`Bundle length: ${text.length} chars`);
  
  const target = 'stickman-explainer';
  let idx = 0;
  while ((idx = text.indexOf(target, idx)) !== -1) {
    const snippet = text.slice(Math.max(0, idx - 100), Math.min(text.length, idx + 150));
    console.log(`\nFound match at ${idx}:`);
    console.log(snippet);
    idx += target.length;
  }
}

inspectBundle().catch(console.error);
