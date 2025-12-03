import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award, Zap, TrendingUp, Calendar, Trophy } from "lucide-react";

const ProgressPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showPlan = location.state?.fromQuestionnaire;

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id as string)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: stats } = useQuery({
    queryKey: ['user_statistics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', user?.id as string)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsError) throw achievementsError;

      const { data: userAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user?.id as string);

      if (userAchievementsError) throw userAchievementsError;

      return allAchievements.map(achievement => ({
        ...achievement,
        unlocked_at: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at
      }));
    },
    enabled: !!user?.id,
  });

  const unlockedCount = achievements.filter(a => a.unlocked_at).length;
  const xpForNextLevel = (profile?.level || 1) * 1000;
  const xpProgress = Math.min(100, ((profile?.xp || 0) / xpForNextLevel) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6 py-4 md:py-8">
        <header className="flex items-center gap-4">
          <Link to="/" aria-label="Volver a inicio">
            <Button variant="outline" size="icon" aria-label="Volver">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mi Progreso</h1>
        </header>

        {showPlan && (
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 shadow-lg animate-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Award className="w-5 h-5" />
                  Plan Personalizado Listo
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Tu camino hacia una voz confiada</h2>
                <p className="text-lg text-gray-600">
                  Basado en tus respuestas, hemos diseñado un plan de 4 semanas para mejorar tu proyección y claridad.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/60 p-4 rounded-xl border border-primary/10">
                    <h3 className="font-bold text-primary mb-1">Semana 1: Fundamentos</h3>
                    <p className="text-sm text-gray-600">Respiración y postura vocal.</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl border border-primary/10">
                    <h3 className="font-bold text-primary mb-1">Semana 2: Claridad</h3>
                    <p className="text-sm text-gray-600">Articulación y eliminación de muletillas.</p>
                  </div>
                </div>
                <Button className="mt-4 w-full sm:w-auto text-lg h-12 px-8 shadow-xl shadow-primary/20" size="lg">
                  Comenzar mi Plan
                </Button>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                {/* Placeholder for a graph or visual */}
                <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-white">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-primary">92%</span>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Potencial</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin-slow" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Level & XP Card */}
        <Card className="p-6 md:p-8 bg-gradient-card border-border/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-medium">
              {profile?.level || 1}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Nivel {profile?.level || 1}</h2>
              <p className="text-muted-foreground">{profile?.xp || 0} / {xpForNextLevel} XP</p>
              <Progress value={xpProgress} className="h-3 mt-2" aria-label={`Progreso de nivel: ${Math.round(xpProgress)}%`} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <Zap className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-foreground">{profile?.streak_days || 0}</p>
              <p className="text-sm text-muted-foreground">Días de racha</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-foreground">{profile?.total_sessions || 0}</p>
              <p className="text-sm text-muted-foreground">Sesiones totales</p>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
              <p className="text-2xl font-bold text-foreground">{Math.floor((stats?.total_practice_time || 0) / 60)}</p>
              <p className="text-sm text-muted-foreground">Minutos practicados</p>
            </div>
          </div>
        </Card>

        {/* Statistics Card */}
        {stats && (
          <Card className="p-6 md:p-8 bg-card border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" aria-hidden="true" />
              Estadísticas
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Confianza promedio</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(stats.avg_confidence || 0)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fluidez promedio</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(stats.avg_fluency || 0)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tono promedio</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(stats.avg_tone || 0)}%</p>
              </div>
            </div>
            {stats.best_scenario && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Tu mejor escenario</p>
                <p className="text-lg font-semibold text-primary capitalize">{stats.best_scenario}</p>
              </div>
            )}
          </Card>
        )}

        {/* Achievements Card */}
        <Card className="p-6 md:p-8 bg-card border-border/50">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" aria-hidden="true" />
            Logros ({unlockedCount}/{achievements.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${achievement.unlocked_at
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/30 border-border opacity-60"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl" aria-hidden="true">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-primary">+{achievement.xp_reward} XP</span>
                      {achievement.unlocked_at && (
                        <span className="text-xs text-muted-foreground">
                          • Desbloqueado {new Date(achievement.unlocked_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-center">
          <Link to="/escenarios">
            <Button className="h-12 px-8 bg-gradient-hero">Seguir Practicando</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ProgressPage;
