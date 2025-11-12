import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Briefcase, MessageCircle, Presentation } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Selecciona un escenario</h1>
            <p className="text-muted-foreground mt-2">Elige el tipo de práctica que deseas realizar</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <Card
                key={scenario.id}
                className="p-6 space-y-4 hover:shadow-medium transition-all duration-300 hover:scale-105 bg-gradient-card border-border/50"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center shadow-soft`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{scenario.title}</h3>
                  <p className="text-muted-foreground text-sm">{scenario.description}</p>
                </div>
                <Link to={`/simulacion/${scenario.id}`}>
                  <Button className="w-full bg-gradient-hero shadow-soft hover:shadow-medium transition-all">
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
