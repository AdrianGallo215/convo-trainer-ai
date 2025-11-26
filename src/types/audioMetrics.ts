export interface AudioMetrics {
  durationMs: number;           // Duración del audio en ms
  wordCount: number;            // Palabras en la transcripción
  wordsPerMinute: number;       // Velocidad de habla
  averageVolume: number;        // Volumen promedio 0-1
  silencePercentage: number;    // % de tiempo en silencio
  fillerWords: string[];        // Muletillas detectadas ["eh", "este"]
  fillerWordCount: number;      // Total de muletillas
  responseTimeMs: number;       // Tiempo desde que IA terminó
}

export interface TranscriptionResult {
  text: string;
  metrics: AudioMetrics;
}
