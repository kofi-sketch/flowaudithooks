-- =====================================================
-- Add Saved Hooks Feature
-- =====================================================

-- Create saved_hooks table for users to save their favorite hooks
CREATE TABLE public.saved_hooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  hook_id UUID REFERENCES public.hooks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hook_id)
);

-- Create index for faster lookups
CREATE INDEX idx_saved_hooks_user_id ON public.saved_hooks(user_id);
CREATE INDEX idx_saved_hooks_hook_id ON public.saved_hooks(hook_id);
CREATE INDEX idx_saved_hooks_created_at ON public.saved_hooks(created_at DESC);

-- Enable RLS
ALTER TABLE public.saved_hooks ENABLE ROW LEVEL SECURITY;

-- Users can only read their own saved hooks
CREATE POLICY "Users can read their own saved hooks"
  ON public.saved_hooks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can save hooks
CREATE POLICY "Users can save hooks"
  ON public.saved_hooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave hooks
CREATE POLICY "Users can unsave hooks"
  ON public.saved_hooks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can see all saved hooks
CREATE POLICY "Admins can see all saved hooks"
  ON public.saved_hooks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
