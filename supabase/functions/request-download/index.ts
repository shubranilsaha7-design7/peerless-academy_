import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Simple in-memory rate limiter per IP address
// Keeps track of download requests per IP within the last 60 seconds
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 3;
const ipRequestCounts = new Map<string, { count: number; firstRequestTime: number }>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    
    // 1. Edge-Level Rate Limiting
    const now = Date.now();
    const rateLimitData = ipRequestCounts.get(clientIp);

    if (rateLimitData) {
      if (now - rateLimitData.firstRequestTime < RATE_LIMIT_WINDOW_MS) {
        if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
          console.warn(`Rate limit exceeded for IP: ${clientIp}`);
          return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        rateLimitData.count += 1;
      } else {
        // Reset window
        ipRequestCounts.set(clientIp, { count: 1, firstRequestTime: now });
      }
    } else {
      ipRequestCounts.set(clientIp, { count: 1, firstRequestTime: now });
    }

    // 2. Parse request
    const { phone, resource_name, resource_link, user_id } = await req.json();

    if (!phone || !resource_name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Supabase Client with Service Role (to bypass RLS for XP update and insert)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Insert into downloads (triggers Phase 2 webhook)
    const { error: insertError } = await supabase
      .from('downloads')
      .insert([{ phone, resource_name, resource_link, user_id: user_id || null }]);

    if (insertError) throw insertError;

    // 4. Award XP if user is authenticated
    if (user_id) {
      // Get current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', user_id)
        .single();
        
      if (profile) {
        const newXp = (profile.xp || 0) + 50;
        const newLevel = Math.floor(newXp / 100) + 1; // Basic leveling logic
        
        await supabase
          .from('profiles')
          .update({ xp: newXp, level: Math.max(profile.level, newLevel) })
          .eq('id', user_id);
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Resource sent to WhatsApp and XP awarded!" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
