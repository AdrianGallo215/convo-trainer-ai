import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Home, RotateCcw } from "lucide-react";

const Feedback = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
        <header className="flex items-center gap-4">
          <Link to="/escenarios" aria-label="Volver a escenarios">
            <Button variant="outline" size="icon" aria-label="Volver"><ArrowLeft className="w-4 h-4" aria-hidden="true" /></Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Resultados de tu sesión</h1>
        </header>

        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8 space-y-8 border border-border/50" role="region" aria-label="Resultados y análisis">
          <section className="space-y-6" aria-labelledby="scores-heading">
            <h2 id="scores-heading" className="text-xl font-semibold text-foreground">Puntuación</h2>
            <div className="space-y-4" role="list" aria-label="Métricas de desempeño">
              <div className="space-y-2" role="listitem">
                <div className="flex justify-between text-sm"><span className="text-foreground font-medium">Confianza</span><span className="text-muted-foreground" aria-label="70 por ciento">70%</span></div>
                <Progress value={70} className="h-3" aria-label="Barra de progreso de confianza" />
              </div>
              <div className="space-y-2" role="listitem">
                <div className="flex justify-between text-sm"><span className="text-foreground font-medium">Fluidez</span><span className="text-muted-foreground" aria-label="60 por ciento">60%</span></div>
                <Progress value={60} className="h-3" aria-label="Barra de progreso de fluidez" />
              </div>
              <div className="space-y-2" role="listitem">
                <div className="flex justify-between text-sm"><span className="text-foreground font-medium">Tono</span><span className="text-muted-foreground" aria-label="75 por ciento">75%</span></div>
                <Progress value={75} className="h-3" aria-label="Barra de progreso de tono" />
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

          <nav className="flex flex-col sm:flex-row gap-4 pt-4" aria-label="Acciones disponibles">
            <Link to="/escenarios" className="flex-1" aria-label="Volver a escenarios para repetir sesión">
              <Button variant="outline" className="w-full h-12 border-2 hover:bg-secondary/50"><RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />Repetir sesión</Button>
            </Link>
            <Link to="/" className="flex-1" aria-label="Volver a la página de inicio">
              <Button className="w-full h-12 bg-gradient-hero shadow-soft hover:shadow-medium transition-all"><Home className="w-4 h-4 mr-2" aria-hidden="true" />Inicio</Button>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default Feedback;
