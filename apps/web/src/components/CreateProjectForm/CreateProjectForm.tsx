import { ReactNode } from "react";

export default function CreateProjectForm({
  title,
  children,
}: {
  title: string;
  children: ReactNode; // <--- Added this
}) {
  return (
    <div className="form-step-container">
      <h1>{title}</h1>
      <div className="form-content">{children}</div>
    </div>
  );
}
