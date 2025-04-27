
import { Emotion, AlertSignal } from "@/components/EmotionResult";

// En una aplicación real, esto se conectaría a una API de procesamiento de lenguaje natural
// Como OpenAI, Google NLP, IBM Watson, etc.
// Por ahora implementamos una versión simulada para demostración

export async function analyzeText(text: string): Promise<{
  emotions: Emotion[];
  alertSignals: AlertSignal[];
}> {
  // Simulamos un tiempo de procesamiento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Convertir texto a minúsculas para facilitar las coincidencias
  const lowerText = text.toLowerCase();
  
  // Definición de patrones para emociones
  const emotionPatterns = {
    felicidad: ["feliz", "contento", "alegre", "genial", "encantado", "divertido", "😊", "😄", "❤️", "me gusta"],
    tristeza: ["triste", "deprimido", "desanimado", "mal", "llorar", "😢", "😭", "extraño", "solo", "perdido"],
    enojo: ["enojado", "furioso", "molesto", "irritado", "odio", "😠", "😡", "rabia", "!!", "imbécil"],
    miedo: ["miedo", "asustado", "preocupado", "nervioso", "ansiedad", "pánico", "terror", "😨", "temo"],
    sorpresa: ["sorprendido", "asombrado", "increíble", "no puedo creer", "wow", "dios mío", "😮", "😲", "!!"],
    disgusto: ["asco", "repulsivo", "desagradable", "horrible", "detesto", "🤮", "odio"],
    amor: ["amor", "te quiero", "te amo", "cariño", "adorable", "precioso", "❤️", "😘", "💕"],
    ansiedad: ["ansiedad", "ansioso", "estrés", "presión", "agobiado", "agotado", "no puedo más", "agobio", "cansado"]
  };
  
  // Definición de patrones para señales de alerta
  const alertPatterns = {
    manipulación: {
      patterns: [
        "si realmente me quisieras", "nadie te va a querer como yo", "solo me tienes a mí", 
        "está en tu cabeza", "estás exagerando", "estás loco", "siempre haces lo mismo", 
        "nunca escuchas", "no entiendes nada", "siempre tienes la culpa", "mírate cómo estás",
        "tú fuiste quien", "yo solo te estoy ayudando", "lo hago por tu bien",
        "mira lo que me obligas a hacer"
      ],
      severity: "high" as const
    },
    amenazas: {
      patterns: [
        "si me dejas", "vas a ver lo que", "te vas a arrepentir", "me voy a matar", 
        "ya verás", "te juro que", "si no haces lo que", "te voy a hacer", 
        "no sabes de lo que soy capaz", "yo que tú tendría cuidado", "te lo advierto"
      ],
      severity: "high" as const
    },
    insultos: {
      patterns: [
        "idiota", "estúpido", "imbécil", "inútil", "tonto", "retrasado", "inservible", 
        "fracasado", "no vales nada", "patético", "ridículo", "basura", "cerdo", "perra"
      ],
      severity: "medium" as const
    },
    aislamiento: {
      patterns: [
        "no necesitas a", "ellos no te quieren", "solo les importa", "únicamente yo", 
        "yo soy el único", "yo sola te entiendo", "tus amigos solo quieren", 
        "tu familia no te comprende", "deja de hablar con", "no salgas con"
      ],
      severity: "high" as const
    },
    control: {
      patterns: [
        "dónde estás", "con quién estás", "muéstrame", "pruébame", "envíame una foto", 
        "por qué no contestas", "quién te llamó", "déjame ver tu teléfono", 
        "dime tu contraseña", "tienes que reportarte", "no puedes"
      ],
      severity: "medium" as const
    },
    desvalorización: {
      patterns: [
        "nunca haces nada bien", "mírate cómo estás", "crees que alguien más te va a querer", 
        "deberías agradecerme", "no sirves para nada", "no eres suficiente", 
        "cualquiera en tu lugar", "no puedes hacer nada solo"
      ],
      severity: "medium" as const
    },
    culpabilización: {
      patterns: [
        "por tu culpa", "tú provocaste", "tú causaste", "me haces sentir", "me pones", 
        "si no hubieras", "mira lo que me obligas", "ahora por tu culpa", 
        "te dije que esto pasaría", "te lo advertí"
      ],
      severity: "low" as const
    }
  };
  
  // Calcular puntuaciones de emociones
  const emotions: Emotion[] = [];
  let totalMatches = 0;
  
  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    let matches = 0;
    patterns.forEach(pattern => {
      // Contar apariciones con una expresión regular
      const regex = new RegExp(pattern, 'gi');
      const count = (lowerText.match(regex) || []).length;
      matches += count;
    });
    
    totalMatches += matches;
    
    // Asignar color basado en la emoción
    let color = "";
    switch (emotion) {
      case "felicidad": color = "bg-green-500"; break;
      case "tristeza": color = "bg-blue-500"; break;
      case "enojo": color = "bg-red-500"; break;
      case "miedo": color = "bg-purple-500"; break;
      case "sorpresa": color = "bg-yellow-500"; break;
      case "disgusto": color = "bg-orange-500"; break;
      case "amor": color = "bg-pink-500"; break;
      case "ansiedad": color = "bg-indigo-500"; break;
      default: color = "bg-gray-500";
    }
    
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
    // Si no hay coincidencias, asignar valores pequeños aleatorios
    emotions.forEach(em => {
      em.score = Math.random() * 0.3 + 0.05;
    });
  }
  
  // Ordenar por puntuación descendente
  emotions.sort((a, b) => b.score - a.score);
  
  // Detección de señales de alerta
  const alertSignals: AlertSignal[] = [];
  
  for (const [alertType, config] of Object.entries(alertPatterns)) {
    const { patterns, severity } = config;
    const examples: string[] = [];
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`[^.!?]*${pattern}[^.!?]*[.!?]?`, 'gi');
      const matches = [...lowerText.matchAll(regex)];
      
      if (matches.length > 0) {
        // Capturar hasta 3 ejemplos
        matches.slice(0, 3).forEach(match => {
          if (match[0]) {
            examples.push(match[0].trim());
          }
        });
      }
    });
    
    if (examples.length > 0) {
      let description = "";
      switch (alertType) {
        case "manipulación":
          description = "Se detectaron frases que podrían indicar intento de manipulación emocional.";
          break;
        case "amenazas":
          description = "Se detectaron posibles amenazas o advertencias preocupantes.";
          break;
        case "insultos":
          description = "Se detectaron insultos o lenguaje despectivo.";
          break;
        case "aislamiento":
          description = "Se detectaron intentos de separar o aislar de otras relaciones.";
          break;
        case "control":
          description = "Se detectaron comportamientos de control o vigilancia.";
          break;
        case "desvalorización":
          description = "Se detectaron frases que desvalorizan o disminuyen la autoestima.";
          break;
        case "culpabilización":
          description = "Se detectó lenguaje que atribuye culpa de forma injusta.";
          break;
      }
      
      alertSignals.push({
        type: alertType.charAt(0).toUpperCase() + alertType.slice(1),
        description,
        severity: severity,
        examples
      });
    }
  }
  
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
