import { useState, useEffect } from "react";
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

const scenarioData = {
  entrevista: {
    title: "Entrevista laboral",
    initialMessage: "¿Por qué estás interesado en este puesto?",
    responses: [
      "Esa es una excelente motivación. Cuéntame más sobre tu experiencia previa.",
      "Interesante perspectiva. ¿Qué fortalezas crees que aportas al equipo?",
      "Muy bien. ¿Cómo manejas situaciones de presión?",
    ],
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
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [sessionStartTime] = useState(Date.now());

  const scenario = scenarioData[tipo as keyof typeof scenarioData];

  useEffect(() => {
    const savedSubtitles = localStorage.getItem("subtitles") !== "false";
    setShowSubtitles(savedSubtitles);
  }, []);

  const handleUserTranscript = (text: string) => {
    if (!text.trim()) return;
    
    setMessages((prev) => [...prev, { role: "user", text }]);
    toast.success("Respuesta registrada");
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = scenario.responses[responseIndex % scenario.responses.length];
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      setResponseIndex((prev) => prev + 1);
      
      // Speak the AI response
      speak(aiResponse);
    }, 800);
  };

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

  const {
    isListening,
    isSpeaking,
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

  if (!scenario) {
    return <div>Escenario no encontrado</div>;
  }

  // Initial greeting
  useEffect(() => {
    if (!hasGreeted && isSupported) {
      setHasGreeted(true);
      setTimeout(() => {
        speak(scenario.initialMessage);
      }, 500);
    }
  }, [hasGreeted, isSupported, scenario.initialMessage, speak]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  const handleFinish = async () => {
    if (!user) {
      navigate("/feedback");
      return;
    }

    // Calculate session duration
    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

    // Generate random scores (simulated for MVP)
    const confidence = Math.floor(Math.random() * 30) + 60; // 60-90
    const fluency = Math.floor(Math.random() * 30) + 50; // 50-80
    const tone = Math.floor(Math.random() * 30) + 65; // 65-95

    // Save session and check achievements
    const { xpEarned, newAchievements } = await saveSession({
      userId: user.id,
      scenarioType: tipo || "casual",
      confidenceScore: confidence,
      fluencyScore: fluency,
      toneScore: tone,
      durationSeconds,
    });

    // Navigate to feedback with results
    navigate("/feedback", {
      state: {
        scores: { confidence, fluency, tone },
        xpEarned,
        newAchievements,
      },
    });
  };

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
          
          {!isSupported && (
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

          {/* Mensaje inicial */}
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

          {/* Transcripción en tiempo real */}
          {isListening && transcript && (
            <div className="flex items-start gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300" role="article" aria-label="Tu respuesta en progreso" aria-live="polite">
              <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center shadow-soft backdrop-blur-sm" aria-hidden="true">
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex-1 rounded-2xl p-4 shadow-soft bg-primary/80 text-primary-foreground backdrop-blur-sm border-2 border-primary">
                <p className="italic opacity-80">{transcript}...</p>
                {showSubtitles && (
                  <span className="sr-only">{transcript}</span>
                )}
              </div>
            </div>
          )}

          {/* Mensajes de la conversación */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              role="article"
              aria-label={message.role === "user" ? "Tu mensaje" : "Mensaje del asistente"}
            >
              {message.role === "ai" && (
                <Avatar className="w-12 h-12 bg-gradient-hero shadow-soft" aria-hidden="true">
                  <AvatarFallback className="text-2xl bg-transparent">
                    {scenario.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`flex-1 rounded-2xl p-4 shadow-soft backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-primary/90 text-primary-foreground"
                    : "bg-secondary/80 text-foreground"
                }`}
              >
                <p className="leading-relaxed">{message.text}</p>
                {showSubtitles && (
                  <span className="sr-only" aria-live="polite">{message.text}</span>
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

        {/* Campo de entrada de texto alternativo */}
        <div className="bg-card rounded-2xl shadow-soft p-4 border border-border/50" role="region" aria-label="Entrada de texto alternativa">
          <Label htmlFor="text-input" className="text-sm font-medium mb-2 block">
            Escribe tu respuesta (alternativa al micrófono)
          </Label>
          <div className="flex gap-2">
            <Textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu respuesta aquí si prefieres no hablar..."
              className="flex-1 min-h-[80px] resize-none"
              aria-label="Campo de texto para responder sin usar el micrófono"
              disabled={isSpeaking}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isSpeaking}
              size="icon"
              className="h-[80px] w-12 bg-gradient-hero"
              aria-label="Enviar respuesta escrita"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4" role="group" aria-label="Controles de la conversación">
          <Button
            onClick={handleToggleListening}
            disabled={isSpeaking || !isSupported}
            className={`flex-1 h-14 text-lg shadow-soft hover:shadow-medium transition-all ${
              isListening 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-gradient-hero"
            }`}
            aria-label={isListening ? "Detener grabación de voz" : "Iniciar grabación de voz"}
            aria-pressed={isListening}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2 animate-pulse" aria-hidden="true" />
                Detener
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" aria-hidden="true" />
                Hablar
              </>
            )}
          </Button>
          <Button
            onClick={handleFinish}
            variant="outline"
            className="h-14 px-8 text-lg border-2 hover:bg-secondary/50"
            aria-label="Finalizar sesión y ver resultados"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Simulacion;
