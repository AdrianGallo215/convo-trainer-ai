import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { groq } from "../_shared/groq.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Manejo de CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenarioType } = await req.json();

    // 1. Formatear mensajes para la API de Groq
    // Convertimos tus claves personalizadas (rol, message) al estándar de la API (role, content)
    // También cambiamos "ai" por "assistant" que es lo que espera el modelo.
    const formattedMessages = messages.map((msg: any) => ({
      role: (msg.rol === 'ai' || msg.role === 'ai') ? 'assistant' : 'user',
      content: msg.message || msg.text || "" 
    }));

    // 2. Prompt del Sistema estricto para limitar la longitud
    const systemPrompt = `
      Actúa como un resumidor experto. Tu tarea es analizar la conversación de práctica de tipo "${scenarioType || 'general'}".
      Debes generar una descripción final o conclusión muy breve sobre la sesión.
      
      REGLAS OBLIGATORIAS:
      1. La respuesta debe tener MÁXIMO 30 palabras.
      2. Debe ser una frase completa y coherente en español.
      3. No incluyas introducciones como "Aquí tienes el resumen". Ve directo al grano.
      4. Céntrate en el tema principal o el desempeño general.
    `;

    console.log(`Generating summary for ${messages.length} messages...`);

    // 3. Llamada a Groq
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedMessages
      ],
      temperature: 0.5, // Temperatura más baja para ser más directo y menos creativo
      max_tokens: 60,   // Limitamos tokens para asegurar brevedad
    });

    const summary = chatCompletion.choices[0]?.message?.content?.trim() || "Sesión de práctica finalizada.";

    console.log(`Generated summary: ${summary}`);

    // 4. Retornar solo el comentario
    return new Response(
      JSON.stringify({ summary: summary }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in groq-summarize function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        summary: "Resumen no disponible por error técnico." // Fallback por si falla
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      }
    );
  }
});