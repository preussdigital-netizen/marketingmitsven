import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { message } = await req.json();
    
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message (string) required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (message.length > 500) {
      return new Response(JSON.stringify({ error: "message too long (max 500 chars)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const base44 = createClientFromRequest(req);
    
    // Create ChatMessage record with status=pending
    const record = await base44.asServiceRole.entities.ChatMessage.create({
      message: message,
      response: "",
      status: "pending"
    });

    const recordId = record.id;

    // Poll for response (max ~40 seconds)
    const maxAttempts = 20;
    const pollInterval = 2000;
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      const updated = await base44.asServiceRole.entities.ChatMessage.get(recordId);
      
      if (updated.status === "completed" && updated.response) {
        return new Response(JSON.stringify({
          response: updated.response,
          id: recordId
        }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
      
      if (updated.status === "error") {
        return new Response(JSON.stringify({
          response: "Es tut mir leid, bei der Verarbeitung ist ein Fehler aufgetreten.",
          id: recordId
        }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // Timeout
    return new Response(JSON.stringify({
      response: "Die Antwort hat leider zu lange gedauert. Bitte schreibe Sven direkt an marketingmitsven@gmail.com.",
      id: recordId
    }), {
      status: 504,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
