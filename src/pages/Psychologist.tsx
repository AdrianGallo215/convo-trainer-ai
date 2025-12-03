import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, TrendingUp, Award, Activity, Clock, Target, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatientItem {
  id: string;
  full_name: string;
  level: number;
  xp: number;
  total_sessions: number;
}

interface Profile {
  id: string;
  full_name: string;
  level: number;
  xp: number;
  streak_days: number;
  total_sessions: number;
  last_practice_date: string | null;
}

interface Statistics {
  avg_confidence: number;
  avg_fluency: number;
  avg_tone: number;
  total_practice_time: number;
  best_scenario: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  icon: string;
  unlocked: boolean;
}

export default function PsychologistPage() {
  const { user, isPsychologist } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPsychologist) {
      fetchPatients();
    }
  }, [isPsychologist]);

  const fetchPatients = async (query = "") => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from("profiles")
        .select("id, full_name, level, xp, total_sessions")
        .order("total_sessions", { ascending: false })
        .limit(50);

      if (query.trim()) {
        queryBuilder = queryBuilder.ilike("full_name", `%${query}%`);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPatient = async (patientId: string) => {
    setLoading(true);
    setSelectedPatient(patientId);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", patientId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch statistics
      const { data: statsData, error: statsError } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", patientId)
        .single();

      if (statsError) throw statsError;
      setStats(statsData);

      // Fetch achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*")
        .order("requirement_value", { ascending: true });

      const { data: unlockedAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", patientId);

      const unlockedIds = new Set(unlockedAchievements?.map(ua => ua.achievement_id) || []);

      const achievementsWithStatus = (allAchievements || []).map(ach => ({
        ...ach,
        unlocked: unlockedIds.has(ach.id)
      }));

      setAchievements(achievementsWithStatus);
    } catch (error) {
      console.error("Error loading patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Alert>
            <AlertDescription>Por favor, inicia sesión para acceder al panel de psicólogo.</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (!isPsychologist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertDescription>No tienes permisos para acceder a esta página.</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const xpForNextLevel = profile ? profile.level * 100 + (profile.level - 1) * 50 : 0;
  const xpProgress = profile ? (profile.xp / xpForNextLevel) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Panel de Psicólogo</h1>
            <p className="text-muted-foreground mt-2">Revisa el progreso de tus pacientes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Directorio de Pacientes</CardTitle>
            <CardDescription>Encuentra pacientes por nombre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => fetchPatients(searchQuery)}>Buscar</Button>
            </div>

            {loading && (
              <div className="flex justify-center mt-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            <div className="mt-6 space-y-2">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => openPatient(patient.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-secondary/50 ${selectedPatient === patient.id ? "bg-secondary border-primary" : "bg-card"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {patient.full_name?.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.full_name || "Sin nombre"}</p>
                        <p className="text-sm text-muted-foreground">
                          Nivel {patient.level} • {patient.total_sessions} sesiones
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{patient.xp} XP</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Información del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm">{profile.full_name || "Sin nombre"}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Nivel {profile.level}</span>
                    <span className="text-muted-foreground">{profile.xp} / {xpForNextLevel} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Racha</p>
                    <p className="text-2xl font-bold">{profile.streak_days} días</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Sesiones</p>
                    <p className="text-2xl font-bold">{profile.total_sessions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Resumen de Progreso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confianza Promedio</span>
                      <Badge variant="secondary">{Math.round(Number(stats.avg_confidence) || 0)}/100</Badge>
                    </div>
                    <Progress value={Number(stats.avg_confidence) || 0} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fluidez Promedio</span>
                      <Badge variant="secondary">{Math.round(Number(stats.avg_fluency) || 0)}/100</Badge>
                    </div>
                    <Progress value={Number(stats.avg_fluency) || 0} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tono Promedio</span>
                      <Badge variant="secondary">{Math.round(Number(stats.avg_tone) || 0)}/100</Badge>
                    </div>
                    <Progress value={Number(stats.avg_tone) || 0} className="h-2" />
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Tiempo total de práctica</span>
                    </div>
                    <span className="font-semibold">{Math.floor((stats.total_practice_time || 0) / 60)} min</span>
                  </div>
                  {stats.best_scenario && (
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span>Mejor escenario</span>
                      </div>
                      <Badge>{stats.best_scenario}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Logros del Paciente
                </CardTitle>
                <CardDescription>
                  {achievements.filter(a => a.unlocked).length} de {achievements.length} logros desbloqueados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all ${achievement.unlocked
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-muted opacity-60"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                              +{achievement.xp_reward} XP
                            </Badge>
                            {achievement.unlocked && (
                              <Badge variant="outline" className="text-xs">
                                ✓ Completado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
