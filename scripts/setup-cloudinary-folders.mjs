import path from 'path';

const CLOUD_NAME = "dhouh9idx";
const API_KEY = "972395946869552";
const API_SECRET = "wSwqFlvlj0DhvMA5yEXyjlt8uMo";

const baseFolder = 'itnavideo-assets';

const subFolders = [
  'website-graphics',
  'demo-videos',
  'video-types/autoCaption',
  'video-types/audioClean',
  'video-types/longVideoPromo',
  'video-types/compare',
  'video-types/imageToVideoAi',
  'video-types/youtubeSubtitles',
  'video-types/facelessVideo',
  'video-types/typography',
  'video-types/whiteboardVideo',
  'video-types/longVideoClips',
];

async function createFolder(folderPath) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${folderPath}`;
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    console.log(`✅ Created folder: ${folderPath}`);
  } else {
    const errorData = await response.json();
    if (errorData.error && errorData.error.message.includes('exists')) {
       console.log(`✅ Folder already exists: ${folderPath}`);
    } else {
       console.error(`❌ Error creating ${folderPath}:`, errorData);
    }
  }
}

async function createFolders() {
  console.log(`Setting up Cloudinary folder structure under: ${baseFolder}`);
  
  await createFolder(baseFolder);
  await createFolder(`${baseFolder}/video-types`);
  
  for (const folder of subFolders) {
    await createFolder(`${baseFolder}/${folder}`);
  }
  
  console.log('🎉 All folders processed!');
}

createFolders();
