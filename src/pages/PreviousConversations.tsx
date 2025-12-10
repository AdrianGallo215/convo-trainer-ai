import { useState } from "react"; // <--- 1. Importar useState
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Calendar, Trophy, Activity, Mic, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query"; // <--- 2. keepPreviousData ayuda a que no parpadee al cambiar
import { getChatTitle } from "@/lib/utils";

const ITEMS_PER_PAGE = 10; // <--- Constante para limitar items

const PreviousConversations = () => {
    const [page, setPage] = useState(1); // <--- 3. Estado para la página actual

    const { data: conversationData, isLoading, error, isPlaceholderData } = useQuery({
        queryKey: ['user_sessions', page], // <--- 4. Añadimos 'page' aquí para refrescar al cambiar
        queryFn: async () => {
            // Calculamos el rango para Supabase
            const from = (page - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, error, count } = await supabase
                .from('user_sessions')
                .select('*', { count: 'exact' }) // <--- 5. Pedimos el conteo total para saber cuándo deshabilitar "Siguiente"
                .order('completed_at', { ascending: false })
                .range(from, to); // <--- 6. Aplicamos el rango

            if (error) throw error;
            return { data, count }; // Retornamos los datos y el total
        },
        placeholderData: keepPreviousData, // <--- 7. Mantiene los datos viejos visibles mientras cargan los nuevos (mejor UX)
    });

    // Desestructuramos para facilitar uso
    const conversations = conversationData?.data || [];
    const totalCount = conversationData?.count || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // console.log("Conversations page", page, conversations);

    if (isLoading) {
        return <p className="text-center p-8">Cargando conversaciones...</p>;
    }

    if (error) {
        return <p className="text-center p-8 text-red-500">Error cargando datos</p>;
    }

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
                    {conversations.map((conversation) => (
                        <Card key={conversation.id} className="p-6 bg-card border-border/50 hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row gap-6">

                                {/* LEFT SIDE INFO */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">
                                                {new Date(conversation.completed_at ?? conversation.created_at)
                                                    .toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-foreground mb-2">
                                            {getChatTitle(conversation.scenario_type) || "Conversación sin título"}
                                        </h2>

                                        <p className="text-muted-foreground leading-relaxed">
                                            {
                                                conversation.description || "Haz clic para ver los detalles de esta conversación."
                                            }
                                            
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Link to={`./${conversation.id}`}>
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Ver Transcripción
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* STATS PANEL */}
                                <div className="w-full md:w-64 bg-secondary/20 rounded-xl p-4 space-y-4">
                                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Resumen de Estadísticas
                                    </h3>

                                    <div className="space-y-3">
                                        {/* Confidence */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Trophy className="w-3 h-3" /> Confianza
                                                </span>
                                                <span className="font-medium">{conversation.confidence_score}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${conversation.confidence_score}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Fluency */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Mic className="w-3 h-3" /> Fluidez
                                                </span>
                                                <span className="font-medium">{conversation.fluency_score}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{ width: `${conversation.fluency_score}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Tone */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Activity className="w-3 h-3" /> Tono
                                                </span>
                                                <span className="font-medium">{conversation.tone_score}%</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all"
                                                    style={{ width: `${conversation.tone_score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Card>
                    ))}
                </div>

                {/* --- 8. CONTROLES DE PAGINACIÓN --- */}
                <div className="flex items-center justify-between mt-8 border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setPage((old) => Math.max(old - 1, 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Anterior
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages || 1}
                    </span>

                    <Button
                        variant="outline"
                        onClick={() => {
                            if (!isPlaceholderData && page < totalPages) {
                                setPage((old) => old + 1);
                            }
                        }}
                        disabled={isPlaceholderData || page >= totalPages}
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default PreviousConversations;