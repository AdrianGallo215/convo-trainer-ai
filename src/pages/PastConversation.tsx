import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction"; 
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// --- 1. DEFINICIÓN DE TIPOS ---
interface Message {
  role: "user" | "ai";
  text: string;
  audioMetrics?: any;
}

interface ConversationViewerProps {
  initialMessages?: Message[];
  scenarioTitle?: string;
  scenarioAvatar?: string;
}


// --- 2. DATOS MOCKEADOS (Escenario: Entrevista Frontend) ---
const DEMO_MESSAGES: Message[] = [
  {
    role: "ai",
    text: "Hola, bienvenido a la entrevista técnica. He revisado tu portafolio y veo proyectos interesantes en React. ¿Podrías explicarme qué es el Virtual DOM y por qué mejora el rendimiento?",
    audioMetrics: { duration: 5.2 }
  },
  {
    role: "user",
    text: "Claro. El Virtual DOM es una representación ligera del DOM real en memoria. React lo usa para comparar el estado actual con el nuevo (diffing) y solo actualiza en el DOM real los nodos que han cambiado, evitando repintados costosos de toda la página.",
    audioMetrics: { duration: 8.5 }
  },
  {
    role: "ai",
    text: "Exacto, buena explicación. Ahora, hablemos de gestión de estado. ¿En qué situación preferirías usar Context API sobre una librería externa como Redux o Zustand?",
    audioMetrics: { duration: 6.1 }
  },
  {
    role: "user",
    text: "Usaría Context API para estados globales simples que no cambian con mucha frecuencia, como el tema (oscuro/claro) o la autenticación del usuario. Para estados complejos con muchas actualizaciones frecuentes, preferiría Zustand para evitar re-renders innecesarios.",
    audioMetrics: { duration: 9.0 }
  },
  {
    role: "ai",
    text: "Entiendo. Me parece un criterio sólido. Pasemos al siguiente punto...",
    audioMetrics: { duration: 2.5 }
  }
];

// --- 3. COMPONENTE ---
const PastConversation = ({ 
  // Usamos los datos mockeados como valor por defecto aquí
  initialMessages = DEMO_MESSAGES, 
  scenarioTitle = "Entrevista Frontend Sr.", 
  scenarioAvatar = "👨‍💻" 
}: ConversationViewerProps) => {
  const navigate = useNavigate();
  

  const id = 2
const { data: sessionData, isLoading, error } = useQuery({
    queryKey: ['user_sessions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*') // Asegúrate de que esto traiga la columna de los mensajes
        .eq('id', id as string)
        .single();

      if (error) throw error;
      return data;
    },
    // Solo ejecuta si hay ID en la URL. 
    enabled: !!id, 
  });
// sessionData se va a renderizar en el front
// id viene de useParams

  const [messages] = useState<Message[]>(initialMessages);
  
  // Hook de voz (asumiendo que existe en tu proyecto)
  const { 
    isSpeaking, 
    speak, 
    stopSpeaking 
  } = useVoiceInteraction({
    onTranscript: () => {},
    language: "es-ES",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
          
          {/* HEADER DEL VISOR */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate(-1)} 
                variant="outline" 
                size="icon" 
                className="rounded-full w-12 h-12 border-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>

              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {scenarioTitle}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {messages.length} mensajes intercambiados
                </span>
              </div>
            </div>

            {/* Indicador de Audio */}
            <div className="flex items-center gap-4">
              {isSpeaking && (
                <div className="flex items-center gap-2 text-primary animate-pulse">
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Reproduciendo...</span>
                </div>
              )}
            </div>
          </header>

          {/* AREA DE MENSAJES */}
          <div
            className="relative bg-card rounded-3xl shadow-medium p-6 md:p-8 space-y-8 border border-border/50 min-h-[60vh]"
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No hay mensajes para mostrar.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }} // Delay escalonado para efecto visual
                >
                  {/* AVATAR IA */}
                  {message.role === "ai" && (
                    <Avatar className="w-10 h-10 md:w-14 md:h-14 border border-border bg-secondary flex items-center justify-center">
                      <AvatarFallback className="text-xl bg-transparent">
                        {scenarioAvatar}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* AVATAR USER */}
                  {message.role === "user" && (
                    <Avatar className="w-10 h-10 md:w-14 md:h-14 border border-border bg-primary flex items-center justify-center">
                       <span className="text-xl">👤</span>
                    </Avatar>
                  )}

                  {/* BURBUJA DE TEXTO */}
                  <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-6 py-4 shadow-sm text-base md:text-lg leading-relaxed ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-secondary text-secondary-foreground border border-border/50 rounded-tl-sm"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>

                    {/* METADATA Y AUDIO */}
                    <div className="flex items-center gap-2 mt-2 px-1">
                      <span className="text-xs text-muted-foreground uppercase font-semibold">
                        {message.role === "user" ? "Tú" : "AI"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-50 hover:opacity-100 hover:bg-accent"
                        onClick={() => {
                            stopSpeaking(); 
                            speak(message.text);
                        }}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PastConversation;