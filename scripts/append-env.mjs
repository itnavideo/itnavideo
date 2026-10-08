import fs from 'fs';

const envContent = `
# ─── Cloudinary ───
CLOUDINARY_CLOUD_NAME=dhouh9idx
CLOUDINARY_API_KEY=972395946869552
CLOUDINARY_API_SECRET=wSwqFlvlj0DhvMA5yEXyjlt8uMo
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhouh9idx
`;

fs.appendFileSync('.env.local', envContent, 'utf8');
console.log('✅ Appended Cloudinary keys to .env.local');
