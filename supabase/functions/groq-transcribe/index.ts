import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('file');
    const language = formData.get('language') || 'es';
    const prompt = formData.get('prompt') || '';

    if (!audioFile || !(audioFile instanceof File)) {
      throw new Error('Audio file is required');
    }

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('Transcribing audio file:', audioFile.name, 'size:', audioFile.size);

    // Create FormData for Groq API
    const groqFormData = new FormData();
    groqFormData.append('file', audioFile);
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('response_format', 'json');
    groqFormData.append('language', language.toString().split('-')[0]);
    if (prompt) {
      groqFormData.append('prompt', prompt.toString());
    }
    groqFormData.append('temperature', '0');

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Transcription successful');

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in groq-transcribe function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
