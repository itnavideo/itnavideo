import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      topicTitle = 'Faceless Explainer Video',
      transcript = '',
      durationSeconds = 60,
      mode = 'facelessVideo',
    } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    // Deterministic fallback generator
    const generateFallbackMetadata = () => {
      const cleanTitle = topicTitle.trim() || 'Modern AI & Future Technology';
      const duration = Number(durationSeconds) || 60;
      const min = Math.floor(duration / 60);

      const viralTitles = [
        `The Truth About ${cleanTitle} (Explained)`,
        `How ${cleanTitle} Actually Works in 2025`,
        `Why Everyone Is Talking About ${cleanTitle}`,
      ];

      const chapters = [
        '0:00 - Introduction & The Big Problem',
        '0:45 - Key Breakthroughs & Behind the Scenes',
        min >= 3 ? `${Math.floor(min / 2)}:00 - The Turning Point & Critical Metrics` : '1:30 - Critical Breakdown',
        `${Math.max(1, min - 1)}:15 - Strategic Takeaways & Final Verdict`,
      ].join('\n');

      const description = [
        `In this video, we break down ${cleanTitle} and what it means for creators, builders, and the future.`,
        '',
        'TIMESTAMPS:',
        chapters,
        '',
        'KEY TAKEAWAYS:',
        '• How modern systems operate under the hood',
        '• Critical numbers, statistics, and industry benchmarks',
        '• Strategic action items you can apply immediately',
        '',
        '🔔 Subscribe to the channel for weekly high-retention explainers and deep dives!',
        '💬 Drop your thoughts and perspective in the comments below!',
      ].join('\n');

      const baseTag = cleanTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      const tags = [
        baseTag,
        `${baseTag} explained`,
        `${baseTag} 2025`,
        `${baseTag} tutorial`,
        'faceless video',
        'ai explainer',
        'youtube documentary',
        'tech deep dive',
        'vox style explainer',
        'johnny harris style',
        'itnavideo',
        'creator economy',
        'high retention video',
        'automation',
      ].filter(Boolean);

      return { viralTitles, description, tags };
    };

    if (!geminiApiKey) {
      return NextResponse.json({
        ok: true,
        source: 'deterministic',
        metadata: generateFallbackMetadata(),
      });
    }

    const prompt = `You are a world-class YouTube strategist, algorithm specialist, and SEO copywriter for viral documentary and explainer channels (MrBeast, Vox, Johnny Harris, Magnates Media, ColdFusion).

Given the following video details, generate a complete high-CTR YouTube Creator Launch Kit:
- Topic Title: "${topicTitle}"
- Video Duration: ${durationSeconds} seconds
- Video Type / Mode: ${mode}
- Script / Transcript excerpt:
${transcript ? transcript.slice(0, 3000) : 'High-impact explainer video on modern strategies, technologies, and insights.'}

Generate:
1. "viralTitles": Exactly 3 viral YouTube titles (45-65 characters) with high click-through potential (1 Curiosity hook, 1 Direct outcome / transformation, 1 Intrigue / provocative statement).
2. "description": A high-converting YouTube description containing:
   - An engaging 2-sentence hook preview.
   - Structured video chapters with timestamps formatted as "0:00 - ...", scaled across the ${durationSeconds} seconds total duration.
   - 3 bulleted key takeaways.
   - Call to action asking a community discussion question.
3. "tags": 15 to 20 comma-separated SEO tags for pasting into YouTube Studio tags box.

Return strict JSON only in this format:
{
  "viralTitles": ["Title 1", "Title 2", "Title 3"],
  "description": "Full description text...",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const modelName = (process.env.GEMINI_MODEL || 'gemini-flash-latest').trim();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
        }),
      }
    );

    if (!response.ok) {
      console.warn(`[GENERATE_METADATA] Gemini responded with HTTP ${response.status}. Using fallback.`);
      return NextResponse.json({
        ok: true,
        source: 'fallback',
        metadata: generateFallbackMetadata(),
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({
        ok: true,
        source: 'fallback',
        metadata: generateFallbackMetadata(),
      });
    }

    const parsed = JSON.parse(rawText);
    if (!parsed || !Array.isArray(parsed.viralTitles) || parsed.viralTitles.length === 0) {
      return NextResponse.json({
        ok: true,
        source: 'fallback',
        metadata: generateFallbackMetadata(),
      });
    }

    return NextResponse.json({
      ok: true,
      source: 'gemini',
      metadata: {
        viralTitles: parsed.viralTitles.slice(0, 3),
        description: String(parsed.description || ''),
        tags: Array.isArray(parsed.tags) ? parsed.tags : generateFallbackMetadata().tags,
      },
    });
  } catch (err: any) {
    console.error('[GENERATE_METADATA_ERROR]', err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || 'Failed to generate YouTube metadata kit.',
      },
      { status: 500 }
    );
  }
}
