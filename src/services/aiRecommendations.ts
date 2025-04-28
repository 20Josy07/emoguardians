
export interface AIRecommendation {
  recommendation: string;
  context: string;
}

export async function getAIRecommendation(
  emotions: string[],
  alertTypes: string[]
): Promise<AIRecommendation> {
  try {
    const emotionsText = emotions.join(", ");
    const alertsText = alertTypes.join(", ");

    const prompt = `Como asistente de salud emocional, analiza las siguientes emociones detectadas: ${emotionsText}. ${
      alertTypes.length > 0 ? `También se detectaron las siguientes alertas: ${alertsText}.` : ''
    } Proporciona una recomendación breve y empática en español (máximo 3 oraciones) para ayudar a la persona.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDlC9T3R5JhsoFZKA-Y7arkjY8bQU-XOBM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener recomendación');
    }

    const data = await response.json();
    const recommendation = data.candidates[0].content.parts[0].text;
    
    return {
      recommendation,
      context: `Basado en emociones: ${emotionsText}${alertTypes.length > 0 ? ` y alertas: ${alertsText}` : ''}`
    };
  } catch (error) {
    console.error('Error al generar recomendación:', error);
    throw error;
  }
}
