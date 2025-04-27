
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Volume2, 
  VolumeX,
  Keyboard,
  Info
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function AccessibilityControls() {
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [volume, setVolume] = useState(1);
  
  // Controlar el volumen del sintetizador de voz
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        // Inicializar cuando las voces estén disponibles
      });
    }
  }, []);

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (!speechEnabled) {
      const speech = new SpeechSynthesisUtterance("Voz activada");
      speech.lang = "es";
      window.speechSynthesis.speak(speech);
    } else {
      window.speechSynthesis.cancel(); // Detener cualquier lectura en curso
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    // Anunciar cambio de volumen
    if (speechEnabled && newVolume > 0) {
      const speech = new SpeechSynthesisUtterance(`Volumen ${Math.round(newVolume * 100)}%`);
      speech.lang = "es";
      speech.volume = newVolume;
      window.speechSynthesis.speak(speech);
    }
  };

  const announceKeyboardShortcuts = () => {
    const shortcuts = `
      Atajos de teclado disponibles:
      Tab para navegar entre elementos.
      Espacio o Enter para activar botones.
      Control más M para activar o desactivar la voz.
      Control más flecha arriba o abajo para ajustar el volumen.
    `;
    
    const speech = new SpeechSynthesisUtterance(shortcuts);
    speech.lang = "es";
    speech.volume = volume;
    window.speechSynthesis.speak(speech);
  };

  // Manejador de atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+M para toggle de voz
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        toggleSpeech();
      }
      
      // Ctrl+ArrowUp para subir volumen
      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        const newVolume = Math.min(1, volume + 0.1);
        setVolume(newVolume);
        if (speechEnabled) {
          const speech = new SpeechSynthesisUtterance(`Volumen ${Math.round(newVolume * 100)}%`);
          speech.lang = "es";
          speech.volume = newVolume;
          window.speechSynthesis.speak(speech);
        }
      }
      
      // Ctrl+ArrowDown para bajar volumen
      if (e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault();
        const newVolume = Math.max(0, volume - 0.1);
        setVolume(newVolume);
        if (speechEnabled && newVolume > 0) {
          const speech = new SpeechSynthesisUtterance(`Volumen ${Math.round(newVolume * 100)}%`);
          speech.lang = "es";
          speech.volume = newVolume;
          window.speechSynthesis.speak(speech);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speechEnabled, volume]);

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSpeech}
        aria-label={speechEnabled ? "Desactivar voz" : "Activar voz"}
        className="focus:ring-2 focus:ring-primary"
      >
        {speechEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        <span className="sr-only">{speechEnabled ? "Desactivar voz" : "Activar voz"}</span>
      </Button>
      
      {speechEnabled && (
        <div className="flex-1 max-w-[120px]">
          <Slider 
            value={[volume]} 
            min={0} 
            max={1} 
            step={0.1}
            onValueChange={handleVolumeChange}
            aria-label="Control de volumen"
            className="focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Ver atajos de teclado"
            className="focus:ring-2 focus:ring-primary"
            onClick={announceKeyboardShortcuts}
          >
            <Keyboard className="h-5 w-5" />
            <span className="sr-only">Atajos de teclado</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Keyboard className="h-4 w-4" /> 
              Atajos de teclado
            </h3>
            <ul className="text-sm space-y-1">
              <li><kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Tab</kbd> Navegar entre elementos</li>
              <li><kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Espacio</kbd> o <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Enter</kbd> Activar botones</li>
              <li><kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">M</kbd> Activar/desactivar voz</li>
              <li><kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">↑</kbd>/<kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">↓</kbd> Ajustar volumen</li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Acerca de EmoGuardian"
            className="focus:ring-2 focus:ring-primary"
          >
            <Info className="h-5 w-5" />
            <span className="sr-only">Acerca de EmoGuardian</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h3 className="font-medium">Acerca de EmoGuardian</h3>
            <p className="text-sm text-muted-foreground">
              EmoGuardian analiza textos de conversaciones para detectar emociones y posibles señales
              de alerta como lenguaje tóxico, manipulativo o abusivo. Diseñado con accesibilidad para
              personas con discapacidad visual.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta aplicación está pensada como una herramienta de apoyo y no reemplaza
              la valoración profesional.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
