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

import { GoogleGenerativeAI } from '@google/generative-ai';

/** Asks the AI doubt solver using the Vercel API route, with client-side fallback. */
export async function askDoubtSolver(question: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
        systemPrompt: "You are an expert AI tutor at Peerless Academy. Keep answers concise, clear, and focused on helping the student understand the core concept.",
        modelTier: "gemini-2.5-flash"
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.reply) return data.reply;
    }
  } catch (err) {
    console.warn("Backend API route failed, falling back to client-side SDK...");
  }

  // Fallback to direct client-side call if backend route is unreachable (e.g. Vercel config issues)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6IMIMPGsZDc_dKFiz8-pQP_DX-yzAwu2x1XdobUYwf-ng";
  if (!apiKey) throw new Error("Missing Gemini API Key in environment.");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are an expert AI tutor at Peerless Academy. Keep answers concise, clear, and focused on helping the student understand the core concept."
  });

  const result = await model.generateContent(question);
  return result.response.text();
}
