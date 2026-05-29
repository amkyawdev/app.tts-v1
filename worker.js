export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Gemini-Key, X-Groq-Key",
        },
      });
    }

    // Route: TTS via Gemini API
    if (url.pathname === "/api/tts" && request.method === "POST") {
      const body = await request.json();
      const apiKey = request.headers.get("X-Gemini-Key") || env.GEMINI_API_KEY; 
      
      if (!apiKey) {
        return makeCorsResponse(JSON.stringify({ error: "Missing Gemini API Key" }), 400);
      }

      // Call Gemini TTS Endpoint
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:cleanRoomsTextToSpeech?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body.text, voiceConfig: body.voiceConfig })
      });
      
      return makeCorsResponse(geminiResponse.body, geminiResponse.status, geminiResponse.headers);
    }

    // Route: Translate via Groq
    if (url.pathname === "/api/translate" && request.method === "POST") {
      const body = await request.json();
      const apiKey = request.headers.get("X-Groq-Key") || env.GROQ_API_KEY;

      if (!apiKey) {
        return makeCorsResponse(JSON.stringify({ error: "Missing Groq API Key" }), 400);
      }

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: `Translate the text to ${body.targetLanguage}. Only return the translation.` },
            { role: "user", content: body.text }
          ]
        })
      });

      const data = await groqResponse.json();
      return makeCorsResponse(JSON.stringify(data), groqResponse.status);
    }

    return makeCorsResponse(JSON.stringify({ error: "Not Found" }), 404);
  }
};

function makeCorsResponse(body, status, originalHeaders = {}) {
  const headers = new Headers(originalHeaders);
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(body, { status, headers });
}