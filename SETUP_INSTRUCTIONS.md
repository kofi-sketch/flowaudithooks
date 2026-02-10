# Quick Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Wait for the project to be ready (~2 minutes)

## 3. Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql` in this project
3. Copy ALL the contents
4. Paste into the SQL Editor
5. Click **Run** or press Cmd/Ctrl + Enter
6. Verify success (should see "Success. No rows returned")

## 4. Get Supabase Credentials

1. In Supabase dashboard, go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## 5. Configure Environment Variables

1. Open `.env.local` in this project
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-long-key-here
```

## 6. Start Development Server

```bash
npm run dev
```

## 7. First Use

1. Open http://localhost:3000
2. Click **Sign In** (top right)
3. Click **"Don't have an account? Sign up"**
4. Create your account (you'll become the admin!)
5. Go to **Admin Dashboard**
6. Click **Add New Hook**
7. Add a few test hooks
8. Go back to home and start testing!

## Common Issues

### Build Error: "Module not found"
- Run `npm install` again
- Delete `node_modules` and `.next`, then `npm install`

### "Invalid API key" error
- Check that you copied the **anon** key, not the service_role key
- Make sure there are no extra spaces in `.env.local`
- Restart the dev server after changing `.env.local`

### "No hooks available"
- Make sure you ran the SQL migration
- Add at least one hook via the admin dashboard
- Check browser console for errors

### Can't access admin dashboard
- Make sure you signed up (not just signed in)
- The FIRST user to sign up becomes admin
- If you need to reset, delete the user from Supabase dashboard and sign up again

## Verification Checklist

After setup, verify these work:

- [ ] Can sign up
- [ ] Can sign in
- [ ] Can access `/admin` (as first user)
- [ ] Can add a new hook
- [ ] Can see the hook on `/test` page
- [ ] Can vote on hooks
- [ ] Stats update after voting

## Next Steps

1. Add 10-20 hooks to your library
2. Share the `/test` link with your team or test audience
3. Monitor results in the admin dashboard
4. Review flagged hooks (after they get 10+ votes)
5. Deploy to Vercel when ready!

## Need Help?

- Check the main README.md for detailed documentation
- Check Supabase dashboard → Logs for database errors
- Check browser console for frontend errors
