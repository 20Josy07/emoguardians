
import { useState } from "react";
import { Header } from "@/components/Header";
import { EmotionInput } from "@/components/EmotionInput";
import { EmotionResult, Emotion, AlertSignal } from "@/components/EmotionResult";
import { ImageTextInput } from "@/components/ImageTextInput";
import { analyzeText } from "@/services/emotionAnalysis";
import { useToast } from "@/components/ui/use-toast";
import { EmotionRecommendations } from "@/components/EmotionRecommendations";

const Index = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [alertSignals, setAlertSignals] = useState<AlertSignal[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async (text: string) => {
    try {
      setAnalyzing(true);
      
      // Pasamos null como condición de salud ya que la eliminamos del flujo
      const results = await analyzeText(text, null);
      
      setEmotions(results.emotions);
      setAlertSignals(results.alertSignals);
      setAnalyzed(true);
      
      const highSeverityAlerts = results.alertSignals.filter(signal => signal.severity === "high");
      if (highSeverityAlerts.length > 0) {
        toast({
          title: "¡Alerta emocional importante!",
          description: "Se han detectado señales que requieren atención.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error en el análisis:", error);
      toast({
        title: "Error en el análisis",
        description: "Ocurrió un problema al analizar el texto. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageText = (extractedText: string) => {
    if (extractedText.trim()) {
      handleAnalyze(extractedText);
    } else {
      toast({
        title: "No se detectó texto",
        description: "No se pudo encontrar texto en la imagen proporcionada.",
        variant: "destructive"
      });
    }
  };

  const resetAnalysis = () => {
    setAnalyzed(false);
    setEmotions([]);
    setAlertSignals([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-6">
          {!analyzed ? (
            <>
              <EmotionInput onAnalyze={handleAnalyze} isAnalyzing={analyzing} />
              <ImageTextInput 
                onTextExtracted={handleImageText}
                isProcessing={analyzing}
              />
            </>
          ) : (
            <>
              <EmotionResult 
                emotions={emotions}
                alertSignals={alertSignals}
                onReset={resetAnalysis}
              />
              <EmotionRecommendations 
                alertSignals={alertSignals}
                emotions={emotions}
              />
            </>
          )}
          
          {!analyzed && !analyzing && (
            <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-xl font-medium mb-2 text-blue-800">¿Cómo funciona EmoGuardian?</h2>
              <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                <li>Pega o escribe una conversación en el campo de texto superior.</li>
                <li>Presiona el botón "Analizar" para procesar el texto.</li>
                <li>Revisa el resultado del análisis emocional y las posibles alertas.</li>
                <li>Usa el botón con ícono de altavoz para escuchar los resultados.</li>
              </ol>
              <p className="mt-4 text-sm text-blue-600">
                EmoGuardian analiza conversaciones para detectar patrones emocionales y posibles señales 
                de preocupación como manipulación, control o abuso emocional.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>EmoGuardian - Tu guardián emocional para conversaciones seguras</p>
          <p className="mt-1">Diseñado con accesibilidad para todos</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
