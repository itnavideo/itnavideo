import fs from 'fs';

const p = 'components/dashboard/autocaption/AutoCaptionUploadStep.tsx';
let content = fs.readFileSync(p, 'utf8');
content = content.replace(
  'MP4, MOV, Audio • Max 90s • 9:16 Vertical Recommended',
  'MP4, MOV, Audio • Videos and audio longer than 90 seconds are supported. Only the first 90 seconds will be used.'
);
fs.writeFileSync(p, content, 'utf8');
console.log('Updated AutoCaptionUploadStep.tsx successfully!');

