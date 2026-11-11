import fs from 'fs';

function findRenderProgressModalUsages() {
  const dirs = ['components', 'app'];
  dirs.forEach(d => {
    if (!fs.existsSync(d)) return;
    const files = fs.readdirSync(d, { recursive: true });
    files.forEach(f => {
      if (typeof f !== 'string' || (!f.endsWith('.tsx') && !f.endsWith('.ts'))) return;
      const full = `${d}/${f}`;
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('RenderProgressModal')) {
        console.log(`Uses RenderProgressModal: ${full}`);
        const lines = content.split('\n');
        lines.forEach((l, i) => {
          if (l.includes('<RenderProgressModal') || l.includes('title=')) {
            console.log(`  L${i+1}: ${l.trim()}`);
          }
        });
      }
    });
  });
}

findRenderProgressModalUsages();

