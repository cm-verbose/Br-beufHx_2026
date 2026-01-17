"use client";

import axios from "axios";
import type { Project as ProjectInterface } from "@repo/db";
import { useEffect, useState } from "react";
import Project from "../../components/Project/project";
import "./styles.scss";
import ProjectAPI, { ProjectResponse } from "@/service/project_api";

/**
 * Represents the project list
 * @returns
 */
export default function ProjectList() {
  const [data, setData] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    ProjectAPI.getAllProjects()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div className="loading-container">Loading projects...</div>;
  }
  return (
    <div className="ProjectGrid">
      {data.map((project) => {
        return <Project key={project.id} title={project.title} id={project.id} />;
      })}
    </div>
  );
}
