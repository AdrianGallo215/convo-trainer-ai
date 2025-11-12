import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Home, RotateCcw, Trophy, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
}

const Feedback = () => {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as {
    scores?: { confidence: number; fluency: number; tone: number };
    xpEarned?: number;
    newAchievements?: Achievement[];
  } | null;

  const [showAchievements, setShowAchievements] = useState(false);

  // Default scores if no state (for guest users)
  const scores = state?.scores || { confidence: 70, fluency: 60, tone: 75 };
  const xpEarned = state?.xpEarned || 0;
  const newAchievements = state?.newAchievements || [];

  useEffect(() => {
    if (newAchievements.length > 0) {
      setTimeout(() => setShowAchievements(true), 800);
    }
  }, [newAchievements.length]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
        <header className="flex items-center gap-4">
          <Link to="/escenarios" aria-label="Volver a escenarios">
            <Button variant="outline" size="icon" aria-label="Volver">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Resultados de tu sesión</h1>
        </header>

        {/* XP Earned Card (if user is logged in) */}
        {user && xpEarned > 0 && (
          <Card className="p-6 bg-gradient-hero text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-center gap-4">
              <Zap className="w-12 h-12" aria-hidden="true" />
              <div className="text-center">
                <p className="text-4xl font-bold">+{xpEarned} XP</p>
                <p className="text-primary-foreground/80">¡Experiencia ganada!</p>
              </div>
            </div>
          </Card>
        )}

        {/* New Achievements */}
        {showAchievements && newAchievements.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" aria-hidden="true" />
              ¡Nuevos logros desbloqueados!
            </h2>
            {newAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-6 bg-primary/10 border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="text-5xl" aria-hidden="true">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{achievement.title}</h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                    <p className="text-sm font-medium text-primary mt-2">+{achievement.xp_reward} XP</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8 space-y-8 border border-border/50" role="region" aria-label="Resultados y análisis">
          <section className="space-y-6" aria-labelledby="scores-heading">
            <h2 id="scores-heading" className="text-xl font-semibold text-foreground">Puntuación</h2>
            <div className="space-y-4" role="list" aria-label="Métricas de desempeño">
              <div className="space-y-2" role="listitem">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">Confianza</span>
                  <span className="text-muted-foreground" aria-label={`${scores.confidence} por ciento`}>{scores.confidence}%</span>
                </div>
                <Progress value={scores.confidence} className="h-3" aria-label="Barra de progreso de confianza" />
              </div>
              <div className="space-y-2" role="listitem">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">Fluidez</span>
                  <span className="text-muted-foreground" aria-label={`${scores.fluency} por ciento`}>{scores.fluency}%</span>
                </div>
                <Progress value={scores.fluency} className="h-3" aria-label="Barra de progreso de fluidez" />
              </div>
              <div className="space-y-2" role="listitem">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">Tono</span>
                  <span className="text-muted-foreground" aria-label={`${scores.tone} por ciento`}>{scores.tone}%</span>
                </div>
                <Progress value={scores.tone} className="h-3" aria-label="Barra de progreso de tono" />
              </div>
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="recommendations-heading">
            <h2 id="recommendations-heading" className="text-xl font-semibold text-foreground">Recomendaciones</h2>
            <div className="bg-secondary/30 rounded-xl p-6 space-y-3" role="list" aria-label="Lista de recomendaciones">
              <p className="text-foreground leading-relaxed" role="listitem">• Habla más pausado.</p>
              <p className="text-foreground leading-relaxed" role="listitem">• Buen contacto visual.</p>
              <p className="text-foreground leading-relaxed" role="listitem">• Evita muletillas repetitivas.</p>
            </div>
          </section>

          {!user && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-foreground text-center">
                <Link to="/auth" className="font-semibold text-primary hover:underline">
                  Inicia sesión
                </Link>
                {" "}para guardar tu progreso y desbloquear logros
              </p>
            </div>
          )}

          <nav className="flex flex-col sm:flex-row gap-4 pt-4" aria-label="Acciones disponibles">
            <Link to="/escenarios" className="flex-1" aria-label="Volver a escenarios para repetir sesión">
              <Button variant="outline" className="w-full h-12 border-2 hover:bg-secondary/50">
                <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                Repetir sesión
              </Button>
            </Link>
            {user && (
              <Link to="/progress" className="flex-1" aria-label="Ver mi progreso completo">
                <Button variant="outline" className="w-full h-12 border-2 hover:bg-secondary/50">
                  <Trophy className="w-4 h-4 mr-2" aria-hidden="true" />
                  Ver Progreso
                </Button>
              </Link>
            )}
            <Link to="/" className="flex-1" aria-label="Volver a la página de inicio">
              <Button className="w-full h-12 bg-gradient-hero shadow-soft hover:shadow-medium transition-all">
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                Inicio
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default Feedback;
