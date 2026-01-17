"use client";

import React, { useMemo, useRef, useState } from "react";
import "./style.scss";

type Mode = "PROMPT" | "FORM";

type Task = {
  id: number;
  label: string;
  parentId: number | null;
};

export default function CreateProjectPage() {
  const [page, setPage] = useState<0 | 1 | 2>(0);

  const [mode, setMode] = useState<Mode>("FORM");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");

  const [taskValue, setTaskValue] = useState("");
  const [parentChoice, setParentChoice] = useState<number | "none">("none");
  const [tasks, setTasks] = useState<Task[]>([]);
  const nextTaskId = useRef(1);

  const titleOk = title.trim().length > 0;

  const parentOptions = useMemo(() => {
    return tasks.map((t) => ({ id: t.id, label: t.label }));
  }, [tasks]);

  function goNext() {
    setPage((p) => (p < 2 ? ((p + 1) as 0 | 1 | 2) : p));
  }

  function goBack() {
    setPage((p) => (p > 0 ? ((p - 1) as 0 | 1 | 2) : p));
  }

  function resetAll() {
    setPage(0);
    setMode("FORM");
    setTitle("");
    setPrompt("");
    setTaskValue("");
    setParentChoice("none");
    setTasks([]);
    nextTaskId.current = 1;
  }

  function addTask() {
    const label = taskValue.trim();
    if (!label) return;

    const parentId = parentChoice === "none" ? null : parentChoice;

    const newTask: Task = {
      id: nextTaskId.current++,
      label,
      parentId,
    };

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

  function setTaskParent(taskId: number, newParentId: number | null) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (newParentId === t.id) return t; // safety
        return { ...t, parentId: newParentId };
      })
    );
  }

  function submitCreate() {
    const payload = {
      title: title.trim(),
      mode,
      prompt: mode === "PROMPT" ? prompt.trim() : null,
      tasks: mode === "FORM" ? tasks : [],
    };

    console.log("CREATE_PROJECT_PAYLOAD", payload);
    alert("Projet prêt (payload loggué dans la console).");
  }

  return (
    <div className="Creation-Form">
      {page === 0 && (
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault();
            if (!titleOk) return;
            goNext();
          }}
        >
          <h1>Create new project</h1>

          <input
            id="project-creation-input"
            type="text"
            placeholder="Project Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="modeRow" role="radiogroup" aria-label="Creation mode">
            <label className={`modeChip ${mode === "PROMPT" ? "active" : ""}`}>
              <input
                type="radio"
                name="mode"
                checked={mode === "PROMPT"}
                onChange={() => setMode("PROMPT")}
              />
              Prompt
            </label>

            <label className={`modeChip ${mode === "FORM" ? "active" : ""}`}>
              <input
                type="radio"
                name="mode"
                checked={mode === "FORM"}
                onChange={() => setMode("FORM")}
              />
              Form tasks
            </label>
          </div>

          <div className="actions">
            <button type="submit" disabled={!titleOk}>
              next
            </button>
          </div>
        </form>
      )}

      {page === 1 && mode === "PROMPT" && (
        <div className="card">
          <h1>Prompt</h1>
          <p className="sub">
            Projet: <strong>{title}</strong>
          </p>

          <textarea
            id="project-prompt"
            placeholder="Describe your project..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="actions">
            <button type="button" onClick={goBack}>
              back
            </button>
            <button type="button" onClick={goNext}>
              next
            </button>
          </div>
        </div>
      )}

      {page === 1 && mode === "FORM" && (
        <div className="card">
          <h1>Add tasks</h1>
          <p className="sub">
            Tasks for: <strong>{title}</strong>
          </p>

          <ul className="taskList">
            {tasks.map((t) => {
              const parent = t.parentId ? tasks.find((x) => x.id === t.parentId) : null;

              return (
                <li key={t.id} className="taskItem">
                  <div className="taskLeft">
                    <div className="taskLabel">{t.label}</div>
                    <div className="taskMeta">
                      parent: <strong>{parent ? parent.label : "none"}</strong>
                    </div>
                  </div>

                  <div className="taskRight">
                    <select
                      value={t.parentId ?? "none"}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTaskParent(t.id, v === "none" ? null : Number(v));
                      }}
                    >
                      <option value="none">no parent</option>
                      {parentOptions
                        .filter((opt) => opt.id !== t.id)
                        .map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                    </select>

                    <button type="button" className="danger" onClick={() => removeTask(t.id)}>
                      remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <form
            className="addRow"
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            <input
              className="taskInput"
              placeholder="Input new task"
              value={taskValue}
              onChange={(e) => setTaskValue(e.target.value)}
            />

            <select
              className="parentSelect"
              value={parentChoice}
              onChange={(e) => {
                const v = e.target.value;
                setParentChoice(v === "none" ? "none" : Number(v));
              }}
            >
              <option value="none">no parent</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  depends on: {opt.label}
                </option>
              ))}
            </select>

            <button type="submit">Add Task</button>
          </form>

          <div className="actions">
            <button type="button" onClick={goBack}>
              back
            </button>
            <button type="button" onClick={goNext}>
              next
            </button>
          </div>
        </div>
      )}

      {page === 2 && (
        <div className="card">
          <h1>Review</h1>

          <div className="reviewRow">
            <div className="reviewKey">Title</div>
            <div className="reviewVal">{title}</div>
          </div>

          <div className="reviewRow">
            <div className="reviewKey">Mode</div>
            <div className="reviewVal">{mode}</div>
          </div>

          {mode === "PROMPT" ? (
            <div className="reviewBlock">
              <div className="reviewKey">Prompt</div>
              <pre className="preview">{prompt || "(empty)"}</pre>
            </div>
          ) : (
            <div className="reviewBlock">
              <div className="reviewKey">Tasks</div>
              <pre className="preview">{JSON.stringify(tasks, null, 2)}</pre>
            </div>
          )}

          <div className="actions">
            <button type="button" onClick={goBack}>
              back
            </button>
            <button type="button" onClick={submitCreate}>
              create
            </button>
            <button type="button" className="ghost" onClick={resetAll}>
              reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
