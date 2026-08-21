import { supabase } from '@/integrations/supabase/client';

type SubmissionPayload = {
  score: number;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  timeSpentSeconds: number;
  details?: unknown;
};

/** Saves a mock-exam result for the signed-in student. No-ops for guests. */
export async function saveTestSubmission(payload: SubmissionPayload) {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return { saved: false as const };

    const { error } = await supabase.from('test_submissions').insert({
      user_id: user.id,
      exam_type: 'mock',
      score: payload.score,
      total: payload.total,
      correct: payload.correct,
      wrong: payload.wrong,
      skipped: payload.skipped,
      time_spent_seconds: payload.timeSpentSeconds,
      details: (payload.details ?? {}) as never,
    } as never);
    if (error) throw error;
    return { saved: true as const };
  } catch {
    return { saved: false as const };
  }
}

/** Adds XP to the signed-in student's profile. No-ops for guests. */
export async function addProfileXp(amount: number) {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .maybeSingle();
    const current = (profile as { xp?: number } | null)?.xp ?? 0;
    await supabase
      .from('profiles')
      .update({ xp: current + amount } as never)
      .eq('id', user.id);
  } catch {
    /* offline-first: local XP still applies */
  }
}

/** Asks the AI doubt solver edge function. Throws with a readable message. */
export async function askDoubtSolver(question: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ answer?: string; error?: string }>(
    'ai-doubt-solver',
    { body: { question } },
  );
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  if (!data?.answer) throw new Error('The AI returned an empty answer.');
  return data.answer;
}
