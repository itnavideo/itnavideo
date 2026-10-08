import { readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('❌ Missing Cloudinary credentials in .env.local');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const DOWNLOADS_DIR = 'C:\\Users\\user\\Downloads';
const CLOUDINARY_FOLDER = 'itnavideo-assets/typographyvideos';

// The 34 latest MP4 videos from Downloads
const TARGET_FILES = [
  '1071306485_1790793403530322.mp4',
  '1060539661_1790792905089181.mp4',
  '1060477160_1790793323800947.mp4',
  '1030137386_1790684236238338.mp4',
  '1025542632_1790668810541316.mp4',
  '954628595_1790667112889662.mp4',
  '931648967_1790669456982750.mp4',
  '826702944_1790793154524445.mp4',
  '821731532_1790667731617850.mp4',
  '805753495_1790279290616467.mp4',
  '795046111_1790792827971760.mp4',
  '750208776_1790666916911801.mp4',
  '748125494_1790669880706265.mp4',
  '727444900_1790667580912531.mp4',
  '651644969_1790685162921299.mp4',
  '650789818_1790666935752956.mp4',
  '633420581_1790674468960207.mp4',
  '615669656_1790685483024205.mp4',
  '591236388_1790666803105256.mp4',
  '589294697_1790279832495051.mp4',
  '499250610_1790670190117390.mp4',
  '467511457_1790793221970390.mp4',
  '453245311_1790793294322355.mp4',
  '450363977_1790793662135655.mp4',
  '388441493_1790667667757390.mp4',
  '340435376_1790669681251260.mp4',
  '248946837_1790685581401867.mp4',
  '233285037_1790792971467838.mp4',
  '194080610_1790684155035928.mp4',
  '120041496_1790667221693641.mp4',
  '119681421_1790684323145438.mp4',
  '105725755_1790793052871887.mp4',
  '100932073_1790674339382097.mp4',
  '26871195_1790793419299902.mp4',
];

async function main() {
  console.log(`Starting Cloudinary upload for ${TARGET_FILES.length} typography videos...`);
  const uploadedAssets = [];

  for (let i = 0; i < TARGET_FILES.length; i++) {
    const filename = TARGET_FILES[i];
    const filePath = path.join(DOWNLOADS_DIR, filename);

    if (!existsSync(filePath)) {
      console.warn(`[${i + 1}/${TARGET_FILES.length}] File not found: ${filePath}`);
      continue;
    }

    const publicId = path.parse(filename).name;
    console.log(`[${i + 1}/${TARGET_FILES.length}] Uploading ${filename} to Cloudinary folder "${CLOUDINARY_FOLDER}"...`);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: CLOUDINARY_FOLDER,
        public_id: publicId,
        overwrite: true,
        use_filename: true,
        unique_filename: false,
      });

      console.log(`  ✅ Uploaded: ${res.secure_url}`);
      console.log(`  📸 Poster Screenshot: ${res.secure_url.replace(/\.mp4$/i, '.jpg')}`);

      uploadedAssets.push({
        filename,
        publicId: res.public_id,
        secureUrl: res.secure_url,
        posterUrl: res.secure_url.replace(/\.mp4$/i, '.jpg'),
        duration: res.duration,
        width: res.width,
        height: res.height,
      });
    } catch (err) {
      console.error(`  ❌ Failed uploading ${filename}:`, err.message);
    }
  }

  console.log(`\n🎉 Upload Complete! ${uploadedAssets.length}/${TARGET_FILES.length} videos uploaded to Cloudinary.`);
}

main().catch(console.error);
