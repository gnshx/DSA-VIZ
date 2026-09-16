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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "1.5rem 0.5rem", position: "relative" }}>
      {/* Visual Window Header if bounded */}
      {windowRange && (
        <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-cyan">Active Search Space: [{windowRange[0]} ... {windowRange[1]}]</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            ({windowRange[1] >= windowRange[0] ? `${windowRange[1] - windowRange[0] + 1} candidates remaining` : "empty"})
          </span>
        </div>
      )}

      {/* Array Container - Fluid Zero Scrollbar Engine */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "clamp(0.2rem, 1vw, 0.65rem)",
          padding: "1rem 0.25rem",
          position: "relative",
          minHeight: "170px",
          overflowX: "hidden"
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
                flex: "1 1 0px",
                minWidth: "28px",
                maxWidth: "56px",
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
                  fontSize: "0.725rem",
                  fontFamily: "var(--font-mono)",
                  color: isHighlighted ? "var(--cyan-400)" : "var(--text-dim)",
                  marginBottom: "0.35rem",
                  fontWeight: 600
                }}
              >
                [{idx}]
              </span>

              {/* Memory Element Cell */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1.12",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(0.85rem, 1.4vw, 1.25rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  background: isSwapped
                    ? "linear-gradient(145deg, rgba(244, 63, 94, 0.25), rgba(244, 63, 94, 0.1))"
                    : isHighlighted
                    ? "linear-gradient(145deg, rgba(6, 182, 212, 0.25), rgba(99, 102, 241, 0.2))"
                    : "var(--bg-card)",
                  border: isSwapped
                    ? "2px solid var(--rose-400)"
                    : isHighlighted
                    ? "2px solid var(--cyan-400)"
                    : "1px solid var(--border-medium)",
                  color: isSwapped
                    ? "var(--rose-400)"
                    : isHighlighted
                    ? "var(--cyan-400)"
                    : "var(--text-primary)",
                  boxShadow: isSwapped
                    ? "var(--shadow-glow-rose)"
                    : isHighlighted
                    ? "var(--shadow-glow-cyan)"
                    : "var(--shadow-sm)",
                  transform: isHighlighted || isSwapped ? "translateY(-4px) scale(1.04)" : "none",
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
                  gap: "0.2rem",
                  marginTop: "0.5rem",
                  minHeight: "46px"
                }}
              >
                {pointers.map((pName) => (
                  <div key={pName} className="pointer-marker" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--indigo-400)", lineHeight: 1 }}>▲</span>
                    <span className={`badge ${getPointerBadgeClass(pName)}`} style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}>
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
