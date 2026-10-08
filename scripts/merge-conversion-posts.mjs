import fs from 'fs';
import path from 'path';

const blogPostsPath = path.resolve('lib/blogPosts.ts');
const conversionPath = path.resolve('lib/conversionBlogPosts.ts');

const conversionCode = fs.readFileSync(conversionPath, 'utf8');
const startIndex = conversionCode.indexOf('[');
const endIndex = conversionCode.lastIndexOf(']');

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find array in conversionBlogPosts.ts');
  process.exit(1);
}

const postsJsonStr = conversionCode.slice(startIndex, endIndex + 1);
const posts = JSON.parse(postsJsonStr);

console.log('Parsed', posts.length, 'posts from conversionBlogPosts.ts');

let blogPostsContent = fs.readFileSync(blogPostsPath, 'utf8');

// Remove the import line if present
blogPostsContent = blogPostsContent.replace(/import\s*\{\s*conversionBlogPosts\s*\}\s*from\s*['"][^'"]+['"];\s*\n?/, '');

// Remove ...conversionBlogPosts, if present
blogPostsContent = blogPostsContent.replace(/\.\.\.conversionBlogPosts,\s*\n?/, '');

// Format the posts cleanly as TypeScript objects
const serializedPosts = JSON.stringify(posts, null, 2).slice(1, -1).trim();

const targetMarker = 'export const blogPosts: BlogPost[] = [\n';
if (!blogPostsContent.includes(targetMarker)) {
  console.error('Target marker not found in blogPosts.ts');
  process.exit(1);
}

blogPostsContent = blogPostsContent.replace(
  targetMarker,
  targetMarker + '  ' + serializedPosts + ',\n'
);

fs.writeFileSync(blogPostsPath, blogPostsContent, 'utf8');
console.log('Successfully inserted', posts.length, 'conversion blog posts directly into lib/blogPosts.ts!');
