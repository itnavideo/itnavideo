/**
 * Centralized Presigned Direct S3 Media Uploader
 * Ensures exact Content-Type header matching between presign request and S3 PUT call.
 * Prevents "Failed to Upload" errors across Windows, Mac, and Mobile browsers.
 */

export function resolveSafeContentType(file: File): string {
  if (file.type && file.type.trim().length > 0) {
    return file.type.trim();
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3': return 'audio/mpeg';
    case 'm4a': return 'audio/mp4';
    case 'wav': return 'audio/wav';
    case 'aac': return 'audio/aac';
    case 'ogg': return 'audio/ogg';
    case 'flac': return 'audio/flac';
    case 'mp4': return 'video/mp4';
    case 'mov': return 'video/quicktime';
    case 'webm': return 'video/webm';
    case 'mkv': return 'video/x-matroska';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'gif': return 'image/gif';
    default: return 'application/octet-stream';
  }
}

export async function uploadFileViaPresign(
  file: File,
  workflowMode: string | { prefix?: string } = "general",
  userId: string = "guest_user",
  userEmail?: string
): Promise<string & { url: string; key: string }> {
  const contentType = resolveSafeContentType(file);

  const cleanMode = typeof workflowMode === 'object' && workflowMode !== null
    ? (workflowMode.prefix || 'general')
    : String(workflowMode || 'general');

  const presignRes = await fetch("/api/media/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType,
      mode: cleanMode,
      userId: userId || "guest_user",
      userEmail: userEmail || undefined,
      fileSize: file.size,
    }),
  });

  const presign = await presignRes.json().catch(() => ({}));
  if (!presignRes.ok || !presign.ok || !presign.uploadUrl || !presign.key) {
    throw new Error(presign.error || `Could not prepare cloud upload for ${file.name}`);
  }

  // Direct PUT upload to S3 presigned URL with explicit matching Content-Type header
  const uploadRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`Direct cloud upload failed (${uploadRes.status}). Please check network connectivity.`);
  }

  const key = String(presign.key);
  // Return a string primitive wrapper that also allows .url and .key access
  const result = Object.assign(new String(key), {
    url: key,
    key: key,
  });

  return result as any;
}
