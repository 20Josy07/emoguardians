
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Speaker } from "lucide-react";

interface EmotionInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function EmotionInput({ onAnalyze, isAnalyzing }: EmotionInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim().length > 0) {
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
          placeholder="Pega aquí el texto de tu conversación (WhatsApp, Messenger, etc.) o escribe el texto que quieres analizar..."
          className="min-h-[200px] resize-y font-normal text-base leading-relaxed focus:ring-2 focus:ring-primary"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Texto de conversación"
        />
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant="outline" onClick={() => setText("")} disabled={isAnalyzing}>
          Limpiar
        </Button>
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
