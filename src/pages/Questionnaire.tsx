import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireData } from '../data/questionnaireData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const RiveContainer = ({ riveData }: { riveData: NonNullable<typeof questionnaireData[0]['rive']> }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { RiveComponent, rive } = useRive({
        src: `/${riveData.src}`,
        artboard: riveData.artboard,
        stateMachines: riveData.stateMachines,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover, // Changed to Cover for full screen
            alignment: Alignment.Center,
        }),
        onLoadError: (error) => {
            console.error('Rive load error:', error);
        },
        onLoad: () => {
            console.log('Rive loaded successfully');
        },
        onStateChange: (event) => {
            console.log('State changed:', event);
        }
    });

    useEffect(() => {
        if (rive) {
            // If not playing, try to start it
            if (!rive.isPlaying && rive.stateMachineNames.length > 0) {
                const stateMachineName = typeof riveData.stateMachines === 'string'
                    ? riveData.stateMachines
                    : rive.stateMachineNames[0];

                if (stateMachineName) {
                    setTimeout(() => {
                        try {
                            rive.play(stateMachineName);
                        } catch (error) {
                            console.error('Error playing state machine:', error);
                        }
                    }, 100);
                }
            }
        }
    }, [rive, riveData.stateMachines]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full pointer-events-none" // Full screen background
        >
            <RiveComponent />
        </div>
    );
};

const Questionnaire = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const navigate = useNavigate();

    const currentItem = questionnaireData[currentIndex];

    // Effect to handle "progress" type auto-advance
    useEffect(() => {
        if (currentItem.type === 'progress') {
            const timer = setTimeout(() => {
                handleNext();
            }, 20_000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, currentItem.type]);

    const handleNext = () => {
        if (currentIndex < questionnaireData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            navigate('/progress');
        }
    };

    const handleAnswer = (key: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));

        if ((!currentItem.type || currentItem.type === 'boolean') && !currentItem.switch) {
            handleNext();
        }
    };

    const renderContent = () => {
        if (!currentItem) return null;

        // Special handling for "progress" type
        if (currentItem.type === 'progress') {
            return (
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in duration-700 p-4">
                    {/* Rive is now background, but for progress we might want it focused? 
                         Actually, let's keep the background logic consistent. 
                         If the user wants "take all screen", background is best.
                     */}
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                        {currentItem.description}
                    </h2>
                </div>
            )
        }

        return (
            <div className="relative z-10 max-w-2xl mx-auto w-full p-4 animate-in slide-in-from-bottom-10 duration-500">
                <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-white/20 rounded-3xl overflow-hidden">
                    <CardContent className="p-6 md:p-8 flex flex-col items-center text-center space-y-6">

                        <div className="space-y-3">
                            {currentItem.name && (
                                <h2
                                    className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
                                    dangerouslySetInnerHTML={{ __html: currentItem.name }}
                                />
                            )}

                            {currentItem.description && (
                                <p
                                    className="text-lg text-gray-600 font-medium"
                                    dangerouslySetInnerHTML={{ __html: currentItem.description }}
                                />
                            )}
                        </div>

                        <div className="w-full space-y-4">
                            {/* Boolean / Default Type */}
                            {(!currentItem.type || currentItem.type === 'boolean') && !currentItem.switch && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                                    <Button
                                        onClick={() => handleAnswer(currentItem.id || 'unknown', true)}
                                        className="flex-1 h-auto py-4 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 whitespace-normal"
                                    >
                                        Sí
                                    </Button>
                                    <Button
                                        onClick={() => handleAnswer(currentItem.id || 'unknown', false)}
                                        className="flex-1 h-auto py-4 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 whitespace-normal"
                                        variant="ghost"
                                    >
                                        No
                                    </Button>
                                </div>
                            )}

                            {/* Switch / List Options */}
                            {currentItem.switch && (
                                <div className="grid gap-3 w-full">
                                    {currentItem.switch.map((opt, idx) => (
                                        <Button
                                            key={idx}
                                            onClick={() => {
                                                handleAnswer(currentItem.target as string || 'target', opt.id || opt.name);
                                                handleNext();
                                            }}
                                            variant="outline"
                                            className="h-auto py-4 px-6 text-left flex flex-col items-start justify-center rounded-2xl border-2 border-gray-100 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all group whitespace-normal"
                                        >
                                            <span className="font-bold text-lg text-gray-800 group-hover:text-primary break-words w-full">
                                                {opt.name}
                                            </span>
                                            {opt.description && (
                                                <span className="text-sm text-gray-500 font-medium mt-1 break-words w-full">
                                                    {opt.description}
                                                </span>
                                            )}
                                            {opt.list && (
                                                <div className="flex flex-wrap gap-4 mt-3 w-full">
                                                    {opt.list.map((l, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex flex-col items-center bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-1 min-w-[80px]"
                                                        >
                                                            <span className="text-2xl mb-1">{l.icon}</span>
                                                            <span className="text-xs font-semibold text-gray-600 text-center">
                                                                {l.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            )}

                            {/* Checkbox / Multiple List */}
                            {currentItem.list && currentItem.multiple && (
                                <div className="space-y-4 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {currentItem.list.map((item, idx) => {
                                            const isSelected = (answers[currentItem.id || 'content'] || []).includes(item.title);
                                            return (
                                                <Button
                                                    key={idx}
                                                    variant="outline"
                                                    className={cn(
                                                        "h-auto py-4 flex flex-col gap-3 rounded-2xl border-2 transition-all whitespace-normal",
                                                        isSelected
                                                            ? "border-primary bg-primary/5 text-primary shadow-inner"
                                                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600"
                                                    )}
                                                    onClick={() => {
                                                        const current = answers[currentItem.id || 'content'] || [];
                                                        const updated = isSelected
                                                            ? current.filter((t: string) => t !== item.title)
                                                            : [...current, item.title];
                                                        setAnswers(prev => ({
                                                            ...prev,
                                                            [currentItem.id || 'content']: updated
                                                        }));
                                                    }}
                                                >
                                                    <span className="text-3xl filter drop-shadow-sm">
                                                        {item.icon}
                                                    </span>
                                                    <span className="font-bold text-sm text-center break-words w-full">{item.title}</span>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                    <Button
                                        onClick={handleNext}
                                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                    >
                                        Continuar <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center p-4 overflow-hidden relative font-sans">
            {/* Background Rive Animation */}
            {currentItem?.rive && (
                <div className="absolute inset-0 z-0 opacity-40">
                    <RiveContainer riveData={currentItem.rive} />
                </div>
            )}

            {/* Decorative background elements (optional, kept for texture if no rive or on top) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {renderContent()}
        </div>
    );
}

export default Questionnaire;