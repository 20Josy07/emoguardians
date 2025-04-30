
// Esta función obtiene recomendaciones de la API de Google Gemini
// basadas en las emociones detectadas y señales de alerta

export interface AIRecommendation {
  recommendation: string;
  context: string;
}

export async function getAIRecommendation(
  emotions: string[],
  alertTypes: string[]
): Promise<AIRecommendation> {
  try {
    // Preparar los datos para enviar a la API
    const emotionsText = emotions.join(", ");
    const alertsText = alertTypes.join(", ");

    // Crear el mensaje para la IA
    const prompt = `Como asistente de salud emocional, analiza las siguientes emociones detectadas: ${emotionsText}. ${
      alertTypes.length > 0 ? `También se detectaron las siguientes alertas: ${alertsText}.` : ''
    } Proporciona una recomendación breve y empática en español (máximo 3 oraciones) para ayudar a la persona.`;

    // Llamar a la API de Google Gemini
    // Esta es una API REST estándar, similar a las que usarías en cualquier proyecto
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDlC9T3R5JhsoFZKA-Y7arkjY8bQU-XOBM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt  // El mensaje que enviamos a la IA
          }]
        }],
        generationConfig: {
          temperature: 0.7,         // Controla la creatividad de la respuesta
          maxOutputTokens: 150,     // Limita la longitud de la respuesta
        }
      }),
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error('Error al obtener recomendación');
    }

    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Extraer la recomendación del resultado
    const recommendation = data.candidates[0].content.parts[0].text;
    
    // Devolver la recomendación y el contexto
    return {
      recommendation: recommendation,
      context: `Basado en emociones: ${emotionsText}${alertTypes.length > 0 ? ` y alertas: ${alertsText}` : ''}`
    };
  } catch (error) {
    console.error('Error al generar recomendación:', error);
    throw error;
  }
}
