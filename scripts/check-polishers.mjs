import fs from 'fs';

function checkFile(path, keywords) {
  const content = fs.readFileSync(path, 'utf8');
  console.log(`Checking ${path}:`);
  keywords.forEach(k => {
    const regex = new RegExp(`.{0,40}${k}.{0,60}`, 'gi');
    const matches = content.match(regex) || [];
    console.log(`  Keyword "${k}": ${matches.length} matches`);
    matches.slice(0, 3).forEach(m => console.log(`    -> ${m.trim()}`));
  });
}

checkFile('components/dashboard/AiVideoPolisherStudio.tsx', ['Jump', 'Punch', 'B-Roll', 'Callout', 'Cinematic', 'Dynamic']);
checkFile('components/dashboard/AiShortsPolisherStudio.tsx', ['Jump', 'Punch', 'Zoom', 'Cinematic', 'Dynamic']);
