import { Children, useState, ReactNode } from "react";

export default function CreateProjectForms({ children }: { children: ReactNode }) {
  const [page, setPage] = useState(0);

  // 1. Convert children to a safe array so we can index it (e.g. array[0])
  const arrayChildren = Children.toArray(children);
  const totalPages = arrayChildren.length;

  function goNext() {
    // Prevent going past the last index (length - 1)
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  }

  function goBack() {
    // Prevent going below 0
    if (page > 0) {
      setPage(page - 1);
    }
  }

  // 2. Grab only the active child
  const activeChild = arrayChildren[page];

  return (
    <div className="CreateProjectForm">
      {/* 3. Render only the active step */}
      <div className="step-container">{activeChild}</div>

      <div
        className="navigation-controls"
        style={{ marginTop: "20px", display: "flex", gap: "10px" }}
      >
        {/* Hide Back button on first page */}
        <button
          onClick={goBack}
          disabled={page === 0}
          style={{ visibility: page === 0 ? "hidden" : "visible" }}
        >
          Back
        </button>

        {/* Change button text to "Finish" on the last page, or hide "Next" */}
        {page < totalPages - 1 ? (
          <button onClick={goNext}>Next</button>
        ) : (
          /* You might want to handle the final submit inside the child component,
              so we render nothing or a disabled button here */
          <span />
        )}
      </div>
    </div>
  );
}
