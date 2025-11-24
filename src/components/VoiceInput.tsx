import React, { useEffect } from 'react';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceInputProps {
    onTranscript?: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
    const { isRecording, transcript, startRecording, stopRecording, error: sttError } = useSpeechToText();
    const { speak, isSpeaking, error: ttsError } = useTextToSpeech();

    useEffect(() => {
        if (transcript && onTranscript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-card">
            <div className="flex items-center gap-2">
                <Button
                    variant={isRecording ? "destructive" : "default"}
                    size="icon"
                    onClick={isRecording ? stopRecording : startRecording}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => speak(transcript || "Hello, this is a test of the voice system.")}
                    disabled={isSpeaking || (!transcript && !isRecording)}
                    title="Speak Text"
                >
                    <Volume2 className="h-4 w-4" />
                </Button>
            </div>

            {transcript && (
                <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="font-medium mb-1">Transcript:</p>
                    <p>{transcript}</p>
                </div>
            )}

            {(sttError || ttsError) && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {sttError || ttsError}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
