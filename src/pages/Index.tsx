import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, MessageCircle, Target, Settings, LogIn, LogOut, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-center mb-6" aria-hidden="true">
              <div className="w-20 h-20 rounded-full bg-gradient-hero shadow-medium flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Entrenamiento de Habilidades Sociales</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Mejora tus habilidades de comunicación con simulaciones interactivas impulsadas por IA</p>
          </header>

          <section className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "0.2s" }} aria-label="Características principales">
            <article className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 space-y-3">
              <MessageCircle className="w-10 h-10 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">Conversaciones Reales</h2>
              <p className="text-muted-foreground">Practica situaciones del día a día con escenarios realistas</p>
            </article>
            <article className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 space-y-3">
              <Target className="w-10 h-10 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">Feedback Inmediato</h2>
              <p className="text-muted-foreground">Recibe análisis y sugerencias para mejorar tus habilidades</p>
            </article>
            <article className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 space-y-3">
              <Brain className="w-10 h-10 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">Aprendizaje Adaptativo</h2>
              <p className="text-muted-foreground">La IA se adapta a tu nivel y te propone retos personalizados</p>
            </article>
          </section>

          <nav className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "0.4s" }} aria-label="Acciones principales">
            {user ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/escenarios" aria-label="Ir a selección de escenarios">
                    <Button size="lg" className="h-14 px-8 text-lg bg-gradient-hero shadow-medium hover:shadow-soft transition-all">
                      Comenzar práctica
                    </Button>
                  </Link>
                  <Link to="/progress" aria-label="Ver mi progreso">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
                      <TrendingUp className="w-5 h-5 mr-2" aria-hidden="true" />
                      Mi Progreso
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-4 justify-center">
                  <Link to="/configuracion" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2" aria-label="Configuración">
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Configuración
                  </Link>
                  <button onClick={() => signOut()} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2" aria-label="Cerrar sesión">
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/escenarios" aria-label="Ir a selección de escenarios">
                  <Button size="lg" className="h-14 px-8 text-lg bg-gradient-hero shadow-medium hover:shadow-soft transition-all">
                    Comenzar práctica
                  </Button>
                </Link>
                <div className="flex gap-4 justify-center">
                  <Link to="/auth" className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 font-medium" aria-label="Iniciar sesión para guardar progreso">
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    Iniciar Sesión para Guardar Progreso
                  </Link>
                  <Link to="/configuracion" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2" aria-label="Configuración">
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Configuración
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </main>
  );
};

export default Index;
