
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TaskDetails } from "@/components/TaskDetails";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/components/ui/use-toast";
import { SettingsPanel } from "@/components/SettingsPanel";

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

// Sample data - normally would be fetched from an API or context
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "EMR / EHR Updates - Dev",
    client: "Russell DeGroote, Alumni Sports",
    tasks: [
      {
        id: "1-1",
        name: "Frontend Development",
        subtasks: [
          { id: "1-1-1", name: "Twilio configuration" },
          { id: "1-1-2", name: "User authentication" }
        ]
      },
      {
        id: "1-2",
        name: "Backend Development",
        subtasks: [
          { id: "1-2-1", name: "API endpoints" },
          { id: "1-2-2", name: "Database schema" }
        ]
      }
    ],
    hoursTotal: 40,
    hoursCompleted: 9.67
  },
  {
    id: "2",
    name: "Website Redesign",
    client: "John Smith, XYZ Corp",
    tasks: [
      {
        id: "2-1",
        name: "UI/UX Design",
        subtasks: [
          { id: "2-1-1", name: "Homepage mockup" },
          { id: "2-1-2", name: "Mobile designs" }
        ]
      }
    ],
    hoursTotal: 25,
    hoursCompleted: 12
  }
];

const TaskDetailsPage = () => {
  const { projectId, taskId, subtaskId } = useParams();
  const [project, setProject] = useState<Project | undefined>();
  const [task, setTask] = useState<Task | undefined>();
  const [subtask, setSubtask] = useState<SubTask | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find project, task, and subtask based on URL params
  useEffect(() => {
    const foundProject = sampleProjects.find(p => p.id === projectId);
    setProject(foundProject);
    
    if (foundProject) {
      const foundTask = foundProject.tasks.find(t => t.id === taskId);
      setTask(foundTask);
      
      if (foundTask) {
        const foundSubtask = foundTask.subtasks.find(s => s.id === subtaskId);
        setSubtask(foundSubtask);
      }
    }
  }, [projectId, taskId, subtaskId]);

  const handleBackToList = () => {
    navigate("/");
  };

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
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-hidden">
        <TaskDetails 
          project={project}
          task={task}
          subtask={subtask}
          onBack={handleBackToList}
        />
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

export default TaskDetailsPage;
