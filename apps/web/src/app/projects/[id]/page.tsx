"use client";

import AppLayout from "@/components/AppLayout/AppLayout";
import { Project } from "@repo/db";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.scss";

type CurrentView = "details" | "tasks" | "roadmap";

/**
 * Represents the a project's page
 * @returns
 */
export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState({} as Project);
  const [view, setView] = useState<CurrentView>("details");
  useEffect(() => {
    axios.get(`http://127.0.0.1:4000/project/${params.id}`).then((res) => {
      setProject(res.data);
    });
  }, [params.id]);

  return (
    <AppLayout>
      <div className="Focused-Project">
        <div id="project-header">{project.title}</div>
        <nav>
          <button onClick={() => setView("details")}>Details</button>
          <button onClick={() => setView("tasks")}>Tasks</button>
          <button onClick={() => setView("roadmap")}>Roadmap</button>
        </nav>
        <div>
          {(() => {
            switch (view) {
              case "details": {
                return <div>{project.category}</div>;
              }
              case "roadmap": {
                return <div>Roadmap</div>;
              }
              case "tasks": {
                return <div>Tasks</div>;
              }
            }
          })()}
        </div>
      </div>
    </AppLayout>
  );
}
