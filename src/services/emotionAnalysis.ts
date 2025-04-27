
import { Emotion, AlertSignal } from "@/components/EmotionResult";
import { analyzeEmotions, detectAlertSignals } from "./utils/textAnalysis";

export async function analyzeText(text: string, healthCondition?: string | null): Promise<{
  emotions: Emotion[];
  alertSignals: AlertSignal[];
}> {
  // Simulamos un tiempo de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const emotions = analyzeEmotions(text);
  const alertSignals = detectAlertSignals(text, healthCondition);

  // Simular aleatoriamente algunos resultados en caso de que el texto de prueba sea muy corto
  if (text.length < 50 && Math.random() > 0.5) {
    if (alertSignals.length === 0 && Math.random() > 0.7) {
      alertSignals.push({
        type: "Manipulación",
        description: "Se detectaron frases que podrían indicar intento de manipulación emocional.",
        severity: "high",
        examples: ["Si realmente me quisieras harías esto por mí.", "Nadie te va a querer como yo."]
      });
    }
  }
  
  return { emotions, alertSignals };
}
