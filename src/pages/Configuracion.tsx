import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Mic, Globe } from "lucide-react";
import { toast } from "sonner";

const Configuracion = () => {
  const navigate = useNavigate();
  const [microphone, setMicrophone] = useState("mic1");
  const [language, setLanguage] = useState("es");
  const [voiceMode, setVoiceMode] = useState(true);

  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-6">
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-hero rounded-xl shadow-soft">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          </div>
        </div>

        <Card className="p-8 space-y-6 bg-gradient-card shadow-medium border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Mic className="w-5 h-5 text-primary" />
              <Label htmlFor="microphone" className="text-lg font-semibold text-foreground">
                Micrófono
              </Label>
            </div>
            <Select value={microphone} onValueChange={setMicrophone}>
              <SelectTrigger id="microphone" className="h-12 bg-background border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mic1">Micrófono predeterminado</SelectItem>
                <SelectItem value="mic2">Micrófono externo</SelectItem>
                <SelectItem value="mic3">Auriculares con micrófono</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-5 h-5 text-primary" />
              <Label htmlFor="language" className="text-lg font-semibold text-foreground">
                Idioma
              </Label>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="h-12 bg-background border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">Inglés</SelectItem>
                <SelectItem value="fr">Francés</SelectItem>
                <SelectItem value="de">Alemán</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
            <div className="space-y-1">
              <Label htmlFor="voice-mode" className="text-lg font-semibold text-foreground">
                Modo de voz
              </Label>
              <p className="text-sm text-muted-foreground">
                Habilita la interacción por voz durante las prácticas
              </p>
            </div>
            <Switch
              id="voice-mode"
              checked={voiceMode}
              onCheckedChange={setVoiceMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full h-14 text-lg bg-gradient-hero shadow-soft hover:shadow-medium transition-all"
        >
          Guardar configuración
        </Button>

        <div className="text-center text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
          <p>💡 Consejo: Asegúrate de probar tu micrófono antes de iniciar una sesión de práctica</p>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
