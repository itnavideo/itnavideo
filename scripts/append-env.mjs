import fs from 'fs';

/**
 * Appends Cloudinary environment variable placeholders to .env.local.
 * Fill in the actual values from your Cloudinary dashboard.
 * Never hardcode API keys or secrets in this file.
 */
const envContent = `
# ─── Cloudinary ───
CLOUDINARY_CLOUD_NAME=dhouh9idx
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY_HERE
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET_HERE
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhouh9idx
`;

fs.appendFileSync('.env.local', envContent, 'utf8');
console.log('✅ Appended Cloudinary key placeholders to .env.local — fill in real values from Cloudinary Console.');
