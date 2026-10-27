// scripts/evaluate-faceless-output.mjs
import fs from 'node:fs';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function evaluateVideoBlueprint({ title, durationSeconds, transcript, scenes, captions, sfxEvents, videoUrl }) {
  console.log('\n🧠 [AI DIRECTOR AUDIT] Sending video blueprint to Groq Llama 3.3 70B for elite analysis...');

  const prompt = `You are an elite YouTube documentary director, motion graphics supervisor, and post-production editor for high-retention 16:9 widescreen videos (Vox, Magnates Media, Johnny Harris, DecodingYT, James Jani benchmark).

Critique this Faceless Explainer Video blueprint and render output:

PROJECT DETAILS:
- Title: ${title}
- Total Duration: ${durationSeconds}s
- Aspect Ratio: 16:9 Widescreen Full HD (1920x1080)
- Video URL: ${videoUrl || 'N/A'}
- Spoken Narration: "${transcript}"
- Total Scenes: ${scenes.length}
- Total Captions: ${captions.length}
- Total SFX Events: ${sfxEvents?.length || 0}

SCENE BREAKDOWN:
${JSON.stringify(scenes, null, 2)}

SFX EVENTS:
${JSON.stringify(sfxEvents, null, 2)}

EVALUATION RUBRIC:
1. Pacing & Rhythm: Are scene lengths between 3-6 seconds? Is there any scene lingering too long (>7s)?
2. Visual Variety: Are there consecutive identical layouts? Is there a good balance between cinematic b-roll and graphic editorial scenes?
3. Headline & Copy Polish: Are headings punchy (3-6 words)? Are highlighted keywords emotionally compelling for flame orange glow?
4. SFX Impact: Are booms, swooshes, and risers timed to key visual transitions? Is audio ducking effective?
5. Layout Rigor: Are stat cards used only with real numbers? Are split screens balanced for 16:9?
6. Missing Elements: What elements are missing that a top-tier documentary editor would add (e.g., marker underlines, subtle film grain, dynamic zooms, chapter dividers)?

Return a strict JSON object with this EXACT structure:
{
  "overallScore": 88,
  "verdict": "string summarizing current quality",
  "strengths": ["list of what works well"],
  "criticalGaps": ["list of specific visual or pacing weaknesses"],
  "codeActions": [
    {
      "targetFile": "path to file to modify",
      "issue": "description of the defect",
      "action": "exact code improvement to implement"
    }
  ]
}
`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are an elite YouTube documentary director and video editor. Respond ONLY in valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq evaluation failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  const auditResult = JSON.parse(text);
  console.log('✅ [AI DIRECTOR AUDIT] Audit complete! Score:', auditResult.overallScore, '/ 100');
  console.log('Verdict:', auditResult.verdict);
  console.log('Strengths:', auditResult.strengths);
  console.log('Critical Gaps:', auditResult.criticalGaps);
  console.log('Actionable Code Improvements:', JSON.stringify(auditResult.codeActions, null, 2));
  return auditResult;
}

if (process.argv[1]?.endsWith('evaluate-faceless-output.mjs')) {
  // Test run
  evaluateVideoBlueprint({
    title: 'Master Your Money & Financial Freedom',
    durationSeconds: 24,
    transcript: "Money is not just about having more, it's about knowing what to do with what you have. Earn wisely, spend carefully, and invest for the future. Don't let money control your life, learn to control your money. Small savings can become big opportunities over time. The goal isn't to look rich, it's to build real financial freedom, where your money works for you and gives you the freedom to choose how you live.",
    scenes: [
      { sceneNumber: 1, layoutType: 'hook_scene', heading: 'True Power of Money', durationSeconds: 4.02 },
      { sceneNumber: 2, layoutType: 'full_bleed_visual', heading: 'Earn, Spend, Invest', durationSeconds: 3.92 },
      { sceneNumber: 3, layoutType: 'split_screen', heading: 'Control Your Money', durationSeconds: 3.72 },
      { sceneNumber: 4, layoutType: 'card_concept', heading: 'Small Savings, Big Wins', durationSeconds: 3.7 },
      { sceneNumber: 5, layoutType: 'full_bleed_visual', heading: 'Real Financial Freedom', durationSeconds: 4.1 },
      { sceneNumber: 6, layoutType: 'conclusion_scene', heading: 'Freedom to Choose', durationSeconds: 4.2 }
    ],
    captions: [1, 2, 3, 4, 5, 6],
    sfxEvents: [
      { sfxType: 'cinematic-boom', startFrame: 0 },
      { sfxType: 'whoosh', startFrame: 120 }
    ],
    videoUrl: 'https://storage.example.com/test.mp4'
  }).catch(console.error);
}
