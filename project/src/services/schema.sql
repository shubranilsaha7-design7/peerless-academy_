-- ============================================================
-- PEERLESS ACADEMY — SUPABASE DATABASE SCHEMA
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. QUESTIONS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text        text NOT NULL,
  options              jsonb NOT NULL,            -- string[]
  correct_option_index int  NOT NULL,
  explanation          text,
  subject              text NOT NULL CHECK (subject IN ('Physics','Chemistry','Maths','Biology')),
  class_level          int  NOT NULL CHECK (class_level BETWEEN 7 AND 12),
  exam_type            text NOT NULL CHECK (exam_type IN ('NCERT','JEE','NEET','General')),
  difficulty           text NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy','Medium','Hard')),
  created_at           timestamptz DEFAULT now()
);

-- Covering indexes for fast filter queries
CREATE INDEX IF NOT EXISTS idx_q_class        ON questions (class_level);
CREATE INDEX IF NOT EXISTS idx_q_exam         ON questions (exam_type);
CREATE INDEX IF NOT EXISTS idx_q_subject      ON questions (subject);
CREATE INDEX IF NOT EXISTS idx_q_composite    ON questions (subject, class_level, exam_type);
CREATE INDEX IF NOT EXISTS idx_q_difficulty   ON questions (difficulty);

-- RLS: anyone (anon or authenticated) can read questions
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read questions"  ON questions FOR SELECT USING (true);
CREATE POLICY "auth insert questions"  ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ── 2. USER PROFILES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text,
  xp         int DEFAULT 0,
  streak     int DEFAULT 0,
  level      int DEFAULT 1,
  last_active timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE  USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT  WITH CHECK (auth.uid() = id);

-- ── 3. ARENA MATCHES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS arena_matches (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id      uuid REFERENCES auth.users(id),
  player2_id      uuid REFERENCES auth.users(id),    -- NULL = AI Ghost
  status          text DEFAULT 'waiting'  CHECK (status IN ('waiting','active','completed','abandoned')),
  player1_score   int DEFAULT 0,
  player2_score   int DEFAULT 0,
  question_ids    jsonb,                              -- uuid[]
  round_results   jsonb,                              -- per-round data
  winner_id       uuid REFERENCES auth.users(id),    -- NULL = AI won / draw
  is_ai_match     boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  completed_at    timestamptz
);

-- Indexes for lobby queries
CREATE INDEX IF NOT EXISTS idx_match_status     ON arena_matches (status);
CREATE INDEX IF NOT EXISTS idx_match_player1    ON arena_matches (player1_id);
CREATE INDEX IF NOT EXISTS idx_match_player2    ON arena_matches (player2_id);
CREATE INDEX IF NOT EXISTS idx_match_waiting    ON arena_matches (status, created_at) WHERE status = 'waiting';

-- RLS: players can only see/modify their own matches
ALTER TABLE arena_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their matches" ON arena_matches
  FOR SELECT USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Player1 can create match" ON arena_matches
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their matches" ON arena_matches
  FOR UPDATE USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- ── 4. REAL-TIME PUBLICATION ────────────────────────────────
-- Enable Supabase Realtime on arena_matches
ALTER PUBLICATION supabase_realtime ADD TABLE arena_matches;

-- ── 5. HELPER: auto-update profile on new user ──────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 6. CONTACT INQUIRIES TABLE ─────────────────────────────
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name   text NOT NULL,
  guardian_name  text NOT NULL,
  phone          text NOT NULL,
  class_level    text NOT NULL,
  message        text,
  created_at     timestamptz DEFAULT now()
);

-- RLS for contact inquiries (public can insert, only authenticated can select)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view inquiries" ON contact_inquiries FOR SELECT USING (auth.role() = 'authenticated');

-- ── 7. VIDEO LECTURES TABLE ─────────────────────────────
CREATE TABLE IF NOT EXISTS video_lectures (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  subject     text NOT NULL CHECK (subject IN ('Physics','Chemistry','Biology','Maths')),
  chapter     text NOT NULL,
  video_url   text NOT NULL,
  duration    int DEFAULT 0, -- in minutes
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE video_lectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read video lectures" ON video_lectures FOR SELECT USING (true);
CREATE POLICY "Admins can insert video lectures" ON video_lectures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
