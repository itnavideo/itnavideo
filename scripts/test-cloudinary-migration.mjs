// scripts/test-cloudinary-migration.mjs
import { v2 as cloudinary } from 'cloudinary';
import { loadEnvLocal } from './load-env-local.mjs';

loadEnvLocal();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testSingleMigration() {
  const testS3Url = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/renders/3-days-jd6pua1emr/out.mp4';
  const publicId = 'faceless_cycle_4_jd6pua1emr';

  console.log('Testing Cloudinary direct cloud-to-cloud upload from S3:');
  console.log('Source:', testS3Url);

  const result = await cloudinary.uploader.upload(testS3Url, {
    resource_type: 'video',
    folder: 'itnavideo/test-renders',
    public_id: publicId,
    overwrite: true,
  });

  console.log('✅ Cloudinary Upload Successful!');
  console.log('Public ID:', result.public_id);
  console.log('Secure URL:', result.secure_url);
  console.log('Format:', result.format, '| Bytes:', result.bytes, '| Duration:', result.duration);
}

testSingleMigration().catch(console.error);
