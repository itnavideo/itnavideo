import fs from 'fs';

const content = fs.readFileSync('components/dashboard/ImageToVideoStudio.tsx', 'utf8');
const match = content.match(/export const THIRTY_TWO_CAPTION_STYLES: CaptionStyleItem\[\] = \[([\s\S]*?)\];/);
if (match) {
  console.log('Found THIRTY_TWO_CAPTION_STYLES length:', match[1].length);
  const sample = match[1].slice(0, 1000);
  console.log(sample);
} else {
  console.log('Not found directly');
}
