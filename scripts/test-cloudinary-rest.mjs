// scripts/test-cloudinary-rest.mjs
import crypto from 'node:crypto';
import { loadEnvLocal } from './load-env-local.mjs';

loadEnvLocal();

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function uploadRemoteVideoToCloudinary(s3Url, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'itnavideo/test-renders';

  // Cloudinary signature is SHA1 of sorted params string + secret
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const formData = new FormData();
  formData.append('file', s3Url);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  console.log(`Cloud-to-cloud uploading to Cloudinary (${publicId})...`);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    duration: data.duration,
    bytes: data.bytes,
    format: data.format,
  };
}

async function run() {
  const s3Url = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/renders/3-days-jd6pua1emr/out.mp4';
  const result = await uploadRemoteVideoToCloudinary(s3Url, 'faceless_cycle_4_jd6pua1emr');
  console.log('🎉 SUCCESS! Uploaded directly to Cloudinary:');
  console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
