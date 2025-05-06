
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface BottomNavProps {
  userName: string;
  onOpenSettings: () => void;
  onQuit: () => void;
}

export function BottomNav({ 
  userName, 
  onOpenSettings, 
  onQuit
}: BottomNavProps) {
  return (
    <div className="border-t border-border p-2 flex items-center justify-between bg-card">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className="text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <span className="font-medium text-foreground">{userName}</span>
      </div>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={onQuit} className="text-foreground">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
