import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.argv[2] || '.env.local');
const existing = parseEnvFile(envPath);

const sections = [
  ['# Itnavideo production environment', '# Keep secrets out of git. Local template assets are used for reel generation.'],
  ['# App', ['NEXT_PUBLIC_SITE_URL', 'https://www.itnavideo.com'], ['NEXT_PUBLIC_API_BASE_URL', ''], ['EC2_WEB_BACKEND_URL', '']],
  ['# Supabase', ['NEXT_PUBLIC_SUPABASE_URL', ''], ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', ''], ['SUPABASE_SERVICE_ROLE_KEY', firstValue(existing, ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'SECRET_KEY'])]],
  ['# AI providers', '# Groq handles transcription and OpenAI handles planning decisions.', ['OPENAI_API_KEY', ''], ['GROQ_API_KEY', '']],
  ['# AWS access and legacy asset config', '# Preserve existing values for EC2/admin recovery. Do not use AWS/S3 as the template asset source.', ['AWS_WEB_BACKEND_URL', ''], ['AWS_JOB_INTAKE_URL', ''], ['AWS_REGION', ''], ['AWS_LOCAL_STORAGE_ROOT', ''], ['AWS_ASSET_LIBRARY_ENABLED', ''], ['AWS_ASSET_BUCKET', ''], ['AWS_ASSET_REGION', ''], ['AWS_ASSET_PREFIX', ''], ['AWS_ASSET_BASE_URL', ''], ['AWS_ASSET_MANIFEST_URL', ''], ['AWS_ACCESS_KEY_ID', ''], ['AWS_SECRET_ACCESS_KEY', '']],
  ['# Remotion Lambda rendering', '# Serverless render path for production; local testing still uses npm run reel:render.', ['REMOTION_LAMBDA_BUCKET_NAME', ''], ['REMOTION_LAMBDA_SITE_NAME', 'itnavideo-video-explainer'], ['REMOTION_LAMBDA_FUNCTION_NAME', ''], ['REMOTION_LAMBDA_SERVE_URL', ''], ['REMOTION_LAMBDA_MEMORY_MB', '3008'], ['REMOTION_LAMBDA_TIMEOUT_SECONDS', '900'], ['REMOTION_LAMBDA_DISK_MB', '2048'], ['REMOTION_LAMBDA_LOG_RETENTION_DAYS', '1'], ['REMOTION_LAMBDA_PRIVACY', 'private'], ['REMOTION_LAMBDA_DELETE_AFTER', '3-days'], ['REMOTION_LAMBDA_CONCURRENCY', '6'], ['REMOTION_LAMBDA_USE_FRAMES_PER_LAMBDA', 'true'], ['REMOTION_LAMBDA_FRAMES_PER_LAMBDA', '300']],
  ['# Video system', '# Old upload/render/transcription pipeline is removed until the new structure is defined.', ['PORT', '3000']],
  ['# Admin and operations', ['ADMIN_USERNAME', 'admin'], ['ADMIN_PASSWORD', ''], ['ADMIN_API_SECRET', ''], ['FREE_TIER_RENDER_ENABLED', '1'], ['FREE_TIER_QUEUE_LIMIT', '50'], ['FREE_USER_ACTIVE_RENDER_LIMIT', '2'], ['PAID_USER_ACTIVE_RENDER_LIMIT', '4'], ['USER_RENDER_START_LIMIT', '4'], ['USER_RENDER_START_WINDOW_MS', '900000'], ['USER_UPLOAD_LIMIT', '20'], ['USER_UPLOAD_WINDOW_MS', '900000'], ['HEALTH_ALERT_THRESHOLD_PERCENT', '70'], ['NEXT_PUBLIC_VERCEL_DASHBOARD_URL', ''], ['NEXT_PUBLIC_RENDER_DASHBOARD_URL', ''], ['CAREERS_AUTORESPONDER_WEBHOOK_URL', '']],
];

const output = [];
for (const section of sections) {
  if (output.length) output.push('');
  output.push(section[0]);
  for (const item of section.slice(1)) {
    if (typeof item === 'string') {
      output.push(item);
      continue;
    }
    const [key, fallback] = item;
    output.push(`${key}=${valueFor(existing, key, fallback)}`);
  }
}

fs.writeFileSync(envPath, `${output.join('\n')}\n`, 'utf8');
console.log(`Normalized ${envPath}`);

function parseEnvFile(filePath) {
  const values = new Map();
  if (!fs.existsSync(filePath)) return values;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!values.has(key) || String(value).trim()) values.set(key, value);
  }
  return values;
}

function valueFor(values, key, fallback) {
  const value = values.get(key);
  if (value !== undefined && value !== '') return value;
  return fallback || '';
}

function firstValue(values, keys) {
  for (const key of keys) {
    const value = values.get(key);
    if (value !== undefined && value !== '') return value;
  }
  return '';
}
