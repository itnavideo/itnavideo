import { blogPosts } from '../lib/blogPosts.ts';

const slugs = new Map();
const duplicates = [];

blogPosts.forEach((post, index) => {
  if (slugs.has(post.slug)) {
    duplicates.push({ slug: post.slug, firstIndex: slugs.get(post.slug), duplicateIndex: index });
  } else {
    slugs.set(post.slug, index);
  }
});

console.log('Duplicates found:', duplicates);
