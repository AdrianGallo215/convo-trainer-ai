import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Calendar, Award, TrendingUp, Zap, Loader2 } from "lucide-react";

interface PatientItem {
  id: string;
  full_name: string | null;
  username: string | null;
}

interface Profile {
  xp: number;
  level: number;
  streak_days: number;
  total_sessions: number;
}

interface Statistics {
  avg_confidence: number | null;
  avg_fluency: number | null;
  avg_tone: number | null;
  total_practice_time: number;
  best_scenario: string | null;
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

const ModeratorPage = () => {
  const { user, isModerator } = useAuth();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isModerator) return;
    // load recent patients by default
    fetchPatients();
  }, [isModerator]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      if (!search) {
        const { data } = await supabase.from("profiles").select("id, full_name, username").limit(50).order('created_at', { ascending: false } as any);
        setPatients(data || []);
      } else {
        const q = `%${search}%`;
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, username")
          .or(`full_name.ilike.${q},username.ilike.${q}`);
        setPatients(data || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const openPatient = async (patient: PatientItem) => {
    setSelectedPatient(patient);
    setProfile(null);
    setStats(null);
    setAchievements([]);

    try {
      setLoading(true);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("xp, level, streak_days, total_sessions")
        .eq("id", patient.id)
        .single();

      if (profileData) setProfile(profileData as Profile);

      const { data: statsData } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", patient.id)
        .single();

      if (statsData) setStats(statsData as Statistics);

      const { data: allAchievements } = await supabase.from("achievements").select("*").order("xp_reward");
      const { data: unlockedIds } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", patient.id);

      const unlockedMap = new Map((unlockedIds || []).map((u: any) => [u.achievement_id, u.unlocked_at]));
      const achievementsWithStatus = (allAchievements || []).map((ach: any) => ({ ...ach, unlocked_at: unlockedMap.get(ach.id) }));
      setAchievements(achievementsWithStatus as Achievement[]);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen p-6">Accede para ver esta sección.</main>
    );
  }

  if (!isModerator) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-bold">Acceso denegado</h2>
            <p className="text-muted-foreground mt-2">Necesitas ser moderador para ver las estadísticas de pacientes.</p>
          </Card>
        </div>
      </main>
    );
  }

  const xpForNextLevel = profile ? (profile.level * 100) + ((profile.level - 1) * 50) : 100;
  const xpProgress = profile ? (profile.xp / xpForNextLevel) * 100 : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6 py-4 md:py-8">
        <header className="flex items-center gap-4">
          <Link to="/" aria-label="Volver a inicio">
            <Button variant="outline" size="icon" aria-label="Volver" className="rounded-full w-12 h-12 border-2">
              <ArrowLeft className="w-6 h-6" aria-hidden="true" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Panel de Moderador</h1>
        </header>

        <Card className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label>Buscar paciente</Label>
              <div className="flex gap-2 mt-2">
                <Input placeholder="Nombre o usuario" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button onClick={fetchPatients} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
                </Button>
              </div>

              <div className="mt-4 space-y-2 max-h-96 overflow-auto">
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openPatient(p)}
                    className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${selectedPatient?.id === p.id ? 'bg-primary/10 border-primary/30' : 'bg-card hover:bg-secondary/50'}`}
                  >
                    <div className="font-medium">{p.full_name || p.username || "Usuario sin nombre"}</div>
                    <div className="text-sm text-muted-foreground">{p.username}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              {!selectedPatient && (
                <div className="text-muted-foreground">Selecciona un paciente para ver sus estadísticas.</div>
              )}

              {selectedPatient && (
                <>
                  <h2 className="text-xl font-bold mb-4">{selectedPatient.full_name || selectedPatient.username}</h2>

                  <Card className="p-6 mb-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-medium">
                        {profile?.level || 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">Nivel {profile?.level || 1}</h3>
                        <p className="text-muted-foreground">{profile?.xp || 0} / {xpForNextLevel} XP</p>
                        <Progress value={xpProgress} className="h-3 mt-2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{profile?.streak_days || 0}</p>
                        <p className="text-sm text-muted-foreground">Días de racha</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{profile?.total_sessions || 0}</p>
                        <p className="text-sm text-muted-foreground">Sesiones totales</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold">{Math.floor((stats?.total_practice_time || 0) / 60)}</p>
                        <p className="text-sm text-muted-foreground">Minutos practicados</p>
                      </div>
                    </div>
                  </Card>

                  {stats && (
                    <Card className="p-6 mb-4">
                      <h3 className="text-lg font-bold mb-3"><Trophy className="inline-block w-4 h-4 mr-2" />Estadísticas</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Confianza promedio</p>
                          <p className="text-2xl font-bold">{Math.round(stats.avg_confidence || 0)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fluidez promedio</p>
                          <p className="text-2xl font-bold">{Math.round(stats.avg_fluency || 0)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tono promedio</p>
                          <p className="text-2xl font-bold">{Math.round(stats.avg_tone || 0)}%</p>
                        </div>
                      </div>
                      {stats.best_scenario && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                          <p className="text-sm text-muted-foreground">Mejor escenario</p>
                          <p className="text-lg font-semibold text-primary capitalize">{stats.best_scenario}</p>
                        </div>
                      )}
                    </Card>
                  )}

                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-3"><Award className="inline-block w-4 h-4 mr-2" />Logros</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className={`p-4 rounded-lg border ${achievement.unlocked_at ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border opacity-60'}`}>
                          <div className="flex items-start gap-3">
                            <div className="text-3xl" aria-hidden="true">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-medium text-primary">+{achievement.xp_reward} XP</span>
                                {achievement.unlocked_at && (
                                  <span className="text-xs text-muted-foreground">• Desbloqueado {new Date(achievement.unlocked_at).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default ModeratorPage;
