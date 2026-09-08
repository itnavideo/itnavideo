import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const srcFile = path.join(root, 'public', 'preview', 'file_0000000018cc82079ca3ca5c29058919.png');
const destDir = path.join(root, 'public', 'assets', 'reusable', 'images');

const destinations = [
  'whiteboard-corporate-clean.png',
  'whiteboard-corporate-luxury.png',
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
  for (const filename of destinations) {
    const destFile = path.join(destDir, filename);
    await copyFile(srcFile, destFile);
    console.log(`Successfully deployed background to: ${filename}`);
  }
}

run().catch(console.error);
