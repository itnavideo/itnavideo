import fs from 'fs';

let content = fs.readFileSync('lib/blogPosts.ts', 'utf-8');

// Find the last index of "export async function getAllPublishedBlogPostsAsync"
const idx = content.lastIndexOf('export async function getAllPublishedBlogPostsAsync');
if (idx !== -1) {
  // Cut everything from the end of the last post object
  const lastPostIdx = content.lastIndexOf('"Start scaling your video content engine today by creating your free account on Itnavideo."');
  if (lastPostIdx !== -1) {
    const validPrefix = content.slice(0, lastPostIdx + '"Start scaling your video content engine today by creating your free account on Itnavideo."'.length);
    const trailingCode = `
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export async function getDbBlogPost(slug: string): Promise<BlogPost | null> {
  const local = getBlogPost(slug);
  if (local) return local;
  return null;
}

export async function getAllPublishedBlogPostsAsync(): Promise<BlogPost[]> {
  const sortedLocal = [...blogPosts].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA;
  });
  return sortedLocal;
}
`;
    fs.writeFileSync('lib/blogPosts.ts', validPrefix + trailingCode, 'utf-8');
    console.log('Successfully formatted end of lib/blogPosts.ts');
  } else {
    console.log('Could not find last post index');
  }
}
