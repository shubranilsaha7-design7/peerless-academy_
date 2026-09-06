-- Phase 4: Batch Ecosystem & Admin Command Center Schema

-- 1. Batches & Cohorts
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  target_exam TEXT,
  target_year INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.batch_enrollments (
  batch_id UUID REFERENCES public.batches ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (batch_id, user_id)
);

-- 2. Drip Content Modules
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'video', 'pdf', 'quiz'
  url TEXT,
  unlock_date TIMESTAMPTZ NOT NULL,
  is_locked BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb, -- e.g., timestamp quizzes for videos
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Proctoring & Anti-Cheat Telemetry
CREATE TABLE IF NOT EXISTS public.proctoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  session_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'blur', 'visibility_hidden', 'copy', 'paste'
  event_timestamp TIMESTAMPTZ DEFAULT now(),
  severity TEXT DEFAULT 'low' -- 'low', 'medium', 'high'
);

-- 4. Video Retention Analytics
CREATE TABLE IF NOT EXISTS public.video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  module_id UUID NOT NULL REFERENCES public.course_modules,
  max_watched_seconds INT DEFAULT 0,
  drop_off_seconds INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Dynamic Scholarships & Coupons
CREATE TABLE IF NOT EXISTS public.scholarship_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INT NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  required_elo INT DEFAULT 0,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. AI Token Tracking
CREATE TABLE IF NOT EXISTS public.ai_token_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  tokens_used INT NOT NULL,
  model TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extend User Profiles for Parent Telemetry & AI Rate Limiting
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS parent_contact TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_rate_limited BOOLEAN DEFAULT false;
