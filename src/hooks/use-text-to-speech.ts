import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
            
            // Call edge function for TTS
            const { data, error: functionError } = await supabase.functions.invoke(
                'elevenlabs-tts',
                {
                    body: { 
                        text,
                        voiceId: '1SM7GgM6IMuvQlz2BwM3' // Rachel voice
                    }
                }
            );

            if (functionError) {
                throw new Error(functionError.message || 'Failed to generate speech');
            }

            if (!data?.audioBase64) {
                throw new Error('No audio data received');
            }

            // Convert base64 to blob
            const binaryString = atob(data.audioBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
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
            setError(err instanceof Error ? err.message : 'Failed to generate speech');
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
