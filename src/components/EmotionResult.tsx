
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; 
import { Button } from "@/components/ui/button";
import { AlertTriangle, Speaker, Info, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Emotion = {
  name: string;
  score: number;
  color: string;
};

export type AlertSignal = {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  examples: string[];
};

export interface EmotionResultProps {
  emotions: Emotion[];
  alertSignals: AlertSignal[];
  onReset: () => void;
}

export function EmotionResult({ emotions, alertSignals, onReset }: EmotionResultProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const speakResults = () => {
    // Crear resumen para lectura
    let summary = "Análisis emocional completado. ";
    
    // Añadir emociones principales
    const topEmotions = [...emotions].sort((a, b) => b.score - a.score).slice(0, 2);
    if (topEmotions.length > 0) {
      summary += `Las emociones principales detectadas son: ${topEmotions.map(e => e.name).join(" y ")}. `;
    }
    
    // Añadir alertas
    if (alertSignals.length > 0) {
      const highSeverity = alertSignals.filter(a => a.severity === "high");
      if (highSeverity.length > 0) {
        summary += `¡Atención! Se han detectado ${highSeverity.length} señales de alerta importantes: ${highSeverity.map(a => a.type).join(", ")}. `;
      } else {
        summary += `Se han detectado ${alertSignals.length} señales de posible preocupación. `;
      }
    } else {
      summary += "No se han detectado señales de alerta en esta conversación. ";
    }
    
    const speech = new SpeechSynthesisUtterance(summary);
    speech.lang = "es";
    window.speechSynthesis.speak(speech);
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case "high": return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "medium": return <Info className="h-4 w-4 mr-1" />;
      default: return <Info className="h-4 w-4 mr-1" />;
    }
  };

  // Colores para las emociones si no tienen uno asignado
  const getEmotionColor = (index: number) => {
    const colors = [
      "bg-blue-500", 
      "bg-purple-500", 
      "bg-pink-500", 
      "bg-orange-500",
      "bg-green-500", 
      "bg-teal-500", 
      "bg-indigo-500",
      "bg-yellow-500"
    ];
    return colors[index % colors.length];
  };

  const hasHighSeverity = alertSignals.some(signal => signal.severity === "high");
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resultado del análisis</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={speakResults}
            aria-label="Leer resultados en voz alta"
            className="focus:ring-2 focus:ring-primary"
          >
            <Speaker className="h-5 w-5" />
            <span className="sr-only">Leer resultados</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de emociones */}
        <div>
          <h3 className="text-lg font-medium mb-3">Emociones detectadas</h3>
          <div className="space-y-3">
            {emotions.map((emotion, index) => (
              <div key={emotion.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{emotion.name}</span>
                  <span className="text-sm">{Math.round(emotion.score * 100)}%</span>
                </div>
                <Progress 
                  value={emotion.score * 100} 
                  className={emotion.color || getEmotionColor(index)} 
                  aria-label={`${emotion.name}: ${Math.round(emotion.score * 100)}%`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Señales de alerta */}
        {alertSignals.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <AlertTriangle className={cn("h-5 w-5 mr-2", hasHighSeverity ? "text-red-500" : "text-yellow-500")} />
              <span>{hasHighSeverity ? "Señales de alerta detectadas" : "Posibles señales de preocupación"}</span>
            </h3>
            
            <div className="space-y-4">
              {alertSignals.map((signal, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-3 border rounded-lg", 
                    getSeverityColor(signal.severity)
                  )}
                >
                  <div className="flex items-center mb-1">
                    {getSeverityIcon(signal.severity)}
                    <h4 className="font-medium">{signal.type}</h4>
                  </div>
                  <p className="text-sm mb-2">{signal.description}</p>
                  
                  {showDetails && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium mb-1">Ejemplos detectados:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {signal.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="mt-4 w-full" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Ocultar detalles" : "Mostrar más detalles"}
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex">
            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
            <p className="text-green-800">
              No se han detectado señales de alerta en esta conversación. La comunicación parece saludable.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="secondary" onClick={onReset} className="w-full">
          Analizar otro texto
        </Button>
      </CardFooter>
    </Card>
  );
}
