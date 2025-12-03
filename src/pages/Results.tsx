import React, { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { scenarios } from './Escenarios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';

const Results = () => {
    const navigate = useNavigate();
    const [showResult, setShowResult] = useState(false);
    const [recommendedScenario, setRecommendedScenario] = useState(scenarios[0]);

    // Rive Animation
    const { RiveComponent } = useRive({
        src: '/data_proccessing_loader.riv', // Assumes file is in public folder
        stateMachines: 'data_proccessing_loader',
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    useEffect(() => {
        // Pick a random scenario
        const random = scenarios[Math.floor(Math.random() * scenarios.length)];
        setRecommendedScenario(random);

        // Simulate processing time
        const timer = setTimeout(() => {
            setShowResult(true);
        }, 6_000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

                {/* Full Screen Rive Background */}
                {!showResult && (
                    <div className="absolute inset-0 w-full h-full z-0">
                        <RiveComponent className="w-full h-full opacity-50" />
                    </div>
                )}

                <div className="max-w-4xl w-full z-10 relative">
                    {!showResult ? (
                        <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500 h-[80vh]">
                            <h2 className="text-4xl md:text-6xl font-bold text-foreground text-center animate-pulse drop-shadow-2xl">
                                Analizando tus respuestas...
                            </h2>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
                            <div className="text-center mb-12 space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider shadow-sm border border-primary/20">
                                    <Sparkles className="w-4 h-4" />
                                    Plan personalizado
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
                                    Tu escenario ideal
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    Basado en tu perfil, te recomendamos comenzar con este ejercicio para potenciar tus habilidades.
                                </p>
                            </div>

                            <Card className="bg-card/50 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden hover:shadow-primary/10 transition-all duration-500 group">
                                <CardContent className="p-0 grid md:grid-cols-2">
                                    <div className={`p-12 flex items-center justify-center bg-gradient-to-br ${recommendedScenario.color} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                                        <recommendedScenario.icon className="w-32 h-32 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-10 flex flex-col justify-center space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-bold text-foreground mb-2">
                                                {recommendedScenario.title}
                                            </h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed">
                                                {recommendedScenario.description}
                                            </p>
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={() => navigate(`/simulacion/${recommendedScenario.id}`)}
                                                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                                            >
                                                Comenzar práctica <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                            <p className="text-center text-sm text-muted-foreground mt-4">
                                                Te tomará aproximadamente 15 minutos
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Results;
