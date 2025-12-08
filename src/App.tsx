import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Escenarios from "./pages/Escenarios";
import Simulacion from "./pages/Simulacion";
import Feedback from "./pages/Feedback";
import Progress from "./pages/Progress";
import Moderator from "./pages/Moderator";
import Psychologist from "./pages/Psychologist";
import Configuracion from "./pages/Configuracion";
import PreviousConversations from "./pages/PreviousConversations";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                    <AuthProvider>
                        <Toaster />
                        <Sonner />
                        <Chatbot />
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/escenarios" element={<ProtectedRoute><Escenarios /></ProtectedRoute>} />
                            <Route path="/simulacion/:tipo" element={<ProtectedRoute><Simulacion /></ProtectedRoute>} />
                            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                            <Route path="/previous-conversations" element={<ProtectedRoute><PreviousConversations /></ProtectedRoute>} />
                            <Route path="/moderator" element={<ProtectedRoute><Moderator /></ProtectedRoute>} />
                            <Route path="/psychologist" element={<ProtectedRoute><Psychologist /></ProtectedRoute>} />
                            <Route path="/results" element={<Results />} />
                            <Route path="/configuracion" element={<Configuracion />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AuthProvider>
                </ThemeProvider>
            </TooltipProvider>
        </QueryClientProvider>
    </BrowserRouter>
);

export default App;
