CREATE INDEX IF NOT EXISTS idx_cbt_questions_compound ON public.cbt_questions USING btree (exam_type, subject, chapter, difficulty);
