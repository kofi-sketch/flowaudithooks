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
