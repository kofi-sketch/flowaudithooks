-- Migration 005: Add content type support
-- Adds support for three content types: hooks, bridges, and follow-ups

-- Create ENUM type for content_type
CREATE TYPE content_type AS ENUM ('hook', 'bridge', 'followup');

-- Add content_type column (defaults existing records to 'hook')
ALTER TABLE public.hooks
  ADD COLUMN content_type content_type DEFAULT 'hook' NOT NULL;

-- Create indexes for filtering performance
CREATE INDEX idx_hooks_content_type ON public.hooks(content_type);
CREATE INDEX idx_hooks_content_type_green_percentage
  ON public.hooks(content_type, green_percentage DESC);
CREATE INDEX idx_hooks_content_type_created_at
  ON public.hooks(content_type, created_at DESC);

-- Drop the old function
DROP FUNCTION IF EXISTS get_random_hook(UUID[]);

-- Update get_random_hook to filter by content_type
CREATE OR REPLACE FUNCTION get_random_hook(
  excluded_ids UUID[] DEFAULT '{}',
  p_content_type content_type DEFAULT 'hook'
)
RETURNS TABLE (
  id UUID,
  text TEXT,
  total_votes INTEGER,
  green_votes INTEGER,
  red_votes INTEGER,
  green_percentage NUMERIC,
  is_flagged BOOLEAN,
  created_at TIMESTAMPTZ,
  content_type content_type
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id,
    h.text,
    h.total_votes,
    h.green_votes,
    h.red_votes,
    h.green_percentage,
    h.is_flagged,
    h.created_at,
    h.content_type
  FROM public.hooks h
  WHERE h.id != ALL(excluded_ids)
    AND h.content_type = p_content_type
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
