# 🚀 Quick Start Guide

Get your Hook Tester running in under 10 minutes!

## ⚡ Fast Track Setup

### 1. Install (30 seconds)

```bash
cd /Users/AIAgenterminal/hook-tester
npm install
```

### 2. Create Supabase Project (2 minutes)

1. Visit https://supabase.com
2. Click "New Project"
3. Fill in details and wait for setup

### 3. Run Database Migration (1 minute)

1. In Supabase dashboard → **SQL Editor**
2. Open `supabase/migrations/001_initial_schema.sql` from this project
3. Copy ALL contents
4. Paste in SQL Editor
5. Click **RUN**

### 4. Get Credentials (30 seconds)

1. In Supabase → **Settings** → **API**
2. Copy **Project URL** and **anon public** key

### 5. Configure Environment (30 seconds)

Edit `.env.local` in this project:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_key_here
```

### 6. Start App (10 seconds)

```bash
npm run dev
```

Visit: http://localhost:3000

### 7. Create Admin Account (1 minute)

1. Click "Sign In"
2. Click "Sign up"
3. Enter email and password
4. You're now the admin! 🎉

### 8. Add Your First Hook (30 seconds)

1. Click "Admin Dashboard"
2. Click "Add New Hook"
3. Enter a hook (or use an example)
4. Click "Add Hook"

### 9. Start Testing! (immediately)

1. Click "Hook Tester" logo or go to `/test`
2. Vote on hooks
3. Watch stats update in real-time

## 🎯 You're Done!

That's it! You now have:
- ✅ A working Hook Tester app
- ✅ Admin access
- ✅ Database setup
- ✅ Ready to add hooks and get feedback

## 📖 What's Next?

- **Add more hooks**: Build up your library
- **Share `/test` link**: Get feedback from your team
- **Monitor results**: Check admin dashboard regularly
- **Deploy**: See `DEPLOYMENT.md` when ready

## ❓ Need Help?

- **Can't access admin?** Make sure you were the FIRST to sign up
- **No hooks showing?** Add at least one hook via admin dashboard
- **Auth errors?** Check `.env.local` has correct values (no extra spaces!)
- **Build fails?** Run `npm install` again

## 📚 Full Documentation

- `README.md` - Complete documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `DEPLOYMENT.md` - Deploy to Vercel
- `PROJECT_SUMMARY.md` - Technical overview

---

**That's it! Happy testing! 🎉**
