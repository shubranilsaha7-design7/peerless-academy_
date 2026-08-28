-- ============================================================
-- VIDEO CMS & AI AGENT SCHEMA
-- ============================================================

-- 1. COURSE MODULES (Video CMS)
CREATE TABLE IF NOT EXISTS public.course_modules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id text DEFAULT 'DEFAULT_BATCH',
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PLATFORM SETTINGS (AI Config)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id text PRIMARY KEY DEFAULT 'GLOBAL',
  ai_name text DEFAULT 'Elite AI Mentor',
  ai_greeting text DEFAULT 'Hello! I am your AI Mentor. How can I help you today?',
  system_prompt text DEFAULT 'You are an elite educational AI mentor. Provide concise, helpful answers.',
  model_tier text DEFAULT 'gemini-1.5-pro',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules viewable by all" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Admins can insert modules" ON public.course_modules FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update modules" ON public.course_modules FOR UPDATE USING (true);

CREATE POLICY "Settings viewable by all" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.platform_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update settings" ON public.platform_settings FOR UPDATE USING (true);

-- INITIAL SEED
INSERT INTO public.platform_settings (id, ai_name, ai_greeting, system_prompt, model_tier)
VALUES ('GLOBAL', 'Elite AI Mentor', 'Hello! I am your AI Mentor. How can I help you today?', 'You are an elite educational AI mentor. Provide concise, helpful answers.', 'gemini-1.5-pro')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_modules (title, description, video_url)
VALUES ('Welcome to Peerless Academy', 'Getting started with your journey.', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
ON CONFLICT DO NOTHING;
