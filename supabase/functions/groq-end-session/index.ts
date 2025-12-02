// este prompt lo vas a poner por cada consulta hecha
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // Le pedimos a Groq que *clasifique*, no que converse
    const prompt = `
Tu tarea es analizar un mensaje y determinar SI expresa explícitamente
o implícitamente el deseo de terminar, finalizar o irse de una reunión.

Responde SOLO con:
- "true" → si el usuario quiere acabar la reunión
- "false" → si no lo quiere

Ejemplos:
"Ya me quiero ir de la reunión" → true
"Deberíamos hacer un break" → false
"Creo que ya es hora de terminar" → true
"Estoy aburrido" → false
"Quiero finalizar esta reunión" → true

Ahora analiza este texto: "${text}"
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0, // Para evitar respuestas ambiguas
        max_tokens: 5,
      }),
    });

    if (!response.ok) {
      throw new Error("Groq API error: " + response.status);
    }

    const data = await response.json();
    const raw = data.choices[0]?.message?.content?.trim().toLowerCase();

    // Normalizamos la salida
    const result = raw.includes("true");

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
