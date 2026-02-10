# 🚀 Run Database Migration - Step by Step

## ✅ Your Configuration is Ready!

- **Supabase URL**: `https://stboueshyjvooiftfuxm.supabase.co`
- **Anon Key**: Updated in `.env.local` ✓

---

## 📊 Step 1: Go to Supabase SQL Editor

**Click this link**: https://supabase.com/dashboard/project/stboueshyjvooiftfuxm/sql/new

---

## 📋 Step 2: Copy the SQL Code

The migration file is located at:
```
/Users/AIAgenterminal/hook-tester/supabase/migrations/001_initial_schema.sql
```

**You can either:**

### Option A: Open the file and copy it
1. Open Finder
2. Navigate to: `/Users/AIAgenterminal/hook-tester/supabase/migrations/`
3. Open `001_initial_schema.sql` with a text editor
4. Select All (Cmd+A) and Copy (Cmd+C)

### Option B: Use Terminal to copy
```bash
cat /Users/AIAgenterminal/hook-tester/supabase/migrations/001_initial_schema.sql | pbcopy
```
This copies the entire file to your clipboard!

---

## 📝 Step 3: Paste and Run in Supabase

1. Go back to the Supabase SQL Editor tab
2. **Paste** the SQL code (Cmd+V)
3. Click the **RUN** button (or press Cmd+Enter)
4. Wait for the success message: "Success. No rows returned"

---

## ✅ Step 4: Verify Tables Were Created

1. In Supabase dashboard, click **Table Editor** (table icon) in the left sidebar
2. You should see these new tables:
   - ✅ `users`
   - ✅ `hooks`
   - ✅ `votes`

---

## 🎯 Step 5: Test Your App!

Now you can start the app:

```bash
cd /Users/AIAgenterminal/hook-tester
npm run dev
```

Visit: http://localhost:3000

**Then:**
1. Click "Sign In" → "Sign up"
2. Create your account (you'll become the admin!)
3. Go to Admin Dashboard
4. Add your first hook
5. Test voting!

---

## 🎉 You're All Set!

Once the migration runs successfully, your database is ready and you can:
- ✅ Sign up users
- ✅ Add hooks
- ✅ Collect votes
- ✅ Track performance

---

## 🆘 If You See Errors

### "relation already exists"
- Tables were already created
- You're good to go! Skip to Step 5

### "permission denied"
- Make sure you're logged into the correct Supabase project
- Check you're on: https://supabase.com/dashboard/project/stboueshyjvooiftfuxm

### Other errors
- Copy the error message
- Check the line number where it failed
- Make sure you copied the ENTIRE SQL file (273 lines)

---

**Need the SQL code quickly?** Run this in terminal:
```bash
cat /Users/AIAgenterminal/hook-tester/supabase/migrations/001_initial_schema.sql | pbcopy
```
Then paste in Supabase SQL Editor!
