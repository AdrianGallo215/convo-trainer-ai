import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Volume2, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { useGamefication } from "@/hooks/useGamefication";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Importación de ElevenLabs
import { useConversation } from "@elevenlabs/react";

const scenarioData = {
  entrevista: {
    title: "Entrevista laboral",
    initialMessage: "¿Por qué estás interesado en este puesto?",
    responses: [], // En modo ElevenLabs, las respuestas vienen de la IA real
    avatar: "💼",
  },
  casual: {
    title: "Conversación casual",
    initialMessage: "Hola, ¿cómo te fue en tu día?",
    responses: [
      "¡Qué interesante! Cuéntame más sobre eso.",
      "Me alegra escuchar eso. ¿Y qué planes tienes para el fin de semana?",
      "Suena genial. Yo también disfruto ese tipo de actividades.",
    ],
    avatar: "😊",
  },
  presentacion: {
    title: "Presentación pública",
    initialMessage: "Empieza tu presentación cuando estés listo.",
    responses: [
      "Muy bien, proyectas seguridad. Continúa con tu exposición.",
      "Excelente punto. Tu audiencia está muy atenta.",
      "Perfecto cierre. Has mantenido el interés durante toda la presentación.",
    ],
    avatar: "👥",
  },
};

const Simulacion = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveSession } = useGamefication();
  
  // Estado
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [hasStarted, setHasStarted] = useState(false);

  // Determinar si usamos ElevenLabs (Solo para entrevista)
  const isElevenLabsMode = tipo === "entrevista";

  const scenario = scenarioData[tipo as keyof typeof scenarioData];
  const speakRef = useRef<(text: string) => void>(() => { });

  // --- CONFIGURACIÓN ELEVENLABS ---
  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message: any) => {
      // Cuando ElevenLabs envía un mensaje (texto de lo que está hablando)
      // Nota: Verifica si 'message' es string o objeto según tu versión del SDK
      const text = typeof message === 'string' ? message : message.message || message.text;
      if (text) {
        setMessages((prev) => [...prev, { role: "ai", text }]);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      toast.error("Error de conexión con el agente de voz");
    },
  });

  const { status: elStatus, isSpeaking: elIsSpeaking } = conversation;
  const isElevenLabsConnected = elStatus === "connected";

  // --- CONFIGURACIÓN STANDARD (NO-ELEVENLABS) ---
  useEffect(() => {
    const savedSubtitles = localStorage.getItem("subtitles") !== "false";
    setShowSubtitles(savedSubtitles);
  }, []);

  const handleUserTranscript = useCallback((text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    
    // Si estamos en modo ElevenLabs, no generamos respuesta simulada aquí,
    // ElevenLabs responderá automáticamente por audio y onMessage.
    if (isElevenLabsMode) {
      toast.success("Respuesta enviada al agente");
      return; 
    }

    toast.success("Respuesta registrada");

    // Lógica Standard: Respuesta Simulada
    setTimeout(() => {
      const aiResponse = scenario.responses[responseIndex % scenario.responses.length];
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      setResponseIndex((prev) => prev + 1);

      if (speakRef.current) {
        speakRef.current(aiResponse);
      }
    }, 800);
  }, [scenario, responseIndex, isElevenLabsMode]);

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    handleUserTranscript(textInput);
    setTextInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  // Hook Standard (siempre se inicializa pero se usa condicionalmente)
  const {
    isListening: stdIsListening,
    isSpeaking: stdIsSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported,
  } = useVoiceInteraction({
    onTranscript: handleUserTranscript,
    language: 'es-ES',
  });

  // Update ref
  useEffect(() => {
    speakRef.current = speak;
  }, [speak]);

  // --- LÓGICA DE CONTROL ---

  // Unificamos estados de UI
  const isListening = isElevenLabsMode ? isElevenLabsConnected : stdIsListening;
  const isSpeaking = isElevenLabsMode ? elIsSpeaking : stdIsSpeaking;

  const handleStart = async () => {
    setHasStarted(true);
    
    if (isElevenLabsMode) {
      try {
        // This is a placeholder - ElevenLabs configuration would go here
        toast.info("Modo ElevenLabs no configurado completamente");
      } catch (error) {
        console.error("Error starting EL session:", error);
        toast.error("No se pudo iniciar la entrevista con IA");
      }
    } else {
      // Modo Standard
      setTimeout(() => {
        speak(scenario.initialMessage);
      }, 500);
    }
  };

  const handleToggleListening = async () => {
    if (isElevenLabsMode) {
      // Placeholder for ElevenLabs toggle
      toast.info("Modo ElevenLabs no configurado completamente");
    } else {
      // Modo Standard
      if (isListening) {
        stopListening();
      } else {
        stopSpeaking();
        startListening();
      }
    }
  };

  const handleFinish = async () => {
    // Si estamos en ElevenLabs, cerramos la sesión
    if (isElevenLabsMode && isElevenLabsConnected) {
      await conversation.endSession();
    }

    if (!user) {
      navigate("/feedback");
      return;
    }

    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const confidence = Math.floor(Math.random() * 30) + 60; 
    const fluency = Math.floor(Math.random() * 30) + 50; 
    const tone = Math.floor(Math.random() * 30) + 65; 

    const { xpEarned, newAchievements } = await saveSession({
      userId: user.id,
      scenarioType: tipo || "casual",
      confidenceScore: confidence,
      fluencyScore: fluency,
      toneScore: tone,
      durationSeconds,
    });

    navigate("/feedback", {
      state: {
        scores: { confidence, fluency, tone },
        xpEarned,
        newAchievements,
      },
    });
  };

  if (!scenario) {
    return <div>Escenario no encontrado</div>;
  }

  // PANTALLA DE INICIO
  if (!hasStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-card rounded-3xl shadow-medium border border-border/50">
          <Avatar className="w-24 h-24 mx-auto bg-gradient-hero shadow-soft">
            <AvatarFallback className="text-4xl bg-transparent">
              {scenario.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{scenario.title}</h1>
            <p className="text-muted-foreground">
              {isElevenLabsMode 
                ? "Inicia la entrevista con IA avanzada." 
                : "Haz clic en comenzar para iniciar la simulación de voz."}
            </p>
          </div>
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full text-lg h-12 bg-gradient-hero shadow-soft hover:shadow-medium transition-all"
          >
            Comenzar Simulación
          </Button>
          <div className="flex justify-center">
            <Link to="/escenarios">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // PANTALLA DE CHAT
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/escenarios" aria-label="Volver a escenarios">
              <Button variant="outline" size="icon" aria-label="Volver">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{scenario.title}</h1>
          </div>

          {/* Mostrar estado solo si NO es ElevenLabs o si es supported */}
          {!isElevenLabsMode && !isSupported && (
            <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Voz no disponible
            </div>
          )}
        </header>

        <div className="relative bg-card rounded-3xl shadow-medium p-6 md:p-8 space-y-6 border border-border/50 min-h-[60vh]" role="region" aria-label="Área de conversación">
          {/* Indicador de estado */}
          <div className="absolute top-4 right-4 flex items-center gap-2" role="status" aria-live="polite" aria-atomic="true">
            {isSpeaking && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">Hablando...</span>
              </div>
            )}
            {isListening && (
              <div className="flex items-center gap-2 text-destructive animate-pulse">
                <div className="w-3 h-3 rounded-full bg-destructive" aria-hidden="true" />
                <span className="text-sm">Escuchando...</span>
              </div>
            )}
          </div>

          {/* Mensaje inicial (Static for Standard, Dynamic/Hidden for EL until start) */}
          <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" role="article" aria-label="Mensaje del asistente virtual">
            <Avatar className="w-14 h-14 md:w-16 md:h-16 bg-gradient-hero shadow-soft" aria-hidden="true">
              <AvatarFallback className="text-2xl md:text-3xl bg-transparent">
                {scenario.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-secondary/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <p className="text-foreground leading-relaxed">{scenario.initialMessage}</p>
              {showSubtitles && (
                <span className="sr-only" aria-live="polite">{scenario.initialMessage}</span>
              )}
            </div>
          </div>

          {/* Transcripción en tiempo real (Solo para Standard Mode, EL maneja su propio audio/stream) */}
          {!isElevenLabsMode && isListening && transcript && (
            <div className="flex items-start gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300" role="article" aria-label="Tu respuesta en progreso" aria-live="polite">
              <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center shadow-soft backdrop-blur-sm" aria-hidden="true">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1 rounded-2xl p-4 shadow-soft bg-primary/80 text-primary-foreground backdrop-blur-sm border-2 border-primary">
                <p className="italic opacity-80">{transcript}...</p>
              </div>
            </div>
          )}

          {/* Mensajes de la conversación */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${message.role === "user" ? "flex-row-reverse" : ""
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              role="article"
            >
              {message.role === "ai" && (
                <Avatar className="w-12 h-12 bg-gradient-hero shadow-soft" aria-hidden="true">
                  <AvatarFallback className="text-2xl bg-transparent">
                    {scenario.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`flex-1 rounded-2xl p-4 shadow-soft backdrop-blur-sm ${message.role === "user"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-secondary/80 text-foreground"
                  }`}
              >
                <p className="leading-relaxed">{message.text}</p>
                {/* Botón de repetir audio: Solo standard. EL no soporta replay de texto fácilmente sin volver a generar */}
                {!isElevenLabsMode && message.role === "ai" && (
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-50 hover:opacity-100"
                      onClick={() => speak(message.text)}
                      title="Reproducir mensaje"
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center shadow-soft backdrop-blur-sm" aria-hidden="true">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Texto: Deshabilitado o Oculto en modo ElevenLabs si se prefiere full voz, pero lo dejo activo */}
        <div className="bg-card rounded-2xl shadow-soft p-4 border border-border/50" role="region" aria-label="Entrada de texto alternativa">
          <Label htmlFor="text-input" className="text-sm font-medium mb-2 block">
            Escribe tu respuesta {isElevenLabsMode ? "(Nota: En modo entrevista, se prioriza la voz)" : "(alternativa al micrófono)"}
          </Label>
          <div className="flex gap-2">
            <Textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu respuesta aquí..."
              className="flex-1 min-h-[80px] resize-none"
              disabled={isSpeaking}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isSpeaking}
              size="icon"
              className="h-[80px] w-12 bg-gradient-hero"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4" role="group" aria-label="Controles de la conversación">
          <Button
            onClick={handleToggleListening}
            disabled={isSpeaking || (!isElevenLabsMode && !isSupported)}
            className={`flex-1 h-14 text-lg shadow-soft hover:shadow-medium transition-all ${isListening
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-gradient-hero"
              }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                {isElevenLabsMode ? "Desconectar" : "Detener"}
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" aria-hidden="true" />
                {isElevenLabsMode ? "Conectar Entrevista" : "Hablar"}
              </>
            )}
          </Button>
          <Button
            onClick={handleFinish}
            variant="outline"
            className="h-14 px-8 text-lg border-2 hover:bg-secondary/50"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Simulacion;