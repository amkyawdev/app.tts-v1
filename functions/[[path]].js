export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Gemini-Key, X-Groq-Key",
        },
      });
    }

    // TTS route
    if (url.pathname === "/api/tts" && request.method === "POST") {
      const body = await request.json();
      const apiKey = request.headers.get("X-Gemini-Key") || env.GEMINI_API_KEY; 
      
      if (!apiKey) {
        return makeCorsResponse(JSON.stringify({ error: "Missing API Key" }), 400);
      }

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:cleanRoomsTextToSpeech?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        return makeCorsResponse(response.body, response.status, response.headers);
      } catch (err) {
        return makeCorsResponse(JSON.stringify({ error: err.message }), 500);
      }
    }

    // Translate route
    if (url.pathname === "/api/translate" && request.method === "POST") {
      const body = await request.json();
      const apiKey = request.headers.get("X-Groq-Key") || env.GROQ_API_KEY;

      if (!apiKey) {
        return makeCorsResponse(JSON.stringify({ error: "Missing API Key" }), 400);
      }

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              { role: "system", content: `Translate to ${body.targetLanguage}. Only return translation.` },
              { role: "user", content: body.text }
            ]
          })
        });
        const data = await response.json();
        return makeCorsResponse(JSON.stringify(data), response.status);
      } catch (err) {
        return makeCorsResponse(JSON.stringify({ error: err.message }), 500);
      }
    }

    return makeCorsResponse(JSON.stringify({ error: "Not Found" }), 404);
  }
};

function makeCorsResponse(body, status, originalHeaders = {}) {
  const headers = new Headers(originalHeaders);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(body, { status, headers });
}