import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = process.env.REMOTION_LAMBDA_BUCKET_NAME || process.env.AWS_ASSET_BUCKET || 'remotionlambda-useast1-2zq6twaok1';
const REGION = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'us-east-1';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const downloadsDir = 'C:\\Users\\Akram Editor Studio\\Downloads';
const localTargetDir = path.resolve(process.cwd(), 'public/assets/reusable/music');

if (!existsSync(localTargetDir)) {
  mkdirSync(localTargetDir, { recursive: true });
}

// 13 Unique Tracks from YouTube Audio Library
const rawTracks = [
  {
    originalFile: '19th Floor - Bobby Richards.mp3',
    id: '19th-floor-bobby-richards',
    title: '19th Floor',
    artist: 'Bobby Richards',
    genre: 'R&B / Soul / Jazz',
    mood: 'chill',
    tags: ['chill', 'smooth', 'evening', 'relaxed', 'lofi'],
    recommendedVolume: 0.15,
  },
  {
    originalFile: 'Illusions - Anno Domini Beats.mp3',
    id: 'illusions-anno-domini-beats',
    title: 'Illusions',
    artist: 'Anno Domini Beats',
    genre: 'Hip Hop / Trap',
    mood: 'mystery',
    tags: ['mystery', 'suspense', 'dark', 'tension', 'investigation'],
    recommendedVolume: 0.14,
  },
  {
    originalFile: 'True Messiah - DJ Freedem.mp3',
    id: 'true-messiah-dj-freedem',
    title: 'True Messiah',
    artist: 'DJ Freedem',
    genre: 'Hip Hop / Beats',
    mood: 'dynamic',
    tags: ['dynamic', 'rhythm', 'modern', 'hustle', 'viral'],
    recommendedVolume: 0.15,
  },
  {
    originalFile: 'Not For Nothing - Otis McDonald.mp3',
    id: 'not-for-nothing-otis-mcdonald',
    title: 'Not For Nothing',
    artist: 'Otis McDonald',
    genre: 'Funk / Hip Hop',
    mood: 'upbeat',
    tags: ['upbeat', 'creator', 'positive', 'classic', 'groove'],
    recommendedVolume: 0.16,
  },
  {
    originalFile: 'Book The Rental Wit It - RAGE.mp3',
    id: 'book-the-rental-wit-it-rage',
    title: 'Book The Rental Wit It',
    artist: 'RAGE',
    genre: 'Hip Hop / Trap',
    mood: 'tech',
    tags: ['tech', 'energy', 'hustle', 'modern', 'fast'],
    recommendedVolume: 0.14,
  },
  {
    originalFile: 'Something is Going On - Godmode.mp3',
    id: 'something-is-going-on-godmode',
    title: 'Something is Going On',
    artist: 'Godmode',
    genre: 'Cinematic / Suspense',
    mood: 'mystery',
    tags: ['mystery', 'thriller', 'tension', 'cinematic', 'deep'],
    recommendedVolume: 0.15,
  },
  {
    originalFile: 'That One Bar Scene - RKVC.mp3',
    id: 'that-one-bar-scene-rkvc',
    title: 'That One Bar Scene',
    artist: 'RKVC',
    genre: 'Rock / Acoustic',
    mood: 'acoustic',
    tags: ['acoustic', 'story', 'chill', 'bar', 'warm'],
    recommendedVolume: 0.15,
  },
  {
    originalFile: 'Crock Pot - Diamond Ortiz.mp3',
    id: 'crock-pot-diamond-ortiz',
    title: 'Crock Pot',
    artist: 'Diamond Ortiz',
    genre: 'Funk / Retro',
    mood: 'upbeat',
    tags: ['upbeat', 'retro', 'funky', 'bright', 'creator'],
    recommendedVolume: 0.16,
  },
  {
    originalFile: 'Parasail - Silent Partner.mp3',
    id: 'parasail-silent-partner',
    title: 'Parasail',
    artist: 'Silent Partner',
    genre: 'Acoustic / Folk',
    mood: 'acoustic',
    tags: ['acoustic', 'inspiring', 'hopeful', 'travel', 'calm'],
    recommendedVolume: 0.16,
  },
  {
    originalFile: 'Crimson Fly - Huma-Huma.mp3',
    id: 'crimson-fly-huma-huma',
    title: 'Crimson Fly',
    artist: 'Huma-Huma',
    genre: 'Pop / Dance',
    mood: 'upbeat',
    tags: ['upbeat', 'happy', 'bright', 'positive', 'energetic'],
    recommendedVolume: 0.16,
  },
  {
    originalFile: 'What It Is - Silent Partner.mp3',
    id: 'what-it-is-silent-partner',
    title: 'What It Is',
    artist: 'Silent Partner',
    genre: 'R&B / Soul',
    mood: 'chill',
    tags: ['chill', 'smooth', 'modern', 'clean', 'lofi'],
    recommendedVolume: 0.15,
  },
  {
    originalFile: 'Vishnu - Patrick Patrikios.mp3',
    id: 'vishnu-patrick-patrikios',
    title: 'Vishnu',
    artist: 'Patrick Patrikios',
    genre: 'Ambient / Cinematic',
    mood: 'tech',
    tags: ['tech', 'ambient', 'focus', 'deep', 'modern'],
    recommendedVolume: 0.14,
  },
  {
    originalFile: 'Dutty - Vibe Tracks.mp3',
    id: 'dutty-vibe-tracks',
    title: 'Dutty',
    artist: 'Vibe Tracks',
    genre: 'Reggae / Pop',
    mood: 'chill',
    tags: ['chill', 'reggae', 'vibe', 'relaxing', 'summer'],
    recommendedVolume: 0.15,
  },
];

async function main() {
  console.log(`Starting BGM S3 upload to Bucket: ${BUCKET} (${REGION})...\n`);

  const results = [];

  for (const item of rawTracks) {
    const srcPath = path.join(downloadsDir, item.originalFile);
    if (!existsSync(srcPath)) {
      console.warn(`[WARN] File not found: ${srcPath}`);
      continue;
    }

    const cleanFilename = `${item.id}.mp3`;
    const localDestPath = path.join(localTargetDir, cleanFilename);

    // 1. Copy to local reusable library
    copyFileSync(srcPath, localDestPath);
    console.log(`[LOCAL] Copied ${item.originalFile} -> ${cleanFilename}`);

    // 2. Upload to S3
    const s3Key = `assets/reusable/music/${cleanFilename}`;
    const fileBuffer = readFileSync(localDestPath);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: 'audio/mpeg',
        CacheControl: 'public, max-age=31536000',
      })
    );

    const s3Url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`;
    console.log(`[S3 SUCCESS] Uploaded to: ${s3Url}`);

    results.push({
      ...item,
      fileName: cleanFilename,
      localPath: `/assets/reusable/music/${cleanFilename}`,
      s3Key,
      s3Url,
    });
  }

  // Save the master BGM catalog
  const catalogPath = path.resolve(process.cwd(), 'lib/music/youtubeBgmCatalog.json');
  mkdirSync(path.dirname(catalogPath), { recursive: true });
  writeFileSync(catalogPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nMaster BGM Catalog written to: ${catalogPath} (${results.length} tracks).`);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
