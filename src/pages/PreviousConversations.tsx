import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Calendar, Trophy, Activity, Mic } from "lucide-react";

interface Conversation {
    id: string;
    title: string;
    date: string;
    summary: string;
    stats: {
        confidence: number;
        fluency: number;
        tone: number;
    };
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: "1",
        title: "Entrevista de trabajo - Desarrollador senior",
        date: "2024-03-20",
        summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        stats: {
            confidence: 85,
            fluency: 92,
            tone: 88
        }
    },
    {
        id: "2",
        title: "Presentación de proyecto final",
        date: "2024-03-18",
        summary: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        stats: {
            confidence: 78,
            fluency: 85,
            tone: 90
        }
    },
    {
        id: "3",
        title: "Negociación salarial",
        date: "2025-11-26",
        summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        stats: {
            confidence: 92,
            fluency: 88,
            tone: 85
        }
    },
    {
        id: "4",
        title: "Feedback constructivo",
        date: "2024-03-10",
        summary: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
        stats: {
            confidence: 80,
            fluency: 82,
            tone: 88
        }
    }
];

const PreviousConversations = () => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6 py-4 md:py-8">
                <header className="flex items-center gap-4">
                    <Link to="/" aria-label="Volver a inicio">
                        <Button variant="outline" size="icon" aria-label="Volver">
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Conversaciones anteriores</h1>
                </header>

                <div className="grid gap-6">
                    {MOCK_CONVERSATIONS.map((conversation) => (
                        <Card key={conversation.id} className="p-6 bg-card border-border/50 hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">{new Date(conversation.date).toLocaleDateString()}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground mb-2">{conversation.title}</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {conversation.summary}
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link to={`./${conversation.id}`}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Ver Transcripción
                                            </Button>
                                        </Link>
                                        {
                                        /*
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Ver Transcripción
                                        </Button>
                                        */}
                                    </div>
                                </div>

                                <div className="w-full md:w-64 bg-secondary/20 rounded-xl p-4 space-y-4">
                                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Resumen de Estadísticas
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Trophy className="w-3 h-3" /> Confianza
                                                </span>
                                                <span className="font-medium">{conversation.stats.confidence}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${conversation.stats.confidence}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Mic className="w-3 h-3" /> Fluidez
                                                </span>
                                                <span className="font-medium">{conversation.stats.fluency}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{ width: `${conversation.stats.fluency}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Activity className="w-3 h-3" /> Tono
                                                </span>
                                                <span className="font-medium">{conversation.stats.tone}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all"
                                                    style={{ width: `${conversation.stats.tone}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default PreviousConversations;
