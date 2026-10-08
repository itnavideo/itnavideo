import fs from 'node:fs';
import path from 'node:path';

const dirs = [
  'public/assets/reusable/images/2d',
  'public/assets/reusable/images/realistic',
];

const RANDOM_PATTERNS = [
  /^file[_-]/i,
  /^img[_-]?\d*/i,
  /^image[_-]?\d*/i,
  /^download/i,
  /^screenshot/i,
  /^[a-f0-9]{12,}$/i,
  /^\d+$/,
  /^istockphoto/i,
  /^intro-\d+/i,
  /^images\s*\(\d+\)/i,
  /^images$/i,
  /^inline_image/i,
];

for (const dir of dirs) {
  const fullDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) {
    console.log(`Directory does not exist: ${dir}`);
    continue;
  }
  const files = fs.readdirSync(fullDir).filter((f) => !f.startsWith('.') && f !== 'assets.json');
  const needsRenaming = [];
  const alreadyNamed = [];

  for (const f of files) {
    const nameWithoutExt = path.parse(f).name;
    const isRandom = RANDOM_PATTERNS.some((p) => p.test(nameWithoutExt));
    if (isRandom) {
      needsRenaming.push(f);
    } else {
      alreadyNamed.push(f);
    }
  }

  console.log(`\n========================================`);
  console.log(`Directory: ${dir}`);
  console.log(`Total files: ${files.length}`);
  console.log(`Needs Renaming (Random/Generic): ${needsRenaming.length}`);
  console.log(`Already Named: ${alreadyNamed.length}`);
  console.log(`========================================`);
  if (needsRenaming.length > 0) {
    console.log(`First 10 needing renames:`);
    console.log(needsRenaming.slice(0, 10));
  }
}
