import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhouh9idx',
  api_key: '972395946869552',
  api_secret: 'wSwqFlvlj0DhvMA5yEXyjlt8uMo',
});

async function main() {
  const folders = [
    'uploads/DEMO VIDEOS/AUTO CAPTIONS',
    'uploads/DEMO VIDEOS/COMPARE VIDOES',
    'uploads/DEMO VIDEOS/TYPOGRAPHY VIDEO',
  ];

  for (const folder of folders) {
    const result = await cloudinary.search
      .expression(`resource_type:video AND asset_folder="${folder}"`)
      .max_results(20)
      .execute();

    console.log(`\n${folder.split('/').pop()} (${result.total_count}):`);
    for (const r of result.resources) {
      console.log(`  ${r.public_id}`);
    }
  }
}

main().catch(e => console.error('ERR:', e.message));
