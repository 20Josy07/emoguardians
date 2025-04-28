
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface HealthConditionFormProps {
  onSubmit: (condition: string | null) => void;
}

export function HealthConditionForm({ onSubmit }: HealthConditionFormProps) {
  const [condition, setCondition] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(condition.trim() || null);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>¿Tienes alguna condición de salud?</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="condition">
              Comparte tu condición para un análisis más preciso (opcional)
            </Label>
            <Input
              id="condition"
              placeholder="Ej: ansiedad, depresión, etc."
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button type="submit" variant="outline" className="flex-1">
              Continuar
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onSubmit(null)}
              className="flex-1"
            >
              Omitir este paso
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
