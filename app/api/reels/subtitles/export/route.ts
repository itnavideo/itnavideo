import { NextResponse } from 'next/server';
import { generateSrtContent, generateVttContent, type CaptionChunkForExport } from '@/lib/captions/subtitleExporter';
import { createReadUrl } from '@/lib/aws/mediaStorage';
import { transcribeMediaUrlWithGroq } from '@/services/ai/groqTranscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let rawCaptions = Array.isArray(body.captions) ? body.captions : [];
    const fileName = String(body.fileName || 'youtube-subtitles').trim();
    const format = String(body.format || 'srt').toLowerCase(); // 'srt' | 'vtt'
    const casing = (String(body.casing || body.youtubeSubtitleCase || 'natural')) as 'natural' | 'uppercase';
    const mediaKey = String(body.mediaKey || '').trim();

    // If no captions were passed, but mediaKey exists, transcribe on the fly
    if (rawCaptions.length === 0 && mediaKey) {
      try {
        const mediaUrl = await createReadUrl(mediaKey);
        const groqResult = await transcribeMediaUrlWithGroq({
          mediaUrl,
          fileName,
          language: body.spokenLanguage !== 'auto' ? body.spokenLanguage : undefined,
        });
        if (groqResult && Array.isArray(groqResult.segments) && groqResult.segments.length > 0) {
          rawCaptions = groqResult.segments;
        } else if (groqResult && groqResult.transcript) {
          body.transcript = groqResult.transcript;
        }
      } catch (transcribeErr) {
        console.warn('[SUBTITLE_EXPORT_TRANSCRIBE_FALLBACK_ERR]', transcribeErr);
      }
    }

    const captions: CaptionChunkForExport[] = rawCaptions.map((item: any) => ({
      start: Number(item.start) || 0,
      end: Number(item.end) || 0,
      text: String(item.text || '').trim(),
    })).filter((c: CaptionChunkForExport) => Boolean(c.text));

    if (captions.length === 0 && body.transcript) {
      // Fallback: create single caption chunk from full transcript
      captions.push({
        start: 0,
        end: 60,
        text: String(body.transcript).trim(),
      });
    }

    if (captions.length === 0) {
      return NextResponse.json({ ok: false, error: 'No captions found or generated for export.' }, { status: 400 });
    }

    const baseName = fileName.replace(/\.[^/.]+$/, '') || 'youtube-subtitles';
    const content = format === 'vtt' ? generateVttContent(captions, casing) : generateSrtContent(captions, casing);
    const ext = format === 'vtt' ? 'vtt' : 'srt';
    const mimeType = format === 'vtt' ? 'text/vtt' : 'application/x-subrip';

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': `${mimeType}; charset=utf-8`,
        'Content-Disposition': `attachment; filename="${baseName}.${ext}"`,
      },
    });
  } catch (error: any) {
    console.error('[SUBTITLE_EXPORT_ERROR]', error);
    return NextResponse.json({
      ok: false,
      error: error?.message || 'Failed to export subtitles.',
    }, { status: 500 });
  }
}
