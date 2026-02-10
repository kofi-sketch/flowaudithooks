-- Manual fix for admin user creation
-- This creates the missing user record in public.users and makes them admin

-- First, let's see what auth users exist
SELECT 'Auth Users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

SELECT 'Public Users:' as info;
SELECT id, email, is_admin FROM public.users ORDER BY created_at DESC LIMIT 5;

-- To create the admin user, replace YOUR_AUTH_USER_ID and YOUR_EMAIL with actual values
-- Get these from the auth.users query above
--
-- INSERT INTO public.users (id, email, is_admin, created_at)
-- VALUES ('YOUR_AUTH_USER_ID', 'YOUR_EMAIL', true, NOW())
-- ON CONFLICT (id) DO UPDATE SET is_admin = true;
