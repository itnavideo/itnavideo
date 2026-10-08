# Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor for basic site data.

Required tables:

- `public.waitlist`
- `public.newsletter`
- `public.job_applications`
- `public.app_settings`

If the dashboard shows an error like:

```text
Could not find the table in the schema cache
```

open Supabase Dashboard -> SQL Editor -> New query, paste the contents of `supabase/schema.sql`, and run it.

After the SQL succeeds, refresh the app.

## Security Advisor: RLS Disabled

If Supabase emails a warning like:

```text
Table publicly accessible
rls_disabled_in_public
```

run `supabase/enable-rls-security.sql` in Supabase Dashboard -> SQL Editor.

The app uses server-side service-role helpers for these tables, so enabling RLS blocks direct public browser access while keeping server API routes working.
