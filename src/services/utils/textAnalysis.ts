
import { emotionPatterns, getEmotionColor } from '../patterns/emotionPatterns';
import { alertPatterns, getAlertDescription } from '../patterns/alertPatterns';
import { Emotion, AlertSignal } from '@/components/EmotionResult';

export const analyzeEmotions = (text: string): Emotion[] => {
  const lowerText = text.toLowerCase();
  const emotions: Emotion[] = [];
  let totalMatches = 0;

  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    let matches = 0;
    patterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'gi');
      const count = (lowerText.match(regex) || []).length;
      matches += count;
    });

    totalMatches += matches;
    const color = getEmotionColor(emotion);

    emotions.push({
      name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      score: matches,
      color
    });
  }

  // Normalizar puntuaciones
  if (totalMatches > 0) {
    emotions.forEach(em => {
      em.score = em.score / totalMatches;
    });
  } else {
    emotions.forEach(em => {
      em.score = Math.random() * 0.3 + 0.05;
    });
  }

  return emotions.sort((a, b) => b.score - a.score);
};

export const detectAlertSignals = (text: string, healthCondition?: string | null): AlertSignal[] => {
  const lowerText = text.toLowerCase();
  const alertSignals: AlertSignal[] = [];

  // Añadir patrones específicos basados en la condición de salud
  const currentAlertPatterns = { ...alertPatterns };
  if (healthCondition) {
    const condition = healthCondition.toLowerCase();
    if (condition.includes('ansiedad')) {
      currentAlertPatterns.ansiedad.patterns.push(
        ...['ataque de pánico', 'me cuesta respirar', 'me siento ahogado', 'palpitaciones']
      );
    }
    if (condition.includes('depresión')) {
      currentAlertPatterns.tristeza.patterns.push(
        ...['no quiero vivir', 'todo es mi culpa', 'no valgo nada', 'no tiene sentido']
      );
    }
  }

  for (const [alertType, config] of Object.entries(currentAlertPatterns)) {
    const { patterns, severity } = config;
    const examples: string[] = [];

    patterns.forEach(pattern => {
      const regex = new RegExp(`[^.!?]*${pattern}[^.!?]*[.!?]?`, 'gi');
      const matches = [...lowerText.matchAll(regex)];

      if (matches.length > 0) {
        matches.slice(0, 3).forEach(match => {
          if (match[0]) {
            examples.push(match[0].trim());
          }
        });
      }
    });

    if (examples.length > 0) {
      alertSignals.push({
        type: alertType.charAt(0).toUpperCase() + alertType.slice(1),
        description: getAlertDescription(alertType),
        severity,
        examples
      });
    }
  }

  return alertSignals;
};
