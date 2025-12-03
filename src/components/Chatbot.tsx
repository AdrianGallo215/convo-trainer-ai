import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Groq from 'groq-sdk';
import { questionnaireData } from '../data/questionnaireData';
import { useNavigate } from 'react-router-dom';

// Initialize Groq - strictly using environment variable
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [hasStarted, setHasStarted] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Initial greeting
    useEffect(() => {
        if (isOpen && !hasStarted) {
            setHasStarted(true);
            const systemPrompt = `
                You are a helpful, friendly, and professional AI assistant for "Vocal Image", a communication training app.
                Your goal is to guide the user through a short questionnaire to understand their needs.
                
                Here is the questionnaire data you need to cover:
                ${JSON.stringify(questionnaireData)}
                
                Rules:
                1. Ask questions one by one or in very small logical groups.
                2. Be conversational and empathetic.
                3. Do NOT ask for the "id" or technical details, just the "name" or concept.
                4. When you have enough information or have covered the main points, thank the user and tell them you have prepared a personalized plan.
                5. CRITICAL: At the very end, provide a markdown link exactly like this: [Ver Resultados](/results).
                6. Keep responses concise.
            `;

            setMessages([
                { role: 'system', content: systemPrompt },
                { role: 'assistant', content: '¡Hola! Soy tu asistente de Vocal Image. Me gustaría hacerte unas breves preguntas para personalizar tu experiencia. ¿Te parece bien?' }
            ]);
        }
    }, [isOpen, hasStarted]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                model: 'llama-3.1-8b-instant', // Fast and efficient
                temperature: 0.7,
                max_tokens: 1024,
            });

            const botResponse = chatCompletion.choices[0]?.message?.content || "Lo siento, tuve un problema. ¿Podemos intentar de nuevo?";

            setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);

            // Check for navigation link in response (simple client-side check)
            if (botResponse.includes('(/progress)')) {
                // Optional: Auto-redirect after a delay? 
                // For now, let the user click the link rendered in the UI.
            }

        } catch (error) {
            console.error("Groq Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, hubo un error de conexión. Por favor verifica tu conexión a internet." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Helper to render message content with links
    const renderContent = (content: string) => {
        // Simple regex to detect markdown links [text](url)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            if (match.index > lastIndex) {
                parts.push(content.substring(lastIndex, match.index));
            }
            const url = match[2];
            const text = match[1];
            parts.push(
                <span
                    key={match.index}
                    onClick={() => navigate(url)}
                    className="text-primary underline cursor-pointer hover:text-primary/80 font-bold"
                >
                    {text}
                </span>
            );
            lastIndex = linkRegex.lastIndex;
        }
        if (lastIndex < content.length) {
            parts.push(content.substring(lastIndex));
        }
        return parts.length > 0 ? parts : content;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[380px] h-[600px] shadow-2xl border-none rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 bg-background/95 backdrop-blur-md ring-1 ring-white/10">
                    <CardHeader className="bg-primary/10 p-4 flex flex-row items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Asistente IA</CardTitle>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    En línea
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex w-full",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                                                msg.role === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted/80 backdrop-blur-sm text-foreground rounded-tl-none border border-white/10"
                                            )}
                                        >
                                            {renderContent(msg.content)}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Escribiendo...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-background/50 border-t border-white/5 backdrop-blur-sm">
                            <div className="relative flex items-center">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu respuesta..."
                                    className="pr-12 py-6 rounded-full border-white/10 bg-white/5 focus:bg-white/10 transition-all shadow-inner"
                                    disabled={isLoading}
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1 w-10 h-10 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-tr from-primary to-purple-600 hover:scale-110 transition-all duration-300 animate-in zoom-in hover:shadow-primary/50"
                >
                    <MessageCircle className="w-8 h-8 text-white" />
                </Button>
            )}
        </div>
    );
};

export default Chatbot;
