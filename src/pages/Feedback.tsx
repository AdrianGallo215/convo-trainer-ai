import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home, RotateCcw, Trophy, Zap, Clock, Heart, Sparkles, CheckCircle2, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
}

const CircularProgress = ({ value, size = 200, strokeWidth = 15 }: { value: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 270 degrees
  const dashOffset = arcLength - (value / 100) * arcLength;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform rotate-[135deg]"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
          strokeDasharray={arcLength}
          strokeDashoffset={0}
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-primary transition-all duration-1000 ease-out"
          strokeDasharray={arcLength}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center transform rotate-0">
        <span className="text-6xl font-bold tracking-tighter">{Math.round(value)}</span>
        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide mt-1">Puntuación General</span>
      </div>
    </div>
  );
};

const MetricBar = ({ label, value, colorClass, icon: Icon }: { label: string; value: number; colorClass: string; icon: any }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-1">
      <div className={`p-1.5 rounded-full ${colorClass.replace("bg-", "bg-opacity-20 bg-").replace("h-full", "")} `}>
        <Icon className={`w-4 h-4 ${colorClass.replace("bg-", "text-")}`} />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right">{Math.round(value)}</span>
    </div>
  </div>
);

const Feedback = () => {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as {
    scores?: { confidence: number; fluency: number; tone: number; timing?: number };
    xpEarned?: number;
    newAchievements?: Achievement[];
    recommendations?: string[];
  } | null;

  const [showContent, setShowContent] = useState(false);

  // Default scores and recommendations if no state (for guest users)
  const scores = state?.scores || { confidence: 0, fluency: 0, tone: 0 };
  const xpEarned = state?.xpEarned || 0;
  const newAchievements = state?.newAchievements || [];

  // Determine if it was a voice session based on the presence of timing score
  const isVoiceSession = scores.timing !== undefined;

  // Default recommendations based on session type
  const defaultRecommendations = isVoiceSession
    ? [
      "Trabaja en reducir muletillas y pausas innecesarias.",
      "Ajusta tu tono para transmitir más seguridad.",
      "Intenta mantener un ritmo constante al hablar."
    ]
    : [
      "Intenta expandir más tus respuestas para enriquecer la conversación.",
      "Haz preguntas abiertas para demostrar interés en el otro.",
      "Mantén un lenguaje claro y empático en todo momento."
    ];

  const recommendations = state?.recommendations || defaultRecommendations;

  // Calculate overall score
  const availableScores = [scores.confidence, scores.fluency, scores.tone];
  if (scores.timing !== undefined) availableScores.push(scores.timing);
  const overallScore = availableScores.reduce((a, b) => a + b, 0) / availableScores.length;

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-8 px-4 md:py-12">
      <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header */}
        <div className="text-center space-y-2 mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Escenario Completado</h1>
          <p className="text-muted-foreground text-lg">¡Buen trabajo! Veamos cómo te fue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Score & Stats */}
          <div className="space-y-8 flex flex-col h-full">
            {/* Circular Score - Expands to fill available space */}
            <div className="flex-1 flex items-center justify-center py-8 bg-card rounded-3xl shadow-sm border border-border/50 min-h-[300px]">
              <CircularProgress value={overallScore} size={280} strokeWidth={20} />
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between px-6 py-4 bg-card rounded-2xl border border-border/50 shadow-sm w-full shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="font-bold text-lg">+{xpEarned} XP</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Trophy className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium">Escenario Completado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Metrics & Insights */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Metrics */}
            <div className="space-y-6 bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50">
              <h3 className="font-semibold text-lg mb-4">Desglose de Métricas</h3>
              <MetricBar
                label="Confianza"
                value={scores.confidence}
                colorClass="bg-purple-500"
                icon={Trophy}
              />
              <MetricBar
                label="Claridad"
                value={scores.fluency}
                colorClass="bg-blue-400"
                icon={Activity}
              />
              <MetricBar
                label="Empatía"
                value={scores.tone}
                colorClass="bg-sky-400"
                icon={Heart}
              />
              {scores.timing !== undefined && (
                <MetricBar
                  label="Ritmo"
                  value={scores.timing}
                  colorClass="bg-indigo-500"
                  icon={Clock}
                />
              )}
            </div>

            {/* AI Insights - Expands if needed */}
            <div className="flex-1 bg-secondary/30 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                <Sparkles className="w-5 h-5" />
                <h3>Análisis de IA</h3>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground/80 uppercase tracking-wide">Recomendaciones</h4>
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="text-muted-foreground leading-relaxed flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Full Width Outside Grid */}
        <Link to="/escenarios" className="block mt-8 md:mt-12">
          <Button className="w-full h-14 text-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            Terminar
          </Button>
        </Link>

      </div>
    </main>
  );
};

export default Feedback;
