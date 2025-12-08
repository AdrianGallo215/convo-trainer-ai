import Groq from "npm:groq-sdk@0.36.0";

const apiKey = Deno.env.get('GROQ_API_KEY');

if (!apiKey) {
  console.error('Missing GROQ_API_KEY environment variable');
}

export const groq = new Groq({
  apiKey: apiKey,
});
