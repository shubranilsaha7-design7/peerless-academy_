-- Phase 2 CBT Adaptive Engine Schema

-- Table for actual CBT/PYQ Questions (if it doesn't already exist or to ensure schema match)
CREATE TABLE IF NOT EXISTS public.cbt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type TEXT NOT NULL, -- 'JEE Main', 'JEE Advanced', 'NEET'
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  question_latex TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of strings (LaTeX)
  correct_index INT NOT NULL,
  explanation_latex TEXT,
  year INT,
  shift TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure RLS is active
ALTER TABLE public.cbt_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "cbt_public_read" ON public.cbt_questions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "cbt_admin_write" ON public.cbt_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Table for Granular Question Attempts (NTA Tracking)
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(), -- Groups attempts in a single test session
  question_id UUID NOT NULL REFERENCES public.cbt_questions ON DELETE CASCADE,
  selected_index INT, -- NULL if skipped
  is_correct BOOLEAN NOT NULL DEFAULT false,
  time_spent_ms INT NOT NULL DEFAULT 0,
  is_guessed BOOLEAN NOT NULL DEFAULT false, -- flagged if correct and time < 5000ms
  is_time_sink BOOLEAN NOT NULL DEFAULT false, -- flagged if incorrect and time > 180000ms
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for attempts
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "qa_select_own" ON public.question_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "qa_insert_own" ON public.question_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Specialized View for the Error Log (Deep Diagnostics)
CREATE OR REPLACE VIEW public.error_log AS
SELECT 
  qa.user_id,
  q.subject,
  q.chapter,
  COUNT(*) as mistake_count,
  MAX(qa.created_at) as last_mistake_at
FROM public.question_attempts qa
JOIN public.cbt_questions q ON q.id = qa.question_id
WHERE qa.is_correct = false AND qa.selected_index IS NOT NULL
GROUP BY qa.user_id, q.subject, q.chapter;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_session ON public.question_attempts USING btree (user_id, session_id);
