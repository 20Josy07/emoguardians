
export interface AIRecommendation {
  recommendation: string;
  context: string;
}

export async function getAIRecommendation(
  apiKey: string,
  emotions: string[],
  alertTypes: string[]
): Promise<AIRecommendation> {
  try {
    const emotionsText = emotions.join(", ");
    const alertsText = alertTypes.join(", ");

    const prompt = `Como asistente de salud emocional, analiza las siguientes emociones detectadas: ${emotionsText}. ${
      alertTypes.length > 0 ? `También se detectaron las siguientes alertas: ${alertsText}.` : ''
    } Proporciona una recomendación breve y empática en español (máximo 3 oraciones) para ayudar a la persona.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente empático especializado en salud emocional. Tus respuestas son breves, prácticas y comprensivas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener recomendación');
    }

    const data = await response.json();
    return {
      recommendation: data.choices[0].message.content,
      context: `Basado en emociones: ${emotionsText}${alertTypes.length > 0 ? ` y alertas: ${alertsText}` : ''}`
    };
  } catch (error) {
    console.error('Error al generar recomendación:', error);
    throw error;
  }
}
