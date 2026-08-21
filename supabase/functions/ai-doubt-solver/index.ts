import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { streamText } from 'npm:ai';
import { createOpenAICompatible } from 'npm:@ai-sdk/openai-compatible';

const SYSTEM = `You are the Peerless Academy AI Doubt Solver, helping Class 5-12, NEET and JEE aspirants in Agartala, Tripura.
Rules:
- Answer Physics, Chemistry, Maths and Biology doubts step by step, short and exam-focused.
- For questions about fees, batches, admissions or timings, say a mentor will confirm details on WhatsApp (+91 87941 30855).
- Keep answers under 180 words. Use simple language and plain-text math.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) {
      return new Response(JSON.stringify({ error: 'AI is not configured yet.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (!question || question.length > 2000) {
      return new Response(JSON.stringify({ error: 'Please send a question between 1 and 2000 characters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const gateway = createOpenAICompatible({
      name: 'lovable',
      baseURL: 'https://ai.gateway.lovable.dev/v1',
      headers: { 'Lovable-API-Key': key, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
    });

    const result = streamText({
      model: gateway('google/gemini-2.5-flash'),
      system: SYSTEM,
      prompt: question,
    });

    const answer = await result.text;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    const status = /402|credit/i.test(message) ? 402 : /429/.test(message) ? 429 : 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
