
import React, { useRef, useState } from 'react';
import { Camera, FileImage } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { extractTextFromImage } from '@/services/imageProcessing';

interface ImageTextInputProps {
  onTextExtracted: (text: string) => void;
  isProcessing: boolean;
}

export function ImageTextInput({ onTextExtracted, isProcessing }: ImageTextInputProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      
      const text = await extractTextFromImage(file);
      onTextExtracted(text);
    } catch (err) {
      setError('Error al procesar la imagen. Por favor, intenta con otra.');
      console.error('Error processing image:', err);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');
      
      context.drawImage(video, 0, 0);
      stream.getTracks().forEach(track => track.stop());

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg');
      });

      const imageUrl = URL.createObjectURL(blob);
      setSelectedImage(imageUrl);
      
      const text = await extractTextFromImage(blob);
      onTextExtracted(text);
    } catch (err) {
      setError('Error al acceder a la cámara. Por favor, verifica los permisos.');
      console.error('Error capturing image:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Añadir imagen</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {selectedImage && (
            <div className="relative w-full max-w-md aspect-video">
              <img
                src={selectedImage}
                alt="Imagen seleccionada"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          <FileImage className="mr-2" />
          Seleccionar imagen
        </Button>
        <Button
          variant="outline"
          onClick={handleCameraCapture}
          disabled={isProcessing}
        >
          <Camera className="mr-2" />
          Usar cámara
        </Button>
      </CardFooter>
    </Card>
  );
}
