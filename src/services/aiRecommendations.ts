
// Esta función utiliza la API de ShadAI para generar recomendaciones basadas en emociones
// detectadas y señales de alerta

export interface AIRecommendation {
  recommendation: string;
  context: string;
}

// Recomendaciones predefinidas como respaldo en caso de que la API falle
const emotionRecommendations = {
  felicidad: "Disfruta de este momento positivo y considera compartir tu alegría con personas cercanas para fortalecer tus vínculos emocionales.",
  tristeza: "Es normal sentir tristeza a veces; date espacio para procesar tus emociones y considera hablar con alguien de confianza sobre lo que sientes.",
  enojo: "Intenta tomar un momento para respirar profundamente antes de reaccionar, y pregúntate qué necesidad no satisfecha podría estar causando tu enojo.",
  miedo: "El miedo es una respuesta natural que nos protege; identifica qué lo está causando y evalúa realísticamente la situación para encontrar formas de afrontarla.",
  sorpresa: "Tómate un momento para procesar esta información inesperada antes de reaccionar, permitiéndote responder de manera más equilibrada.",
  disgusto: "Es importante reconocer qué te causa rechazo y evaluar si puedes establecer límites saludables frente a esa situación.",
  amor: "Cultiva estos sentimientos positivos y considera expresarlos de manera constructiva, recordando la importancia del equilibrio en las relaciones.",
  ansiedad: "Practica técnicas de respiración y mindfulness para centrarte en el presente, y considera hablar con un profesional si la ansiedad persiste."
};

// Recomendaciones adicionales basadas en señales de alerta como respaldo
const alertRecommendations = {
  manipulación: "Mantente atento a patrones de manipulación emocional y recuerda que tienes derecho a establecer límites claros en tus relaciones.",
  amenazas: "Las amenazas nunca son parte de una relación saludable; considera buscar apoyo profesional si te sientes en riesgo.",
  insultos: "El respeto es fundamental en cualquier relación; los insultos son una forma de abuso verbal que no deberías tolerar.",
  aislamiento: "Mantener conexiones sociales diversas es importante para tu bienestar; cuestiona cualquier intento de alejarte de tus seres queridos.",
  control: "Las relaciones saludables se basan en la confianza y la libertad, no en el control; reflexiona sobre el equilibrio de poder en tus relaciones.",
  desvalorización: "Tu valor no depende de las opiniones de otros; rodéate de personas que te valoren y respeten.",
  culpabilización: "No eres responsable de las emociones o acciones de otros; reconoce cuando intentan hacerte sentir culpable injustamente.",
  ansiedad: "La ansiedad puede ser abrumadora; considera técnicas de relajación y, si es persistente, busca apoyo profesional.",
  tristeza: "Es normal sentirse triste a veces; permítete sentir esta emoción y busca actividades y personas que te brinden confort."
};

export async function getAIRecommendation(
  emotions: string[],
  alertTypes: string[]
): Promise<AIRecommendation> {
  try {
    // Simulamos un tiempo de procesamiento para hacer la experiencia más realista
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Preparando el prompt para ShadAI
    let promptText = "Genera una recomendación psicológica breve y útil para una persona que está experimentando ";
    
    // Agregamos emociones al prompt
    if (emotions.length > 0) {
      promptText += `las siguientes emociones: ${emotions.join(", ")}`;
      
      // Agregamos alertas si existen
      if (alertTypes.length > 0) {
        promptText += ` y muestra posibles señales de: ${alertTypes.join(", ")}`;
      }
    } else if (alertTypes.length > 0) {
      promptText += `posibles señales de: ${alertTypes.join(", ")}`;
    } else {
      promptText += "diversas emociones";
    }
    
    promptText += ". La recomendación debe ser empática, práctica y escrita en español.";

    // Llamada a la API de ShadAI
    try {
      const response = await fetch("https://api.shadai.ai/api/v1/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptText,
          max_tokens: 200
        })
      });

      // Si la respuesta es exitosa, procesamos los datos
      if (response.ok) {
        const data = await response.json();
        
        // Verificamos que la respuesta tenga el formato esperado
        if (data && data.text) {
          // Formatear la respuesta para que se ajuste a nuestro formato
          const formattedEmotions = emotions.map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()).join(", ");
          const formattedAlerts = alertTypes.length > 0 
            ? alertTypes.map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join(", ") 
            : "";
          
          return {
            recommendation: data.text.trim(),
            context: `Basado en emociones: ${formattedEmotions}${alertTypes.length > 0 ? ` y alertas: ${formattedAlerts}` : ''}`
          };
        }
      }
      
      // Si algo falla con la API, usamos las recomendaciones predefinidas
      throw new Error("No se pudo obtener una respuesta de la API");
    } catch (apiError) {
      console.error("Error con la API de ShadAI:", apiError);
      
      // Usamos las recomendaciones predefinidas como respaldo
      let recommendation = "";
      if (emotions.length > 0) {
        const mainEmotion = emotions[0].toLowerCase();
        recommendation = emotionRecommendations[mainEmotion as keyof typeof emotionRecommendations] || 
                        "Observa tus emociones sin juzgarlas y date permiso para sentir, recordando que todas las emociones son válidas y temporales.";
      }

      // Si hay alertas, añadir una recomendación específica
      if (alertTypes.length > 0) {
        const mainAlert = alertTypes[0].toLowerCase();
        const alertRecommendation = alertRecommendations[mainAlert as keyof typeof alertRecommendations];
        
        if (alertRecommendation) {
          recommendation = recommendation + " " + alertRecommendation;
        }
      }

      // Formatear adecuadamente la respuesta
      const formattedEmotions = emotions.map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()).join(", ");
      const formattedAlerts = alertTypes.length > 0 
        ? alertTypes.map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join(", ") 
        : "";

      return {
        recommendation: recommendation,
        context: `Basado en emociones: ${formattedEmotions}${alertTypes.length > 0 ? ` y alertas: ${formattedAlerts}` : ''} (usando recomendaciones predefinidas)`
      };
    }
  } catch (error) {
    console.error('Error al generar recomendación:', error);
    throw new Error('Error al generar recomendación');
  }
}
