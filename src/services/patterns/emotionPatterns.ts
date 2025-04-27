
export const emotionPatterns = {
  felicidad: ["feliz", "contento", "alegre", "genial", "encantado", "divertido", "😊", "😄", "❤️", "me gusta"],
  tristeza: ["triste", "deprimido", "desanimado", "mal", "llorar", "😢", "😭", "extraño", "solo", "perdido"],
  enojo: ["enojado", "furioso", "molesto", "irritado", "odio", "😠", "😡", "rabia", "!!", "imbécil"],
  miedo: ["miedo", "asustado", "preocupado", "nervioso", "ansiedad", "pánico", "terror", "😨", "temo"],
  sorpresa: ["sorprendido", "asombrado", "increíble", "no puedo creer", "wow", "dios mío", "😮", "😲", "!!"],
  disgusto: ["asco", "repulsivo", "desagradable", "horrible", "detesto", "🤮", "odio"],
  amor: ["amor", "te quiero", "te amo", "cariño", "adorable", "precioso", "❤️", "😘", "💕"],
  ansiedad: ["ansiedad", "ansioso", "estrés", "presión", "agobiado", "agotado", "no puedo más", "agobio", "cansado"]
};

export const getEmotionColor = (emotion: string): string => {
  switch (emotion) {
    case "felicidad": return "bg-green-500";
    case "tristeza": return "bg-blue-500";
    case "enojo": return "bg-red-500";
    case "miedo": return "bg-purple-500";
    case "sorpresa": return "bg-yellow-500";
    case "disgusto": return "bg-orange-500";
    case "amor": return "bg-pink-500";
    case "ansiedad": return "bg-indigo-500";
    default: return "bg-gray-500";
  }
};
