# Supabase Edge Function Deployment Guide

## Prerequisites

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   You can find your project reference in your Supabase Dashboard under **Project Settings → General**

## Deploy the Edge Function

Deploy the `manage-linked-admins` function to enable admin email management:

```bash
supabase functions deploy manage-linked-admins --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference (e.g., `oqvervtlweduaasgjhmx`).

## Configure Environment Variables (Secrets)

The Edge Function needs the following secrets to work properly:

```bash
supabase secrets set \
  HOST_ADMIN_EMAIL=tumainicomprehensive@gmail.com \
  SITE_URL=http://localhost:5174 \
  PUBLIC_SUPABASE_KEY=YOUR_ANON_KEY \
  SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY \
  --project-ref YOUR_PROJECT_REF
```

### Where to find these values:

1. **HOST_ADMIN_EMAIL**: Already configured in `.env.local` - `tumainicomprehensive@gmail.com`

2. **SITE_URL**: 
   - For local development: `http://localhost:5174`
   - For production: Your deployed app URL (e.g., `https://your-app.vercel.app`)

3. **PUBLIC_SUPABASE_KEY** (Anon Key): 
   - Go to Supabase Dashboard → **Project Settings → API**
   - Copy the `anon` `public` key
   - It's also in your `.env.local` file as `VITE_SUPABASE_ANON_KEY`

4. **SUPABASE_SERVICE_ROLE_KEY**:
   - Go to Supabase Dashboard → **Project Settings → API**
   - Copy the `service_role` `secret` key
   - ⚠️ **NEVER** commit this key to your repository
   - ⚠️ **NEVER** add it to a `VITE_` environment variable

## Configure Auth Redirect URLs

Add the following URLs to your Supabase Auth allowed redirect list:

1. Go to Supabase Dashboard → **Authentication → URL Configuration**
2. Add these to **Redirect URLs**:
   - `http://localhost:5174/?set-password=1` (for local development)
   - `https://your-production-url/?set-password=1` (for production)

## Verify Deployment

After deployment, refresh the "Linked Admin Emails" section in the Settings page. If everything is configured correctly:

- You should see any existing linked admins
- The error message should disappear
- You can authorize new staff members by entering their name and email

## Troubleshooting

### "Could not load linked email access"

This means either:
1. The Edge Function is not deployed yet - run the deployment command above
2. The secrets are not configured - set them using the `supabase secrets set` command
3. The project reference is incorrect - verify it in Project Settings

### "Authentication is required"

Make sure you're signed in with the host admin email (`tumainicomprehensive@gmail.com`)

### "Only the configured host email can manage linked admins"

The `HOST_ADMIN_EMAIL` secret must match your current logged-in email exactly.

### Check Function Logs

View function logs in Supabase Dashboard:
1. Go to **Edge Functions → manage-linked-admins**
2. Click on **Logs** tab
3. Look for any error messages

## Database Setup

Make sure the `admin_users` table exists in your Supabase database:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run the migrations in `supabase/migrations/` if not already applied
3. Or use: `supabase db push` from your project directory

## Quick Commands Reference

```bash
# Link project (one time)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy manage-linked-admins

# Set secrets
supabase secrets set KEY=VALUE --project-ref YOUR_PROJECT_REF

# View secrets (masked)
supabase secrets list --project-ref YOUR_PROJECT_REF

# View function logs
supabase functions logs manage-linked-admins --project-ref YOUR_PROJECT_REF
```

## Production Deployment

For production:

1. Update `SITE_URL` secret to your production URL
2. Add production URL to Auth redirect allowlist
3. Ensure the host admin email has an active row in `admin_users` table
4. Deploy the function to production project reference

## Security Notes

- The `service_role` key has admin privileges - keep it secret
- Only the host email can manage linked admins
- All admin emails must be explicitly authorized
- Invited admins set their own passwords via secure email links
- Passwords are never created or sent by the host
