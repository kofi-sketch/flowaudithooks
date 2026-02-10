-- Check if you have any users in the public.users table
SELECT id, email, is_admin, created_at
FROM public.users
ORDER BY created_at DESC;

-- Check if you have any users in auth.users
SELECT id, email, created_at, confirmed_at
FROM auth.users
ORDER BY created_at DESC;
