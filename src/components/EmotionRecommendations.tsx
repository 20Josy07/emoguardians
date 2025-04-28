
import { AlertSignal } from "./EmotionResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRecommendations } from "@/services/recommendationService";

interface EmotionRecommendationsProps {
  alertSignals: AlertSignal[];
}

export function EmotionRecommendations({ alertSignals }: EmotionRecommendationsProps) {
  if (alertSignals.length === 0) return null;

  const hasHighSeverity = alertSignals.some(signal => signal.severity === "high");
  const recommendations = getRecommendations(alertSignals);

  return (
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
  );
}
