import { ElevenLabsClient } from 'elevenlabs';

const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

if (!apiKey) {
    console.error('Missing VITE_ELEVENLABS_API_KEY environment variable');
} else {
    console.log('ElevenLabs API Key loaded:', apiKey.substring(0, 5) + '...');
}

export const elevenLabs = new ElevenLabsClient({
    apiKey: apiKey
});
