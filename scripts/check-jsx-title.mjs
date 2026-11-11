import fs from 'fs';
import path from 'path';

function checkJsxVariables(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkJsxVariables(full);
    } else if (entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      // Look for error like `title is not defined`
      // Check if `title` is used inside JSX like `title={title}` or `{title}`
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/\{title\}/.test(line) || /title=\{title\}/.test(line)) {
          // Check if `title` is declared in this file
          const hasTitleDecl = /\b(title\s*[:=]|const\s+\[?\s*title\b|function.*\(.*title|interface.*title|\btype\b.*title)/.test(content);
          if (!hasTitleDecl) {
            console.log(`[UNDEFINED TITLE ERROR RISK] ${full}:${idx + 1} -> ${line.trim()}`);
          }
        }
      });
    }
  }
}

console.log('Checking all components and pages for undeclared title references in JSX...');
checkJsxVariables('components');
checkJsxVariables('app');
console.log('Check complete.');

