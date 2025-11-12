import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in duration-700">
        <div className="space-y-4">
          <div className="inline-block p-4 bg-gradient-hero rounded-2xl shadow-medium mb-4">
            <MessageSquare className="w-16 h-16 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Entrenamiento de Habilidades Sociales
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Mejora tus habilidades sociales con práctica interactiva impulsada por IA
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Link to="/escenarios">
            <Button 
              size="lg" 
              className="w-full max-w-sm text-lg h-14 bg-gradient-hero shadow-medium hover:shadow-soft transition-all duration-300 hover:scale-105"
            >
              Comenzar práctica
            </Button>
          </Link>
          
          <Link to="/configuracion">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full max-w-sm text-lg h-12 border-2 hover:bg-secondary/50 transition-all duration-300"
            >
              <Settings className="w-5 h-5 mr-2" />
              Configuración rápida
            </Button>
          </Link>
        </div>

        <div className="pt-8 flex justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
              <span className="text-2xl">🎯</span>
            </div>
            <span>Escenarios realistas</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
              <span className="text-2xl">💬</span>
            </div>
            <span>IA conversacional</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <span>Feedback detallado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
