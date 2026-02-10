-- Fix for "Database error saving new user" issue
-- The trigger function needs SECURITY DEFINER to bypass RLS policies

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Allow user creation on signup" ON public.users;

-- Recreate the handle_new_user function with SECURITY DEFINER
-- This allows the function to bypass RLS and insert user records
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER  -- This is the key: run with owner's privileges, not caller's
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth signup
    RAISE WARNING 'Error creating user record: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Also update the make_first_user_admin function to use SECURITY DEFINER
CREATE OR REPLACE FUNCTION make_first_user_admin()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
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
