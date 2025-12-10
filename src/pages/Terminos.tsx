import { Header } from "@/components/Header";
import { Scale, FileText, Bot, AlertTriangle, Check } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { Separator } from "@/components/ui/separator";

const Terminos = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                <FadeIn>
                    <div className="space-y-8">
                        <div className="text-center space-y-4 mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Términos y condiciones</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Normas de uso para nuestra plataforma de entrenamiento conversacional.
                            </p>
                        </div>

                        <div className="prose prose-gray dark:prose-invert max-w-none space-y-12">
                            {/* Introduction */}
                            <section className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                        <Scale className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-semibold m-0">Aceptación de los términos</h2>
                                </div>
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    Bienvenido a ConvoTrainer AI. Al acceder y utilizar nuestra plataforma, usted acepta cumplir con los siguientes términos y condiciones. Este servicio está diseñado para el desarrollo de habilidades blandas y de comunicación.
                                </p>
                            </section>

                            {/* Nature of Service */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" /> Naturaleza del servicio
                                </h2>
                                <p className="text-muted-foreground">
                                    ConvoTrainer AI es una herramienta educativa. Proporcionamos simulaciones conversacionales impulsadas por IA para fines de práctica y aprendizaje.
                                </p>
                                <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border-l-4 border-amber-500">
                                    <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Descargo de Responsabilidad sobre IA
                                    </h3>
                                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                                        Las respuestas y retroalimentación proporcionadas por el sistema son generadas por modelos de Inteligencia Artificial (incluyendo tecnologías de <strong>Groq</strong> y <strong>ElevenLabs</strong>). Aunque nos esforzamos por la precisión, la IA puede ocasionalmente generar información incorrecta o sesgada. Los usuarios deben utilizar su propio juicio profesional al interpretar los consejos recibidos.
                                    </p>
                                </div>
                            </section>

                            <Separator />

                            {/* User Conduct */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-primary" /> Uso apropiado y conducta
                                </h2>
                                <p className="text-muted-foreground">
                                    Al interactuar con nuestros agentes virtuales, usted se compromete a mantener un entorno de respeto y profesionalismo.
                                </p>
                                <ul className="space-y-3 list-none pl-0">
                                    {[
                                        "No utilizar lenguaje ofensivo, discriminatorio o de odio durante las simulaciones.",
                                        "No intentar manipular ('jailbreak') los modelos de IA para generar contenido prohibido.",
                                        "No utilizar la plataforma para fines ilegales o no autorizados.",
                                        "Respetar la integridad de la infraestructura tecnológica proporcionada."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start text-muted-foreground">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <Separator />

                            {/* Academic Project Info */}
                            <section className="bg-secondary/20 rounded-2xl p-8 border border-border/50">
                                <h2 className="text-xl font-semibold mb-4">Contexto académico - HCI 2025-2</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Esta aplicación es parte del proyecto final del curso <strong>Interacción Humano-Computador</strong> (2025-2). Al utilizar este servicio, usted reconoce que la plataforma puede estar sujeta a cambios, interrupciones o actualizaciones relacionadas con el ciclo académico de la universidad.
                                </p>
                            </section>

                            {/* Intellectual Property */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold">Propiedad intelectual</h2>
                                <p className="text-muted-foreground">
                                    Todo el contenido, diseño, interfaces y código fuente de ConvoTrainer AI son propiedad del equipo de desarrollo del proyecto o sus licenciantes. El uso de tecnologías de terceros (Groq, ElevenLabs) está sujeto a sus respectivos términos y licencias.
                                    <div className="flex gap-4 mt-2">
                                        <a href="https://groq.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            Términos de Groq
                                        </a>
                                        <a href="https://elevenlabs.io/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            Términos de ElevenLabs
                                        </a>
                                    </div>
                                </p>
                            </section>

                            <div className="text-center pt-8 text-sm text-muted-foreground">
                                <p>Cualquier duda o consulta puede ser dirigida al equipo.</p>
                                <p className="mt-2">Última actualización: Diciembre 2025</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>
        </div>
    );
};

export default Terminos;
