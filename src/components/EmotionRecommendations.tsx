
import { useState } from "react";
import { AlertSignal } from "./EmotionResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRecommendations } from "@/services/recommendationService";
import { getAIRecommendation, AIRecommendation } from "@/services/aiRecommendations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface EmotionRecommendationsProps {
  alertSignals: AlertSignal[];
  emotions: { name: string; score: number }[];
}

export function EmotionRecommendations({ alertSignals, emotions }: EmotionRecommendationsProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { toast } = useToast();

  const hasHighSeverity = alertSignals.some(signal => signal.severity === "high");
  const recommendations = getRecommendations(alertSignals);

  const handleGetAIRecommendation = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key requerida",
        description: "Por favor, ingresa tu API Key de Perplexity para obtener recomendaciones personalizadas.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoadingAI(true);
      const topEmotions = emotions
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(e => e.name);
      
      const alertTypes = alertSignals.map(signal => signal.type);
      
      const aiRec = await getAIRecommendation(apiKey, topEmotions, alertTypes);
      setAiRecommendation(aiRec);
      
      toast({
        title: "Recomendación generada",
        description: "Se ha generado una nueva recomendación personalizada.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la recomendación. Verifica tu API Key.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (alertSignals.length === 0 && emotions.length === 0) return null;

  return (
    <div className="space-y-4">
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

      <Card className="w-full shadow-lg border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <span>Recomendación IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Ingresa tu API Key de Perplexity"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleGetAIRecommendation}
              disabled={isLoadingAI}
            >
              {isLoadingAI ? "Generando..." : "Obtener recomendación"}
            </Button>
          </div>
          
          {aiRecommendation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">{aiRecommendation.recommendation}</p>
              <p className="text-xs text-blue-600 mt-2">{aiRecommendation.context}</p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Para obtener recomendaciones personalizadas, necesitas una API Key de Perplexity. 
            Las recomendaciones se generan teniendo en cuenta tus emociones detectadas y posibles señales de alerta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
