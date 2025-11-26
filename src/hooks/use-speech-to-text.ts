import { useState, useRef, useCallback } from 'react';
import { groq } from '@/lib/groq';
import type { AudioMetrics, TranscriptionResult } from '@/types/audioMetrics';

interface UseSpeechToTextReturn {
    isRecording: boolean;
    transcript: string;
    audioMetrics: AudioMetrics | null;
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
    const [audioMetrics, setAudioMetrics] = useState<AudioMetrics | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const volumeSamplesRef = useRef<number[]>([]);
    const startTimeRef = useRef<number>(0);
    const silenceThreshold = 0.01; // Threshold for silence detection

    const startRecording = useCallback(async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Media devices API not supported in this browser or context (requires HTTPS).');
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Setup audio analysis
            audioContextRef.current = new AudioContext({ sampleRate: 24000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;
            source.connect(analyserRef.current);
            
            volumeSamplesRef.current = [];
            startTimeRef.current = Date.now();
            
            // Start volume monitoring
            const monitorVolume = () => {
                if (analyserRef.current && mediaRecorderRef.current?.state === 'recording') {
                    const dataArray = new Float32Array(analyserRef.current.fftSize);
                    analyserRef.current.getFloatTimeDomainData(dataArray);
                    
                    const sum = dataArray.reduce((acc, val) => acc + Math.abs(val), 0);
                    const average = sum / dataArray.length;
                    volumeSamplesRef.current.push(average);
                    
                    requestAnimationFrame(monitorVolume);
                }
            };
            monitorVolume();
            
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const endTime = Date.now();
                const durationMs = endTime - startTimeRef.current;
                
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
                    
                    // Enhanced prompt to capture filler words
                    const fillerWordsPrompt = language.startsWith('es') 
                        ? 'Transcribe exactamente incluyendo muletillas como: eh, este, mmm, pues, bueno, o sea, entonces, como que'
                        : 'Transcribe exactly including filler words like: um, uh, like, you know, so, well';
                    
                    const completion = await groq.audio.transcriptions.create({
                        file: audioFile,
                        model: 'whisper-large-v3',
                        response_format: 'json',
                        language: language.split('-')[0],
                        prompt: fillerWordsPrompt,
                        temperature: 0,
                    });
                    console.log('Groq response:', completion);
                    
                    const transcriptText = completion.text;
                    setTranscript(transcriptText);
                    
                    // Calculate audio metrics
                    const avgVolume = volumeSamplesRef.current.length > 0
                        ? volumeSamplesRef.current.reduce((a, b) => a + b, 0) / volumeSamplesRef.current.length
                        : 0;
                    
                    const silentSamples = volumeSamplesRef.current.filter(v => v < silenceThreshold).length;
                    const silencePercentage = volumeSamplesRef.current.length > 0
                        ? (silentSamples / volumeSamplesRef.current.length) * 100
                        : 0;
                    
                    // Detect filler words in Spanish
                    const fillerWordPatterns = language.startsWith('es')
                        ? ['\\beh\\b', '\\beste\\b', '\\bmmm+\\b', '\\bpues\\b', '\\bbueno\\b', '\\bo sea\\b', '\\bentonces\\b', '\\bcomo que\\b']
                        : ['\\bum\\b', '\\buh\\b', '\\blike\\b', '\\byou know\\b', '\\bso\\b', '\\bwell\\b'];
                    
                    const detectedFillers: string[] = [];
                    fillerWordPatterns.forEach(pattern => {
                        const regex = new RegExp(pattern, 'gi');
                        const matches = transcriptText.match(regex);
                        if (matches) {
                            detectedFillers.push(...matches.map(m => m.toLowerCase().trim()));
                        }
                    });
                    
                    const wordCount = transcriptText.split(/\s+/).filter(w => w.length > 0).length;
                    const wordsPerMinute = durationMs > 0 ? Math.round((wordCount / durationMs) * 60000) : 0;
                    
                    const metrics: AudioMetrics = {
                        durationMs,
                        wordCount,
                        wordsPerMinute,
                        averageVolume: avgVolume,
                        silencePercentage,
                        fillerWords: detectedFillers,
                        fillerWordCount: detectedFillers.length,
                        responseTimeMs: 0 // Will be set from Simulacion
                    };
                    
                    setAudioMetrics(metrics);
                    console.log('Audio metrics:', metrics);
                    
                } catch (err) {
                    console.error('Transcription error:', err);
                    setError('Failed to transcribe audio');
                } finally {
                    setIsRecording(false);
                    stream.getTracks().forEach(track => track.stop());
                    
                    // Cleanup audio context
                    if (audioContextRef.current) {
                        audioContextRef.current.close();
                        audioContextRef.current = null;
                    }
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
        audioMetrics,
        startRecording,
        stopRecording,
        error,
    };
}
