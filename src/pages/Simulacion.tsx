import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";

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
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);

  const scenario = scenarioData[tipo as keyof typeof scenarioData];

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

  const handleFinish = () => {
    navigate("/feedback");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/escenarios">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{scenario.title}</h1>
          </div>
          
          {!isSupported && (
            <div className="text-sm text-muted-foreground">
              Voz no disponible
            </div>
          )}
        </div>

        <div className="relative bg-card rounded-3xl shadow-medium p-6 md:p-8 space-y-6 border border-border/50 min-h-[60vh]">
          {/* Indicador de estado */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isSpeaking && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Hablando...</span>
              </div>
            )}
            {isListening && (
              <div className="flex items-center gap-2 text-destructive animate-pulse">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm">Escuchando...</span>
              </div>
            )}
          </div>

          {/* Mensaje inicial */}
          <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Avatar className="w-14 h-14 md:w-16 md:h-16 bg-gradient-hero shadow-soft">
              <AvatarFallback className="text-2xl md:text-3xl bg-transparent">
                {scenario.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-secondary/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
              <p className="text-foreground leading-relaxed">{scenario.initialMessage}</p>
            </div>
          </div>

          {/* Transcripción en tiempo real */}
          {isListening && transcript && (
            <div className="flex items-start gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center shadow-soft backdrop-blur-sm">
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
              className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.role === "ai" && (
                <Avatar className="w-12 h-12 bg-gradient-hero shadow-soft">
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
              </div>
              {message.role === "user" && (
                <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center shadow-soft backdrop-blur-sm">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleToggleListening}
            disabled={isSpeaking || !isSupported}
            className={`flex-1 h-14 text-lg shadow-soft hover:shadow-medium transition-all ${
              isListening 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-gradient-hero"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2 animate-pulse" />
                Detener
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Hablar
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
    </div>
  );
};

export default Simulacion;
