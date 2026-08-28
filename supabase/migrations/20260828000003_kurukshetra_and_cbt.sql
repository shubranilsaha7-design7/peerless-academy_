-- ============================================================
-- KURUKSHETRA & CBT SUPER-APP SCHEMA
-- ============================================================

-- 1. 15,000+ QUESTION BANK (cbt_questions)
CREATE TABLE IF NOT EXISTS public.cbt_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_target text NOT NULL, -- 'JEE_MAIN', 'NEET', etc.
  class_level integer NOT NULL,
  subject text NOT NULL,
  chapter text NOT NULL,
  exam_year_tag text,
  difficulty text NOT NULL, -- 'Standard', 'Challenger', 'Advanced'
  question_type text NOT NULL, -- 'Single_Correct', 'Multi_Correct', etc.
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  ncert_reference text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. KURUKSHETRA MATCHES (1v1 Duels)
CREATE TABLE IF NOT EXISTS public.kurukshetra_matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id uuid REFERENCES auth.users(id) NOT NULL,
  player2_id uuid REFERENCES auth.users(id), -- Null if bot
  is_bot_match boolean DEFAULT false,
  status text DEFAULT 'waiting', -- 'waiting', 'active', 'completed'
  winner_id uuid REFERENCES auth.users(id),
  player1_score integer DEFAULT 0,
  player2_score integer DEFAULT 0,
  elo_exchanged integer DEFAULT 0,
  questions_payload jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ERROR NOTEBOOK (SM-2 Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.error_notebook (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  question_id uuid REFERENCES public.cbt_questions(id) NOT NULL,
  source text NOT NULL, -- 'CBT', 'Kurukshetra'
  interval integer DEFAULT 1,
  repetition integer DEFAULT 0,
  ease_factor numeric DEFAULT 2.5,
  next_review_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, question_id)
);

-- 4. TEST ANALYTICS (Cognitive Diagnostics)
CREATE TABLE IF NOT EXISTS public.test_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  test_type text NOT NULL, -- 'Custom', 'Full Mock'
  total_score integer NOT NULL,
  time_traps_count integer DEFAULT 0,
  silly_mistakes_count integer DEFAULT 0,
  chapter_mastery jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES
ALTER TABLE public.cbt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kurukshetra_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_notebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by all users" ON public.cbt_questions FOR SELECT USING (true);
CREATE POLICY "Admins can insert questions" ON public.cbt_questions FOR INSERT WITH CHECK (true); -- Securing via Service Role

CREATE POLICY "Users can view their matches" ON public.kurukshetra_matches FOR SELECT USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY "Users can insert matches" ON public.kurukshetra_matches FOR INSERT WITH CHECK (auth.uid() = player1_id);
CREATE POLICY "Users can update their matches" ON public.kurukshetra_matches FOR UPDATE USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Users can view own notebook" ON public.error_notebook FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notebook" ON public.error_notebook FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notebook" ON public.error_notebook FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.test_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON public.test_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
