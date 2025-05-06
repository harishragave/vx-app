
import { useState, useEffect } from "react";
import { TaskList } from "@/components/TaskList";
import { BottomNav } from "@/components/BottomNav";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    // Simulate Electron environment
    toast({
      title: "Desktop Application Simulation",
      description: "This is a web simulation of the desktop app. Electron features will be mocked.",
    });
  }, []);

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleQuit = () => {
    toast({
      title: "Quit Application",
      description: "In a real Electron app, this would close the application.",
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <TaskList />
      </div>
      
      <BottomNav 
        userName="Ashokkumar Pothiraj"
        onOpenSettings={handleOpenSettings}
        onQuit={handleQuit}
      />
      
      {showSettings && <SettingsPanel onClose={handleCloseSettings} />}
    </div>
  );
};

export default Index;
