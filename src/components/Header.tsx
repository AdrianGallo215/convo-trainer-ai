import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Settings, LogIn, LogOut, TrendingUp, User as UserIcon, ChevronDown, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
    const { user, signOut, isPsychologist } = useAuth();

    // Get user name or default to "Usuario"
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario";
    const userInitials = userName.substring(0, 2).toUpperCase();

    return (
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:inline-block">ConvoTrainer AI</span>
                </Link>

                <nav className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 pl-2 pr-3 rounded-full hover:bg-secondary/50">
                                    <Avatar className="h-8 w-8 border border-border">
                                        <AvatarImage src={user.user_metadata?.avatar_url} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium hidden sm:inline-block">Hola, {userName}</span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isPsychologist ? (
                                    <Link to="/psychologist">
                                        <DropdownMenuItem className="cursor-pointer gap-2">
                                            <UserCog className="w-4 h-4" />
                                            <span>Panel de Psicólogo</span>
                                        </DropdownMenuItem>
                                    </Link>
                                ) : (
                                    <Link to="/progress">
                                        <DropdownMenuItem className="cursor-pointer gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>Progreso</span>
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                <Link to="/configuracion">
                                    <DropdownMenuItem className="cursor-pointer gap-2">
                                        <Settings className="w-4 h-4" />
                                        <span>Configuración</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => signOut()}>
                                    <LogOut className="w-4 h-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/auth">
                            <Button variant="default" size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Iniciar Sesión</span>
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};
