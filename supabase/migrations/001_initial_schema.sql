-- =====================================================
-- Hook Tester & Randomizer - Initial Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hooks table with auto-calculated metrics
CREATE TABLE public.hooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL CHECK (char_length(text) > 0),
  total_votes INTEGER DEFAULT 0 CHECK (total_votes >= 0),
  green_votes INTEGER DEFAULT 0 CHECK (green_votes >= 0),
  red_votes INTEGER DEFAULT 0 CHECK (red_votes >= 0),
  green_percentage NUMERIC GENERATED ALWAYS AS (
    CASE
      WHEN total_votes > 0 THEN ROUND((green_votes::NUMERIC / total_votes::NUMERIC) * 100, 2)
      ELSE 0
    END
  ) STORED,
  is_flagged BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table for audit trail
CREATE TABLE public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hook_id UUID REFERENCES public.hooks(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('green', 'red', 'star')),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_hooks_is_flagged ON public.hooks(is_flagged);
CREATE INDEX idx_hooks_green_percentage ON public.hooks(green_percentage DESC);
CREATE INDEX idx_hooks_created_at ON public.hooks(created_at DESC);
CREATE INDEX idx_votes_hook_id ON public.votes(hook_id);
CREATE INDEX idx_votes_session_id ON public.votes(session_id);
CREATE INDEX idx_votes_created_at ON public.votes(created_at DESC);
CREATE INDEX idx_users_email ON public.users(email);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Hooks policies
CREATE POLICY "Anyone can read hooks"
  ON public.hooks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert hooks"
  ON public.hooks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update hooks"
  ON public.hooks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete hooks"
  ON public.hooks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Votes policies
CREATE POLICY "Anyone can read votes"
  ON public.votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert votes"
  ON public.votes FOR INSERT
  TO public
  WITH CHECK (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get a random hook excluding recent ones
CREATE OR REPLACE FUNCTION get_random_hook(excluded_ids UUID[] DEFAULT '{}')
RETURNS TABLE (
  id UUID,
  text TEXT,
  total_votes INTEGER,
  green_votes INTEGER,
  red_votes INTEGER,
  green_percentage NUMERIC,
  is_flagged BOOLEAN,
  created_at TIMESTAMPTZ
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
    h.created_at
  FROM public.hooks h
  WHERE h.id != ALL(excluded_ids)
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update hook statistics after vote
CREATE OR REPLACE FUNCTION update_hook_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.hooks
  SET
    total_votes = total_votes + 1,
    green_votes = CASE WHEN NEW.vote_type = 'green' THEN green_votes + 1 ELSE green_votes END,
    red_votes = CASE WHEN NEW.vote_type = 'red' THEN red_votes + 1 ELSE red_votes END,
    updated_at = NOW()
  WHERE id = NEW.hook_id;

  -- Check if hook should be flagged (only count green/red votes, not stars)
  IF NEW.vote_type IN ('green', 'red') THEN
    PERFORM check_and_flag_hook(NEW.hook_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check and flag poorly performing hooks
CREATE OR REPLACE FUNCTION check_and_flag_hook(p_hook_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_votes INTEGER;
  v_green_percentage NUMERIC;
BEGIN
  SELECT total_votes, green_percentage
  INTO v_total_votes, v_green_percentage
  FROM public.hooks
  WHERE id = p_hook_id;

  -- Flag if: at least 10 votes AND less than 40% green
  IF v_total_votes >= 10 AND v_green_percentage < 40 THEN
    UPDATE public.hooks
    SET is_flagged = true, updated_at = NOW()
    WHERE id = p_hook_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to make first user admin
CREATE OR REPLACE FUNCTION make_first_user_admin()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count
  FROM public.users
  WHERE is_admin = true;

  -- If no admin exists, make this user admin
  IF admin_count = 0 THEN
    NEW.is_admin := true;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create user record on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update hook stats when vote is inserted
CREATE TRIGGER on_vote_inserted
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_hook_stats();

-- Trigger to make first user admin
CREATE TRIGGER on_user_created
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION make_first_user_admin();

-- Trigger to automatically create user record when someone signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert sample hooks (uncomment if you want initial data)
-- Note: You'll need to replace 'your-admin-user-id' with an actual UUID after creating your first admin user

/*
INSERT INTO public.hooks (text, created_by) VALUES
  ('🚀 Transform your business in 30 days or your money back', NULL),
  ('The secret strategy Fortune 500 companies don''t want you to know', NULL),
  ('Why 97% of people fail at [problem] (and how you can be in the 3%)', NULL),
  ('I tried [method] for 90 days. Here''s what happened...', NULL),
  ('The surprising truth about [topic] that experts won''t tell you', NULL),
  ('[Number] proven ways to achieve [outcome] without [common pain]', NULL),
  ('Stop doing [common practice]. Do this instead.', NULL),
  ('The [adjective] framework that helped me [achievement]', NULL),
  ('How to get [desired result] even if you''re [objection]', NULL),
  ('This one change increased my [metric] by [impressive percentage]', NULL);
*/
