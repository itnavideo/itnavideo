import crypto from 'crypto';

let cachedToken = null;

export async function listGoogleDriveChildren(folderId) {
  const accessToken = await getGoogleDriveAccessToken();
  const query = `'${folderId}' in parents and trashed=false`;
  const url = `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({
    q: query,
    fields: 'files(id,name,mimeType,size,thumbnailLink,webContentLink,modifiedTime),nextPageToken',
    pageSize: '1000',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  })}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.warn(`Google Drive list failed for ${folderId}:`, data.error || response.status);
    return [];
  }

  return Array.isArray(data.files) ? data.files : [];
}

export async function downloadGoogleDriveFile(fileId) {
  const accessToken = await getGoogleDriveAccessToken();
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Google Drive download failed for ${fileId}: ${response.status}`);
  }

  return response;
}

export function isGoogleDriveConfigured() {
  return Boolean(
    process.env.GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID &&
    process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY,
  );
}

async function getGoogleDriveAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  if (!isGoogleDriveConfigured()) {
    throw new Error('Google Drive service account is not configured.');
  }

  const email = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = String(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsignedJwt = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify(claim))}`;
  const signature = crypto
    .sign('RSA-SHA256', Buffer.from(unsignedJwt), privateKey)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsignedJwt}.${signature}`,
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error(`Google Drive token failed: ${data.error || response.status}`);
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + Math.max(0, Number(data.expires_in || 3600) - 60) * 1000,
  };

  return cachedToken.accessToken;
}

function base64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
