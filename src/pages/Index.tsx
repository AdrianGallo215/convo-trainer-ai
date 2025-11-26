import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, MessageCircle, Target, Eye, Mic, Volume2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
          <div className="container mx-auto px-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              Nuevo: Modo de alto contraste
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto">
              Domina tus habilidades sociales con <span className="text-primary bg-clip-text text-transparent bg-gradient-hero">Inteligencia Artificial</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Práctica realista para entrevistas, charlas casuales y presentaciones. Diseñado para todos, con herramientas de accesibilidad avanzadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/escenarios">
                <Button size="lg" className="h-14 px-8 text-xl font-medium bg-gradient-hero shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto rounded-xl">
                  Comenzar
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-xl font-medium border-2 hover:bg-secondary/50 w-full sm:w-auto rounded-xl">
                    Crear cuenta
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Diseñado para el aprendizaje efectivo</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Escenarios Realistas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interactúa con personajes virtuales en situaciones cotidianas y profesionales diseñadas por expertos.
                </p>
              </div>

              <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Feedback Instantáneo</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Recibe análisis detallado sobre tu tono, fluidez y confianza inmediatamente después de cada sesión.
                </p>
              </div>

              <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">IA Adaptativa</h3>
                <p className="text-muted-foreground leading-relaxed">
                  El sistema aprende de tus respuestas y ajusta la dificultad para mantenerte siempre desafiado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="py-20 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Accesibilidad primero</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Creemos que la educación debe ser accesible para todos. Nuestra plataforma está construida siguiendo las pautas WCAG para garantizar una experiencia inclusiva.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-foreground">
                    <Eye className="w-5 h-5 text-primary" />
                    <span>Modo de alto contraste y tamaños de texto ajustables</span>
                  </li>
                  <li className="flex items-center gap-3 text-foreground">
                    <Mic className="w-5 h-5 text-primary" />
                    <span>Control por voz y lectura de pantalla</span>
                  </li>
                  <li className="flex items-center gap-3 text-foreground">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <span>Feedback auditivo y visual sincronizado</span>
                  </li>
                </ul>
                <Link to="/configuracion">
                  <Button variant="outline" className="mt-4">
                    Explorar opciones de accesibilidad
                  </Button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-secondary to-background p-8 rounded-3xl border border-border/50 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">A</span>
                    </div>
                    <div>
                      <div className="h-2 w-24 bg-foreground/20 rounded mb-2" />
                      <div className="h-2 w-32 bg-foreground/10 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-black border-2 border-yellow-400 rounded-xl shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                      <span className="font-bold text-black">A</span>
                    </div>
                    <div>
                      <div className="h-2 w-24 bg-yellow-400 rounded mb-2" />
                      <div className="h-2 w-32 bg-yellow-400/80 rounded" />
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Ejemplo de modos visuales disponibles
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">ConvoTrainer AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Proyecto de Interacción Humano-Computador 2025-2.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/escenarios" className="hover:text-primary transition-colors">Escenarios</Link></li>
                <li><Link to="/progress" className="hover:text-primary transition-colors">Progreso</Link></li>
                <li><Link to="/configuracion" className="hover:text-primary transition-colors">Accesibilidad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Términos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>soporte@convotrainer.ai</li>
                <li>Universidad Nacional de Ingeniería</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2025 ConvoTrainer AI. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
