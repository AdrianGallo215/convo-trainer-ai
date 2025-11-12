import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Configuracion = () => {
  const [voz, setVoz] = useState(true);
  const [idioma, setIdioma] = useState("es");
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState("normal");
  const [subtitles, setSubtitles] = useState(true);

  useEffect(() => {
    const savedHighContrast = localStorage.getItem("highContrast") === "true";
    const savedTextSize = localStorage.getItem("textSize") || "normal";
    const savedSubtitles = localStorage.getItem("subtitles") !== "false";
    
    setHighContrast(savedHighContrast);
    setTextSize(savedTextSize);
    setSubtitles(savedSubtitles);

    if (savedHighContrast) {
      document.documentElement.classList.add("high-contrast");
    }
    if (savedTextSize === "large") {
      document.documentElement.classList.add("text-large");
    } else if (savedTextSize === "xlarge") {
      document.documentElement.classList.add("text-xlarge");
    }
  }, []);

  const handleHighContrastChange = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem("highContrast", String(checked));
    if (checked) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const handleTextSizeChange = (value: string) => {
    setTextSize(value);
    localStorage.setItem("textSize", value);
    document.documentElement.classList.remove("text-large", "text-xlarge");
    if (value === "large") {
      document.documentElement.classList.add("text-large");
    } else if (value === "xlarge") {
      document.documentElement.classList.add("text-xlarge");
    }
  };

  const handleSubtitlesChange = (checked: boolean) => {
    setSubtitles(checked);
    localStorage.setItem("subtitles", String(checked));
  };

  const handleGuardar = () => {
    toast.success("Configuración guardada correctamente");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6 py-4 md:py-8">
        <header className="flex items-center gap-4">
          <Link to="/" aria-label="Volver a inicio">
            <Button variant="outline" size="icon" aria-label="Volver">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configuración</h1>
        </header>

        <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8 space-y-6 border border-border/50" role="region" aria-label="Configuración de la aplicación">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Interacción</h2>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="modo-voz" className="text-base font-medium">Modo de voz</Label>
              <Switch id="modo-voz" checked={voz} onCheckedChange={setVoz} aria-label="Activar o desactivar modo de voz" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idioma" className="text-base font-medium">Idioma</Label>
              <Select value={idioma} onValueChange={setIdioma}>
                <SelectTrigger id="idioma" className="w-full" aria-label="Seleccionar idioma">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">Inglés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground">Accesibilidad</h2>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast" className="text-base font-medium">Alto contraste</Label>
                <p className="text-sm text-muted-foreground">Aumenta el contraste para mejor legibilidad</p>
              </div>
              <Switch id="high-contrast" checked={highContrast} onCheckedChange={handleHighContrastChange} aria-label="Activar o desactivar modo de alto contraste" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-size" className="text-base font-medium">Tamaño del texto</Label>
              <Select value={textSize} onValueChange={handleTextSizeChange}>
                <SelectTrigger id="text-size" className="w-full" aria-label="Seleccionar tamaño de texto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (16px)</SelectItem>
                  <SelectItem value="large">Grande (18px)</SelectItem>
                  <SelectItem value="xlarge">Muy grande (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="subtitles" className="text-base font-medium">Subtítulos</Label>
                <p className="text-sm text-muted-foreground">Mostrar subtítulos durante las conversaciones</p>
              </div>
              <Switch id="subtitles" checked={subtitles} onCheckedChange={handleSubtitlesChange} aria-label="Activar o desactivar subtítulos" />
            </div>
          </section>

          <Button onClick={handleGuardar} className="w-full h-12 bg-gradient-hero text-lg shadow-soft hover:shadow-medium transition-all" aria-label="Guardar toda la configuración">
            Guardar configuración
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Configuracion;
