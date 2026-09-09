import React from "react";
import { ExecutionEvent } from "../types/trace";

interface GridVisualizerProps {
  event: ExecutionEvent;
}

export const GridVisualizer: React.FC<GridVisualizerProps> = ({ event }) => {
  const state = event.structureState || {};
  const grid: (number | string | null)[][] = state.grid || [];
  const activeCell: [number, number] | null = state.activeCell ?? null;
  const dependencyCells: [number, number][] = state.dependencyCells || [];
  const baseCases: [number, number][] = state.baseCases || [];
  const rowLabels: string[] = state.rowLabels || [];
  const colLabels: string[] = state.colLabels || [];
  const formula: string = state.formula || "";

  const isDependency = (r: number, c: number) =>
    dependencyCells.some(([dr, dc]) => dr === r && dc === c);

  const isBaseCase = (r: number, c: number) =>
    baseCases.some(([br, bc]) => br === r && bc === c);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "1.5rem 1rem",
        gap: "1.25rem",
        overflowX: "auto"
      }}
    >
      {/* Top Formula Banner */}
      {formula && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            padding: "0.45rem 1rem",
            borderRadius: "8px"
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--indigo-400)", fontWeight: 700, textTransform: "uppercase" }}>
            State Transition:
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#ffffff", fontWeight: 600 }}>
            {formula}
          </span>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <span className="badge badge-emerald">Base Cases</span>
        <span className="badge badge-amber">Dependencies</span>
        <span className="badge badge-cyan">Active Computation</span>
      </div>

      {/* 2D Table Grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          background: "rgba(0, 0, 0, 0.4)",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-md)"
        }}
      >
        {/* Col Headers */}
        {colLabels.length > 0 && (
          <div style={{ display: "flex", gap: "4px", marginLeft: rowLabels.length > 0 ? "54px" : "0" }}>
            {colLabels.map((cLabel, cIdx) => (
              <div
                key={`col-${cIdx}`}
                style={{
                  width: "52px",
                  height: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.725rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "var(--cyan-400)"
                }}
              >
                {cLabel}
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        {grid.map((row, rIdx) => (
          <div key={`row-${rIdx}`} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {/* Row Label */}
            {rowLabels.length > 0 && (
              <div
                style={{
                  width: "50px",
                  fontSize: "0.725rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "var(--indigo-400)",
                  textAlign: "right",
                  paddingRight: "6px"
                }}
              >
                {rowLabels[rIdx] || `[${rIdx}]`}
              </div>
            )}

            {/* Cells */}
            {row.map((cellVal, cIdx) => {
              const isActive = activeCell && activeCell[0] === rIdx && activeCell[1] === cIdx;
              const isDep = isDependency(rIdx, cIdx);
              const isBase = isBaseCase(rIdx, cIdx);
              const hasValue = cellVal !== null && cellVal !== undefined;

              let bg = "rgba(255, 255, 255, 0.03)";
              let border = "1px solid var(--border-subtle)";
              let color = "var(--text-dim)";

              if (isActive) {
                bg = "rgba(6, 182, 212, 0.25)";
                border = "2px solid var(--cyan-400)";
                color = "#ffffff";
              } else if (isDep) {
                bg = "rgba(245, 158, 11, 0.2)";
                border = "2px solid var(--amber-400)";
                color = "var(--amber-400)";
              } else if (isBase) {
                bg = "rgba(16, 185, 129, 0.15)";
                border = "1px solid var(--emerald-400)";
                color = "var(--emerald-400)";
              } else if (hasValue) {
                color = "var(--text-primary)";
              }

              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  style={{
                    width: "52px",
                    height: "44px",
                    borderRadius: "6px",
                    background: bg,
                    border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.95rem",
                    fontWeight: hasValue ? 700 : 400,
                    color,
                    boxShadow: isActive ? "var(--shadow-glow-cyan)" : "none",
                    transform: isActive ? "scale(1.08)" : "none",
                    transition: "all var(--transition-normal)",
                    position: "relative"
                  }}
                >
                  {hasValue ? cellVal : "·"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
