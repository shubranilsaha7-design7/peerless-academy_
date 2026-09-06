import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { GoogleGenerativeAI, SchemaType } from "npm:@google/generative-ai";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_INSTRUCTION = `You are an elite academic content generator for JEE Main, JEE Advanced, and NEET UG.
Your task is to generate authentic, advanced-level Previous Year Questions (PYQs).
CRITICAL RULES:
- Format all mathematical equations using LaTeX. Use a single $ for inline math (e.g., $E=mc^2$) and double $$ for block math.
- You must generate EXACTLY the number of questions requested.
- Adhere strictly to the JSON schema.
- Questions must be extremely rigorous and accurate.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { subject, exam_type, class_level, chapter, count } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
       throw new Error("Supabase environment variables not configured");
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const schema = {
      type: SchemaType.ARRAY,
      description: "List of generated questions",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question_text: { type: SchemaType.STRING, description: "The full question text with LaTeX math" },
          options: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Exactly 4 options, containing LaTeX where necessary"
          },
          correct_option_index: { type: SchemaType.INTEGER, description: "0-based index of the correct option (0 to 3)" },
          explanation: { type: SchemaType.STRING, description: "Step-by-step full breakdown explanation with LaTeX math" },
          difficulty: { type: SchemaType.STRING, description: "One of: easy, medium, hard" },
          year: { type: SchemaType.INTEGER, description: "The PYQ year, e.g., 2024" }
        },
        required: ["question_text", "options", "correct_option_index", "explanation", "difficulty", "year"]
      }
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const prompt = `Generate exactly ${count} authentic PYQs for ${exam_type} (Class ${class_level}), Subject: ${subject}, Chapter: "${chapter}".`;
    const result = await model.generateContent(prompt);
    
    const responseText = result.response.text();
    const generatedQuestions = JSON.parse(responseText);

    const payload = generatedQuestions.map((q: any) => ({
      exam_type,
      subject,
      class_level,
      chapter,
      question_text: q.question_text,
      options: q.options,
      correct_option_index: q.correct_option_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
      year: q.year,
      tags: ["PYQ", `${exam_type} ${q.year}`]
    }));

    const { error } = await supabaseAdmin
      .from("cbt_questions")
      .insert(payload);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, count: payload.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

