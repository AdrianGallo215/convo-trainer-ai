import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Home, RotateCcw, TrendingUp, CheckCircle2 } from "lucide-react";

const metrics = [
  { label: "Confianza", value: 70, color: "bg-primary" },
  { label: "Fluidez", value: 60, color: "bg-accent" },
  { label: "Tono", value: 75, color: "bg-success" },
];

const recommendations = [
  "Habla más pausado para mejorar la claridad",
  "Excelente contacto visual durante la conversación",
  "Evita muletillas repetitivas como 'eh' o 'mmm'",
  "Tu lenguaje corporal transmite confianza",
];

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-gradient-to-br from-success to-success/80 rounded-2xl shadow-medium mb-4">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">¡Sesión completada!</h1>
          <p className="text-muted-foreground text-lg">Aquí está tu análisis de rendimiento</p>
        </div>

        <Card className="p-8 space-y-6 bg-gradient-card shadow-medium border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Puntuación</h2>
            </div>
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">{metric.label}</span>
                  <span className="text-muted-foreground font-semibold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-3" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 space-y-4 bg-gradient-card shadow-medium border-border/50">
          <h2 className="text-2xl font-semibold text-foreground">Recomendaciones</h2>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-sm">{index + 1}</span>
                </div>
                <p className="text-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link to="/escenarios" className="flex-1 max-w-xs">
            <Button className="w-full h-14 text-lg bg-gradient-hero shadow-soft hover:shadow-medium transition-all">
              <RotateCcw className="w-5 h-5 mr-2" />
              Repetir sesión
            </Button>
          </Link>
          <Link to="/" className="flex-1 max-w-xs">
            <Button variant="outline" className="w-full h-14 text-lg border-2 hover:bg-secondary/50">
              <Home className="w-5 h-5 mr-2" />
              Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
