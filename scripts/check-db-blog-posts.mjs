import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', url ? 'Defined' : 'Missing');
console.log('Supabase Key:', key ? 'Defined' : 'Missing');

if (url && key) {
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, created_at, scheduled_at, published_at');
  
  if (error) {
    console.error('Error fetching blog_posts:', error);
  } else {
    console.log('Found blog posts in DB:', data?.length);
    console.log(JSON.stringify(data, null, 2));
  }
}
