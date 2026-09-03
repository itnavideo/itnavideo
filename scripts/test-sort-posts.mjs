import { blogPosts } from '../lib/blogPosts.ts';

const sorted = [...blogPosts].sort((a, b) => {
  const dateA = new Date(a.date).getTime() || 0;
  const dateB = new Date(b.date).getTime() || 0;
  return dateB - dateA;
});

console.log('Total posts:', sorted.length);
console.log('\nTop 12 newest posts:');
sorted.slice(0, 12).forEach((p, i) => {
  console.log(`${i + 1}. [${p.date}] (${p.slug}) - ${p.title}`);
});
