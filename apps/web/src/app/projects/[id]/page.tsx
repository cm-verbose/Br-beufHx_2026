"use client";

import AppLayout from "@/components/AppLayout/AppLayout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.scss";
import ProjectAPI, { ProjectResponse, Status } from "@/service/project_api";

type CurrentView = "details" | "tasks" | "roadmap";

const TaskNode = ({ task }: { task: any }) => {
  return (
    <div className="task-node">
      <div className="task-card">
        <div className="task-header">
          <div className={`status-dot ${task.state === "FINISHED" ? "done" : ""}`} />
          <h4>{task.name}</h4>
        </div>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>
      {task.children && task.children.length > 0 && (
        <div className="task-children">
          {task.children.map((child: any) => (
            <TaskNode key={child.id} task={child} />
          ))}
        </div>
      )}
    </div>
  );
};

interface RoadmapNodeProps {
  task: any;
  parentFinished?: boolean;
  onNodeClick: (task: any) => void;
}

const RoadmapNode = ({ task, parentFinished = true, onNodeClick }: RoadmapNodeProps) => {
  const isFinished = task.state === "FINISHED";
  const isLocked = !parentFinished;
  const childrenUnlocked = isFinished;

  let statusClass = "locked";
  if (isFinished) statusClass = "finished";
  else if (!isLocked) statusClass = "active";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) {
      onNodeClick(task);
    }
  };

  return (
    <div className="roadmap-branch">
      <div className={`roadmap-node ${statusClass}`} onClick={handleClick}>
        <div className="status-icon">{isLocked ? "🔒" : isFinished ? "✔" : "⚡"}</div>
        <h4>{task.name}</h4>
      </div>

      {task.children && task.children.length > 0 && (
        <div className="roadmap-children">
          {task.children.map((child: any) => (
            <RoadmapNode
              key={child.id}
              task={child}
              parentFinished={childrenUnlocked}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [view, setView] = useState<CurrentView>("details");

  const fetchData = () => {
    if (params.id) {
      ProjectAPI.getProjectById(Number(params.id))
        .then((data) => setProject(data))
        .catch((err) => console.error("Can't load the project", err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleStatusChange = async (newStatus: Status) => {
    if (!selectedTask) return;
    try {
      await ProjectAPI.updateTaskStatus(selectedTask.id, newStatus);
      setSelectedTask(null);
      setLoading(true);
      fetchData();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating task status");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center">Loading project...</div>
      </AppLayout>
    );
  }
  if (!project) {
    return (
      <AppLayout>
        <div className="p-10 text-center">Project not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="Focused-Project">
        <div id="project-header">{project.title}</div>
        <nav>
          <button onClick={() => setView("details")} className={view === "details" ? "active" : ""}>
            Details
          </button>
          <button onClick={() => setView("tasks")} className={view === "tasks" ? "active" : ""}>
            Tasks
          </button>
          <button onClick={() => setView("roadmap")} className={view === "roadmap" ? "active" : ""}>
            Roadmap
          </button>
        </nav>

        <div className="project-content">
          {(() => {
            switch (view) {
              case "details":
                return (
                  <div className="project-details">
                    <h3>Category</h3>
                    <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>{project.category}</p>
                    <h3>Description</h3>
                    <p>{(project as any).description || "No description provided."}</p>
                    <div className="meta-info">
                      Created on: {new Date(project.createdDate || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                );
              case "roadmap":
                return (
                  <div className="roadmap-container">
                    {project.Tasks && project.Tasks.length > 0 ? (
                      project.Tasks.map((task: any) => (
                        <RoadmapNode
                          key={task.id}
                          task={task}
                          parentFinished={true}
                          onNodeClick={(t) => setSelectedTask(t)}
                        />
                      ))
                    ) : (
                      <div className="text-white opacity-50">No roadmap data available.</div>
                    )}
                  </div>
                );
              case "tasks":
                return (
                  <div className="tasks-container">
                    {project.Tasks?.map((task: any) => (
                      <TaskNode key={task.id} task={task} />
                    ))}
                  </div>
                );
            }
          })()}
        </div>

        {selectedTask && (
          <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
            <div className="task-modal" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedTask.name}</h2>
              <div className="modal-actions">
                <button className="btn-todo" onClick={() => handleStatusChange(Status.NOT_STARTED)}>
                  Reset (Not Started)
                </button>
                <button
                  className="btn-progress"
                  onClick={() => handleStatusChange(Status.IN_PROGRESS)}
                >
                  Mark In Progress
                </button>
                <button className="btn-finish" onClick={() => handleStatusChange(Status.FINISHED)}>
                  Complete Task ✨
                </button>
              </div>
              <button className="btn-close" onClick={() => setSelectedTask(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
