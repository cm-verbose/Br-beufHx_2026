"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./dashboard.scss";
import AppLayout from "@/components/AppLayout/AppLayout";
import DataPoint from "@/components/DataPoint/DataPoint";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProjectAPI from "@/service/project_api";

function isTaskDone(t: any): boolean {
  if (typeof t?.done === "boolean") return t.done;
  if (typeof t?.isDone === "boolean") return t.isDone;
  if (typeof t?.completed === "boolean") return t.completed;
  if (typeof t?.isCompleted === "boolean") return t.isCompleted;
  if (typeof t?.status === "string") return t.status.toUpperCase() === "DONE";
  return false;
}

function isProjectCompleted(p: any): boolean {
  const tasks = Array.isArray(p?.Tasks) ? p.Tasks : [];
  if (tasks.length === 0) return false;
  return tasks.every(isTaskDone);
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]); // tableau de projets

  useEffect(() => {
    ProjectAPI.getAllProjects().then((res) => {
      setData(res);
    });
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const soon = new Date(now);
    soon.setDate(soon.getDate() + 7); // "due" = 7 jours (change si tu veux)

    let projectsDue = 0;
    let recentlyCompleted = 0;

    let remainingTasks = 0;
    let completedTasks = 0;

    for (const p of data) {
      const tasks = Array.isArray(p?.Tasks) ? p.Tasks : [];

      for (const t of tasks) {
        if (isTaskDone(t)) completedTasks++;
        else remainingTasks++;
      }

      const completed = isProjectCompleted(p);
      const end = p?.estimatedEndDate ? new Date(p.estimatedEndDate) : null;

      if (!completed && end && end <= soon) projectsDue++;

      // recentlyCompleted: ici je fais "completed + createdDate dans les 7 derniers jours"
      if (completed && p?.createdDate) {
        const created = new Date(p.createdDate);
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (created >= weekAgo) recentlyCompleted++;
      }
    }

    const totalTasks = remainingTasks + completedTasks;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return { projectsDue, recentlyCompleted, remainingTasks, completedTasks, progress };
  }, [data]);

  return (
    <AppLayout>
      <div className="Dashboard">
        <h1>Dashboard</h1>

        <div id="statistics">
          <section>
            <h2>Projects</h2>
            <div id="data-points">
              <DataPoint data={String(stats.projectsDue)} label="Projects Due" />
              <DataPoint data={String(stats.recentlyCompleted)} label="Recently Completed" />
            </div>

            <button type="button" onClick={() => router.push("/projects")}>
              View projects{" "}
              <Image src="/svg/arrow.svg" alt="arrow" priority width={32} height={32} />
            </button>
          </section>

          <section>
            <h2>Tasks</h2>
            <div id="data-points">
              <DataPoint data={String(stats.remainingTasks)} label="Remaining Tasks" />
              <DataPoint data={String(stats.completedTasks)} label="Completed Tasks" />
              <DataPoint data={`${stats.progress}%`} label="Current Progression" />
            </div>

            <button type="button" onClick={() => router.push("/tasks")}>
              View due Tasks{" "}
              <Image src="/svg/arrow.svg" alt="arrow" priority width={32} height={32} />
            </button>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
