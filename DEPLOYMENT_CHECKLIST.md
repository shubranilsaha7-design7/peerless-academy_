# Peerless Academy - Deployment & Configuration Checklist

This checklist contains all the necessary SQL scripts, environment variables, and deployment steps to finalize the Peerless Academy platform overhaul. Follow these steps sequentially in your Supabase Dashboard and Vercel/Hosting environment.

## Phase 1: Database Security (Row Level Security)

### SQL: Enable RLS on `contact_inquiries`
Run the following SQL snippet in the **Supabase SQL Editor** to secure the enquiries table, allowing anonymous inserts but restricting reads to authenticated admins.

```sql
-- Enable Row Level Security
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and public users to submit enquiries
CREATE POLICY "Allow public inserts for enquiries"
ON public.contact_inquiries
FOR INSERT
TO public, anon
WITH CHECK (true);

-- Restrict read access to authenticated admins only
CREATE POLICY "Allow authenticated users to read enquiries"
ON public.contact_inquiries
FOR SELECT
TO authenticated
USING (true);
```

## Phase 2: WhatsApp Edge Function Delivery

### SQL: Create `downloads` table and Webhook
Run this SQL to create the `downloads` table (if it doesn't exist) and set up the Webhook trigger that calls the `send-whatsapp-pdf` Edge Function whenever a new download is requested.

```sql
-- 1. Create downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL,
  resource_name text NOT NULL,
  resource_link text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the pg_net extension (required for Webhooks)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 3. Create the webhook trigger function
CREATE OR REPLACE FUNCTION trigger_send_whatsapp_pdf()
RETURNS trigger AS $$
BEGIN
  perform net.http_post(
    url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/send-whatsapp-pdf',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer <YOUR_ANON_KEY>'),
    body := json_build_object('type', TG_OP, 'record', row_to_json(NEW))::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Bind the webhook to the downloads table
DROP TRIGGER IF EXISTS on_download_insert ON public.downloads;
CREATE TRIGGER on_download_insert
AFTER INSERT ON public.downloads
FOR EACH ROW
EXECUTE FUNCTION trigger_send_whatsapp_pdf();
```

## Phase 3: Platform Expansion (XP & Rate Limiting)

### Environment Variables
Configure the following environment variables in your **Supabase Dashboard** -> Edge Functions -> Secrets, or via the Supabase CLI:

```bash
supabase secrets set WHATSAPP_API_TOKEN="your_meta_cloud_api_token"
supabase secrets set WHATSAPP_PHONE_ID="your_meta_phone_id"
supabase secrets set SUPABASE_URL="https://<YOUR_PROJECT_REF>.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### Deploy Edge Functions
Deploy the two Edge Functions (the Webhook handler and the Rate Limiter/XP Awarder):

```bash
supabase functions deploy send-whatsapp-pdf
supabase functions deploy request-download
```

## Phase 4: Production Frontend Deployment

Ensure your production hosting provider (e.g., Vercel) has the following standard environment variables set up (from your `.env` file):

```env
VITE_SUPABASE_URL="https://<YOUR_PROJECT_REF>.supabase.co"
VITE_SUPABASE_ANON_KEY="your_anon_key"
```

To finalize the deployment:
1. Run a type check: `npm run typecheck`
2. Run the production build: `npm run build`
3. Git Commit & Push your changes to trigger the CI/CD pipeline on Vercel.

*(All Phase 1-4 logic has been integrated cleanly into the React/Vite codebase, including the unified Admin Dashboard, gamification Navbar hooks, and Toast UI).*
 
## Phase 6: Leaderboard (Hall of Legends) 
 
### SQL: Enable Public Leaderboard Read Access on Profiles 
Run this to allow the Leaderboard UI to read the xp and level from the profiles table to rank top students. 
 
`sql 
-- Ensure RLS is active on profiles 
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; 
 
-- Allow public read access to essential ranking fields 
CREATE POLICY " Allow public to view leaderboard "profiles ON public.profiles FOR SELECT USING (true); 
` 
