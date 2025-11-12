import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const [isListening, setIsListening] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);

  const scenario = scenarioData[tipo as keyof typeof scenarioData];

  if (!scenario) {
    return <div>Escenario no encontrado</div>;
  }

  const handleSpeak = () => {
    setIsListening(true);
    
    // Simulate user speaking
    setTimeout(() => {
      setIsListening(false);
      const userMessage = "Esta es mi respuesta simulada...";
      setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
      
      toast.success("Respuesta registrada");
      
      // AI response
      setTimeout(() => {
        const aiResponse = scenario.responses[responseIndex % scenario.responses.length];
        setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
        setResponseIndex((prev) => prev + 1);
      }, 1000);
    }, 2000);
  };

  const handleFinish = () => {
    navigate("/feedback");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-6">
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <div className="flex items-center gap-4">
          <Link to="/escenarios">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{scenario.title}</h1>
        </div>

        <div className="bg-card rounded-3xl shadow-medium p-8 space-y-6 border border-border/50">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 bg-gradient-hero shadow-soft">
              <AvatarFallback className="text-3xl bg-transparent">
                {scenario.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-secondary rounded-2xl p-4 shadow-soft">
              <p className="text-foreground">{scenario.initialMessage}</p>
            </div>
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {message.role === "ai" && (
                <Avatar className="w-12 h-12 bg-gradient-hero shadow-soft">
                  <AvatarFallback className="text-2xl bg-transparent">
                    {scenario.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`flex-1 rounded-2xl p-4 shadow-soft ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <p>{message.text}</p>
              </div>
              {message.role === "user" && (
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-soft">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleSpeak}
            disabled={isListening}
            className="flex-1 h-14 text-lg bg-gradient-hero shadow-soft hover:shadow-medium transition-all"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2 animate-pulse" />
                Escuchando...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Responder (simulado)
              </>
            )}
          </Button>
          <Button
            onClick={handleFinish}
            variant="outline"
            className="h-14 px-8 text-lg border-2 hover:bg-secondary/50"
          >
            Finalizar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Simulacion;
