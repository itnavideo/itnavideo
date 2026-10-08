import { blogPosts } from '../lib/blogPosts.ts';

console.log(`Total blog posts in lib/blogPosts.ts: ${blogPosts.length}`);
console.log('\nTop 15 blog posts:');
blogPosts.slice(0, 15).forEach((p, i) => {
  console.log(`${i + 1}. [${p.date}] (${p.slug}) - ${p.title.slice(0, 50)}...`);
});

console.log('\nLast 15 blog posts:');
blogPosts.slice(-15).forEach((p, i) => {
  console.log(`${blogPosts.length - 15 + i + 1}. [${p.date}] (${p.slug}) - ${p.title.slice(0, 50)}...`);
});
