
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

// Sample data
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

export function TaskList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [selectedSubtaskId, setSelectedSubtaskId] = useState<string | null>(null);

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleSubtaskSelect = (subtaskId: string) => {
    setSelectedSubtaskId(subtaskId);
  };

  const filteredProjects = sampleProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-3 flex items-center bg-card">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            className="pl-9 bg-card border-0 focus:ring-0 focus:border-0" 
            placeholder="Search contracts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button size="icon" variant="ghost" className="ml-2 text-accent1">
          <div className="h-5 w-5 rounded-full border-2 border-accent1 flex items-center justify-center">
            <div className="h-2 w-2 bg-accent1 rounded-full"></div>
          </div>
        </Button>
      </div>

      <div className="flex justify-between px-4 py-3 border-b border-border">
        <div className="font-medium">Recency</div>
        <div className="font-medium">Hours this week</div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredProjects.map((project) => (
          <div key={project.id} className="border-b border-border">
            <div 
              className="px-4 py-3 cursor-pointer hover:bg-accent/10"
              onClick={() => toggleProject(project.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-2 mt-1">
                    {expandedProjects[project.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  <div>
                    <div className="font-medium text-accent1">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.client}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{project.hoursCompleted}hr {Math.floor((project.hoursCompleted % 1) * 60)}m</div>
                  <div className="text-sm text-accent1">of {project.hoursTotal} hrs</div>
                </div>
              </div>
            </div>

            {expandedProjects[project.id] && (
              <div className="ml-6 pl-2 border-l border-border">
                {project.tasks.map((task) => (
                  <div key={task.id} className="mb-2">
                    <div 
                      className="px-4 py-2 cursor-pointer hover:bg-accent/10 flex items-center"
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="mr-2">
                        {expandedTasks[task.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      <div className="font-medium">{task.name}</div>
                    </div>

                    {expandedTasks[task.id] && (
                      <div className="ml-6 pl-2 border-l border-border">
                        {task.subtasks.map((subtask) => (
                          <Link 
                            key={subtask.id}
                            to={`/project/${project.id}/task/${task.id}/subtask/${subtask.id}`}
                            className={`px-4 py-2 cursor-pointer hover:bg-accent/10 block ${selectedSubtaskId === subtask.id ? 'bg-accent/20' : ''}`}
                            onClick={() => handleSubtaskSelect(subtask.id)}
                          >
                            {subtask.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
