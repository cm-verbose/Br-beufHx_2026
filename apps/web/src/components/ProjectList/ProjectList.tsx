"use client";

import axios from "axios";
import type { Project as ProjectInterface } from "@repo/db";
import { useEffect, useState } from "react";
import Project from "../../components/Project/project";
import "./styles.scss";

/**
 * Represents the project list
 * @returns
 */
export default function ProjectList() {
  const [data, setData] = useState([] as Array<ProjectInterface>);
  useEffect(() => {
    axios.get("http://127.0.0.1:4000/project").then((res) => {
      const data = res.data;
      setData(data);
    });
  }, []);
  return (
    <div className="ProjectGrid">
      {data.map((project) => {
        return <Project key={project.id} title={project.title} id={project.id} />;
      })}
    </div>
  );
}
