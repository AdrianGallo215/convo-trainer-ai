import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { groq } from '../../../src/lib/groq.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function getGroqChatCompletion(messages: any[], systemPrompt: string) {

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response;
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenarioType } = await req.json();

    // System prompts personalizados según el tipo de escenario
    const systemPrompts: Record<string, string> = {
      entrevista: `Eres un entrevistador profesional de recursos humanos. Tu objetivo es ayudar al candidato a practicar sus habilidades de entrevista. 
      - Haz preguntas relevantes sobre experiencia laboral, fortalezas, debilidades y motivaciones
      - Mantén un tono profesional pero amigable
      - Proporciona seguimiento basado en las respuestas del candidato
      - Haz preguntas de comportamiento (STAR method)
      - Evalúa la claridad, confianza y relevancia de las respuestas`,

      casual: `Eres un amigo que está teniendo una conversación casual. Tu objetivo es ayudar a la persona a practicar conversaciones sociales naturales.
      - Haz preguntas sobre el día, intereses, planes
      - Mantén un tono amigable y relajado
      - Muestra interés genuino en lo que comparte
      - Haz seguimiento con preguntas relacionadas
      - Crea un ambiente cómodo para practicar habilidades sociales`,

      presentacion: `Eres una audiencia atenta en una presentación pública. Tu objetivo es ayudar al presentador a practicar sus habilidades de oratoria.
      - Proporciona retroalimentación constructiva sobre la presentación
      - Haz preguntas relevantes al tema presentado
      - Reconoce puntos fuertes (claridad, estructura, ejemplos)
      - Mantén un tono de apoyo pero profesional
      - Simula reacciones de audiencia apropiadas`
    };

    const systemPrompt = systemPrompts[scenarioType as keyof typeof systemPrompts] || systemPrompts.casual;

    console.log(`Processing chat for scenario: ${scenarioType}`);
    console.log(`Messages count: ${messages.length}`);

    const completion = await getGroqChatCompletion(messages, systemPrompt);

    // if (!completion) {
    //   console.error('Groq API error:', errorText);
    //   throw new Error(`Groq API error: }`);
    // }

    console.log("Groq response: ", completion);

    const aiResponse = completion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

    console.log(`AI Response generated: ${aiResponse.substring(0, 50)}...`);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in groq-chat function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
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
