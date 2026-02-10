# How to Get the Correct Supabase Key

## 🔑 Finding Your Anon Key

1. **Go to your Supabase project**:
   https://supabase.com/dashboard/project/stboueshyjvooiftfuxm

2. **Click on the Settings icon** (gear icon) in the left sidebar

3. **Click "API"** in the settings menu

4. **Look for "Project API keys" section**

5. **Copy the "anon public" key**:
   - It's a LONG key that starts with `eyJ...`
   - NOT the one that starts with `sb_publishable_`
   - NOT the `service_role` key (that's secret!)

6. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://stboueshyjvooiftfuxm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-long-key-here
   ```

## 📸 What It Looks Like

In the Supabase dashboard, you'll see:

```
Project API keys

Project URL
https://stboueshyjvooiftfuxm.supabase.co

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Ym91ZXNoeWp2b29pZnRmdXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NjQwMDAsImV4cCI6MjAyNTQ0MDAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
👆 COPY THIS ONE (it's much longer than shown here)

service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
⚠️ DO NOT USE THIS ONE
```

## ✅ Quick Test

After updating `.env.local` with the correct key:

1. **Restart your dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Visit**: http://localhost:3000

3. **Try to sign up** - if it works, your key is correct!

## 🆘 Still Having Issues?

If you're not sure which key to use:

1. In Supabase dashboard → Settings → API
2. Take a screenshot of the "Project API keys" section (hide the service_role key)
3. Or just copy the entire key that's labeled **"anon public"**

The anon key is safe to expose in your frontend code - it's designed for that!
