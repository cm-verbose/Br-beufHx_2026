"use client";

import CreateProjectForm from "@/components/CreateProjectForm/CreateProjectForm";
import CreateProjectForms from "@/components/CreateProjectForm/CreateProjectForms";
import ProjectAPI, { CategoryProject, ProjectDTO } from "@/service/project_api";
import { useState, useRef, useMemo } from "react";
import "./style.scss";
import { useRouter } from "next/navigation";

type Mode = "PROMPT" | "FORM";
type Task = {
  id: number;
  label: string;
  parentId: number | null;
};

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<Mode>("PROMPT");
  const [prompt, setPrompt] = useState("");

  const [taskValue, setTaskValue] = useState("");
  const [parentChoice, setParentChoice] = useState<number | "none">("none");
  const [tasks, setTasks] = useState<Task[]>([]);
  const nextTaskId = useRef(1);

  const titleOk = title.trim().length > 0;

  const parentOptions = useMemo(() => {
    return tasks.map((t) => ({ id: t.id, label: t.label }));
  }, [tasks]);

  function addTask() {
    const label = taskValue.trim();
    if (!label) return;
    const parentId = parentChoice === "none" ? null : parentChoice;
    const newTask: Task = { id: nextTaskId.current++, label, parentId };
    setTasks((prev) => [...prev, newTask]);
    setTaskValue("");
    setParentChoice("none");
  }

  function removeTask(taskId: number) {
    setTasks((prev) => {
      const without = prev.filter((t) => t.id !== taskId);
      return without.map((t) => (t.parentId === taskId ? { ...t, parentId: null } : t));
    });
  }

  function submitCreate() {
    const payload: ProjectDTO = {
      title: title.trim(),
      description: description.trim(),
      category: CategoryProject.PROJET,
      estimatedEndDate: new Date().toISOString(),
      Tasks: [],
    };
    ProjectAPI.createManualProject(payload);
    router.push("/projects");
  }

  return (
    <div className="create-project-container">
      <CreateProjectForms>
        <CreateProjectForm title="1. Project General Information">
          <div className="card">
            <div className="form-group">
              <label>
                Project Name <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. My Awesome App"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {!titleOk && <span className="error-text">⚠️ Project name is required.</span>}
            </div>

            <div className="form-group">
              <label>
                Description <span className="optional">(Optional)</span>
              </label>
              <textarea
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CreateProjectForm>
        <CreateProjectForm title="2. Tasks Configuration">
          <div className="card">
            <div className="mode-selection">
              <p className="mode-title">How do you want to build?</p>
              <div className="radio-group">
                <label className={mode === "PROMPT" ? "active" : ""}>
                  <input
                    type="radio"
                    checked={mode === "PROMPT"}
                    onChange={() => setMode("PROMPT")}
                  />
                  AI Generation (Prompt)
                </label>
                <label className={mode === "FORM" ? "active" : ""}>
                  <input type="radio" checked={mode === "FORM"} onChange={() => setMode("FORM")} />
                  Manual Tasks
                </label>
              </div>
            </div>

            {mode === "PROMPT" ? (
              <div className="form-group">
                <p className="optional">
                  Describe what you want, and we will generate the tasks for you.
                </p>
                <textarea
                  placeholder="I want a CRM system with user login..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                />
              </div>
            ) : (
              <div>
                <ul className="task-list">
                  {tasks.length === 0 && (
                    <li style={{ color: "#999", fontStyle: "italic" }}>No tasks added yet.</li>
                  )}
                  {tasks.map((t) => (
                    <li key={t.id}>
                      <span>
                        <strong>{t.label}</strong>
                        {t.parentId && (
                          <span className="task-meta">(Depends on ID:{t.parentId})</span>
                        )}
                      </span>
                      <button type="button" className="btn-remove" onClick={() => removeTask(t.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="add-task-row">
                  <input
                    placeholder="New task name"
                    value={taskValue}
                    onChange={(e) => setTaskValue(e.target.value)}
                  />
                  <select
                    value={parentChoice}
                    onChange={(e) =>
                      setParentChoice(e.target.value === "none" ? "none" : Number(e.target.value))
                    }
                  >
                    <option value="none">No Parent</option>
                    {parentOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn-add" onClick={addTask}>
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </CreateProjectForm>

        <CreateProjectForm title="3. Review & Submit">
          <div className="card">
            <h3>Project Summary</h3>

            <div className="summary-grid">
              <strong>Name:</strong> <span>{title}</span>
              <strong>Desc:</strong> <span>{description || "N/A"}</span>
              <strong>Mode:</strong>{" "}
              <span>{mode === "PROMPT" ? "AI Generation" : "Manual Tasks"}</span>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <strong>Configuration Content:</strong>
              <div className="code-preview">
                {mode === "PROMPT" ? (
                  prompt || <span style={{ color: "#ef4444" }}>(Empty Prompt)</span>
                ) : tasks.length > 0 ? (
                  JSON.stringify(tasks, null, 2)
                ) : (
                  <span style={{ color: "#ef4444" }}>(No tasks defined)</span>
                )}
              </div>
            </div>

            <button className="btn-submit" onClick={submitCreate} disabled={!titleOk}>
              Create Project
            </button>
          </div>
        </CreateProjectForm>
      </CreateProjectForms>
    </div>
  );
}
