"use client";

import { JSX, useState } from "react";
import "./style.scss";

/**
 * Project creation page
 */
export default function CreateProjectPage() {
  const [taskValue, setTaskValue] = useState("");
  const [tasks, setTasks] = useState([] as string[]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(0);

  function renderFormPage(): JSX.Element {
    switch (page) {
      case 0: {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (title.trim().length === 0) return;
              setPage(page + 1);
            }}
          >
            <h1>Create new project</h1>
            <input
              type="text"
              placeholder="Project Name"
              value={title} // Control the input
              onChange={(e) => setTitle(e.target.value)}
            />
            <button>next</button>
          </form>
        );
      }

      case 1: {
        return (
          <div>
            <h1>Add tasks</h1>
            <p>
              Tasks for: <strong>{title}</strong>
            </p>

            <ul>
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!taskValue.trim()) return;
                setTasks([...tasks, taskValue]);

                setTaskValue("");
              }}
            >
              <input
                placeholder="Input new task"
                value={taskValue}
                onChange={(e) => setTaskValue(e.target.value)}
              />
              <button type="submit">Add Task</button>
            </form>
            <button onClick={() => setPage(page + 1)}>next</button>
          </div>
        );
      }
      default:
        return <></>;
    }
  }
  return <div className="Creation-Form">{renderFormPage()}</div>;
}
