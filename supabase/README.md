# Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor for the production project before using dashboard video generation.

Required tables:

- `public.projects`
- `public.ffmpeg_jobs`
- `public.waitlist`
- `public.newsletter`

If the dashboard shows an error like:

```text
Could not find the table 'public.projects' in the schema cache
```

open Supabase Dashboard -> SQL Editor -> New query, paste the contents of `supabase/schema.sql`, and run it.

After the SQL succeeds, refresh the dashboard. The app has a local fallback for missing project tables, but Supabase history and cross-device project sync require these tables.
