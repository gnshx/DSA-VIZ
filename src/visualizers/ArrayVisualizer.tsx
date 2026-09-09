import React from "react";
import { ExecutionEvent } from "../types/trace";

interface ArrayVisualizerProps {
  event: ExecutionEvent;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ event }) => {
  const array: number[] = Array.isArray(event.structureState)
    ? event.structureState
    : event.structureState?.array || [];

  const highlighted = new Set(event.highlightedIndices || []);
  const swapped = new Set(event.swappedIndices || []);
  const windowRange = event.windowRange; // [left, right]

  // Map pointer names to array indices
  const pointerMap: Record<number, string[]> = {};
  if (event.pointers) {
    Object.entries(event.pointers).forEach(([name, val]) => {
      const idx = typeof val === "number" ? val : parseInt(val as string, 10);
      if (!isNaN(idx) && idx >= 0 && idx < array.length) {
        if (!pointerMap[idx]) pointerMap[idx] = [];
        pointerMap[idx].push(name);
      }
    });
  }

  // Pointer color mapping
  const getPointerBadgeClass = (name: string) => {
    switch (name.toLowerCase()) {
      case "i":
      case "left":
      case "slow":
        return "badge-indigo";
      case "j":
      case "right":
      case "fast":
        return "badge-rose";
      case "mid":
      case "pivot":
        return "badge-amber";
      default:
        return "badge-cyan";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "2rem 1rem", position: "relative" }}>
      {/* Visual Window Header if bounded */}
      {windowRange && (
        <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-cyan">Active Search Space: [{windowRange[0]} ... {windowRange[1]}]</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            ({windowRange[1] >= windowRange[0] ? `${windowRange[1] - windowRange[0] + 1} candidates remaining` : "empty"})
          </span>
        </div>
      )}

      {/* Array Container */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          padding: "1.5rem 1rem",
          position: "relative",
          minHeight: "180px"
        }}
      >
        {array.map((value, idx) => {
          const isHighlighted = highlighted.has(idx);
          const isSwapped = swapped.has(idx);
          const isOutOfWindow = windowRange && (idx < windowRange[0] || idx > windowRange[1]);
          const pointers = pointerMap[idx] || [];

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: isOutOfWindow ? 0.35 : 1,
                transition: "all var(--transition-smooth)",
                position: "relative"
              }}
            >
              {/* Index Number Label */}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: isHighlighted ? "var(--cyan-400)" : "var(--text-dim)",
                  marginBottom: "0.4rem",
                  fontWeight: 600
                }}
              >
                [{idx}]
              </span>

              {/* Memory Element Cell */}
              <div
                style={{
                  width: "56px",
                  height: "64px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  background: isSwapped
                    ? "linear-gradient(145deg, rgba(244, 63, 94, 0.25), rgba(244, 63, 94, 0.1))"
                    : isHighlighted
                    ? "linear-gradient(145deg, rgba(6, 182, 212, 0.25), rgba(99, 102, 241, 0.2))"
                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                  border: isSwapped
                    ? "2px solid var(--rose-400)"
                    : isHighlighted
                    ? "2px solid var(--cyan-400)"
                    : "1px solid var(--border-subtle)",
                  color: isSwapped
                    ? "var(--rose-400)"
                    : isHighlighted
                    ? "#ffffff"
                    : "var(--text-primary)",
                  boxShadow: isSwapped
                    ? "var(--shadow-glow-rose)"
                    : isHighlighted
                    ? "var(--shadow-glow-cyan)"
                    : "var(--shadow-sm)",
                  transform: isHighlighted || isSwapped ? "translateY(-6px) scale(1.05)" : "none",
                  transition: "all var(--transition-smooth)"
                }}
              >
                {value}
              </div>

              {/* Pointers Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginTop: "0.6rem",
                  minHeight: "50px"
                }}
              >
                {pointers.map((pName) => (
                  <div key={pName} className="pointer-marker" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--indigo-400)" }}>▲</span>
                    <span className={`badge ${getPointerBadgeClass(pName)}`}>
                      {pName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
