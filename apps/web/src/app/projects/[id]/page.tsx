"use client";

import AppLayout from "@/components/AppLayout/AppLayout";
import { Project } from "@repo/db";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.scss";

/**
 * Represents the a project's page
 * @returns
 */
export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState({} as Project);
  useEffect(() => {
    axios.get(`http://127.0.0.1:4000/project/${params.id}`).then((res) => {
      setProject(res.data);
    });
  });

  return (
    <AppLayout>
      <div className="Focused-Project">
        <div id="project-header">{project.title}</div>
      </div>
    </AppLayout>
  );
}
