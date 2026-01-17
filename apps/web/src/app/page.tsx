"use client";

import "./dashboard.scss";
import AppLayout from "@/components/AppLayout/AppLayout";
import DataPoint from "@/components/DataPoint/DataPoint";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * The main dashboard page
 */
export default function Dashboard() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="Dashboard">
        <h1>Dashboard</h1>
        <div id="statistics">
          <section>
            <h2>Projects</h2>
            <div id="data-points">
              <DataPoint data="4" label="Projects Due" />
              <DataPoint data="4" label="Recently Completed"></DataPoint>
            </div>
            <button
              onClick={() => {
                router.push("/projects");
              }}
            >
              View projects{" "}
              <Image src="./svg/arrow.svg" alt="arrow" priority width={32} height={32} />
            </button>
          </section>

          <section>
            <h2>Tasks</h2>
            <div id="data-points">
              <DataPoint data="36" label="Remaining Tasks" />
              <DataPoint data="47" label="Completed Tasks" />
              <DataPoint data="74%" label="Current Progression" />
            </div>
            <button>
              View due Tasks{" "}
              <Image src="./svg/arrow.svg" priority alt="arrow" width={32} height={32} />
            </button>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
