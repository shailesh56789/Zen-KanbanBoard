import { useState, useEffect } from "react";

export default function AnimatedKanbanBoard() {
  const [currentStep, setCurrentStep] = useState(0);

  const tasks = [
    { id: 1, title: "Design UI", color: "#bfdbfe", borderColor: "#93c5fd" },
    { id: 2, title: "Setup Database", color: "#d1fae5", borderColor: "#86efac" },
    { id: 3, title: "API Integration", color: "#e9d5ff", borderColor: "#c4b5fd" },
    { id: 4, title: "Testing", color: "#fed7aa", borderColor: "#fdba74" },
  ];

  const columns = ["To Do", "In Progress", "Done"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getTaskPosition = (taskId, step) => {
    const animations = {
      1: [0, 0, 1, 1, 2, 2, 2, 0],
      2: [0, 0, 0, 1, 1, 2, 2, 2],
      3: [1, 1, 1, 1, 2, 2, 0, 0],
      4: [2, 2, 2, 2, 2, 2, 1, 1],
    };
    return animations[taskId][step];
  };

  const dotColors = ["#f87171", "#fbbf24", "#34d399"];

  return (
    <div
      style={{
        minHeight:800,
        backgroundColor: "white",
        borderRadius: 24,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        padding: 24,
        minWidth: 800,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: 8,
          }}
        >
          Project Dashboard
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              height: 8,
              backgroundColor: "#fecdd3",
              borderRadius: 9999,
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#ec4899",
                borderRadius: 9999,
                width: `${((currentStep + 1) / 8) * 100}%`,
                transition: "width 1s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 14, color: "#4b5563" }}>
            {Math.round(((currentStep + 1) / 8) * 100)}%
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        {columns.map((column, columnIndex) => (
          <div
            key={column}
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: 12,
              padding: 16,
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h4 style={{ fontWeight: "600", color: "#374151" }}>{column}</h4>
              <span
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#4b5563",
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 9999,
                  minWidth: 24,
                  textAlign: "center",
                }}
              >
                {tasks.filter(
                  (task) => getTaskPosition(task.id, currentStep) === columnIndex
                ).length}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flexGrow: 1,
              }}
            >
              {tasks
                .filter(
                  (task) => getTaskPosition(task.id, currentStep) === columnIndex
                )
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: task.color,
                      border: `2px solid ${task.borderColor}`,
                      borderRadius: 12,
                      padding: 12,
                      cursor: "pointer",
                      transition: "all 1s ease",
                      animation: "slideIn 0.5s ease-out",
                      transformOrigin: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ fontWeight: 500, color: "#1f2937" }}>
                        {task.title}
                      </h5>
                      <div style={{ display: "flex", gap: 4 }}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: dotColors[columnIndex],
                          }}
                        />
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#4b5563",
                        marginTop: 8,
                      }}
                    >
                      {columnIndex === 0
                        ? "Ready to start"
                        : columnIndex === 1
                        ? "In development"
                        : "Completed"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
          color: "#6b7280",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { color: "#93c5fd", label: "Design" },
            { color: "#86efac", label: "Backend" },
            { color: "#c4b5fd", label: "Integration" },
            { color: "#fdba74", label: "Testing" },
          ].map(({ color, label }) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                  borderRadius: 4,
                }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <span>Live Demo</span>
      </div>
    </div>
  );
}