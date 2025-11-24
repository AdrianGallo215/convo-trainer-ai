import { useEffect, useRef } from 'react';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';

interface UseVoiceInteractionProps {
  onTranscript: (text: string) => void;
  language?: string;
}

interface UseVoiceInteractionReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSupported: boolean;
}

export const useVoiceInteraction = ({
  onTranscript,
  language = 'es-ES' // Language param is kept for compatibility but Groq Whisper handles language automatically or can be configured if needed.
}: UseVoiceInteractionProps): UseVoiceInteractionReturn => {
  const {
    isRecording: isListening,
    transcript,
    startRecording: startListening,
    stopRecording: stopListening,
    error: sttError
  } = useSpeechToText({ language });

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    error: ttsError
  } = useTextToSpeech();

  const lastProcessedRef = useRef('');

  useEffect(() => {
    if (transcript && transcript !== lastProcessedRef.current) {
      lastProcessedRef.current = transcript;
      onTranscript(transcript);
    } else if (!transcript) {
      lastProcessedRef.current = '';
    }
  }, [transcript, onTranscript]);

  if (sttError) console.error('STT Error:', sttError);
  if (ttsError) console.error('TTS Error:', ttsError);

  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported: true, // APIs are supported
  };
};
