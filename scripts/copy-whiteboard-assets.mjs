import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'public', 'visuals', 'previews');
const destDir = path.join(root, 'public', 'assets', 'reusable', 'images');

const srcFile = path.join(srcDir, 'whiteboard-video-new.png');

const filenames = [
  'whiteboard-corporate-clean.png',
  'whiteboard-photo-hd.jpg',
  'whiteboard-conference.jpg',
  'whiteboard-dark-modern.jpg',
  'whiteboard-outdoor-street.jpg',
  'whiteboard-classroom.jpg',
  'whiteboard-coworking.jpg',
  'whiteboard-person-writing.jpg'
];

async function run() {
  await mkdir(destDir, { recursive: true });
  for (const filename of filenames) {
    const destFile = path.join(destDir, filename);
    await copyFile(srcFile, destFile);
    console.log(`Copied ${filename} successfully.`);
  }
}

run().catch(console.error);
