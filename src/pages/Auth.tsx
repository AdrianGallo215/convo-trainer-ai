import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Brain, Loader2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).max(100),
  fullName: z.string().trim().min(1, { message: "El nombre es requerido" }).max(100),
});

const signinSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(1, { message: "La contraseña es requerida" }).max(100),
});

const Auth = () => {
  const { signUp, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({ email: "", password: "", fullName: "" });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [isPsychologist, setIsPsychologist] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signupSchema.parse(signupData);
      setIsLoading(true);
      
      const { error } = await signUp(validated.email, validated.password, validated.fullName);
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email ya está registrado. Por favor inicia sesión.");
        } else {
          toast.error(error.message || "Error al crear cuenta");
        }
      } else {
        // If registering as psychologist, add the role
        if (isPsychologist) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('user_roles').insert({
              user_id: user.id,
              role: 'psychologist'
            });
          }
        }
        toast.success("¡Cuenta creada exitosamente! Bienvenido.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signinSchema.parse(signinData);
      setIsLoading(true);
      
      const { error } = await signIn(validated.email, validated.password);
      
      if (error) {
        if (error.message.includes("Invalid login")) {
          toast.error("Email o contraseña incorrectos");
        } else {
          toast.error(error.message || "Error al iniciar sesión");
        }
      } else {
        toast.success("¡Bienvenido de nuevo!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-hero shadow-medium flex items-center justify-center" aria-hidden="true">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Entrenamiento de Habilidades Sociales</h1>
          <p className="text-muted-foreground">Inicia sesión para guardar tu progreso</p>
        </header>

        <Card className="p-6 bg-card shadow-soft border-border/50">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signinData.email}
                    onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    aria-label="Email para iniciar sesión"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••"
                    value={signinData.password}
                    onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    aria-label="Contraseña"
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-hero" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nombre Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                    disabled={isLoading}
                    aria-label="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    aria-label="Email para registro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    aria-label="Contraseña (mínimo 6 caracteres)"
                  />
                  <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <Label htmlFor="psychologist-toggle" className="text-sm font-medium cursor-pointer">
                      Soy psicólogo/a
                    </Label>
                  </div>
                  <Switch
                    id="psychologist-toggle"
                    checked={isPsychologist}
                    onCheckedChange={setIsPsychologist}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-hero" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Creando cuenta...
                    </>
                  ) : (
                    isPsychologist ? "Crear Cuenta de Psicólogo" : "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>
    </main>
  );
};

export default Auth;
