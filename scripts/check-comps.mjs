import './load-env-local.mjs';
import { getCompositionsOnLambda } from '@remotion/lambda/client';

const region = process.env.REMOTION_AWS_REGION || 'us-east-1';
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render-4-0-467-mem3008mb-disk2048mb-900sec';
const serveUrl = process.env.REMOTION_LAMBDA_SERVE_URL || 'https://remotionlambda-useast1-m59wp9dklj.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html';

console.log('Checking Lambda:', { region, functionName, serveUrl });

try {
  const comps = await getCompositionsOnLambda({
    region,
    functionName,
    serveUrl,
  });
  console.log(`Successfully fetched ${comps.length} compositions from Lambda:`);
  for (const c of comps) {
    console.log(`- ${c.id}: ${c.width}x${c.height} @ ${c.fps}fps`);
  }
} catch (e) {
  console.error('Error fetching compositions:', e);
}
