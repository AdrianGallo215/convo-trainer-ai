import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, MessageCircle, Presentation } from "lucide-react";
import { Header } from "@/components/Header";

const scenarios = [
  {
    id: "entrevista",
    title: "Entrevista laboral",
    description: "Practica responder preguntas en una entrevista de trabajo.",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    id: "casual",
    title: "Conversación casual",
    description: "Simula una charla informal con un personaje.",
    icon: MessageCircle,
    color: "from-teal-500 to-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    iconColor: "text-teal-600 dark:text-teal-400"
  },
  {
    id: "presentacion",
    title: "Presentación pública",
    description: "Entrena para hablar frente a un público.",
    icon: Presentation,
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
];

const Escenarios = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Selecciona un Escenario</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el tipo de práctica que deseas realizar hoy. Cada escenario está diseñado para mejorar habilidades específicas.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <Card
                  key={scenario.id}
                  className="group p-8 flex flex-col h-full space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border border-border/50 hover:border-primary/50 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl ${scenario.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-8 h-8 ${scenario.iconColor}`} />
                  </div>

                  <div className="space-y-3 flex-1">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {scenario.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>

                  <Link to={`/simulacion/${scenario.id}`} className="block pt-2">
                    <Button className="w-full h-14 text-lg font-medium bg-gradient-hero text-primary-foreground shadow-sm hover:shadow-md transition-all rounded-xl hover:opacity-90">
                      Practicar
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Escenarios;
