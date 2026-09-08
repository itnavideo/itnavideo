/**
 * Generate New Sticker Poses using OpenAI gpt-image-1
 *
 * This script generates 4 new poses for each sticker character:
 * - surprised: eyes wide, mouth open, hands up in shock/amazement
 * - explaining: one hand raised with index finger, lecturing pose
 * - celebrating: both arms up, happy expression, victory pose
 * - comparing: both hands out palms up, weighing/balancing gesture
 *
 * Usage: node scripts/generate-sticker-poses.mjs [--character=stickman-explainer] [--pose=surprised]
 *
 * Without arguments, generates all missing poses for all characters.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load env
const envPath = path.join(ROOT, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
let OPENAI_API_KEY = '';
for (const line of envLines) {
  if (line.startsWith('OPENAI_API_KEY=')) {
    OPENAI_API_KEY = line.slice('OPENAI_API_KEY='.length).trim();
  }
}

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env.local');
  process.exit(1);
}

console.log(`✅ OpenAI API Key loaded (${OPENAI_API_KEY.slice(0, 12)}...)`);

// New poses to generate
const NEW_POSES = ['surprised', 'explaining', 'celebrating', 'comparing'];

// Character definitions with style descriptions for the AI
const CHARACTERS = [
  {
    id: 'stickman-explainer',
    folder: 'public/assets/stickman/stickman-explainer',
    description: 'A simple black and white stick figure character with a round head, thin limbs, and expressive face. Minimalist 2D line art style with no colors. The character has a friendly, teacher-like personality. Clean white/transparent background.',
    bodyType: 'full_body',
    filePrefix: '' // uses descriptive names
  },
  {
    id: 'girl-teacher-3d',
    folder: 'public/assets/stickman/girl-teacher-3d',
    description: 'A 3D rendered young female teacher character with brown hair in a ponytail, wearing a professional blue blazer and white shirt, khaki pants. She has a friendly, approachable expression. Pixar/3D animation style with soft lighting. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'young-presenter-3d',
    folder: 'public/assets/stickman/young-presenter-3d',
    description: 'A 3D rendered young male presenter/tech professional character with short dark hair, wearing a navy blue t-shirt and jeans. Modern startup/tech vibe. Pixar/3D animation style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'corporate-woman-3d',
    folder: 'public/assets/stickman/corporate-woman-3d',
    description: 'A 3D rendered professional corporate woman character with short dark hair, wearing a formal grey/dark business suit with a blazer and pencil skirt. Confident and authoritative look. Pixar/3D animation style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'chibi-boy-3d',
    folder: 'public/assets/stickman/chibi-boy-3d',
    description: 'A cute chibi-style 3D boy character with big head, big eyes, small body. Wearing a casual colorful outfit (hoodie and shorts). Anime/chibi proportions with oversized head. Very cute and expressive. Pixar meets anime style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'doctor-3d-half',
    folder: 'public/assets/stickman/doctor-3d-half',
    description: 'A 3D rendered male doctor character shown from waist up (half body). Wearing a white lab coat with stethoscope around neck. Professional and trustworthy look. Pixar/3D animation style. Half body (waist up) visible. Clean transparent/white background.',
    bodyType: 'half_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'indian-teacher-woman',
    folder: 'public/assets/stickman/indian-teacher-woman',
    description: 'A 3D rendered Indian woman teacher character wearing a traditional saree (purple/violet color) with gold border. She has long black hair tied back, bindi on forehead, warm and nurturing expression. Pixar/3D animation style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'news-anchor-3d-half',
    folder: 'public/assets/stickman/news-anchor-3d-half',
    description: 'A 3D rendered male news anchor character shown from waist up (half body). Wearing a formal dark suit with red/maroon tie. Confident, authoritative news reader look. Pixar/3D animation style. Half body (waist up) visible. Clean transparent/white background.',
    bodyType: 'half_body',
    filePrefix: 'teacher-'
  },
  {
    id: '2d-teacher',
    folder: 'public/assets/stickman/2d-teacher',
    description: 'A flat 2D illustrated male teacher character with simple geometric shapes. Wearing glasses, a white shirt and dark tie. Cartoon/flat design style with solid colors. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'teacher-2d-pro',
    folder: 'public/assets/stickman/teacher-2d-pro',
    description: 'A professional 2D illustrated male teacher character. Better quality than basic 2D. Wearing a smart casual outfit (polo shirt, trousers). Clean vector art style with smooth gradients. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'girl-teacher',
    folder: 'public/assets/stickman/girl-teacher',
    description: 'A 2D illustrated female teacher character with medium-length brown hair. Wearing a professional blouse and skirt. Friendly cartoon style with warm colors. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'grandpa-teacher-3d',
    folder: 'public/assets/stickman/grandpa-teacher-3d',
    description: 'A 3D rendered elderly grandfather teacher character shown from waist up (half body). Grey/white hair, wearing reading glasses and a warm cardigan/sweater. Wise, gentle, trustworthy look. Pixar/3D animation style. Half body (waist up) visible. Clean transparent/white background.',
    bodyType: 'half_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'banker-3d-half',
    folder: 'public/assets/stickman/banker-3d-half',
    description: 'A 3D rendered male banker/financial advisor character shown from waist up (half body). Wearing a formal black suit with gold cufflinks, red pocket square. Professional and wealthy look. Pixar/3D animation style. Half body (waist up) visible. Clean transparent/white background.',
    bodyType: 'half_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'lawyer-girl-3d',
    folder: 'public/assets/stickman/lawyer-girl-3d',
    description: 'A 3D rendered young female lawyer character wearing a formal black blazer with white blouse, holding/near a law book. Professional, confident look with medium brown hair. Pixar/3D animation style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'shia-moulana-3d',
    folder: 'public/assets/stickman/shia-moulana-3d',
    description: 'A 3D rendered religious scholar (Moulana) character wearing a traditional black turban (amamah) and black robe/cloak (aba). Has a white beard. Wise, serene, scholarly look. Pixar/3D animation style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
  {
    id: 'cartoon-teacher',
    folder: 'public/assets/stickman/cartoon-teacher',
    description: 'A colorful cartoon-style male teacher character with exaggerated features. Big head, small body, wearing a bright colored outfit. Fun, kid-friendly cartoon style. Full body visible. Clean transparent/white background.',
    bodyType: 'full_body',
    filePrefix: 'teacher-'
  },
];

// Pose descriptions for the AI prompt
const POSE_PROMPTS = {
  surprised: 'The character is SURPRISED/AMAZED — eyes wide open, mouth slightly open in an "Oh!" expression, both hands raised to shoulder height with palms facing forward, leaning slightly back. Express genuine shock or amazement at a fact.',
  explaining: 'The character is EXPLAINING a concept — one hand raised with index finger pointing up (like making a key point), other hand at side or gesturing. Confident, knowledgeable expression. Like a teacher saying "Here\'s the important thing..."',
  celebrating: 'The character is CELEBRATING/VICTORY — both arms raised high above head in a victory/celebration pose, big happy smile, eyes bright. Like they just won or the viewer got something right. Energetic and joyful.',
  comparing: 'The character is COMPARING two things — both arms extended outward at waist level, palms facing up as if holding/weighing two invisible objects (one in each hand). Thoughtful expression, head slightly tilted. Like saying "on one hand... on the other hand..."',
};

// File naming for each pose
const POSE_FILENAMES = {
  surprised: 'teacher-surprised.png',
  explaining: 'teacher-explaining.png',
  celebrating: 'teacher-celebrating.png',
  comparing: 'teacher-comparing.png',
};

// Special filenames for stickman-explainer (uses descriptive names)
const EXPLAINER_FILENAMES = {
  surprised: 'surprised-expression.png',
  explaining: 'explaining-point.png',
  celebrating: 'celebrating-victory.png',
  comparing: 'comparing-options.png',
};

async function generateImage(prompt) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: prompt,
      n: 1,
      size: '1024x1536', // Portrait for stickers (they're used in 9:16 reels)
      quality: 'high',
      output_format: 'png',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data[0].b64_json;
}

function getFilename(characterId, pose) {
  if (characterId === 'stickman-explainer') {
    return EXPLAINER_FILENAMES[pose];
  }
  return POSE_FILENAMES[pose];
}

function checkExisting(characterFolder, filename) {
  const fullPath = path.join(ROOT, characterFolder, filename);
  return fs.existsSync(fullPath);
}

async function generatePoseForCharacter(character, pose) {
  const filename = getFilename(character.id, pose);
  const outputPath = path.join(ROOT, character.folder, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭️  ${character.id}/${filename} already exists, skipping`);
    return { status: 'skipped', character: character.id, pose };
  }

  const bodyInstruction = character.bodyType === 'half_body'
    ? 'Show the character from the waist UP only (half body portrait).'
    : 'Show the FULL BODY of the character from head to feet.';

  const prompt = `Create a high-quality character illustration for a video comparison explainer app.

CHARACTER: ${character.description}

POSE: ${POSE_PROMPTS[pose]}

IMPORTANT REQUIREMENTS:
- ${bodyInstruction}
- The character should be on a completely TRANSPARENT or PLAIN WHITE background (no scenery, no objects, no floor shadows).
- The character should be centered in the frame.
- HIGH QUALITY: smooth rendering, clean edges, professional quality suitable for 1080p video.
- The character must be drawn in the EXACT SAME ART STYLE as described above (maintain consistency).
- No text, no watermarks, no logos.
- The pose should be clear and exaggerated enough to be readable at small sizes on a mobile phone.
- The character should face slightly toward the viewer (not pure profile view).`;

  console.log(`  🎨 Generating ${character.id} → ${pose}...`);

  try {
    const b64Data = await generateImage(prompt);
    const buffer = Buffer.from(b64Data, 'base64');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`  ✅ Saved: ${character.folder}/${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
    return { status: 'generated', character: character.id, pose, size: buffer.length };
  } catch (err) {
    console.error(`  ❌ Failed: ${character.id}/${pose} — ${err.message}`);
    return { status: 'failed', character: character.id, pose, error: err.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  let targetCharacter = null;
  let targetPose = null;

  for (const arg of args) {
    if (arg.startsWith('--character=')) {
      targetCharacter = arg.slice('--character='.length);
    }
    if (arg.startsWith('--pose=')) {
      targetPose = arg.slice('--pose='.length);
    }
  }

  const characters = targetCharacter
    ? CHARACTERS.filter(c => c.id === targetCharacter)
    : CHARACTERS;

  const poses = targetPose
    ? [targetPose]
    : NEW_POSES;

  if (characters.length === 0) {
    console.error(`❌ Character "${targetCharacter}" not found`);
    process.exit(1);
  }

  console.log(`\n🚀 Sticker Pose Generator`);
  console.log(`   Characters: ${characters.length}`);
  console.log(`   Poses per character: ${poses.length} (${poses.join(', ')})`);
  console.log(`   Total to generate: up to ${characters.length * poses.length} images\n`);

  const results = { generated: 0, skipped: 0, failed: 0 };

  for (const character of characters) {
    console.log(`\n📦 ${character.id}:`);
    for (const pose of poses) {
      const result = await generatePoseForCharacter(character, pose);
      results[result.status]++;

      // Rate limit: wait 2 seconds between generations to avoid hitting rate limits
      if (result.status === 'generated') {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Results:`);
  console.log(`   ✅ Generated: ${results.generated}`);
  console.log(`   ⏭️  Skipped (already exist): ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (results.generated > 0) {
    console.log(`\n🔄 Next steps:`);
    console.log(`   1. Run: npm run assets:index`);
    console.log(`   2. Update STICKER_SETS in COMPARE_EXPLAINER/template.tsx`);
    console.log(`   3. Update sticker-metadata.json`);
    console.log(`   4. Deploy: npx vercel --prod --yes && npm run reel:lambda:deploy\n`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
