# Deployment Checklist for flowaudithooks.vercel.app

## ✅ Configuration Complete

**Supabase URL**: `https://stboueshyjvooiftfuxm.supabase.co`
**Vercel Domain**: `flowaudithooks.vercel.app`

---

## 🔑 Step 1: Verify Supabase Key

⚠️ **IMPORTANT**: Please double-check your Supabase anon key.

1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Look for **Project API keys**
4. Copy the **anon/public** key (it should start with `eyJ...`, not `sb_publishable_`)

If your key starts with `sb_publishable_`, that's likely a different key type. Update `.env.local` with the correct **anon public** key.

---

## 📊 Step 2: Run Database Migration

**CRITICAL**: You must run the SQL migration before the app will work!

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/stboueshyjvooiftfuxm
2. Click **SQL Editor** in the left sidebar
3. Open the file: `supabase/migrations/001_initial_schema.sql` from this project
4. Copy **ALL** the contents (it's a long file!)
5. Paste into the SQL Editor
6. Click **RUN** or press Cmd/Ctrl + Enter
7. Wait for "Success. No rows returned" message

**This creates:**
- Users table
- Hooks table
- Votes table
- All functions and triggers
- First-user-admin logic

---

## 🚀 Step 3: Test Locally

```bash
cd /Users/AIAgenterminal/hook-tester
npm run dev
```

Visit: http://localhost:3000

**Test these:**
- [ ] Homepage loads
- [ ] Can access `/login`
- [ ] Can sign up (creates account)
- [ ] First user becomes admin
- [ ] Can access `/admin` dashboard
- [ ] Can add a hook
- [ ] Can vote on hooks at `/test`
- [ ] Stats update after voting

---

## ☁️ Step 4: Deploy to Vercel

### A. Push to GitHub (if not already)

```bash
cd /Users/AIAgenterminal/hook-tester
git init
git add .
git commit -m "Initial commit - Hook Tester"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### B. Deploy to Vercel

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Project Name**: flowaudithooks (or it may be set already)
5. **Framework Preset**: Next.js (auto-detected)
6. Click **Environment Variables**
7. Add these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://stboueshyjvooiftfuxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_correct_anon_key_here
```

8. Click **Deploy**

---

## 🔗 Step 5: Configure Supabase for Production

After your Vercel deployment is live at `flowaudithooks.vercel.app`:

1. Go to Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update these fields:

**Site URL:**
```
https://flowaudithooks.vercel.app
```

**Redirect URLs** (add all of these):
```
https://flowaudithooks.vercel.app
https://flowaudithooks.vercel.app/login
https://flowaudithooks.vercel.app/test
https://flowaudithooks.vercel.app/admin
https://flowaudithooks.vercel.app/**
```

4. Click **Save**

---

## ✅ Step 6: Test Production

Visit: https://flowaudithooks.vercel.app

**Test:**
- [ ] Homepage redirects to `/test`
- [ ] Can sign up
- [ ] Can sign in
- [ ] First user is admin
- [ ] Can add hooks
- [ ] Can vote on hooks
- [ ] No console errors

---

## 🎯 You're Live!

Once all steps are complete, your Hook Tester will be live at:
**https://flowaudithooks.vercel.app**

### Share with your team:
- **Testing Interface**: https://flowaudithooks.vercel.app/test
- **Admin Dashboard**: https://flowaudithooks.vercel.app/admin (admins only)

---

## 🆘 Troubleshooting

### "Invalid API key" error
- Use the **anon public** key from Supabase (starts with `eyJ...`)
- Not the service_role key
- Not the publishable key

### "No hooks available"
- Make sure you ran the database migration
- Add at least one hook via admin dashboard

### Can't sign up / Auth errors
- Check environment variables in Vercel
- Verify Supabase redirect URLs are set
- Check Supabase → Authentication → Providers (Email should be enabled)

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Try building locally first: `npm run build`

---

## 📞 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/stboueshyjvooiftfuxm
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production App**: https://flowaudithooks.vercel.app
- **Local Dev**: http://localhost:3000

---

**Good luck! 🚀**
