import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WHATSAPP_API_TOKEN = Deno.env.get("WHATSAPP_API_TOKEN");
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");

serve(async (req) => {
  try {
    // Webhook payload from Supabase Database Webhooks
    const payload = await req.json();

    // Check if it's an INSERT trigger
    if (payload.type === "INSERT" && payload.record) {
      const { phone, resource_link, resource_name } = payload.record;

      if (!phone || !resource_link) {
        return new Response(JSON.stringify({ error: "Missing phone or resource_link" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID) {
        console.error("Missing WhatsApp configuration environment variables.");
        return new Response(JSON.stringify({ error: "Internal Configuration Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Prepare payload for Meta WhatsApp Cloud API
      // Note: Assuming a pre-approved template message is used, or a free-form message 
      // if within a 24h window. Using a template is required for initiating conversations.
      // E.g., template name: "resource_download"
      const messagePayload = {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "resource_download", // Ensure this template exists in your Meta WhatsApp Manager
          language: {
            code: "en"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    link: resource_link,
                    filename: resource_name || "Peerless_Academy_Resource.pdf"
                  }
                }
              ]
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: resource_name || "Requested Resource"
                }
              ]
            }
          ]
        }
      };

      const metaResponse = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      const responseData = await metaResponse.json();

      if (!metaResponse.ok) {
        console.error("WhatsApp API Error:", responseData);
        return new Response(JSON.stringify({ error: responseData }), {
          status: 502,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ success: true, data: responseData }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ message: "Ignored event type." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Edge function execution error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
