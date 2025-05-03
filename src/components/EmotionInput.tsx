import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Speaker, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import SpeechRecognition type from our type definitions
import type { SpeechRecognition } from "@/types/speechRecognition";

interface EmotionInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function EmotionInput({ onAnalyze, isAnalyzing }: EmotionInputProps) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Inicializar el reconocimiento de voz
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.lang = 'es-ES';
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setText(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Error de reconocimiento de voz:', event.error);
        setIsListening(false);
        toast({
          title: "Error en el reconocimiento de voz",
          description: "No se pudo acceder al micrófono o hubo un error en la captura de audio.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Reconocimiento de voz no soportado",
        description: "Tu navegador no soporta la API de reconocimiento de voz.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        if (isListening) {
          recognition.stop();
        }
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (!isListening) {
      try {
        recognition.start();
        setIsListening(true);
        toast({
          title: "Escuchando...",
          description: "Habla para convertir tu voz en texto.",
        });
      } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
        toast({
          title: "Error al iniciar el micrófono",
          description: "No se pudo iniciar el reconocimiento de voz. Inténtalo de nuevo.",
          variant: "destructive"
        });
      }
    } else {
      try {
        recognition.stop();
        setIsListening(false);
        toast({
          title: "Reconocimiento detenido",
          description: "Se ha detenido la captura de voz.",
        });
      } catch (error) {
        console.error('Error al detener el reconocimiento:', error);
      }
    }
  };

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      // Si estaba grabando, detenemos la grabación antes de analizar
      if (isListening && recognition) {
        recognition.stop();
        setIsListening(false);
      }
      onAnalyze(text);
    }
  };

  const speakInstructions = () => {
    const speech = new SpeechSynthesisUtterance(
      "Pegue o escriba el texto de la conversación que desea analizar y pulse el botón Analizar."
    );
    speech.lang = "es";
    window.speechSynthesis.speak(speech);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Introduce tu conversación</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={speakInstructions}
            aria-label="Leer instrucciones"
            className="focus:ring-2 focus:ring-primary"
          >
            <Speaker className="h-5 w-5" />
            <span className="sr-only">Leer instrucciones</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Pega aquí el texto de tu conversación (WhatsApp, Messenger, etc.), escribe el texto que quieres analizar o usa el micrófono para hablar..."
          className="min-h-[200px] resize-y font-normal text-base leading-relaxed focus:ring-2 focus:ring-primary"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Texto de conversación"
        />
      </CardContent>
      <CardFooter className="justify-between space-x-2 flex-wrap gap-2">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setText("")} disabled={isAnalyzing}>
            Limpiar
          </Button>
          <Button
            variant="outline"
            onClick={toggleListening}
            disabled={isAnalyzing || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)}
            className={isListening ? "bg-red-100 hover:bg-red-200 border-red-300" : ""}
            aria-label={isListening ? "Detener reconocimiento de voz" : "Iniciar reconocimiento de voz"}
          >
            {isListening ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
            {isListening ? "Detener" : "Hablar"}
          </Button>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isAnalyzing || text.trim().length === 0}
          className="min-w-[120px]"
        >
          {isAnalyzing ? "Analizando..." : "Analizar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
