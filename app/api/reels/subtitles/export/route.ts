import { NextResponse } from 'next/server';
import { generateSrtContent, generateVttContent, type CaptionChunkForExport } from '@/lib/captions/subtitleExporter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawCaptions = Array.isArray(body.captions) ? body.captions : [];
    const fileName = String(body.fileName || 'youtube-subtitles').trim();
    const format = String(body.format || 'srt').toLowerCase(); // 'srt' | 'vtt'
    const casing = (String(body.casing || 'natural')) as 'natural' | 'uppercase';

    const captions: CaptionChunkForExport[] = rawCaptions.map((item: any) => ({
      start: Number(item.start) || 0,
      end: Number(item.end) || 0,
      text: String(item.text || '').trim(),
    }));

    if (captions.length === 0 && body.transcript) {
      // Fallback: create single caption chunk from full transcript
      captions.push({
        start: 0,
        end: 60,
        text: String(body.transcript).trim(),
      });
    }

    if (captions.length === 0) {
      return NextResponse.json({ ok: false, error: 'No captions provided for export.' }, { status: 400 });
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
