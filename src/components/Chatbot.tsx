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
    options?: string[];
    link?: string;
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

    const handleOptionClick = (option: string) => {
        const userMsg: Message = { role: 'user', content: option };
        setMessages(prev => [...prev, userMsg]);
        sendMessage(option, [...messages, userMsg]);
    };

    const sendMessage = async (msgContent: string, currentMessages: Message[]) => {
        setIsLoading(true);
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: currentMessages.map(m => ({ role: m.role, content: m.content })),
                model: 'llama-3.1-8b-instant',
                temperature: 0.5, // Lower temperature for more deterministic JSON
                max_tokens: 1024,
                response_format: { type: "json_object" } // Force JSON mode
            });

            const contentStr = chatCompletion.choices[0]?.message?.content || "{}";
            let parsedContent: { message: string; options?: string[]; link?: string } = { message: "Lo siento, hubo un error.", options: [] };

            try {
                parsedContent = JSON.parse(contentStr);
            } catch (e) {
                console.error("JSON Parse Error", e);
                // Fallback if not JSON
                parsedContent = { message: contentStr, options: [] };
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: parsedContent.message,
                options: parsedContent.options,
                link: parsedContent.link
            } as Message]);

        } catch (error) {
            console.error("Groq Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error de conexión. Verifique su internet." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        sendMessage(input, [...messages, userMsg]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Helper to render message content with links
    const renderContent = (content: string) => {
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
                    className="text-primary underline cursor-pointer hover:text-primary/80 font-bold mx-1"
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

    // Initial greeting with updated prompt
    useEffect(() => {
        if (isOpen && !hasStarted) {
            setHasStarted(true);
            const systemPrompt = `
                You are a helpful, friendly, and professional AI assistant for "ConvoTrainerAI".
                Your goal is to guide the user through a short questionnaire.
                
                Data: ${JSON.stringify(questionnaireData)}
                
                OUTPUT FORMAT:
                You must ALWAYS respond with a valid JSON object with this structure:
                {
                    "message": "Your response text here",
                    "options": ["Option 1", "Option 2"], // Optional, include if question has choices
                    "link": "/results" // Optional, ONLY include this EXACT path when the questionnaire is finished
                }

                Rules:
                1. Language: SPANISH ONLY.
                2. Be concise and friendly.
                3. If the user finishes, set "link": "/results" in the JSON and say goodbye in "message".
            `;

            setMessages([
                { role: 'system', content: systemPrompt },
                {
                    role: 'assistant',
                    content: '¡Hola! Soy tu asistente de ConvoTrainerAI. ¿Listo para comenzar?',
                    options: ['Sí, estoy listo', 'Más tarde']
                } as Message
            ]);
        }
    }, [isOpen, hasStarted]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[380px] md:w-[420px] h-[600px] shadow-2xl border-none rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 bg-background/95 backdrop-blur-md ring-1 ring-white/10">
                    <CardHeader className="bg-primary p-4 flex flex-row items-center justify-between text-primary-foreground shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Asistente IA</CardTitle>
                                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    En línea
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/20 text-primary-foreground">
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-muted/30">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6">
                                {messages.filter(m => m.role !== 'system').map((msg, idx) => {
                                    const isUser = msg.role === 'user';
                                    // Cast to any to access custom properties safely for rendering
                                    const messageData = msg as any;

                                    return (
                                        <div key={idx} className={cn("flex w-full flex-col gap-2", isUser ? "items-end" : "items-start")}>
                                            <div
                                                className={cn(
                                                    "max-w-[85%] p-4 rounded-2xl text-base shadow-sm",
                                                    isUser
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-card text-card-foreground border border-border rounded-tl-none"
                                                )}
                                            >
                                                {renderContent(messageData.content)}

                                                {/* Render Link if present */}
                                                {messageData.link && (
                                                    <div className="mt-3 pt-3 border-t border-border/50">
                                                        <Button
                                                            onClick={() => navigate(messageData.link)}
                                                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                                        >
                                                            Ver resultados
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Render Options if Assistant */}
                                            {!isUser && messageData.options && messageData.options.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-1 w-full max-w-[85%]">
                                                    {messageData.options.map((opt: string, i: number) => (
                                                        <Button
                                                            key={i}
                                                            variant="outline"
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="text-xs font-medium rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
                                                        >
                                                            {opt}
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {isLoading && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Escribiendo...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-background border-t border-border">
                            <div className="relative flex items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Escribe tu respuesta..."
                                    className="pr-12 py-6 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all shadow-sm"
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
                    className="w-16 h-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-110 transition-all duration-300 animate-in zoom-in hover:shadow-primary/50"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            )}
        </div>
    );
};

export default Chatbot;
