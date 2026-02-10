-- Fix for "Database error saving new user" issue
-- Add INSERT policy for users table so the trigger can create new users

-- Allow service role and authenticated users to insert their own user record
CREATE POLICY "Allow user creation on signup"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
