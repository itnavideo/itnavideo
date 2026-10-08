import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = "dhouh9idx";
const API_KEY = "972395946869552";
const API_SECRET = "wSwqFlvlj0DhvMA5yEXyjlt8uMo";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

async function uploadVisuals() {
  console.log("=== Uploading Homepage Visuals to Cloudinary ===");
  const homepageDir = path.join(process.cwd(), 'public', 'visuals', 'homepage');
  const files = fs.readdirSync(homepageDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));

  const results = {};

  for (const file of files) {
    const filePath = path.join(homepageDir, file);
    const publicId = `itnavideo-assets/homepage/${path.parse(file).name}`;
    console.log(`Uploading ${file} -> ${publicId}...`);
    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });
      console.log(`✅ Uploaded ${file}: ${res.secure_url}`);
      results[file] = res.secure_url;
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message);
    }
  }

  console.log("\n=== Uploading Dashboard Hero Images ===");
  const dashboardHeroDir = path.join(process.cwd(), 'public', 'visuals', 'dashboard hero images');
  if (fs.existsSync(dashboardHeroDir)) {
    const dashFiles = fs.readdirSync(dashboardHeroDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
    for (const file of dashFiles) {
      const filePath = path.join(dashboardHeroDir, file);
      const publicId = `itnavideo-assets/dashboard/${path.parse(file).name}`;
      console.log(`Uploading ${file} -> ${publicId}...`);
      try {
        const res = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          resource_type: 'image',
        });
        console.log(`✅ Uploaded dashboard hero ${file}: ${res.secure_url}`);
        results[`dashboard_${file}`] = res.secure_url;
      } catch (err) {
        console.error(`❌ Failed to upload ${file}:`, err.message);
      }
    }
  }

  console.log("\n=== Uploading Heroimages ===");
  const heroDir = path.join(process.cwd(), 'public', 'visuals', 'heroimages');
  if (fs.existsSync(heroDir)) {
    const heroFiles = fs.readdirSync(heroDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
    for (const file of heroFiles) {
      const filePath = path.join(heroDir, file);
      const publicId = `itnavideo-assets/heroimages/${path.parse(file).name}`;
      console.log(`Uploading ${file} -> ${publicId}...`);
      try {
        const res = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          resource_type: 'image',
        });
        console.log(`✅ Uploaded hero image ${file}: ${res.secure_url}`);
        results[`hero_${file}`] = res.secure_url;
      } catch (err) {
        console.error(`❌ Failed to upload ${file}:`, err.message);
      }
    }
  }

  fs.writeFileSync(path.join(process.cwd(), 'public', 'visuals', 'cloudinary-urls.json'), JSON.stringify(results, null, 2));
  console.log("Saved URLs to public/visuals/cloudinary-urls.json");
}

uploadVisuals();
