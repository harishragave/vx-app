
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Pencil, Play, Pause, Square, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type SubTask = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  name: string;
  subtasks: SubTask[];
};

type Project = {
  id: string;
  name: string;
  client: string;
  tasks: Task[];
  hoursTotal: number;
  hoursCompleted: number;
};

interface TaskDetailsProps {
  project?: Project;
  task?: Task;
  subtask?: SubTask;
  onBack: () => void;
}

export function TaskDetails({ project, task, subtask, onBack }: TaskDetailsProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [sessionTime, setSessionTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [todayTime, setTodayTime] = useState({ hours: 0, minutes: 0 }); 
  const [keyboardCount, setKeyboardCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [lastScreenshotTime, setLastScreenshotTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Effect to fetch latest screenshot
  useEffect(() => {
    const fetchScreenshot = () => {
      fetch("http://localhost:3030/latest-screenshot")
        .then((res) => res.json())
        .then((data) => {
          setScreenshotUrl(`http://localhost:3030/screenshots/${data.filename}`);
          setLastScreenshotTime(new Date(data.timestamp));
        })
        .catch(console.error);
    };

    // Initial fetch
    fetchScreenshot();

    // Set up interval for auto-refresh (every 10 seconds)
    const interval = setInterval(fetchScreenshot, 10000);

    return () => clearInterval(interval);
  }, []);

  // Effect to simulate tracking with timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          let seconds = prev.seconds + 1;
          let minutes = prev.minutes;
          let hours = prev.hours;
          
          if (seconds === 60) {
            minutes += 1;
            seconds = 0;
          }
          
          if (minutes === 60) {
            hours += 1;
            minutes = 0;
          }
          
          return { hours, minutes, seconds };
        });
        
        // Update today's time every minute
        if (sessionTime.seconds % 60 === 0 && sessionTime.seconds > 0) {
          setTodayTime(prev => {
            let minutes = prev.minutes + 1;
            let hours = prev.hours;
            
            if (minutes === 60) {
              hours += 1;
              minutes = 0;
            }
            
            return { hours, minutes };
          });
        }
        
        // Simulate keyboard/mouse activity
        if (Math.random() > 0.5) {
          setKeyboardCount(prev => prev + Math.floor(Math.random() * 10));
        }
        if (Math.random() > 0.5) {
          setMouseCount(prev => prev + Math.floor(Math.random() * 5));
        }
      }, 1000); // Real-time seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, sessionTime.seconds, toast]);
  
  const startTracking = () => {
    if (!isTracking) {
      setIsTracking(true);
      toast({
        title: "Tracking started",
        description: "Your session has started. Activity is now being monitored.",
      });
    }
  };

  const pauseTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      toast({
        title: "Tracking paused",
        description: "Your session has been paused.",
      });
    }
  };

  const stopTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      
      const hours = sessionTime.hours;
      const minutes = sessionTime.minutes;
      const seconds = sessionTime.seconds;
      
      let timeDisplay = "";
      if (hours > 0) timeDisplay += `${hours}h `;
      if (minutes > 0 || hours > 0) timeDisplay += `${minutes}m `;
      timeDisplay += `${seconds}s`;
      
      toast({
        title: "Tracking stopped",
        description: `Session completed: ${timeDisplay}`,
      });
    }
  };

  const takeBreak = () => {
    const wasTracking = isTracking;
    setIsTracking(false);
    toast({
      title: "Break started",
      description: wasTracking ? "Your tracking has been paused during your break." : "Break started. Timer is not running.",
    });
  };
  


  const formatSessionTime = () => {
    if (sessionTime.hours > 0) {
      return `${sessionTime.hours}:${String(sessionTime.minutes).padStart(2, '0')}:${String(sessionTime.seconds).padStart(2, '0')}`;
    } else if (sessionTime.minutes > 0) {
      return `${sessionTime.minutes}:${String(sessionTime.seconds).padStart(2, '0')}`;
    } else {
      return `0:${String(sessionTime.seconds).padStart(2, '0')}`;
    }
  };

  const formatTodayTime = () => {
    if (todayTime.hours > 0) {
      return `${todayTime.hours}:${String(todayTime.minutes).padStart(2, '0')} hrs`;
    } else {
      return `${todayTime.minutes} mins`;
    }
  };
  
  if (!project || !task || !subtask) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a subtask to view details
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full w-full max-w-[350px] mx-auto">
      <div className="p-4 border-b border-border flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="font-medium text-lg">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.client}</p>
        </div>
      </div>
      
      <div className="p-4 border-b border-border bg-black">
        <div className="flex flex-col">
          <div className="text-3xl font-bold">
            {formatSessionTime()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Current Session ({format(new Date(), "EEE, dd MMM yyyy HH:mm:ss 'UTC'")})</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border bg-black">
        <div>
          <div className="text-lg font-medium">{formatTodayTime()}</div>
          <div className="text-sm text-muted-foreground">Today ({format(new Date(), "EEE 'UTC'")})</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium">{project.hoursCompleted} of {project.hoursTotal} hrs</div>
          <div className="text-sm text-orange-500">This week (UTC)</div>
        </div>
      </div>
      
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Memo</div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Pencil size={16} />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">{subtask.name}</div>
      </div>
      
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between space-x-1">
          <Button 
            variant={isTracking ? "secondary" : "default"} 
            size="sm"
            onClick={startTracking}
            disabled={isTracking}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Play className="h-4 w-4 mr-1" /> Start
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={pauseTracking}
            disabled={!isTracking}
          >
            <Pause className="h-4 w-4 mr-1" /> Pause
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={stopTracking}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Square className="h-4 w-4 mr-1" /> Stop
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={takeBreak}
            className="px-2"
          >
            <Coffee className="h-4 w-4 mr-1" /> Break
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Latest Screenshot</div>
          <div className="text-sm text-muted-foreground">
            {lastScreenshotTime ? dayjs(lastScreenshotTime).fromNow() : 'No screenshots yet'}
          </div>
        </div>
        
        <div className="w-full rounded-lg border overflow-hidden">
          {screenshotUrl ? (
            <img 
              src={screenshotUrl} 
              alt="Latest Screenshot"
              className="w-full h-auto"
            />
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No screenshots available
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button variant="link" className="text-orange-500 p-0 h-auto">
            View Work Diary
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-accent/10 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Activity Metrics</div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Clock size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Keyboard events: {keyboardCount}</div>
            <div>Mouse movements: {mouseCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
