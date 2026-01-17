"use client";

import "./dashboard.scss";
import AppLayout from "@/components/AppLayout/AppLayout";
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
              <div className="dataPoint">
                <span>4</span>
                <div>Projects Due</div>
              </div>
              <div className="dataPoint">
                <span>4</span>
                <div>Recently completed</div>
              </div>
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
              <div className="dataPoint">
                <span>36</span>
                <div>Remaining Tasks</div>
              </div>

              <div className="dataPoint">
                <span>47</span>
                <div>Completed Tasks</div>
              </div>

              <div className="dataPoint">
                <span>74%</span>
                <div>Current Progression</div>
              </div>
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
