"use client";

import "./dashboard.scss";
import AppLayout from "@/components/AppLayout/AppLayout";
import DataPoint from "@/components/DataPoint/DataPoint";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectAPI from "@/service/project_api";
import TaskAPI, { TaskState } from "@/service/task_api";

export default function Dashboard() {
  const router = useRouter();
  const [activeProject, setActiveProject] = useState(0);
  const [inactiveProject, setInactiveProject] = useState(0);
  const [unfinishedTasks, setUnfinishedTasks] = useState(0);
  const [finishedTasks, setFinishedTasks] = useState(0);
  const MILLIS_WEEK = 604800000;

  useEffect(() => {
    async function getData() {
      const projectData = await ProjectAPI.getAllProjects();
      for (const project of projectData) {
        const tasks = await TaskAPI.getAllTasks();

        console.log(tasks);

        for (const task of tasks) {
          if (task.projectId !== project.id) continue;

          if (task.state === TaskState.IN_PROGRESS || task.state === TaskState.NOT_STARTED) {
            setUnfinishedTasks(unfinishedTasks + 1);
          }
          if (task.state === TaskState.FINISHED) {
            setFinishedTasks(finishedTasks + 1);
          }
        }

        const completionTime = Date.parse(project.estimatedEndDate);
        const timeDifference = Date.now() - completionTime;

        if (timeDifference > MILLIS_WEEK) {
          setInactiveProject(inactiveProject + 1);
        } else {
          setActiveProject(activeProject + 1);
        }
      }
    }
    getData();
  }, []);

  return (
    <AppLayout>
      <div className="Dashboard">
        <h1>Dashboard</h1>

        <div id="statistics">
          <section>
            <h2>Projects</h2>
            <div id="data-points">
              <DataPoint data={String(activeProject)} label="Projects Due" />
              <DataPoint data={String(inactiveProject)} label="Recently Completed" />
            </div>
            <button type="button" onClick={() => router.push("/projects")}>
              View projects
              <Image src="/svg/arrow.svg" alt="arrow" priority width={32} height={32} />
            </button>
          </section>

          <section>
            <h2>Tasks</h2>
            <div id="data-points">
              <DataPoint data={String(unfinishedTasks)} label="Remaining Tasks" />
              <DataPoint data={String(finishedTasks)} label="Completed Tasks" />
              <DataPoint
                data={
                  (() => {
                    const total = finishedTasks + unfinishedTasks;
                    const percent = Math.round((finishedTasks / total) * 100);
                    if (Number.isNaN(percent)) {
                      return "0";
                    }
                    return percent.toString();
                  })() + "%"
                }
                label="Current Progression"
              />
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
