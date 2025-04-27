
export type AlertPattern = {
  patterns: string[];
  severity: "low" | "medium" | "high";
};

export const alertPatterns: Record<string, AlertPattern> = {
  manipulación: {
    patterns: [
      "si realmente me quisieras", "nadie te va a querer como yo", "solo me tienes a mí",
      "está en tu cabeza", "estás exagerando", "estás loco", "siempre haces lo mismo",
      "nunca escuchas", "no entiendes nada", "siempre tienes la culpa", "mírate cómo estás",
      "tú fuiste quien", "yo solo te estoy ayudando", "lo hago por tu bien",
      "mira lo que me obligas a hacer"
    ],
    severity: "high"
  },
  amenazas: {
    patterns: [
      "si me dejas", "vas a ver lo que", "te vas a arrepentir", "me voy a matar",
      "ya verás", "te juro que", "si no haces lo que", "te voy a hacer",
      "no sabes de lo que soy capaz", "yo que tú tendría cuidado", "te lo advierto"
    ],
    severity: "high"
  },
  insultos: {
    patterns: [
      "idiota", "estúpido", "imbécil", "inútil", "tonto", "retrasado", "inservible",
      "fracasado", "no vales nada", "patético", "ridículo", "basura", "cerdo", "perra"
    ],
    severity: "medium"
  },
  aislamiento: {
    patterns: [
      "no necesitas a", "ellos no te quieren", "solo les importa", "únicamente yo",
      "yo soy el único", "yo sola te entiendo", "tus amigos solo quieren",
      "tu familia no te comprende", "deja de hablar con", "no salgas con"
    ],
    severity: "high"
  },
  control: {
    patterns: [
      "dónde estás", "con quién estás", "muéstrame", "pruébame", "envíame una foto",
      "por qué no contestas", "quién te llamó", "déjame ver tu teléfono",
      "dime tu contraseña", "tienes que reportarte", "no puedes"
    ],
    severity: "medium"
  },
  desvalorización: {
    patterns: [
      "nunca haces nada bien", "mírate cómo estás", "crees que alguien más te va a querer",
      "deberías agradecerme", "no sirves para nada", "no eres suficiente",
      "cualquiera en tu lugar", "no puedes hacer nada solo"
    ],
    severity: "medium"
  },
  culpabilización: {
    patterns: [
      "por tu culpa", "tú provocaste", "tú causaste", "me haces sentir", "me pones",
      "si no hubieras", "mira lo que me obligas", "ahora por tu culpa",
      "te dije que esto pasaría", "te lo advertí"
    ],
    severity: "low"
  },
  ansiedad: {
    patterns: [
      "ansiedad constante", "preocupación excesiva", "ataque de pánico", "nervios",
      "sensación de ahogo", "hiperventilación", "tensión", "inquietud",
      "dificultad para concentrarse", "irritabilidad"
    ],
    severity: "medium"
  },
  tristeza: {
    patterns: [
      "me siento triste", "sin esperanza", "vacío", "sin energía", "desinterés",
      "no disfruto nada", "insomnio", "dormir demasiado", "fatiga", "culpa",
      "pensamientos negativos", "no valgo nada"
    ],
    severity: "medium"
  }
};

export const getAlertDescription = (type: string): string => {
  switch (type) {
    case "manipulación":
      return "Se detectaron frases que podrían indicar intento de manipulación emocional.";
    case "amenazas":
      return "Se detectaron posibles amenazas o advertencias preocupantes.";
    case "insultos":
      return "Se detectaron insultos o lenguaje despectivo.";
    case "aislamiento":
      return "Se detectaron intentos de separar o aislar de otras relaciones.";
    case "control":
      return "Se detectaron comportamientos de control o vigilancia.";
    case "desvalorización":
      return "Se detectaron frases que desvalorizan o disminuyen la autoestima.";
    case "culpabilización":
      return "Se detectó lenguaje que atribuye culpa de forma injusta.";
    case "ansiedad":
      return "Se detectaron patrones relacionados con ansiedad.";
    case "tristeza":
      return "Se detectaron patrones relacionados con tristeza o depresión.";
    default:
      return "";
  }
};
