import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting with URL:', url ? 'OK' : 'Missing', 'Key:', key ? 'OK' : 'Missing');

async function run() {
  let dbPosts = [];
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status, created_at, published_at')
        .order('published_at', { ascending: false })
        .limit(150);

      if (error) {
        console.error('Supabase query error:', error.message);
      } else if (data) {
        dbPosts = data;
        console.log('Found in Supabase:', dbPosts.length);
      }
    } catch (e) {
      console.error('Supabase exception:', e.message);
    }
  }

  // Also read lib/blogPosts.ts
  const code = fs.readFileSync('./lib/blogPosts.ts', 'utf8');
  const slugRegex = /"slug":\s*"([^"]+)"/g;
  const titleRegex = /"title":\s*"([^"]+)"/g;
  const dateRegex = /"date":\s*"([^"]+)"/g;

  const slugs = Array.from(code.matchAll(slugRegex)).map(m => m[1]);
  const titles = Array.from(code.matchAll(titleRegex)).map(m => m[1]);
  const dates = Array.from(code.matchAll(dateRegex)).map(m => m[1]);

  console.log('Found in lib/blogPosts.ts:', slugs.length);

  // Combine & deduplicate
  const postsMap = new Map();

  for (const p of dbPosts) {
    if (p.slug && (p.status === 'published' || !p.status)) {
      postsMap.set(p.slug, {
        slug: p.slug,
        title: p.title,
        date: p.published_at || p.created_at || 'Recent',
        source: 'db'
      });
    }
  }

  slugs.forEach((slug, i) => {
    if (!postsMap.has(slug)) {
      postsMap.set(slug, {
        slug: slug,
        title: titles[i] || slug,
        date: dates[i] || '2026',
        source: 'static'
      });
    }
  });

  const allPosts = Array.from(postsMap.values());
  console.log('Total unique posts found:', allPosts.length);

  // Output latest 100
  const top100 = allPosts.slice(0, 100);
  const urls = top100.map(p => `https://www.itnavideo.com/blog/${p.slug}`);

  fs.writeFileSync('./scripts/latest-100-urls.txt', urls.join('\n'), 'utf8');
  fs.writeFileSync('./scripts/latest-100-posts.json', JSON.stringify(top100, null, 2), 'utf8');

  console.log('Saved 100 URLs to ./scripts/latest-100-urls.txt');
}

run();
