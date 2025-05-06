
import { useState } from "react";
import { X, Bell, Shield, Activity, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [settings, setSettings] = useState({
    blankScreenWarning: true,
    inactivityWarning: true,
    longBreakWarning: true,
    keyboardActivityTracking: true,
    mouseActivityTracking: true,
    screenshotCapture: true,
    screenshotInterval: 10, // minutes
  });
  
  const form = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login
    if (username && password) {
      setIsLoggedIn(true);
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };
  
  const warningLogs = [
    { id: 1, type: "Inactivity", message: "No activity detected for 15 minutes", time: "Today, 14:32" },
    { id: 2, type: "Screenshot", message: "Failed to capture screenshot", time: "Today, 13:20" },
    { id: 3, type: "Break", message: "Break time exceeds 1 hour", time: "Yesterday, 16:45" }
  ];
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Tabs defaultValue="account" className="p-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-12 w-12 rounded-full bg-accent1 flex items-center justify-center text-white text-xl font-bold">
                    {username.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className="font-medium">Ashokkumar Pothiraj</div>
                    <div className="text-sm text-muted-foreground">ashok@example.com</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Theme</div>
                  <ThemeToggle />
                </div>
                
                <Button variant="destructive" onClick={handleLogout} className="w-full mt-4">
                  Logout
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </FormItem>
                  
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>
            )}
          </TabsContent>
          
          <TabsContent value="alerts">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Blank Screenshot Warning</h3>
                  <p className="text-sm text-muted-foreground">Alert when a screenshot is blank or not captured</p>
                </div>
                <Switch 
                  checked={settings.blankScreenWarning}
                  onCheckedChange={(checked) => handleSettingChange('blankScreenWarning', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Inactivity Warning</h3>
                  <p className="text-sm text-muted-foreground">Alert when no keyboard/mouse movement is detected</p>
                </div>
                <Switch 
                  checked={settings.inactivityWarning}
                  onCheckedChange={(checked) => handleSettingChange('inactivityWarning', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Long Break Warning</h3>
                  <p className="text-sm text-muted-foreground">Alert when break time exceeds 1 hour</p>
                </div>
                <Switch 
                  checked={settings.longBreakWarning}
                  onCheckedChange={(checked) => handleSettingChange('longBreakWarning', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tracking">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Keyboard Activity Tracking</h3>
                  <p className="text-sm text-muted-foreground">Track keyboard usage during active session</p>
                </div>
                <Switch 
                  checked={settings.keyboardActivityTracking}
                  onCheckedChange={(checked) => handleSettingChange('keyboardActivityTracking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mouse Activity Tracking</h3>
                  <p className="text-sm text-muted-foreground">Track mouse movement during active session</p>
                </div>
                <Switch 
                  checked={settings.mouseActivityTracking}
                  onCheckedChange={(checked) => handleSettingChange('mouseActivityTracking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Screenshot Capture</h3>
                  <p className="text-sm text-muted-foreground">Take periodic screenshots during active sessions</p>
                </div>
                <Switch 
                  checked={settings.screenshotCapture}
                  onCheckedChange={(checked) => handleSettingChange('screenshotCapture', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Screenshot Interval (minutes)</h3>
                <Input 
                  type="number" 
                  min="1"
                  max="60"
                  value={settings.screenshotInterval}
                  onChange={(e) => handleSettingChange('screenshotInterval', parseInt(e.target.value) || 10)}
                  disabled={!settings.screenshotCapture}
                />
                <p className="text-sm text-muted-foreground">
                  How often screenshots will be taken (in minutes)
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="bg-muted/30 rounded-md p-1">
              {warningLogs.map(log => (
                <div key={log.id} className="p-2 border-b border-border last:border-b-0">
                  <div className="flex items-start">
                    {log.type === "Inactivity" && <Activity className="h-4 w-4 mr-2 text-yellow-500 mt-1" />}
                    {log.type === "Screenshot" && <Monitor className="h-4 w-4 mr-2 text-red-500 mt-1" />}
                    {log.type === "Break" && <Bell className="h-4 w-4 mr-2 text-blue-500 mt-1" />}
                    <div>
                      <div className="font-medium text-sm">{log.message}</div>
                      <div className="text-xs text-muted-foreground">{log.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              Clear All Logs
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
