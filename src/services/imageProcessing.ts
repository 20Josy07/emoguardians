
import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageFile: Blob): Promise<string> {
  try {
    // Initialize the worker with proper options
    const worker = await createWorker({
      logger: m => console.debug(m),
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    });
    
    // Load Spanish language data
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    
    const result = await worker.recognize(imageFile);
    await worker.terminate();
    
    return result.data.text || '';
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('No se pudo extraer texto de la imagen');
  }
}
