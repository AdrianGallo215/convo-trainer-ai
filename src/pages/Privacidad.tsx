import { Header } from "@/components/Header";
import { Shield, Lock, Eye, Server, University } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { Separator } from "@/components/ui/separator";

const Privacidad = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                <FadeIn>
                    <div className="space-y-8">
                        <div className="text-center space-y-4 mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Política de privacidad</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Su confianza es nuestra prioridad. Entienda cómo protegemos y gestionamos su información en el entorno de aprendizaje de ConvoTrainer AI.
                            </p>
                        </div>

                        <div className="prose prose-gray dark:prose-invert max-w-none space-y-12">
                            {/* Introduction */}
                            <section className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-semibold m-0">Compromiso de privacidad</h2>
                                </div>
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    En ConvoTrainer AI, nos comprometemos a proteger la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, utilizamos y salvaguardamos su información personal y los datos de voz generados durante el uso de nuestra plataforma de entrenamiento.
                                </p>
                            </section>

                            {/* Data Collection */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-primary" /> Recopilación y uso de datos
                                </h2>
                                <p className="text-muted-foreground">
                                    Para proporcionar una experiencia de entrenamiento personalizada y efectiva, recopilamos y procesamos los siguientes tipos de información:
                                </p>
                                <ul className="grid md:grid-cols-2 gap-4 list-none pl-0">
                                    <li className="bg-secondary/30 p-4 rounded-xl">
                                        <strong className="block text-foreground mb-1">Entradas de voz y audio</strong>
                                        <span className="text-sm text-muted-foreground">Las grabaciones de sus sesiones de práctica para el análisis de retroalimentación.</span>
                                    </li>
                                    <li className="bg-secondary/30 p-4 rounded-xl">
                                        <strong className="block text-foreground mb-1">Métricas de desempeño</strong>
                                        <span className="text-sm text-muted-foreground">Datos sobre su progreso, puntuaciones de fluidez y áreas de mejora identificadas.</span>
                                    </li>
                                </ul>
                            </section>

                            <Separator />

                            {/* Third Party Technologies */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Server className="w-5 h-5 text-primary" /> Tecnologías de terceros e IA
                                </h2>
                                <p className="text-muted-foreground">
                                    Nuestra plataforma utiliza IA para ofrecer análisis en tiempo real y respuestas humanas. Nuestros proveedores tecnológicos son:
                                </p>
                                <div className="grid gap-6 md:grid-cols-2 mt-6">
                                    <div className="border border-border/50 rounded-xl p-6 hover:bg-secondary/20 transition-colors">
                                        <h3 className="text-xl font-semibold mb-2">Groq</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Utilizamos la infraestructura de inferencia de alto rendimiento de Groq para procesar y analizar el contenido de las conversaciones con rapidez y precisión, permitiendo una retroalimentación casi instantánea.
                                        </p>
                                        <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                                            Política de Privacidad de Groq &rarr;
                                        </a>
                                    </div>
                                    <div className="border border-border/50 rounded-xl p-6 hover:bg-secondary/20 transition-colors">
                                        <h3 className="text-xl font-semibold mb-2">ElevenLabs</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            La síntesis de voz realista de nuestros personajes virtuales es impulsada por ElevenLabs. Los textos generados por nuestro sistema son convertidos a audio por esta plataforma para crear una experiencia inmersiva.
                                        </p>
                                        <a href="https://elevenlabs.io/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                                            Política de Privacidad de ElevenLabs &rarr;
                                        </a>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic mt-4">
                                    Tenga en cuenta que, al utilizar nuestros servicios, ciertos datos técnicos necesarios para el procesamiento de audio y texto son compartidos de forma segura con estos proveedores estrictamente para la funcionalidad del servicio.
                                </p>
                            </section>

                            <Separator />

                            {/* Academic Context */}
                            <section className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <University className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-xl font-semibold m-0 text-blue-900 dark:text-blue-100">Contexto académico</h2>
                                </div>
                                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                                    Este proyecto ha sido desarrollado en el marco del curso de <strong>Interacción Humano-Computador</strong> del ciclo 2025-2 en la Universidad Nacional de Ingeniería. Si bien se opera con estándares empresariales, parte de los datos anónimos de interacción podrían ser utilizados con fines académicos.
                                </p>
                            </section>

                            {/* Security */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" /> Seguridad de la Información
                                </h2>
                                <p className="text-muted-foreground">
                                    Implementamos medidas de seguridad técnicas y organizativas robustas para proteger sus datos contra el acceso no autorizado, la pérdida o la alteración. Utilizamos cifrado en tránsito y en reposo para garantizar la integridad de su información personal y académica.
                                </p>
                            </section>

                            <div className="text-center pt-8 text-sm text-muted-foreground">
                                <p>Última actualización: Diciembre 2025</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </main>
        </div>
    );
};

export default Privacidad;
