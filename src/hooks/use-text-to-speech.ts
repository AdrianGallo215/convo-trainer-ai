import { useState, useCallback, useRef } from 'react';
import { elevenLabs } from '@/lib/elevenlabs';

interface UseTextToSpeechReturn {
    speak: (text: string) => Promise<void>;
    stop: () => void;
    isSpeaking: boolean;
    error: string | null;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSpeaking(false);
            audioRef.current = null;
        }
    }, []);

    const speak = useCallback(async (text: string) => {
        if (!text) return;

        // Stop any current playback
        stop();

        try {
            setIsSpeaking(true);
            setError(null);

            console.log('Attempting to speak text:', text.substring(0, 20) + '...');
            if (!elevenLabs) {
                throw new Error('ElevenLabs client not initialized');
            }

            const audioStream = await elevenLabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', { // Default voice ID (Rachel)
                text,
                model_id: 'eleven_multilingual_v2',
                output_format: 'mp3_44100_128',
            });

            const chunks: Uint8Array[] = [];
            for await (const chunk of audioStream) {
                chunks.push(chunk);
            }

            const audioBlob = new Blob(chunks as any[], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
            };

            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                setError('Failed to play audio');
                setIsSpeaking(false);
                audioRef.current = null;
            };

            await audio.play();
        } catch (err) {
            console.error('TTS error:', err);
            setError('Failed to generate speech');
            setIsSpeaking(false);
            audioRef.current = null;
        }
    }, [stop]);

    return {
        speak,
        stop,
        isSpeaking,
        error,
    };
}
