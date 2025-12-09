import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Volume2, Send, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { useGamefication } from "@/hooks/useGamefication";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useConversation } from "@elevenlabs/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import type { AudioMetrics } from "@/types/audioMetrics";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  console.log("Usuario en Simulacion:", user);
  const { saveSession } = useGamefication();
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string; audioMetrics?: AudioMetrics }>>(
    [],
  );
  const [responseIndex, setResponseIndex] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [isThinking, setIsThinking] = useState(false);
  const aiFinishTimeRef = useRef<number>(0);

  const scenario = scenarioData[tipo as keyof typeof scenarioData];
  const speakRef = useRef<(text: string) => void>(() => { });

  const {
    status,
    sendUserMessage: sendMessage,
    //messages: aiMessages,
    isSpeaking: elIsSpeaking,
    startSession,
    //stopSession,
    endSession: endSession,
    //audio
  } = useConversation({
    onMessage: (msg) => {
      if (msg.source === "ai") {
        setMessages((prev) => [...prev, { role: "ai", text: msg.message }]);
        setResponseIndex((prev) => prev + 1);

        // Reproducir audio ElevenLabs
        if (msg.message) {
          const audioBlob = new Blob([msg.message], { type: "audio/mpeg" });
          const url = URL.createObjectURL(audioBlob);
          const sound = new Audio(url);
          sound.play();
        }
        /*
        // Speak the AI response
        if (speakRef.current) {
          speakRef.current(msg.message);
        }
        */
      }
      if (msg.source === "user") {
        handleUserTranscript(msg.message);
      }
    },
  });

  useEffect(() => {
    const savedSubtitles = localStorage.getItem("subtitles") !== "false";
    setShowSubtitles(savedSubtitles);
  }, []);

  const handleUserTranscript = useCallback(
    async (text: string, metrics?: AudioMetrics) => {
      if (!text.trim()) return;

      console.log(text);

      // Calculate response time
      const responseTime = aiFinishTimeRef.current > 0 ? Date.now() - aiFinishTimeRef.current : 0;

      // Update metrics with response time
      const updatedMetrics = metrics ? { ...metrics, responseTimeMs: responseTime } : undefined;

      // Add user message with audio metrics
      const newUserMessage: { role: "user" | "ai"; text: string; audioMetrics?: AudioMetrics } = {
        role: "user",
        text,
        audioMetrics: updatedMetrics,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      toast.success("Respuesta registrada");
      sendMessage(text);
      setIsThinking(true);

      // Log audio metrics
      if (updatedMetrics) {
        console.log("=== MÉTRICAS DE AUDIO ===");
        console.log(`Duración: ${updatedMetrics.durationMs}ms`);
        console.log(`Palabras: ${updatedMetrics.wordCount}`);
        console.log(`Palabras por minuto: ${updatedMetrics.wordsPerMinute}`);
        console.log(`Volumen promedio: ${updatedMetrics.averageVolume.toFixed(3)}`);
        console.log(`Silencio: ${updatedMetrics.silencePercentage.toFixed(1)}%`);
        console.log(`Muletillas: ${updatedMetrics.fillerWords.join(", ")} (${updatedMetrics.fillerWordCount})`);
        console.log(`Tiempo de respuesta: ${updatedMetrics.responseTimeMs}ms`);
        console.log("========================");
      }

      try {
        // Get AI response from Groq
        const allMessages = [...messages, newUserMessage].map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text,
        }));

        const { data, error } = await supabase.functions.invoke("groq-chat", {
          body: {
            messages: allMessages,
            scenarioType: tipo,
          },
        });

        console.log("Groq response: ", data);

        //if (error) throw error;

        const aiResponse = data.response;
        setMessages((prev) => [...prev, { role: "ai" as const, text: aiResponse }]);
        setResponseIndex((prev) => prev + 1);
        setIsThinking(false);

        // Speak the AI response
        if (speakRef.current) {
          speakRef.current(aiResponse);
          // Mark when AI finishes speaking (approximate based on text length)
          const estimatedSpeakTime = aiResponse.split(" ").length * 300; // ~300ms per word
          setTimeout(() => {
            aiFinishTimeRef.current = Date.now();
          }, estimatedSpeakTime);
        }
      } catch (error) {
        console.error("Error getting AI response:", error);
        toast.error("No pudimos conectar con el asistente. Intenta de nuevo.");
        setIsThinking(false);
        // Restore the message to the input so the user can try again
        setTextInput(text);
        // Remove the optimistic message
        setMessages((prev) => prev.slice(0, -1));
      }
    },
    [messages, tipo],
  );

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

  const handleUndo = () => {
    if (messages.length >= 2) {
      setMessages((prev) => prev.slice(0, -2));
      setResponseIndex((prev) => Math.max(0, prev - 1));
      toast.info("Último intercambio deshecho");
    }
  };

  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, isSupported, error: voiceError } =
    useVoiceInteraction({
      onTranscript: handleUserTranscript,
      language: "es-ES",
    });

  // Handle voice errors
  useEffect(() => {
    if (voiceError) {
      toast.error(`Error de voz: ${voiceError}`);
    }
  }, [voiceError]);

  // Update ref when speak function changes
  useEffect(() => {
    speakRef.current = speak;
  }, [speak]);

  if (!scenario) {
    return <div>Conversación no disponible</div>;
  }


  const [hasStarted, setHasStarted] = useState(false);

  const agentIdByScenario: { [key: string]: string } = {
    entrevista: "agent_0701kb0eptdyebnsvs72wcpdy7nv",
    //entrevista: "agent_3001kazqvrppejmaazabtnj6vv87",
    casual: "agent_1801kb0ezy2aeebb1ahwx3txtn3y",
    presentacion: "agent_8101kb0f45ysefz979b6c9khy4pv",
  };
  const handleStart = () => {
    setHasStarted(true);

    startSession({
      // Aca hay que poner un agente diferente
      agentId: agentIdByScenario[tipo as keyof typeof agentIdByScenario],
      connectionType: "websocket",
    });
    /*
    setTimeout(() => {
      speak(scenario.initialMessage);
    }, 500);
    */
  };

  /* 
  useEffect(() => {
    if (!hasGreeted && isSupported) {
      setHasGreeted(true);
      setTimeout(() => {
        speak(scenario.initialMessage);
      }, 500);
    }
  }, [hasGreeted, isSupported, scenario.initialMessage, speak]);
  */

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  const handleFinish = async () => {
    try {
      toast.loading("Analizando conversación...");

      // Calculate session duration
      const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

      // Analyze conversation with Groq if user is logged in and there are messages
      let confidence = 70;
      let fluency = 65;
      let tone = 70;
      // Check if voice was used
      const hasVoiceMessages = messages.some(m => m.role === 'user' && m.audioMetrics);

      let recommendations: string[] = hasVoiceMessages
        ? [
          "Trabaja en reducir muletillas y pausas innecesarias",
          "Ajusta tu tono para transmitir más seguridad",
          "Intenta mantener un ritmo constante al hablar"
        ]
        : [
          "Intenta expandir más tus respuestas para enriquecer la conversación",
          "Haz preguntas abiertas para demostrar interés en el otro",
          "Mantén un lenguaje claro y empático en todo momento"
        ];

      if (user && messages.length > 0) {
        try {
          const conversationMessages = messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.text,
            audioMetrics: msg.audioMetrics || undefined,
          }));

          const { data, error } = await supabase.functions.invoke("groq-analyze", {
            body: {
              messages: conversationMessages,
              scenarioType: tipo,
            },
          });

          if (!error && data) {
            confidence = data.confidence || confidence;
            fluency = data.fluency || fluency;
            tone = data.tone || tone;
            recommendations = data.recommendations || recommendations;

            // Log explanations to console
            if (data.explanations) {
              console.log("Data en crudo de Groq: ", data);
              console.log("=== ANÁLISIS DE GROQ ===");
              console.log(`\n📊 CONFIANZA: ${confidence}/100`);
              console.log(`Explicación: ${data.explanations.confidence}`);
              console.log(`\n💬 FLUIDEZ: ${fluency}/100`);
              console.log(`Explicación: ${data.explanations.fluency}`);
              console.log(`\n🎯 TONO: ${tone}/100`);
              console.log(`Explicación: ${data.explanations.tone}`);
              console.log("\n======================");
            }
          }
        } catch (error) {
          console.error("Error analyzing conversation:", error);
          toast.error("Error al analizar la conversación, usando valores predeterminados");
        }
      }

      // Calculate Timing Score if there are voice messages
      let timingScore: number | undefined = undefined;
      const voiceMessages = messages.filter(m => m.role === 'user' && m.audioMetrics?.responseTimeMs !== undefined);

      if (voiceMessages.length > 0) {
        const totalResponseTime = voiceMessages.reduce((acc, msg) => acc + (msg.audioMetrics?.responseTimeMs || 0), 0);
        const avgResponseTime = totalResponseTime / voiceMessages.length;

        // Scoring logic: < 2s = 100, > 10s = 60
        // Linear interpolation: 100 - ((avg - 2000) / 8000) * 40
        const rawScore = 100 - ((avgResponseTime - 2000) / 8000) * 40;
        timingScore = Math.round(Math.min(100, Math.max(60, rawScore)));

        console.log(`Average Response Time: ${avgResponseTime}ms, Timing Score: ${timingScore}`);
      }

      toast.dismiss();

      if (user) {
        // Save session and check achievements
        const { xpEarned, newAchievements } = await saveSession({
          userId: user.id,
          scenarioType: tipo || "casual",
          confidenceScore: confidence,
          fluencyScore: fluency,
          toneScore: tone,
          durationSeconds,

          // nuevos
          title: scenario.title, 
          messages: messages,           // Pasas el estado messages completo
          recommendations: recommendations, 
          timingScore: timingScore
        });

        // Navigate to feedback with results
        navigate("/feedback", {
          state: {
            scores: { confidence, fluency, tone, timing: timingScore },
            xpEarned,
            newAchievements,
            recommendations,
          },
        });
      } else {
        // Guest user
        navigate("/feedback", {
          state: {
            scores: { confidence, fluency, tone, timing: timingScore },
            recommendations,
          },
        });
      }
    } catch (error) {
      console.error("Error finishing session:", error);
      toast.error("Error al finalizar la sesión");
    }
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-card rounded-3xl shadow-medium border border-border/50">
            <Avatar className="w-24 h-24 mx-auto bg-gradient-hero shadow-soft">
              <AvatarFallback className="text-4xl bg-transparent">{scenario.avatar}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{scenario.title}</h1>
              <p className="text-muted-foreground">Haz clic en comenzar para iniciar la conversación de voz.</p>
            </div>
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full text-lg h-12 bg-gradient-hero shadow-soft hover:shadow-medium transition-all"
            >
              Comenzar Conversación
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Volver" className="rounded-full w-12 h-12 border-2">
                    <ArrowLeft className="w-6 h-6" aria-hidden="true" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de que quieres salir?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Si sales ahora, perderás el progreso de esta conversación.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => navigate("/escenarios")}>Salir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{scenario.title}</h1>

              {messages.length >= 2 && !isThinking && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleUndo}
                      className="rounded-full hover:bg-secondary"
                      aria-label="Deshacer último intercambio"
                    >
                      <RotateCcw className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Deshacer último intercambio</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!isSupported && (
                <div
                  className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full"
                  role="status"
                  aria-live="polite"
                >
                  Micrófono no detectado
                </div>
              )}
            </div>
          </header>

          {/* Mensaje inicial */}
          {/*
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
          */}
          <div
            className="relative bg-card rounded-3xl shadow-medium p-6 md:p-8 space-y-6 border border-border/50 min-h-[60vh]"
            role="region"
            aria-label="Área de conversación"
          >
            {/* Indicador de estado */}
            <div
              className="absolute top-4 right-4 flex items-center gap-2"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isSpeaking && (
                <div className="flex items-center gap-2 text-primary animate-pulse">
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span className="text-lg ">Hablando...</span>
                </div>
              )}
              {isListening && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-500 animate-pulse">
                  <Mic className="w-6 h-6" aria-hidden="true" />
                  <span className="text-lg">Escuchando...</span>
                </div>
              )}
            </div>

            {/* Mensaje inicial */}
            <div
              className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              role="article"
              aria-label="Mensaje del asistente virtual"
            >
              <Avatar className="w-14 h-14 md:w-16 md:h-16 bg-gradient-hero shadow-soft" aria-hidden="true">
                <AvatarFallback className="text-2xl md:text-3xl bg-transparent">{scenario.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-secondary/80 rounded-2xl p-4 shadow-soft backdrop-blur-sm">
                <p className="text-foreground leading-relaxed">{scenario.initialMessage}</p>
                {showSubtitles && (
                  <span className="sr-only" aria-live="polite">
                    {scenario.initialMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Transcripción en tiempo real */}
            {isListening && transcript && (
              <div
                className="flex items-start gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-2 duration-300"
                role="article"
                aria-label="Tu respuesta en progreso"
                aria-live="polite"
              >
                <div
                  className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center shadow-soft backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1 rounded-2xl p-4 shadow-soft bg-primary/80 text-primary-foreground backdrop-blur-sm border-2 border-primary">
                  <p className="italic opacity-80">{transcript}...</p>
                  {showSubtitles && <span className="sr-only">{transcript}</span>}
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
                aria-label={message.role === "user" ? "Tu mensaje" : "Mensaje del asistente"}
              >
                {message.role === "ai" && (
                  <Avatar
                    className="w-12 h-12 md:w-16 md:h-16 bg-gradient-hero shadow-soft border-2 border-background"
                    aria-hidden="true"
                  >
                    <AvatarFallback className="text-2xl md:text-3xl bg-transparent">{scenario.avatar}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex-1 rounded-3xl p-6 shadow-soft backdrop-blur-sm text-lg md:text-xl leading-relaxed ${message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/90 text-foreground border-2 border-border/50"
                    }`}
                >
                  <p>{message.text}</p>
                  {showSubtitles && (
                    <span className="sr-only" aria-live="polite">
                      {message.text}
                    </span>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
                      onClick={() => speak(message.text)}
                      title="Reproducir mensaje"
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {message.role === "user" && (
                  <div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent flex items-center justify-center shadow-soft border-2 border-background"
                    aria-hidden="true"
                  >
                    <span className="text-2xl md:text-3xl">👤</span>
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de "Escribiendo..." */}
            {isThinking && (
              <div
                className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                role="status"
                aria-label="El asistente está pensando"
              >
                <Avatar
                  className="w-12 h-12 md:w-16 md:h-16 bg-gradient-hero shadow-soft border-2 border-background"
                  aria-hidden="true"
                >
                  <AvatarFallback className="text-2xl md:text-3xl bg-transparent">{scenario.avatar}</AvatarFallback>
                </Avatar>
                <div className="bg-secondary/90 rounded-3xl p-6 shadow-soft backdrop-blur-sm border-2 border-border/50 flex items-center gap-1 h-[88px]">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"></div>
                  <span className="sr-only">Pensando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Campo de entrada de texto alternativo */}
          <div
            className="bg-card rounded-2xl shadow-soft p-4 border border-border/50"
            role="region"
            aria-label="Entrada de texto alternativa"
          >
            <Label htmlFor="text-input" className="text-sm font-medium mb-2 block">
              Responder
            </Label>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      onClick={handleToggleListening}
                      variant={isListening ? "destructive" : "default"}
                      size="icon-xl"
                      className={`${isListening ? "animate-pulse" : "bg-gradient-hero text-white"}`}
                      aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
                      disabled={!isSupported || !!voiceError || isThinking}
                    >
                      {isListening ? <MicOff /> : <Mic />}
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {!isSupported
                    ? "Tu navegador no soporta reconocimiento de voz"
                    : voiceError
                      ? "Error accediendo al micrófono"
                      : isThinking
                        ? "Procesando respuesta..."
                        : isListening
                          ? "Detener grabación"
                          : "Iniciar grabación"}
                </TooltipContent>
              </Tooltip>

              <Textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isThinking ? "El asistente está pensando..." : "Escribe tu respuesta aquí si prefieres no hablar..."}
                className="flex-1 min-h-[80px] resize-none"
                aria-label="Campo de texto para responder sin usar el micrófono"
                disabled={isSpeaking || isThinking}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || isSpeaking || isThinking}
                size="icon"
                className="h-[80px] w-12 bg-gradient-hero"
                aria-label="Enviar respuesta escrita"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="h-14 px-8 text-lg border-2 hover:bg-secondary/50"
              aria-label="Finalizar sesión y ver resultados"
            >
              Terminar conversación
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Terminar conversación?</AlertDialogTitle>
              <AlertDialogDescription>
                Se analizará la conversación hasta este punto y se generarán tus resultados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleFinish}>Terminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Simulacion;
