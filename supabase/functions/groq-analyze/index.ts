import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenarioType } = await req.json();

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    // Construir el historial de conversación para análisis
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'Usuario' : 'AI'}: ${msg.content}`
      )
      .join('\n\n');

    const analysisPrompt = `Analiza la siguiente conversación de práctica de habilidades sociales (tipo: ${scenarioType}) y proporciona puntuaciones detalladas:

CONVERSACIÓN:
${conversationHistory}

Por favor, analiza la conversación y proporciona puntuaciones del 0-100 para:
1. CONFIANZA (confidence): Evalúa qué tan seguro y decidido sonó el usuario en sus respuestas
2. FLUIDEZ (fluency): Evalúa qué tan natural y sin pausas/titubeos fueron las respuestas
3. TONO (tone): Evalúa qué tan apropiado fue el tono para el contexto (profesional en entrevista, amigable en casual, etc.)

Además, proporciona 3 recomendaciones específicas para mejorar.

Responde ÚNICAMENTE en el siguiente formato JSON (sin texto adicional):
{
  "confidence": <número 0-100>,
  "fluency": <número 0-100>,
  "tone": <número 0-100>,
  "recommendations": [
    "Recomendación 1 específica y accionable",
    "Recomendación 2 específica y accionable",
    "Recomendación 3 específica y accionable"
  ]
}`;

    console.log(`Analyzing conversation for scenario: ${scenarioType}`);
    console.log(`Messages to analyze: ${messages.length}`);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: analysisPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    console.log(`Analysis generated: ${analysisText.substring(0, 100)}...`);

    // Parse the JSON response
    const analysis = JSON.parse(analysisText);

    // Validar que tenga los campos necesarios
    if (
      typeof analysis.confidence !== 'number' ||
      typeof analysis.fluency !== 'number' ||
      typeof analysis.tone !== 'number' ||
      !Array.isArray(analysis.recommendations)
    ) {
      throw new Error('Invalid analysis format from AI');
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in groq-analyze function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        // Fallback scores si falla el análisis
        confidence: 70,
        fluency: 65,
        tone: 70,
        recommendations: [
          "Practica mantener contacto visual durante las conversaciones",
          "Trabaja en reducir muletillas y pausas innecesarias",
          "Ajusta tu tono según el contexto de la conversación"
        ]
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
