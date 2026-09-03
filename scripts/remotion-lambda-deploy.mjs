import {deployFunction, deploySite, getOrCreateBucket} from '@remotion/lambda';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnvLocal} from './load-env-local.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnvLocal(rootDir);
const entryPoint = path.join(rootDir, 'remotion', 'index.tsx');
const publicDir = path.join(rootDir, 'public');

const region = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'ap-south-1';
const configuredBucketName = process.env.REMOTION_LAMBDA_BUCKET_NAME;
const configuredSiteName = process.env.REMOTION_LAMBDA_SITE_NAME || '';
const legacySitePattern = new RegExp(
  `${['face', 'focus'].join('')}|${['split', 'top', 'media'].join('-')}|${['top', 'video', 'smart', 'text'].join('-')}`,
  'i',
);
const siteName = legacySitePattern.test(configuredSiteName)
  ? 'itnavideo-video-explainer'
  : configuredSiteName || 'itnavideo-video-explainer';
const memorySizeInMb = readNumber('REMOTION_LAMBDA_MEMORY_MB', 3008);
const timeoutInSeconds = readNumber('REMOTION_LAMBDA_TIMEOUT_SECONDS', 900);
const diskSizeInMb = readNumber('REMOTION_LAMBDA_DISK_MB', 2048);
const logRetentionDays = readNumber('REMOTION_LAMBDA_LOG_RETENTION_DAYS', 1);

process.stdout.write(`Deploying Remotion Lambda function in ${region}...\n`);
const deployedFunction = await deployFunction({
  region,
  memorySizeInMb,
  timeoutInSeconds,
  diskSizeInMb,
  createCloudWatchLogGroup: true,
  cloudWatchLogRetentionPeriodInDays: logRetentionDays,
  logLevel: 'info',
});

const bucketName = configuredBucketName?.startsWith('remotionlambda-')
  ? configuredBucketName
  : (await getOrCreateBucket({region, enableFolderExpiry: true, logLevel: 'info'})).bucketName;

import {enableTailwind} from '@remotion/tailwind';

process.stdout.write(`Deploying Remotion site "${siteName}" to ${bucketName}...\n`);
const deployedSite = await deploySite({
  entryPoint,
  bucketName,
  region,
  siteName,
  privacy: 'public',
  options: {
    rootDir,
    publicDir,
    webpackOverride: (config) => enableTailwind(config),
  },
});

process.stdout.write('\nRemotion Lambda ready.\n');
process.stdout.write(`REMOTION_LAMBDA_FUNCTION_NAME=${deployedFunction.functionName}\n`);
process.stdout.write(`REMOTION_LAMBDA_SERVE_URL=${deployedSite.serveUrl}\n`);
process.stdout.write(`REMOTION_LAMBDA_BUCKET_NAME=${bucketName}\n`);

function readNumber(key, fallback) {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
