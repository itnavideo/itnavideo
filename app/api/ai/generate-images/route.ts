import { NextRequest, NextResponse } from 'next/server';
import { generateConsistentImages, generateSingleSceneImage, CharacterReferenceInput } from '@/services/ai/imageGenerationService';
import { uploadTemporaryMediaObject, createReadUrl } from '@/lib/aws/mediaStorage';
import { checkRateLimit, getClientIp } from '@/services/rateLimit/inMemoryRateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rateLimit = checkRateLimit({
    key: `ai-generate-images:${ip}`,
    limit: 30,
    windowMs: 15 * 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many image generation requests. Please wait a few minutes.' },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const isSingleScene = body.mode === 'single-scene';
    const userId = typeof body.userId === 'string' ? body.userId.trim() : 'anonymous-user';
    const style = typeof body.style === 'string' ? body.style : '2d';
    const aspectRatio = body.aspectRatio === '9:16' ? '9:16' : '16:9';

    // Parse character references array (Main, Char 2, Char 3)
    const rawCharRefs = Array.isArray(body.characterReferences) ? body.characterReferences : [];
    const characterReferences: CharacterReferenceInput[] = rawCharRefs
      .map((item: any) => {
        if (!item || !item.base64) return null;
        const rawB64 = String(item.base64).trim();
        const cleanB64 = rawB64.includes(',') ? rawB64.split(',')[1] : rawB64;
        return {
          role: (item.role || 'main') as 'main' | 'char2' | 'char3',
          base64: cleanB64,
          mimeType: item.mimeType || 'image/png',
        };
      })
      .filter(Boolean) as CharacterReferenceInput[];

    // ── Mode A: Single Scene Regeneration ──
    if (isSingleScene) {
      const scenePrompt = typeof body.scenePrompt === 'string' ? body.scenePrompt.trim() : '';
      if (!scenePrompt) {
        return NextResponse.json({ success: false, error: 'Scene prompt is required for regeneration.' }, { status: 400 });
      }

      const singleResult = await generateSingleSceneImage({
        scenePrompt,
        style,
        characterReferences,
        aspectRatio,
      });

      if (!singleResult) {
        return NextResponse.json({ success: false, error: 'Failed to generate single scene image.' }, { status: 502 });
      }

      let finalUrl = '';

      // Attempt S3 upload
      try {
        const bytes = Uint8Array.from(Buffer.from(singleResult.base64, 'base64'));
        const ext = singleResult.mimeType?.includes('jpeg') ? 'jpg' : 'png';
        const { key } = await uploadTemporaryMediaObject({
          body: bytes,
          contentType: singleResult.mimeType || 'image/png',
          fileName: `ai-single-scene-${Date.now()}.${ext}`,
          mode: 'image',
          userId,
          purpose: 'ai-generated',
        });
        const s3SignedUrl = await createReadUrl(key);
        if (s3SignedUrl) {
          finalUrl = s3SignedUrl;
        } else {
          throw new Error('S3 signed URL generation failed.');
        }
      } catch (s3Err) {
        console.error('[AI_GENERATE_IMAGES] S3 upload failed for single scene:', s3Err);
        throw new Error('Failed to upload generated scene image to cloud storage. Base64 fallback is disabled to prevent Lambda payload overflow.');
      }

      return NextResponse.json({
        ok: true,
        success: true,
        imageUrl: finalUrl,
      });
    }

    // ── Mode B: Full Script AI Scene Generation ──
    const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : transcript;
    const audioDurationSeconds = Math.max(5, Number(body.audioDurationSeconds) || 60);

    if (!transcript && !prompt) {
      return NextResponse.json({ ok: false, success: false, error: 'Script transcript or prompt is required.' }, { status: 400 });
    }

    const result = await generateConsistentImages({
      prompt,
      transcript,
      audioDurationSeconds,
      style,
      characterReferences,
      aspectRatio,
    });

    if (!result.success) {
      return NextResponse.json({ ok: false, success: false, error: result.error || 'Image generation failed.' }, { status: 502 });
    }

    // Persist each generated image to S3 with Data URL fallback
    const outputScenes = [];
    for (let i = 0; i < result.images.length; i++) {
      const img = result.images[i];
      const beat = result.scenes?.[i] || {
        sceneId: `scene-${i + 1}`,
        start: i * 6,
        duration: 6,
        scriptText: `Scene ${i + 1}`,
        visualPrompt: result.scenePrompts[i] || prompt,
      };

      let sceneImageUrl = '';

      try {
        const bytes = Uint8Array.from(Buffer.from(img.base64, 'base64'));
        const ext = img.mimeType?.includes('jpeg') ? 'jpg' : 'png';
        const { key } = await uploadTemporaryMediaObject({
          body: bytes,
          contentType: img.mimeType || 'image/png',
          fileName: `ai-scene-${i + 1}-${Date.now()}.${ext}`,
          mode: 'image',
          userId,
          purpose: 'ai-generated',
        });
        const s3SignedUrl = await createReadUrl(key);
        if (s3SignedUrl) {
          sceneImageUrl = s3SignedUrl;
        } else {
          throw new Error('S3 signed URL generation failed.');
        }
      } catch (uploadErr) {
        console.error(`[AI_GENERATE_IMAGES] S3 upload failed for scene ${i + 1}:`, uploadErr);
        throw new Error('Failed to upload generated scene image to cloud storage. Base64 fallback is disabled to prevent Lambda payload overflow.');
      }

      outputScenes.push({
        sceneId: beat.sceneId,
        startSeconds: beat.start,
        endSeconds: beat.start + beat.duration,
        durationSeconds: beat.duration,
        text: beat.scriptText,
        visualPrompt: beat.visualPrompt,
        imageUrl: sceneImageUrl,
      });
    }

    return NextResponse.json({
      ok: true,
      success: true,
      scenes: outputScenes,
      count: outputScenes.length,
    });
  } catch (err: any) {
    console.error('[AI_GENERATE_IMAGES] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

