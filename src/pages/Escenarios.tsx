import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Briefcase, MessageCircle, Presentation, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const scenarios = [
  {
    id: "entrevista",
    title: "Entrevista laboral",
    description: "Practica responder preguntas en una entrevista de trabajo.",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "casual",
    title: "Conversación casual",
    description: "Simula una charla informal con un personaje.",
    icon: MessageCircle,
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "presentacion",
    title: "Presentación pública",
    description: "Entrena para hablar frente a un público.",
    icon: Presentation,
    color: "from-indigo-500 to-indigo-600",
  },
];

const Escenarios = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-2">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-5xl font-bold text-foreground tracking-tight">Selecciona un escenario</h1>
              <p className="text-muted-foreground mt-2 text-xl">Elige el tipo de práctica que deseas realizar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/configuracion">
              <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
                <Settings className="w-6 h-6" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <Card
                key={scenario.id}
                className="group p-6 flex flex-col h-full space-y-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card border-2 border-border/50 hover:border-primary/50"
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${scenario.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{scenario.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{scenario.description}</p>
                </div>
                <Link to={`/simulacion/${scenario.id}`} className="block">
                  <Button className="w-full h-12 text-xl font-medium bg-primary text-primary-foreground shadow-soft hover:shadow-medium transition-all rounded-xl group-hover:bg-primary/90">
                    Practicar
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Escenarios;
