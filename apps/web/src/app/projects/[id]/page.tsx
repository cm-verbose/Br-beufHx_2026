"use client";

import AppLayout from "@/components/AppLayout/AppLayout";
import { Project } from "@repo/db";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.scss";
import ProjectAPI, { ProjectResponse } from "@/service/project_api";

type CurrentView = "details" | "tasks" | "roadmap";

/**
 * Represents the a project's page
 * @returns
 */
export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<CurrentView>("details");
  useEffect(() => {
    if (params.id) {
      ProjectAPI.getProjectById(Number(params.id))
        .then((data) => {
          setProject(data);
        })
        .catch((err) => console.error("Can't load the project", err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

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
