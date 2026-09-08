const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function main() {
  const thumbnailPath = 'C:/Users/Akram Editor Studio/.gemini/antigravity/brain/e4d2773f-5fd6-47e0-8e39-54f033ec5932/.user_uploaded/media__1787240578794.png';
  const facecamBase = 'C:/Users/Akram Editor Studio/.gemini/antigravity/brain/e4d2773f-5fd6-47e0-8e39-54f033ec5932/long_video_promo_preview_1787241774753.png';

  const canvasWidth = 1080;
  const canvasHeight = 1920;

  // 1. Resize exact Ramayana thumbnail to 980x551 (16:9)
  const thumbResized = await sharp(thumbnailPath)
    .resize(980, 551, { fit: 'cover' })
    .toBuffer();

  // Create rounded mask for thumbnail
  const thumbMaskSvg = `
    <svg width="980" height="551">
      <rect x="0" y="0" width="980" height="551" rx="24" ry="24" fill="#fff" />
    </svg>
  `;
  const roundedThumb = await sharp(thumbResized)
    .composite([{ input: Buffer.from(thumbMaskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Create 16:9 thumbnail player frame overlay (play button + red progress bar)
  const playerOverlaySvg = `
    <svg width="980" height="551" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Border Glow -->
      <rect x="1" y="1" width="978" height="549" rx="24" ry="24" fill="none" stroke="rgba(163, 230, 53, 0.7)" stroke-width="3" />
      
      <!-- Top Badge -->
      <rect x="24" y="20" width="140" height="32" rx="8" fill="rgba(0,0,0,0.85)" />
      <circle cx="40" cy="36" r="5" fill="#FF0000" />
      <text x="54" y="41" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">YOUTUBE 16:9</text>

      <!-- Center Play Button -->
      <circle cx="490" cy="275" r="48" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
      <polygon points="478,255 512,275 478,295" fill="#FFFFFF" />

      <!-- Bottom Progress Bar Container -->
      <rect x="0" y="515" width="980" height="36" fill="rgba(0,0,0,0.65)" />
      <rect x="20" y="531" width="940" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
      <rect x="20" y="531" width="420" height="5" rx="2.5" fill="#FF0000" />
      <circle cx="440" cy="533.5" r="7" fill="#FF0000" />
      <text x="850" y="527" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">03:45 / 12:30</text>
    </svg>
  `;

  const framedThumb = await sharp(roundedThumb)
    .composite([{ input: Buffer.from(playerOverlaySvg) }])
    .png()
    .toBuffer();

  // Extract facecam explainer section from generated image (768x1376 base)
  const facecamCrop = await sharp(facecamBase)
    .extract({ left: 0, top: 420, width: 768, height: 950 })
    .resize(1000, 1100, { fit: 'cover' })
    .toBuffer();

  const facecamMaskSvg = `
    <svg width="1000" height="1100">
      <rect x="0" y="0" width="1000" height="1100" rx="32" ry="32" fill="#fff" />
    </svg>
  `;

  const roundedFacecam = await sharp(facecamCrop)
    .composite([{ input: Buffer.from(facecamMaskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Facecam overlay text (viral captions + lower CTA)
  const facecamOverlaySvg = `
    <svg width="1000" height="1100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(2, 6, 23, 0.92)" />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
        <linearGradient id="gradBot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" />
          <stop offset="100%" stop-color="rgba(2, 6, 23, 0.95)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="200" fill="url(#gradTop)" />
      <rect x="0" y="800" width="1000" height="300" fill="url(#gradBot)" />

      <!-- Border around facecam -->
      <rect x="1" y="1" width="998" height="1098" rx="32" ry="32" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />

      <!-- Viral Caption 1 -->
      <rect x="100" y="35" width="800" height="72" rx="18" fill="rgba(15, 23, 42, 0.92)" stroke="rgba(250, 204, 21, 0.6)" stroke-width="2.5" />
      <text x="500" y="83" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" font-weight="900" fill="#FACC15" text-anchor="middle">
        RAMAYANA TRAILER BREAKDOWN! 🚩
      </text>

      <!-- Viral Caption 2 -->
      <rect x="140" y="122" width="720" height="60" rx="16" fill="rgba(2, 6, 23, 0.88)" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" />
      <text x="500" y="163" font-family="'Impact', 'Arial Black', sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        5 CRAZY HIDDEN VFX DETAILS!
      </text>

      <!-- Bottom Link CTA Banner -->
      <rect x="80" y="970" width="840" height="84" rx="24" fill="rgba(163, 230, 53, 0.95)" stroke="#BEF264" stroke-width="2" />
      <text x="500" y="1023" font-family="'Arial Black', sans-serif" font-size="28" font-weight="900" fill="#020617" text-anchor="middle">
        ▶ WATCH FULL 15-MIN BREAKDOWN ➔
      </text>
    </svg>
  `;

  const finalFacecam = await sharp(roundedFacecam)
    .composite([{ input: Buffer.from(facecamOverlaySvg) }])
    .png()
    .toBuffer();

  // Background SVG Canvas (1080 x 1920)
  const backgroundSvg = `
    <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#030712" />
          <stop offset="50%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#020408" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#bgGrad)" />

      <!-- Top Header Title -->
      <rect x="340" y="40" width="400" height="42" rx="21" fill="rgba(163, 230, 53, 0.15)" stroke="rgba(163, 230, 53, 0.4)" stroke-width="1.5" />
      <text x="540" y="67" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#BEF264" text-anchor="middle" letter-spacing="1">
        ⚡ LONG VIDEO PROMO REEL
      </text>
    </svg>
  `;

  const finalComposite = await sharp(Buffer.from(backgroundSvg))
    .composite([
      { input: framedThumb, left: 50, top: 100 },
      { input: finalFacecam, left: 40, top: 720 },
    ])
    .png()
    .toBuffer();

  // Save output files
  const targetPath1 = 'e:/itnavideo/public/visuals/previews/long-video-promo-preview.png';
  const targetPath2 = 'C:/Users/Akram Editor Studio/.gemini/antigravity/brain/e4d2773f-5fd6-47e0-8e39-54f033ec5932/long_video_promo_ramayana_preview.png';
  
  await sharp(finalComposite).toFile(targetPath1);
  await sharp(finalComposite).toFile(targetPath2);

  console.log('Successfully created composite Ramayana promo preview image!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
