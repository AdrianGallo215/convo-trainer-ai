import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Zap, TrendingUp, Calendar, Award } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  xp: number;
  level: number;
  streak_days: number;
  total_sessions: number;
}

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  unlocked_at?: string;
}

interface Statistics {
  avg_confidence: number;
  avg_fluency: number;
  avg_tone: number;
  total_practice_time: number;
  best_scenario: string;
}

const ProgressPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("xp, level, streak_days, total_sessions")
          .eq("id", user.id)
          .single();

        if (profileData) setProfile(profileData);

        // Fetch achievements (all + unlocked)
        const { data: allAchievements } = await supabase
          .from("achievements")
          .select("*")
          .order("xp_reward");

        const { data: unlockedIds } = await supabase
          .from("user_achievements")
          .select("achievement_id, unlocked_at")
          .eq("user_id", user.id);

        const unlockedMap = new Map(unlockedIds?.map(u => [u.achievement_id, u.unlocked_at]) || []);
        const achievementsWithStatus = allAchievements?.map(ach => ({
          ...ach,
          unlocked_at: unlockedMap.get(ach.id)
        })) || [];

        setAchievements(achievementsWithStatus);

        // Fetch statistics
        const { data: statsData } = await supabase
          .from("user_statistics")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (statsData) setStats(statsData);
      } catch (error) {
        toast.error("Error al cargar progreso");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando progreso...</div>
      </main>
    );
  }

  const xpForNextLevel = profile ? (profile.level * 100) + ((profile.level - 1) * 50) : 100;
  const xpProgress = profile ? (profile.xp / xpForNextLevel) * 100 : 0;
  const unlockedCount = achievements.filter(a => a.unlocked_at).length;

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
                className={`p-4 rounded-lg border ${
                  achievement.unlocked_at
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
