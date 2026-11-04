import { createHash } from 'crypto';
import { readFileSync } from 'fs';

const CLOUD_NAME = 'dhouh9idx';
const API_KEY = '972395946869552';
const API_SECRET = 'wSwqFlvlj0DhvMA5yEXyjlt8uMo';
const FOLDER = 'itnavideo12345';

async function testUpload() {
  const publicId = 'blog_luxury_real_estate';
  const filePath = 'C:/Users/user/Downloads/Gemini_Generated_Image_8t440u8t440u8t44.png';
  
  const timestamp = Math.round(Date.now() / 1000);
  const fileData = readFileSync(filePath);
  const base64Data = `data:image/png;base64,${fileData.toString('base64')}`;

  // All params must be sorted alphabetically
  const params = {
    folder: FOLDER,
    overwrite: 'true',
    public_id: publicId,
    timestamp: String(timestamp),
  };

  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  const signature = createHash('sha1').update(stringToSign + API_SECRET).digest('hex');

  const formData = new URLSearchParams({
    file: base64Data,
    ...params,
    api_key: API_KEY,
    signature,
  });

  console.log('Uploading sample image to Cloudinary...');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const json = await res.json();
  if (!res.ok) {
    console.error('Upload failed:', json);
    return;
  }

  console.log('Uploaded successfully!');
  console.log('Secure URL:', json.secure_url);
  
  // URL with bottom-right watermark cropped out cleanly:
  // c_crop,g_north_west,w_0.96,h_0.94 trumps the bottom right 4-6% where the sparkle sits
  const cleanUrl = json.secure_url.replace('/upload/', '/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto/');
  console.log('Clean Watermark-Free URL:', cleanUrl);
}

testUpload().catch(console.error);
