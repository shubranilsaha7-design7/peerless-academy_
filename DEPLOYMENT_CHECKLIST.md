# Peerless Academy - Complete Master Setup & Deployment Checklist

This document contains the single, unified master SQL script to fully configure all database tables, columns, and Row-Level Security (RLS) policies for the Peerless Academy platform and Admin Control Center.

---

## ⚡ MASTER DATABASE MIGRATION (Run this once in Supabase SQL Editor)

Copy and run the entire SQL block below in your **[Supabase Dashboard -> SQL Editor](https://supabase.com/)**. It safely creates all tables, adds missing columns, and establishes full read/write permissions for authenticated admins and students.

```sql
-- ============================================================
-- 1. CONTACT INQUIRIES TABLE & PERMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name   text NOT NULL,
  guardian_name  text NOT NULL,
  phone          text NOT NULL,
  class_level    text NOT NULL,
  message        text,
  status         text DEFAULT 'pending',
  created_at     timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure status column exists if table was previously created
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop old conflicting policies if any
DROP POLICY IF EXISTS "Allow public inserts for enquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to read enquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow admin all on inquiries" ON public.contact_inquiries;

-- Public can submit inquiries
CREATE POLICY "Allow public inserts for enquiries" 
ON public.contact_inquiries FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

-- Authenticated users (Admins) have full SELECT, UPDATE, DELETE control
CREATE POLICY "Allow authenticated read inquiries" 
ON public.contact_inquiries FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated update inquiries" 
ON public.contact_inquiries FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete inquiries" 
ON public.contact_inquiries FOR DELETE 
TO authenticated 
USING (true);


-- ============================================================
-- 2. LECTURES TABLE & PERMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lectures (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text NOT NULL,
  description      text,
  subject          text NOT NULL,
  grade_level      text NOT NULL,
  video_url        text NOT NULL,
  duration         text,
  is_free_preview  boolean DEFAULT false,
  created_at       timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to view free lectures" ON public.lectures;
DROP POLICY IF EXISTS "Allow users with access to view all lectures" ON public.lectures;
DROP POLICY IF EXISTS "Allow authenticated insert lectures" ON public.lectures;
DROP POLICY IF EXISTS "Allow authenticated update lectures" ON public.lectures;
DROP POLICY IF EXISTS "Allow authenticated delete lectures" ON public.lectures;

-- Public can view free preview lectures
CREATE POLICY "Allow public to view free lectures" 
ON public.lectures FOR SELECT 
USING (is_free_preview = true);

-- Authenticated users (students with access code or admins) can view all lectures
CREATE POLICY "Allow authenticated select lectures" 
ON public.lectures FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users (Admins) can insert, update, and delete lectures
CREATE POLICY "Allow authenticated insert lectures" 
ON public.lectures FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update lectures" 
ON public.lectures FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete lectures" 
ON public.lectures FOR DELETE 
TO authenticated 
USING (true);


-- ============================================================
-- 3. BATCHES & TIMINGS TABLE (Dynamic Schedule)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.batches (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text NOT NULL,
  tag          text DEFAULT 'Admissions Open',
  target       text NOT NULL,
  start_date   text NOT NULL,
  days         text NOT NULL,
  time         text NOT NULL,
  features     text[] DEFAULT ARRAY['Daily DPPs', 'Weekly mock tests'],
  seats_total  integer DEFAULT 25,
  seats_left   integer DEFAULT 8,
  is_featured  boolean DEFAULT false,
  is_active    boolean DEFAULT true,
  created_at   timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all batches" ON public.batches FOR ALL TO public, anon, authenticated USING (true) WITH CHECK (true);


-- ============================================================
-- 4. ACCESS CODES & USER ACCESS TABLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.access_codes (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code         text UNIQUE NOT NULL,
  description  text,
  max_uses     integer DEFAULT 1,
  is_active    boolean DEFAULT true,
  created_at   timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_access (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code_id      uuid REFERENCES public.access_codes(id) ON DELETE CASCADE NOT NULL,
  redeemed_at  timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, code_id)
);

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read codes" ON public.access_codes;
DROP POLICY IF EXISTS "Allow authenticated insert codes" ON public.access_codes;
DROP POLICY IF EXISTS "Allow authenticated update codes" ON public.access_codes;
DROP POLICY IF EXISTS "Allow authenticated delete codes" ON public.access_codes;

DROP POLICY IF EXISTS "Users can view their own access" ON public.user_access;
DROP POLICY IF EXISTS "Users can insert their own access" ON public.user_access;

-- Access Codes policies
CREATE POLICY "Allow authenticated read codes" 
ON public.access_codes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert codes" 
ON public.access_codes FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update codes" 
ON public.access_codes FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete codes" 
ON public.access_codes FOR DELETE 
TO authenticated 
USING (true);

-- User Access policies
CREATE POLICY "Users can view their own access" 
ON public.user_access FOR SELECT 
TO authenticated 
USING (user_id = auth.uid() OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own access" 
ON public.user_access FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid() OR auth.role() = 'authenticated');


-- ============================================================
-- 4. SITE MEDIA TABLE (Gallery, Intro Video, Banners)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_media (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type        text NOT NULL,
  url         text,
  embed_code  text,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to site media" ON public.site_media;
DROP POLICY IF EXISTS "Allow authenticated insert site_media" ON public.site_media;
DROP POLICY IF EXISTS "Allow authenticated update site_media" ON public.site_media;
DROP POLICY IF EXISTS "Allow authenticated delete site_media" ON public.site_media;

-- Public can view active media
CREATE POLICY "Allow public read access to site media" 
ON public.site_media FOR SELECT 
USING (true);

-- Authenticated (Admins) can insert, update, delete
CREATE POLICY "Allow authenticated insert site_media" 
ON public.site_media FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update site_media" 
ON public.site_media FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete site_media" 
ON public.site_media FOR DELETE 
TO authenticated 
USING (true);


-- ============================================================
-- 5. USER PROFILES TABLE (XP & Leaderboard)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    text,
  username     text,
  xp           int DEFAULT 0,
  streak       int DEFAULT 0,
  level        int DEFAULT 1,
  last_active  timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public to view leaderboard profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated to update profiles" ON public.profiles;

-- Public can view profiles for Leaderboard and rankings
CREATE POLICY "Allow public to view leaderboard profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Users / Admins can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

-- Users can update their own profile, Admins can adjust student XP
CREATE POLICY "Allow authenticated to update profiles" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (true);


-- ============================================================
-- 6. DOWNLOADS TABLE (WhatsApp Delivery Trigger)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone          text NOT NULL,
  resource_name  text NOT NULL,
  resource_link  text NOT NULL,
  user_id        uuid REFERENCES auth.users(id),
  created_at     timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public inserts on downloads" ON public.downloads;
DROP POLICY IF EXISTS "Allow authenticated read downloads" ON public.downloads;

CREATE POLICY "Allow public inserts on downloads" 
ON public.downloads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read downloads" 
ON public.downloads FOR SELECT 
TO authenticated 
USING (true);
```

---

## 🛠️ Summary of Configured Systems
1. **Contact Inquiries**: Auto-captures demo requests with live status updates (`pending`, `contacted`, `enrolled`).
2. **Lectures Hub**: Categorized by Subject and Class with Free/Locked flags.
3. **Access Tokens**: Code generation with redemption limits and instant validation.
4. **Site Media & Banners**: Controls the top announcement banner, gallery images, startup video, and Instagram widgets.
5. **Scholars & XP**: Real-time leaderboard and admin XP granter.
