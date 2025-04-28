
import { AlertSignal } from "@/components/EmotionResult";

interface Recommendation {
  title: string;
  description: string;
}

export function getRecommendations(alertSignals: AlertSignal[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Base recommendations for any alert
  if (alertSignals.length > 0) {
    recommendations.push({
      title: "Busca apoyo profesional",
      description: "Es importante hablar con un profesional de la salud mental que pueda ayudarte a procesar y manejar estas situaciones."
    });
  }

  // Specific recommendations based on alert types
  alertSignals.forEach(signal => {
    switch (signal.type.toLowerCase()) {
      case "manipulación":
        recommendations.push({
          title: "Establece límites claros",
          description: "Es importante mantener tus límites personales y no permitir que otros te hagan dudar de tus percepciones o sentimientos."
        });
        break;
      case "amenazas":
        if (signal.severity === "high") {
          recommendations.push({
            title: "Busca ayuda inmediata",
            description: "Si te sientes en peligro, contacta inmediatamente a las autoridades o a una línea de ayuda. Tu seguridad es lo más importante."
          });
        }
        break;
      case "aislamiento":
        recommendations.push({
          title: "Mantén tus conexiones",
          description: "Es crucial mantener el contacto con familia y amigos. No permitas que te alejen de tu red de apoyo."
        });
        break;
      case "control":
        recommendations.push({
          title: "Reconoce las señales",
          description: "El control excesivo no es una muestra de amor. Tienes derecho a tu privacidad y autonomía."
        });
        break;
    }
  });

  // Always add resources
  recommendations.push({
    title: "Líneas de ayuda",
    description: "Recuerda que hay líneas de ayuda disponibles 24/7. No dudes en buscar apoyo cuando lo necesites."
  });

  return recommendations;
}
