import fs from 'fs';
import path from 'path';

function findPageRoutes(dir, currentRoute = '') {
  let routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', '.next', 'api'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const segment = entry.name.startsWith('(') && entry.name.endsWith(')') ? '' : entry.name;
      const nextRoute = currentRoute ? `${currentRoute}/${segment}` : `/${segment}`;
      routes = routes.concat(findPageRoutes(full, nextRoute));
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      routes.push({ route: currentRoute || '/', file: full.replace(/\\/g, '/') });
    }
  }
  return routes;
}

const allRoutes = findPageRoutes('app');
console.log(JSON.stringify(allRoutes, null, 2));

