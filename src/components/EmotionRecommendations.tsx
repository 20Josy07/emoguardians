
import { useState } from "react";
import { AlertSignal } from "./EmotionResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRecommendations } from "@/services/recommendationService";
import { getAIRecommendation, AIRecommendation } from "@/services/aiRecommendations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface EmotionRecommendationsProps {
  alertSignals: AlertSignal[];
  emotions: { name: string; score: number }[];
}

export function EmotionRecommendations({ alertSignals, emotions }: EmotionRecommendationsProps) {
  // Estados para controlar la recomendación y el estado de carga
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { toast } = useToast();

  const hasHighSeverity = alertSignals.some(signal => signal.severity === "high");
  const recommendations = getRecommendations(alertSignals);

  // Esta función se llama cuando el usuario hace clic en el botón para obtener una recomendación
  const handleGetAIRecommendation = async () => {
    try {
      setIsLoadingAI(true);
      
      // Obtener las 3 emociones principales
      const topEmotions = emotions
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(e => e.name);
      
      // Obtener los tipos de alerta
      const alertTypes = alertSignals.map(signal => signal.type);
      
      // Llamar a la API para obtener una recomendación personalizada
      const aiRec = await getAIRecommendation(topEmotions, alertTypes);
      setAiRecommendation(aiRec);
      
      // Mostrar mensaje de éxito
      toast({
        title: "Recomendación generada",
        description: "Se ha generado una nueva recomendación personalizada.",
      });
    } catch (error) {
      // Mostrar mensaje de error
      toast({
        title: "Error",
        description: "No se pudo generar la recomendación. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // No mostrar nada si no hay alertas ni emociones
  if (alertSignals.length === 0 && emotions.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Tarjeta de recomendaciones básicas */}
      <Card className={cn(
        "w-full shadow-lg",
        hasHighSeverity ? "border-red-200" : "border-yellow-200"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={cn(
              "h-5 w-5",
              hasHighSeverity ? "text-red-500" : "text-yellow-500"
            )} />
            <span>Recomendaciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{rec.title}</h3>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tarjeta de recomendación IA */}
      <Card className="w-full shadow-lg border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <span>Recomendación IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botón para obtener recomendación */}
          <Button 
            onClick={handleGetAIRecommendation}
            disabled={isLoadingAI}
            className="w-full"
          >
            {isLoadingAI ? "Generando..." : "Obtener recomendación personalizada"}
          </Button>
          
          {/* Mostrar recomendación o esqueleto de carga */}
          {isLoadingAI ? (
            <div className="mt-4">
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : aiRecommendation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">{aiRecommendation.recommendation}</p>
              <p className="text-xs text-blue-600 mt-2">{aiRecommendation.context}</p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Las recomendaciones se generan teniendo en cuenta tus emociones detectadas y posibles señales de alerta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
