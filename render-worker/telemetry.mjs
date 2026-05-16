const TELEMETRY_DEDUPE_MS = 60_000;
const sentEvents = new Map();

export async function notifyTelemetry(event) {
  const webhookUrl = getTelemetryWebhookUrl();
  if (!webhookUrl || process.env.DISABLE_RENDER_TELEMETRY === '1') return false;

  const payload = normalizeTelemetryEvent(event);
  const dedupeKey = `${payload.level}:${payload.type}:${payload.jobId}:${payload.assetId}:${payload.reason}`;
  const now = Date.now();
  const previous = sentEvents.get(dedupeKey) || 0;
  if (now - previous < TELEMETRY_DEDUPE_MS) return false;
  sentEvents.set(dedupeKey, now);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatWebhookPayload(payload)),
    });
    return response.ok;
  } catch (error) {
    console.warn('Telemetry webhook failed:', error);
    return false;
  }
}

function getTelemetryWebhookUrl() {
  return process.env.RENDER_TELEMETRY_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.SLACK_WEBHOOK_URL ||
    process.env.TELEGRAM_WEBHOOK_URL ||
    '';
}

function normalizeTelemetryEvent(event = {}) {
  return {
    level: String(event.level || 'warning'),
    type: String(event.type || 'render_event'),
    jobId: String(event.jobId || 'unknown'),
    assetId: String(event.assetId || ''),
    reason: String(event.reason || 'unknown'),
    recovered: event.recovered !== false,
    details: event.details || {},
    at: new Date().toISOString(),
  };
}

function formatWebhookPayload(event) {
  const title = event.recovered ? 'Recovered render event' : 'Render event needs attention';
  const text = [
    `${event.recovered ? '⚠️' : '🚨'} ${title}`,
    `Job: ${event.jobId}`,
    `Type: ${event.type}`,
    event.assetId ? `Asset: ${event.assetId}` : '',
    `Reason: ${event.reason}`,
    event.recovered ? 'System recovered successfully.' : 'Manual review recommended.',
  ].filter(Boolean).join('\n');

  return {
    content: text,
    text,
    username: 'Itnavideo Render Bot',
    embeds: [{
      title,
      description: text,
      color: event.recovered ? 16766720 : 15158332,
      timestamp: event.at,
    }],
  };
}
