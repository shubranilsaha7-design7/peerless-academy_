import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SYSTEM = `You are the Peerless Academy AI Doubt Solver, helping Class 5-12, NEET and JEE aspirants in Agartala, Tripura.
Rules:
- Answer Physics, Chemistry, Maths and Biology doubts step by step, short and exam-focused.
- When a formula matters, put it on its own line prefixed with "FORMULA:" so the app can highlight it.
- For questions about fees, batches, admissions or timings, say a mentor will confirm details on WhatsApp (+91 87941 30855).
- Keep answers under 220 words. Use simple language and plain-text math.`;

type Block = Record<string, unknown>;

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
    const image = typeof body?.image === 'string' && body.image.startsWith('data:image/') ? body.image : null;
    const history = Array.isArray(body?.history) ? body.history.slice(-10) : [];

    if ((!question && !image) || question.length > 4000) {
      return new Response(JSON.stringify({ error: 'Please send a question between 1 and 4000 characters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const content: Block[] = [{ type: 'text', text: question || 'Solve the problem in this image step by step.' }];
    if (image) content.push({ type: 'image_url', image_url: { url: image } });

    const messages = [
      { role: 'system', content: SYSTEM },
      ...history
        .filter((m: Block) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
        .map((m: Block) => ({ role: m.role, content: m.content })),
      { role: 'user', content },
    ];

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': key },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: text || 'AI request failed.' }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content ?? '';
    if (!answer) {
      return new Response(JSON.stringify({ error: 'The AI returned an empty answer.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
