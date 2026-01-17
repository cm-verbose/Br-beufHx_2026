"use client";

import AppLayout from "@/components/AppLayout/AppLayout";
import "./style.scss";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import ProjectList from "@/components/ProjectList/ProjectList";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProjectView() {
  const router = useRouter();
  const [length, setDataLength] = useState(0);
  useEffect(() => {
    axios.get("http://127.0.0.1:4000/project").then((res) => {
      const data = res.data;
      return setDataLength(data.length);
    });
  }, []);
  return (
    <AppLayout>
      <div className="Project-View">
        <h1>Projects</h1>

        <section id="option-joiner">
          <h2>{`${length} active project${length > 1 ? "s" : ""}`}</h2>
          <div id="options">
            <button>
              Filter{" "}
              <Image
                src="./svg/filter.svg"
                loading="eager"
                alt="filter"
                width={24}
                height={24}
                priority
              ></Image>
            </button>
            <button
              onClick={() => {
                router.push("/create");
              }}
            >
              Add project{" "}
              <Image
                src="./svg/add.svg"
                loading="eager"
                alt="filter"
                width={24}
                height={24}
                priority
              ></Image>
            </button>
          </div>
        </section>
        <section id="project-section">
          <Suspense fallback={<p>Loading projects...</p>}>
            <ProjectList />
          </Suspense>
        </section>
      </div>
    </AppLayout>
  );
}
