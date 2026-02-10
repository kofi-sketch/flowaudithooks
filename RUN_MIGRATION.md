# Run Database Migration

## Quick Guide - Apply Migration in 2 Minutes

### Option 1: Supabase Dashboard (Recommended - Easiest)

1. **Go to Supabase SQL Editor:**
   - Visit: https://supabase.com/dashboard/project/stboueshyjvooiftfuxm/sql

2. **Copy the SQL below and paste it into the SQL Editor:**

```sql
-- Migration 006: Add content_type to saved_hooks
-- Enables filtering saved items by content type

-- Add content_type column to saved_hooks
ALTER TABLE public.saved_hooks
  ADD COLUMN content_type content_type;

-- Populate content_type for existing saved_hooks by joining with hooks table
UPDATE public.saved_hooks sh
SET content_type = h.content_type
FROM public.hooks h
WHERE sh.hook_id = h.id;

-- Make content_type required
ALTER TABLE public.saved_hooks
  ALTER COLUMN content_type SET NOT NULL;

-- Add index for filtering by content_type
CREATE INDEX idx_saved_hooks_user_content_type
  ON public.saved_hooks(user_id, content_type);
```

3. **Click "Run" button**

4. **Verify success:**
   - You should see "Success. No rows returned"
   - The migration is complete!

### Option 2: Command Line (If you have Supabase CLI)

```bash
supabase db push
```

## What This Migration Does

- ✅ Adds `content_type` column to `saved_hooks` table
- ✅ Populates existing saved items with correct content type
- ✅ Makes the column required (NOT NULL)
- ✅ Adds database index for fast filtering

## After Migration

Once complete, your app will:
- Track which type of content (Hook/Bridge/Follow-up) each saved item is
- Allow users to filter their saved content by type
- Display content type badges on saved items

## Troubleshooting

**Error: "column already exists"**
- Migration already ran successfully - you're good to go!

**Error: "permission denied"**
- Make sure you're logged into the correct Supabase project
- You may need to be the project owner/admin

**Questions?**
- Check Supabase logs: https://supabase.com/dashboard/project/stboueshyjvooiftfuxm/logs
