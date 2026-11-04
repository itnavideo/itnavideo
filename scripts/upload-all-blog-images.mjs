import { createHash } from 'crypto';
import { openAsBlob, writeFileSync } from 'fs';
import path from 'path';

const CLOUD_NAME = 'dhouh9idx';
const API_KEY = '972395946869552';
const API_SECRET = 'wSwqFlvlj0DhvMA5yEXyjlt8uMo';
const FOLDER = 'itnavideo12345';
const DOWNLOADS_DIR = 'C:/Users/user/Downloads';

// 25 Images in exact chronological generation order matching blog-image-prompts.md
const IMAGES_TO_UPLOAD = [
  { file: 'Gemini_Generated_Image_8t440u8t440u8t44.png', id: 'blog_luxury_real_estate', category: 'Real Estate' },
  { file: 'Gemini_Generated_Image_g7tpngg7tpngg7tp.png', id: 'blog_dubai_real_estate', category: 'Real Estate' },
  { file: 'Gemini_Generated_Image_oqoftpoqoftpoqof.png', id: 'blog_commercial_real_estate', category: 'Real Estate' },
  { file: 'Gemini_Generated_Image_2tbvbm2tbvbm2tbv.png', id: 'blog_real_estate_agent_usa', category: 'Real Estate' },
  { file: 'Gemini_Generated_Image_tlb57dtlb57dtlb5.png', id: 'blog_youtube_creator_usa', category: 'Creators' },
  { file: 'Gemini_Generated_Image_og76slog76slog76.png', id: 'blog_podcaster_new_york', category: 'Audio & Podcast' },
  { file: 'Gemini_Generated_Image_fr9memfr9memfr9m.png', id: 'blog_faceless_channel_creator', category: 'Creators' },
  { file: 'Gemini_Generated_Image_bgfqx1bgfqx1bgfq.png', id: 'blog_video_producer_studio', category: 'Production' },
  { file: 'Gemini_Generated_Image_rw5n44rw5n44rw5n.png', id: 'blog_batch_video_creator', category: 'Creators' },
  { file: 'Gemini_Generated_Image_z21kxoz21kxoz21k.png', id: 'blog_marketing_agency_team', category: 'Agencies' },
  { file: 'Gemini_Generated_Image_yhvooxyhvooxyhvo.png', id: 'blog_agency_australia', category: 'Agencies' },
  { file: 'Gemini_Generated_Image_nd0pfvnd0pfvnd0p.png', id: 'blog_freelancer_europe', category: 'Freelancers' },
  { file: 'Gemini_Generated_Image_1ab37l1ab37l1ab3.png', id: 'blog_roi_business_analyst', category: 'Business & ROI' },
  { file: 'Gemini_Generated_Image_x218aax218aax218.png', id: 'blog_instagram_creator_reels', category: 'Social & Reels' },
  { file: 'Gemini_Generated_Image_lmyet3lmyet3lmye.png', id: 'blog_captions_creator_usa', category: 'Captions' },
  { file: 'Gemini_Generated_Image_wiqar6wiqar6wiqa.png', id: 'blog_youtube_shorts_creator', category: 'Shorts' },
  { file: 'Gemini_Generated_Image_r6fcmrr6fcmrr6fc.png', id: 'blog_accessibility_creator', category: 'Captions' },
  { file: 'Gemini_Generated_Image_jhdjybjhdjybjhdj.png', id: 'blog_subtitle_designer', category: 'Design & Typography' },
  { file: 'Gemini_Generated_Image_o51y1oo51y1oo51y.png', id: 'blog_ai_video_tools_comparison', category: 'Comparison' },
  { file: 'Gemini_Generated_Image_wjkqoswjkqoswjkq.png', id: 'blog_voice_to_video', category: 'Voice & Audio' },
  { file: 'Gemini_Generated_Image_25hnl125hnl125hn.png', id: 'blog_ai_tools_upgrade', category: 'Growth' },
  { file: 'Gemini_Generated_Image_6ggbch6ggbch6ggb.png', id: 'blog_finance_creator', category: 'Finance' },
  { file: 'Gemini_Generated_Image_izvpkzizvpkzizvp.png', id: 'blog_educator_europe', category: 'Education' },
  { file: 'Gemini_Generated_Image_7bhdo37bhdo37bhd.png', id: 'blog_tutorial_creator', category: 'Tutorials' },
  { file: 'Gemini_Generated_Image_x2fsexx2fsexx2fs.png', id: 'blog_mobile_creator_phone', category: 'Mobile & Social' },
];

async function uploadSingle(item, index, total) {
  const filePath = path.join(DOWNLOADS_DIR, item.file);
  const timestamp = Math.round(Date.now() / 1000);
  const blob = await openAsBlob(filePath, { type: 'image/png' });

  const params = {
    folder: FOLDER,
    overwrite: 'true',
    public_id: item.id,
    timestamp: String(timestamp),
  };

  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  const signature = createHash('sha1').update(stringToSign + API_SECRET).digest('hex');

  const form = new FormData();
  form.append('file', blob, item.file);
  form.append('folder', FOLDER);
  form.append('overwrite', 'true');
  form.append('public_id', item.id);
  form.append('timestamp', String(timestamp));
  form.append('api_key', API_KEY);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed for ${item.id}: ${JSON.stringify(json)}`);
  }

  // Watermark removal transformation: crops bottom-right 4-6% where Gemini watermark sits
  const cleanUrl = json.secure_url.replace('/upload/', '/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto/');
  console.log(`[${index + 1}/${total}] Uploaded ${item.id} -> ${cleanUrl}`);
  return { ...item, cleanUrl, rawUrl: json.secure_url };
}

async function main() {
  console.log(`Starting fast stream upload of ${IMAGES_TO_UPLOAD.length} images to Cloudinary (${FOLDER})...`);
  const uploaded = [];

  for (let i = 0; i < IMAGES_TO_UPLOAD.length; i++) {
    const item = IMAGES_TO_UPLOAD[i];
    try {
      const result = await uploadSingle(item, i, IMAGES_TO_UPLOAD.length);
      uploaded.push(result);
    } catch (err) {
      console.error(`Error uploading ${item.id}:`, err.message);
    }
  }

  writeFileSync('scripts/blog-uploaded-images.json', JSON.stringify(uploaded, null, 2));
  console.log(`\nSuccessfully uploaded ${uploaded.length}/${IMAGES_TO_UPLOAD.length} images.`);
  console.log('Saved image catalog to scripts/blog-uploaded-images.json');
}

main().catch(console.error);
