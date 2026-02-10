# Hook Tester & Randomizer

A powerful web application to test and optimize marketing hooks through systematic feedback collection and performance analytics.

## Features

- 🎯 **Random Hook Testing**: Display hooks randomly to avoid bias
- 📊 **Performance Metrics**: Track votes, success rates, and engagement
- 🚩 **Auto-Flagging**: Automatically flag poor performers (<40% after 10+ votes)
- 👤 **First-User Admin**: First signup automatically becomes admin
- 🔐 **Secure Authentication**: Email/password auth with Supabase
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- ⚡ **Real-time Updates**: Instant feedback after each vote

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- npm or yarn

### 1. Clone and Install

```bash
cd hook-tester
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in the Supabase dashboard
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor
5. Verify the tables were created in the **Table Editor**

### 3. Configure Environment Variables

1. Get your Supabase credentials:
   - Go to **Project Settings** → **API**
   - Copy the **Project URL** and **anon/public key**

2. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First Time Setup

1. **Sign Up**: Navigate to `/login` and create an account
   - The first user automatically becomes the admin
   - Subsequent users are regular users

2. **Add Hooks**: As admin, go to the admin dashboard and add your marketing hooks

3. **Test Hooks**: Open `/test` (or the homepage) to start testing hooks

### For Testers (Public Interface)

- Visit `/test` to see random hooks
- Click **"Worked!"** (green) if the hook caught your attention
- Click **"Didn't Work"** (red) if it felt weak
- Click **"Save for Later"** (star) to bookmark without voting
- Click **"Skip"** to see another hook without voting

### For Admins

Access the admin dashboard at `/admin`:

- **View All Hooks**: See complete stats for every hook
- **Add New Hooks**: Create hooks to test
- **Flagged Hooks**: Review poorly performing hooks
- **Sort & Filter**: Click column headers to sort by any metric

#### Auto-Flagging System

Hooks are automatically flagged when:
- They have **10 or more votes** AND
- Success rate is **below 40%**

Flagged hooks appear in the "Flagged Hooks" view for review.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

### Configure Supabase for Production

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your Vercel domain to **Site URL** and **Redirect URLs**:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/login`

## Project Structure

```
hook-tester/
├── app/
│   ├── (auth)/login/          # Login/signup page
│   ├── (dashboard)/admin/     # Admin dashboard (protected)
│   ├── test/                  # Public testing interface
│   └── layout.tsx             # Root layout
├── components/
│   ├── hooks/
│   │   ├── hook-card.tsx      # Voting UI component
│   │   └── hook-stats-table.tsx # Admin table view
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── actions/               # Server Actions
│   │   ├── auth.ts
│   │   ├── hooks.ts
│   │   └── votes.ts
│   ├── supabase/              # Supabase clients
│   │   ├── client.ts
│   │   └── server.ts
│   ├── types/
│   │   └── database.ts        # TypeScript types
│   └── utils/
│       └── session.ts         # Session management
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
└── middleware.ts              # Route protection
```

## Database Schema

### Tables

- **users**: User profiles with admin flag
- **hooks**: Marketing hooks with performance metrics
- **votes**: Vote history for audit trail

### Key Features

- **Row Level Security (RLS)**: Enforces admin-only writes
- **Auto-calculated metrics**: Green percentage computed automatically
- **Triggers**: Update stats on each vote
- **Functions**: Random hook selection, stat updates, flagging logic

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Testing Checklist

- [ ] First user becomes admin
- [ ] Second user does NOT become admin
- [ ] Random hook function returns different hooks
- [ ] Voting updates stats in real-time
- [ ] Same hook doesn't repeat in short sequence
- [ ] Hooks get flagged after 10 votes with <40% green
- [ ] Admin can add/delete hooks
- [ ] Non-admin users cannot access `/admin`
- [ ] Mobile-responsive design works

## Troubleshooting

### "No hooks available" message

- Make sure you've run the database migration
- Add at least one hook via the admin dashboard

### Authentication not working

- Verify environment variables are set correctly
- Check Supabase URL configuration matches your domain
- Ensure you're using the correct anon key (not the service role key)

### Middleware redirect loop

- Check that your Supabase project URL is correct
- Verify the database migration created the `users` table
- Make sure RLS policies are enabled

## Future Enhancements

- [ ] Analytics dashboard with charts
- [ ] Hook categories/tags
- [ ] A/B testing (compare hook variants)
- [ ] Export data to CSV
- [ ] Edit existing hooks
- [ ] Real-time updates with Supabase Realtime
- [ ] AI-powered hook suggestions

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
