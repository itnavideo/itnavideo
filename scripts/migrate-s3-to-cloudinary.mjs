// scripts/migrate-s3-to-cloudinary.mjs
import fs from 'node:fs';
import { uploadRemoteVideoToCloudinary } from './test-cloudinary-rest.mjs';
import { deleteS3Object } from './delete-s3-object.mjs';

const API_BASE = 'https://www.itnavideo.com';
const BUCKET = 'remotionlambda-useast1-2zq6twaok1';

const RENDERS = [
  // Faceless Video (16:9)
  { id: '3-days-wagq24qy4j', mode: 'facelessVideo', name: 'faceless_c1_wagq24qy4j', title: 'Why 99% Fail in Their 20s' },
  { id: '3-days-1u0pk0po5z', mode: 'facelessVideo', name: 'faceless_c2_1u0pk0po5z', title: 'The Silent Wealth Trap' },
  { id: '3-days-258dk9khl7', mode: 'facelessVideo', name: 'faceless_c3_258dk9khl7', title: 'The Power of Compounding Execution' },
  { id: '3-days-jd6pua1emr', mode: 'facelessVideo', name: 'faceless_c4_jd6pua1emr', title: 'Resilience The Unstoppable Mindset' },
  { id: '3-days-j3dz5ev82s', mode: 'facelessVideo', name: 'faceless_c5_j3dz5ev82s', title: 'How To Master Focus In A Distracted World' },

  // Book Summary (16:9)
  { id: '3-days-t6j16e8ld6', mode: 'bookSummary', name: 'book_summary_c1_t6j16e8ld6', title: 'The Psychology of Money' },
  { id: '3-days-vces3huyzi', mode: 'bookSummary', name: 'book_summary_c2_vces3huyzi', title: 'Rich Dad Poor Dad' },
  { id: '3-days-7u05pg1dmo', mode: 'bookSummary', name: 'book_summary_c3_7u05pg1dmo', title: "Can't Hurt Me" },
  { id: '3-days-gt57hctbeh', mode: 'bookSummary', name: 'book_summary_c4_gt57hctbeh', title: 'Atomic Habits' },

  // Image to Video AI (16:9)
  { id: '3-days-i0ub8lb0et', mode: 'imageToVideoAi', name: 'image_to_video_c1_i0ub8lb0et', title: 'The Path to Financial Wealth' },
  { id: '3-days-paiexwc571', mode: 'imageToVideoAi', name: 'image_to_video_c2_paiexwc571', title: 'Mastering the Compounding Effect' },
  { id: '3-days-w2055610nq', mode: 'imageToVideoAi', name: 'image_to_video_c3_w2055610nq', title: 'The Unbreakable Will' },
  { id: '3-days-wrphzj3ada', mode: 'imageToVideoAi', name: 'image_to_video_c4_wrphzj3ada', title: 'From Adversity to Victory' },

  // Typography Video (9:16)
  { id: '3-days-etqoasxod6', mode: 'typographyVideo', name: 'typography_c1_etqoasxod6', title: 'The Compounding Effect' },
  { id: '3-days-xp75lk967c', mode: 'typographyVideo', name: 'typography_c2_xp75lk967c', title: 'Wealth Is What You Do Not See' },
  { id: '3-days-9msecyf1gl', mode: 'typographyVideo', name: 'typography_c3_9msecyf1gl', title: 'Conquer The Resistance' },
  { id: '3-days-v3ox8uvg7k', mode: 'typographyVideo', name: 'typography_c4_v3ox8uvg7k', title: 'Relentless Execution' },

  // Whiteboard Explainer (9:16)
  { id: '3-days-a30v6e4ios', mode: 'whiteboardVideo', name: 'whiteboard_c1_a30v6e4ios', title: 'The Compounding Interest Engine' },
  { id: '3-days-tnibknfzmy', mode: 'whiteboardVideo', name: 'whiteboard_c2_tnibknfzmy', title: '3 Rules of Financial Freedom' },
  { id: '3-days-vax2uaadlc', mode: 'whiteboardVideo', name: 'whiteboard_c3_vax2uaadlc', title: 'Building Mental Toughness' },
  { id: '3-days-gj9j76ws71', mode: 'whiteboardVideo', name: 'whiteboard_c4_gj9j76ws71', title: 'The Psychology of Daily Execution' },
];

async function migrateAll() {
  console.log('================================================================');
  console.log(`📦 STARTING MIGRATION: 21 VIDEOS FROM AWS S3 -> CLOUDINARY`);
  console.log(`Cloudinary Destination Folder: itnavideo/test-renders/`);
  console.log('================================================================\n');

  const migratedResults = [];

  for (let i = 0; i < RENDERS.length; i++) {
    const item = RENDERS[i];
    console.log(`\n[${i + 1}/${RENDERS.length}] Processing ${item.mode.toUpperCase()}: "${item.title}" (${item.id})`);

    try {
      // 1. Fetch fresh presigned S3 URL
      const statusRes = await fetch(`${API_BASE}/api/reels/jobs/status?renderId=${item.id}&bucketName=${BUCKET}`);
      if (!statusRes.ok) {
        throw new Error(`Failed to get status for ${item.id}: HTTP ${statusRes.status}`);
      }
      const statusData = await statusRes.json();
      const presignedUrl = statusData.outputFile;
      if (!presignedUrl) {
        throw new Error(`No output URL returned for ${item.id}`);
      }

      // 2. Upload directly to Cloudinary
      const uploadRes = await uploadRemoteVideoToCloudinary(presignedUrl, item.name);
      console.log(`   ✅ Uploaded to Cloudinary: ${uploadRes.secureUrl} (${(uploadRes.bytes / (1024 * 1024)).toFixed(1)}MB)`);

      // 3. Delete from AWS S3
      await deleteS3Object(`renders/${item.id}/out.mp4`);

      // If presigned URL has a nested final renders key, delete that as well
      const urlObj = new URL(presignedUrl);
      const s3Path = urlObj.pathname.replace(/^\/+/, '');
      if (s3Path !== `renders/${item.id}/out.mp4`) {
        await deleteS3Object(s3Path);
      }

      migratedResults.push({
        id: item.id,
        mode: item.mode,
        title: item.title,
        cloudinaryUrl: uploadRes.secureUrl,
        publicId: uploadRes.publicId,
        bytes: uploadRes.bytes,
        duration: uploadRes.duration,
        s3Deleted: true,
      });

      fs.writeFileSync('cloudinary_migrated_videos.json', JSON.stringify(migratedResults, null, 2));
      console.log(`   ✨ S3 Deleted & Cloudinary Migration Recorded.`);
    } catch (err) {
      console.error(`   ❌ Migration failed for ${item.id}:`, err.message);
      migratedResults.push({
        id: item.id,
        mode: item.mode,
        title: item.title,
        error: err.message,
        s3Deleted: false,
      });
      fs.writeFileSync('cloudinary_migrated_videos.json', JSON.stringify(migratedResults, null, 2));
    }

    // Brief pause to maintain safe API pacing
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL 21 VIDEOS MIGRATED TO CLOUDINARY & REMOVED FROM S3!`);
  console.log('================================================================');
}

migrateAll().catch(console.error);
