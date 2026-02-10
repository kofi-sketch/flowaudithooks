# Deployment Guide

This guide will walk you through deploying the Hook Tester application to Vercel.

## Prerequisites

- [ ] Project is working locally
- [ ] Supabase project is set up
- [ ] Code is pushed to GitHub
- [ ] You have a Vercel account (free tier works)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Initial commit - Hook Tester app"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### 3. Add Environment Variables

In the Vercel project settings, add these environment variables:

| Name | Value | Where to Find |
|------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Supabase → Project Settings → API → anon/public key |

**Important**: Make sure to use the `anon` key, NOT the `service_role` key!

### 4. Deploy

1. Click **Deploy**
2. Wait for the build to complete (~2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

### 5. Configure Supabase for Production

Update Supabase authentication settings:

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URLs:

   **Site URL**: `https://your-project-name.vercel.app`

   **Redirect URLs** (add all of these):
   - `https://your-project-name.vercel.app`
   - `https://your-project-name.vercel.app/login`
   - `https://your-project-name.vercel.app/test`
   - `https://your-project-name.vercel.app/admin`

4. Click **Save**

### 6. Test Your Deployment

Visit your deployed app and verify:

- [ ] Homepage loads and redirects to `/test`
- [ ] Can access `/login` page
- [ ] Can sign up for an account
- [ ] Can sign in
- [ ] First user becomes admin
- [ ] Can access admin dashboard
- [ ] Can add hooks
- [ ] Can vote on hooks
- [ ] Stats update correctly

## Custom Domain (Optional)

### Add a Custom Domain

1. In Vercel project settings, go to **Domains**
2. Add your domain (e.g., `hooks.yourdomain.com`)
3. Follow Vercel's DNS configuration instructions
4. Update Supabase redirect URLs to include your custom domain

## Environment Management

### Different Environments

You can have different environments:

- **Production**: Your main deployment
- **Preview**: Automatic deployments for pull requests
- **Development**: Local development

### Environment Variables per Environment

In Vercel, you can set different environment variables for:
- Production
- Preview
- Development

This allows you to use different Supabase projects for testing vs production.

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to main**: Deploys to production
- **Push to other branches**: Creates preview deployments
- **Pull requests**: Creates preview deployments

## Monitoring

### Check Deployment Status

1. Go to Vercel dashboard
2. Click on your project
3. View **Deployments** tab

### View Logs

1. Click on a deployment
2. View **Build Logs** and **Function Logs**

### Analytics

Vercel provides basic analytics:
- Page views
- Top pages
- Unique visitors

Enable in: Project Settings → Analytics

## Rollback

If something goes wrong:

1. Go to **Deployments** in Vercel
2. Find a previous working deployment
3. Click **⋯** → **Promote to Production**

## Security Checklist

Before going live:

- [ ] Environment variables are set correctly
- [ ] Using `anon` key (not `service_role` key)
- [ ] Supabase RLS policies are enabled
- [ ] Email confirmation is configured (optional)
- [ ] Rate limiting is considered (via Supabase settings)

## Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For additional optimization:

1. Use Next.js Image component for images
2. Implement static generation where possible
3. Use server-side caching for hooks data

### Database Performance

1. In Supabase, check **Database** → **Performance**
2. Monitor query performance
3. Add indexes if needed (already included in migration)

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check all imports are correct
- Verify all dependencies are in `package.json`
- Try building locally first

**Error: Environment variables not found**
- Add them in Vercel project settings
- Redeploy after adding environment variables

### Authentication Issues

**Error: Invalid API key**
- Verify you're using the `anon` key
- Check for typos in environment variables
- Make sure keys are from the correct Supabase project

**Error: Redirect URL not allowed**
- Add your Vercel URL to Supabase redirect URLs
- Include all possible paths (`/login`, `/test`, etc.)

### Runtime Errors

**Error: Failed to fetch**
- Check Supabase URL is correct
- Verify database migration was run
- Check Supabase project is running

**Error: Middleware redirect loop**
- Verify `users` table exists in Supabase
- Check RLS policies are correct
- Clear browser cookies and try again

## Maintenance

### Regular Tasks

- Monitor Supabase usage (check dashboard)
- Review flagged hooks periodically
- Check Vercel analytics
- Update dependencies: `npm update`

### Database Backups

Supabase automatically backs up your database:
- Go to **Database** → **Backups**
- Can restore from any backup point

### Updates

To update your deployment:

1. Make changes locally
2. Test thoroughly
3. Push to GitHub
4. Vercel automatically deploys
5. Verify in production

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

## Cost Estimation

### Free Tier (Suitable for Testing)

**Vercel Free Tier includes:**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function executions

**Supabase Free Tier includes:**
- 500 MB database storage
- 50,000 monthly active users
- 2 GB bandwidth/month

### Scaling Considerations

**When to upgrade:**
- More than 50,000 monthly active users
- Need more database storage
- Need custom domains without "vercel.app"
- Need team collaboration features

Typical costs for small-medium usage:
- Vercel Pro: $20/month
- Supabase Pro: $25/month

## Next Steps

After deployment:

1. Share the link with your team
2. Add sample hooks
3. Start collecting votes
4. Monitor the admin dashboard
5. Review and optimize based on data

🎉 **Congratulations! Your Hook Tester is now live!**
