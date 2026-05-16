import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { ensureRenderWorkspace } from './renderWorkspace.mjs';

const memoryBlacklist = new Map();
let supabaseClient = null;

export async function isAssetBlacklisted(asset = {}) {
  const key = getAssetKey(asset);
  if (!key) return false;

  const memoryItem = memoryBlacklist.get(key);
  if (memoryItem && !isExpired(memoryItem.expiresAt)) return true;

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from('blacklisted_assets')
      .select('asset_key, expires_at')
      .eq('asset_key', key)
      .maybeSingle();

    if (isMissingTableError(error)) return false;
    if (error) throw error;
    if (!data || isExpired(data.expires_at)) return false;

    memoryBlacklist.set(key, { expiresAt: data.expires_at || null });
    return true;
  } catch (error) {
    console.warn(`Asset blacklist lookup failed for ${key}:`, error);
    return false;
  }
}

export async function blacklistAsset(asset = {}, reason = 'render_failure', metadata = {}) {
  const key = getAssetKey(asset);
  if (!key) return null;

  const ttlHours = Math.max(1, Number(process.env.BLACKLIST_ASSET_TTL_HOURS || 168));
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  const entry = {
    asset_key: key,
    asset_id: getAssetId(asset),
    url_hash: hashValue(asset.url || ''),
    url: shouldStoreRawUrl() ? String(asset.url || '').slice(0, 1000) : null,
    provider: getAssetProvider(asset),
    reason: String(reason || 'render_failure').slice(0, 500),
    metadata,
    hit_count: 1,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  };

  memoryBlacklist.set(key, { expiresAt });
  writeLocalBlacklistEntry(entry);

  const supabase = getSupabaseClient();
  if (!supabase) return entry;

  try {
    const { data: existing } = await supabase
      .from('blacklisted_assets')
      .select('asset_key, hit_count')
      .eq('asset_key', key)
      .maybeSingle();
    const row = {
      ...entry,
      hit_count: Number(existing?.hit_count || 0) + 1,
    };
    const { error } = await supabase
      .from('blacklisted_assets')
      .upsert(row, { onConflict: 'asset_key' });
    if (isMissingTableError(error)) return entry;
    if (error) throw error;
  } catch (error) {
    console.warn(`Asset blacklist write failed for ${key}:`, error);
  }

  return entry;
}

export function getAssetKey(asset = {}) {
  const id = getAssetId(asset);
  if (id) return `id:${id}`;
  const url = String(asset.url || '').trim();
  if (url) return `url:${hashValue(url)}`;
  return '';
}

function getAssetId(asset = {}) {
  return String(asset.driveFileId || asset.assetId || asset.id || asset.fileId || '').trim();
}

function getAssetProvider(asset = {}) {
  if (asset.driveFileId) return 'google_drive';
  if (String(asset.url || '').startsWith('file://')) return 'local_file';
  if (asset.url) return 'url';
  return 'unknown';
}

function hashValue(value) {
  return value ? crypto.createHash('sha256').update(String(value)).digest('hex') : '';
}

function shouldStoreRawUrl() {
  return process.env.BLACKLIST_STORE_RAW_URL === '1';
}

function isExpired(value) {
  if (!value) return false;
  return new Date(value).getTime() <= Date.now();
}

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SECRET_KEY;
  if (!url || !key) return null;
  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseClient;
}

function writeLocalBlacklistEntry(entry) {
  try {
    const workspace = ensureRenderWorkspace();
    const filePath = path.join(workspace.processedAssets.root, 'blacklisted-assets.jsonl');
    fs.appendFileSync(filePath, `${JSON.stringify(entry)}\n`, 'utf8');
  } catch {
    // Local cache is best effort only.
  }
}

function isMissingTableError(error) {
  if (!error) return false;
  const code = String(error.code || '');
  const message = String(error.message || '');
  return code === '42P01' || message.toLowerCase().includes('does not exist');
}
