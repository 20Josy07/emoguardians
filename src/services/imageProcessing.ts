
import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageFile: Blob): Promise<string> {
  try {
    const worker = await createWorker('spa');
    
    const result = await worker.recognize(imageFile);
    await worker.terminate();
    
    return result.data.text || '';
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('No se pudo extraer texto de la imagen');
  }
}
