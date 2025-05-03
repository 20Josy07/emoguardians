
import { Headphones } from "lucide-react";
import { AccessibilityControls } from "./AccessibilityControls";

export function Header() {
  return (
    <header className="w-full py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-2 rounded-lg">
          <Headphones className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EmoVision</h1>
          <p className="text-sm text-muted-foreground">Tu guardián emocional de chats</p>
        </div>
      </div>
      <AccessibilityControls />
    </header>
  );
}
