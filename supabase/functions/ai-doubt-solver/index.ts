import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACADEMIC_SYSTEM = `You are an Elite AI Socratic Tutor for JEE/NEET.
Rules:
- Respond in Markdown. Use LaTeX for math ($ for inline, $$ for block).
- If the user asks for a "Hint", guide them Socratically without giving the final answer.
- If they ask for a "Full Breakdown", provide a highly detailed, step-by-step resolution.
- Never spoon-feed if they just upload an image; ask what they have tried first unless they explicitly want the full solution.`;

const NON_ACADEMIC_SYSTEM = `You are an Elite Academic Mentor and Strategist for JEE/NEET aspirants.
Rules:
- Provide exam strategy, time management routines, revision schedules, and motivational guidance.
- Do not solve physics/math problems here. Direct them to Academic Mode.
- Be highly empathetic, structured, and practical.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, mode = "academic" } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = mode === "academic" ? ACADEMIC_SYSTEM : NON_ACADEMIC_SYSTEM;
    
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "ai" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const latestMessage = messages[messages.length - 1];
    
    const chat = model.startChat({ history });

    // Handle images in latest message
    let resultStream;
    if (latestMessage.image) {
      // Assuming base64 image like "data:image/jpeg;base64,..."
      const [mimeType, b64Data] = latestMessage.image.split(";base64,");
      const mime = mimeType.replace("data:", "");
      
      resultStream = await chat.sendMessageStream([
        { text: latestMessage.content || "Analyze this image." },
        { inlineData: { data: b64Data, mimeType: mime } }
      ]);
    } else {
      resultStream = await chat.sendMessageStream(latestMessage.content);
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of resultStream) {
            const text = chunk.text();
            if (text) {
              const data = JSON.stringify({ text });
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e: any) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

