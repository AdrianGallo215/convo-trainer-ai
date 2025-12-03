import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, MessageCircle, Target, Eye, Mic, Volume2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const RiveSection = ({ src, height = "h-[500px]", children }: { src: string, height?: string, children?: React.ReactNode }) => {
  const { RiveComponent } = useRive({
    src: src,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <div className="absolute inset-0 w-full h-full">
        <RiveComponent />
      </div>
      {/* Overlay gradient for text readability if needed */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/10 pointer-events-none" />

      {children && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          {children}
        </div>
      )}
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. Talker Animation - Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col">
          <div className="absolute inset-0 z-0">
            <RiveSection src="/talker.riv" height="h-full" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 text-center space-y-8 flex-1 flex flex-col justify-center items-center bg-background/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-primary/20 bg-background/80 text-primary backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Nuevo: Modo de alto contraste disponible
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl mx-auto drop-shadow-sm">
              Domina tus habilidades sociales con <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Inteligencia Artificial</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Práctica realista para entrevistas, charlas casuales y presentaciones.
              <br className="hidden md:block" />
              Diseñado para todos, con herramientas de accesibilidad avanzadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full max-w-md mx-auto">
              <Link to="/escenarios" className="w-full">
                <Button size="lg" className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all rounded-2xl">
                  Comenzar Ahora <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              {!user && (
                <Link to="/auth" className="w-full">
                  <Button size="lg" variant="outline" className="w-full h-16 text-xl font-bold border-2 bg-background/50 backdrop-blur-md hover:bg-accent hover:text-accent-foreground rounded-2xl">
                    Crear cuenta
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Diseñado para el aprendizaje efectivo</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Nuestra metodología combina lo mejor de la psicología conductual con tecnología de punta.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageCircle className="w-8 h-8" />,
                  title: "Escenarios Realistas",
                  desc: "Interactúa con personajes virtuales en situaciones cotidianas y profesionales diseñadas por expertos.",
                  color: "blue"
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Feedback Instantáneo",
                  desc: "Recibe análisis detallado sobre tu tono, fluidez y confianza inmediatamente después de cada sesión.",
                  color: "green"
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "IA Adaptativa",
                  desc: "El sistema aprende de tus respuestas y ajusta la dificultad para mantenerte siempre desafiado.",
                  color: "purple"
                }
              ].map((feature, idx) => (
                <div key={idx} className="group bg-card p-8 rounded-[2rem] shadow-lg border border-border/50 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Hearts Animation - Emotional Connection / Accessibility */}
        <section className="relative w-full h-[600px] md:h-[800px] bg-black">
          <RiveSection src="/hearts.riv" height="h-full">
            <div className="bg-background/80 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] max-w-4xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-700">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Accesibilidad primero</h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                Creemos que la educación debe ser accesible para todos. Nuestra plataforma está construida siguiendo las pautas WCAG para garantizar una experiencia inclusiva y empática.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50">
                  <Eye className="w-8 h-8 text-primary" />
                  <span className="font-medium text-lg">Alto contraste y texto ajustable</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50">
                  <Mic className="w-8 h-8 text-primary" />
                  <span className="font-medium text-lg">Control por voz total</span>
                </div>
              </div>

              <div className="mt-10">
                <Link to="/configuracion">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl border-2 hover:bg-foreground hover:text-background transition-colors">
                    Explorar opciones de accesibilidad
                  </Button>
                </Link>
              </div>
            </div>
          </RiveSection>
        </section>

        {/* 3. Rocket Animation - Call to Action */}
        <section className="relative w-full h-[500px] md:h-[700px] bg-gradient-to-b from-background to-secondary/20">
          <RiveSection src="/rocket.riv" height="h-full">
            <div className="bg-background/40 backdrop-blur-md p-12 rounded-[3rem] border border-white/20 shadow-xl max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight">
                ¿Listo para despegar?
              </h2>
              <p className="text-2xl text-muted-foreground mb-10 font-medium">
                Únete a miles de estudiantes que ya están mejorando sus habilidades de comunicación hoy mismo.
              </p>
              <Link to="/escenarios">
                <Button size="lg" className="h-20 px-12 text-2xl font-bold bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all rounded-full">
                  Comenzar mi viaje gratis
                </Button>
              </Link>
            </div>
          </RiveSection>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="font-bold text-2xl tracking-tight">ConvoTrainer AI</span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                Empoderando a las personas a través de la comunicación efectiva y la tecnología inclusiva.
              </p>
            </div>

            {[
              { title: "Plataforma", links: [{ l: "Escenarios", u: "/escenarios" }, { l: "Progreso", u: "/progress" }, { l: "Accesibilidad", u: "/configuracion" }] },
              { title: "Legal", links: [{ l: "Privacidad", u: "#" }, { l: "Términos", u: "#" }] },
              { title: "Contacto", links: [{ l: "soporte@convotrainer.ai", u: "#" }, { l: "Universidad Nacional de Ingeniería", u: "#" }] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-lg mb-6">{col.title}</h4>
                <ul className="space-y-4 text-muted-foreground">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <Link to={link.u} className="hover:text-primary transition-colors text-base">
                        {link.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-border/40 text-center text-muted-foreground">
            <p>© 2025 ConvoTrainer AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
