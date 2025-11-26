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

    // Extraer métricas de audio de los mensajes del usuario
    const audioMetricsData = messages
      .filter((msg: any) => msg.role === 'user' && msg.audioMetrics)
      .map((msg: any) => msg.audioMetrics);

    // Calcular promedios de métricas
    let avgWPM = 0;
    let avgVolume = 0;
    let avgSilence = 0;
    let totalFillerWords = 0;
    let avgResponseTime = 0;
    let allFillerWords: string[] = [];

    if (audioMetricsData.length > 0) {
      avgWPM = audioMetricsData.reduce((sum: number, m: any) => sum + m.wordsPerMinute, 0) / audioMetricsData.length;
      avgVolume = audioMetricsData.reduce((sum: number, m: any) => sum + m.averageVolume, 0) / audioMetricsData.length;
      avgSilence = audioMetricsData.reduce((sum: number, m: any) => sum + m.silencePercentage, 0) / audioMetricsData.length;
      totalFillerWords = audioMetricsData.reduce((sum: number, m: any) => sum + m.fillerWordCount, 0);
      avgResponseTime = audioMetricsData.reduce((sum: number, m: any) => sum + m.responseTimeMs, 0) / audioMetricsData.length;
      allFillerWords = audioMetricsData.flatMap((m: any) => m.fillerWords);
    }

    // Construir el historial de conversación para análisis
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'Usuario' : 'AI'}: ${msg.content}`
      )
      .join('\n\n');

    const metricsInfo = audioMetricsData.length > 0 ? `

MÉTRICAS DE VOZ CAPTURADAS:
- Velocidad de habla promedio: ${Math.round(avgWPM)} palabras por minuto (ideal: 120-150)
- Volumen promedio: ${(avgVolume * 100).toFixed(1)}% (0-100%)
- Porcentaje de silencio: ${avgSilence.toFixed(1)}%
- Muletillas detectadas: ${totalFillerWords} (${[...new Set(allFillerWords)].join(', ')})
- Tiempo de respuesta promedio: ${(avgResponseTime / 1000).toFixed(1)} segundos

Estas métricas son DATOS REALES de audio capturados durante la conversación.` : '';

    const analysisPrompt = `Analiza la siguiente conversación de práctica de habilidades sociales (tipo: ${scenarioType}) y proporciona puntuaciones detalladas basadas tanto en el CONTENIDO como en las MÉTRICAS DE VOZ REALES:

CONVERSACIÓN:
${conversationHistory}${metricsInfo}

Por favor, analiza la conversación usando TANTO el contenido textual COMO las métricas de voz reales y proporciona puntuaciones del 0-100 para:

1. CONFIANZA (confidence): 
   - Evalúa seguridad en el contenido (50%)
   - Volumen de voz (25%): Volumen bajo indica inseguridad
   - Muletillas (25%): Muchas muletillas reducen confianza

2. FLUIDEZ (fluency): 
   - Naturalidad del contenido (40%)
   - Velocidad de habla (30%): 120-150 WPM es óptimo en español
   - Porcentaje de silencio (30%): >25% indica problemas de fluidez

3. TONO (tone): 
   - Apropiado para el contexto (70%)
   - Tiempo de respuesta (30%): <2s es reactivo, >4s puede indicar inseguridad

Además, proporciona 3 recomendaciones ESPECÍFICAS basadas en las métricas reales observadas y una EXPLICACIÓN DETALLADA que MENCIONE LAS MÉTRICAS ESPECÍFICAS de por qué se asignó cada puntuación.

Responde ÚNICAMENTE en el siguiente formato JSON (sin texto adicional):
{
  "confidence": <número 0-100>,
  "fluency": <número 0-100>,
  "tone": <número 0-100>,
  "explanations": {
    "confidence": "Explicación que mencione el volumen, muletillas detectadas y contenido",
    "fluency": "Explicación que mencione WPM, silencios y naturalidad del habla",
    "tone": "Explicación que mencione tiempo de respuesta y apropiación al contexto"
  },
  "recommendations": [
    "Recomendación 1 basada en métricas específicas observadas",
    "Recomendación 2 basada en métricas específicas observadas",
    "Recomendación 3 basada en métricas específicas observadas"
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
        max_tokens: 1200,
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
      !Array.isArray(analysis.recommendations) ||
      !analysis.explanations
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
