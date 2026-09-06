-- Phase 3 Gamification, Economy, and Community Schema

-- Extend User Profiles implicitly with a user_stats table to offload heavy real-time writes
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  elo_rating INT NOT NULL DEFAULT 1200,
  app_coins INT NOT NULL DEFAULT 100,
  current_streak INT NOT NULL DEFAULT 0,
  highest_streak INT NOT NULL DEFAULT 0,
  focus_minutes INT NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "stats_select_public" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "stats_update_own" ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "stats_insert_own" ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Squads (Study Guilds)
CREATE TABLE IF NOT EXISTS public.squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  total_elo INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.squad_members (
  squad_id UUID NOT NULL REFERENCES public.squads ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (squad_id, user_id)
);

-- Realtime Arena Matches (1v1)
CREATE TABLE IF NOT EXISTS public.arena_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID NOT NULL REFERENCES auth.users,
  player2_id UUID REFERENCES auth.users, -- can be null while seeking
  winner_id UUID REFERENCES auth.users,
  player1_score INT DEFAULT 0,
  player2_score INT DEFAULT 0,
  elo_exchanged INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'seeking', -- seeking, active, finished, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Doubt Bounties (Economy)
CREATE TABLE IF NOT EXISTS public.doubt_bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asker_id UUID NOT NULL REFERENCES auth.users,
  solver_id UUID REFERENCES auth.users,
  question_latex TEXT NOT NULL,
  bounty_coins INT NOT NULL DEFAULT 50,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SM-2 Flashcards
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  front_latex TEXT NOT NULL,
  back_latex TEXT NOT NULL,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval INT NOT NULL DEFAULT 0,
  repetitions INT NOT NULL DEFAULT 0,
  next_review_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_flashcards_review ON public.flashcards USING btree (user_id, next_review_date);

-- Error Taxonomy Tags
CREATE TABLE IF NOT EXISTS public.error_taxonomy_tags (
  attempt_id UUID NOT NULL REFERENCES public.question_attempts ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  tag_name TEXT NOT NULL, -- e.g., 'Calculation Slip', 'Concept Gap'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id, tag_name)
);

-- Broadcast functionality for realtime matching
ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_matches;
