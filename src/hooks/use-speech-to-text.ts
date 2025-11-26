import { useState, useRef, useCallback } from 'react';
import { groq } from '@/lib/groq';

interface UseSpeechToTextReturn {
    isRecording: boolean;
    transcript: string;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    error: string | null;
}

interface UseSpeechToTextProps {
    language?: string;
}

export function useSpeechToText({ language = 'es' }: UseSpeechToTextProps = {}): UseSpeechToTextReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Media devices API not supported in this browser or context (requires HTTPS).');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                console.log('Audio recording stopped. Blob size:', audioBlob.size, 'bytes');

                if (audioBlob.size < 1000) {
                    console.warn('Audio recording is too short or empty.');
                    setError('Recording too short. Please speak louder or longer.');
                    setIsRecording(false);
                    return;
                }

                const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

                try {
                    setIsRecording(true);
                    console.log('Sending audio to Groq...');
                    const completion = await groq.audio.transcriptions.create({
                        file: audioFile,
                        model: 'whisper-large-v3',
                        response_format: 'json',
                        language: language.split('-')[0],
                        prompt: language.startsWith('es') ? 'Una conversación en español.' : undefined,
                        temperature: 0,
                    });
                    console.log('Groq response:', completion);
                    setTranscript(completion.text);
                } catch (err) {
                    console.error('Transcription error:', err);
                    setError('Failed to transcribe audio');
                } finally {
                    setIsRecording(false);
                    stream.getTracks().forEach(track => track.stop());
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
            setTranscript('');
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    return {
        isRecording,
        transcript,
        startRecording,
        stopRecording,
        error,
    };
}
