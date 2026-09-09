import React from "react";
import { ExecutionEvent } from "../types/trace";

interface HeapVisualizerProps {
  event: ExecutionEvent;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ event }) => {
  const heap: number[] = event.structureState?.array || [];
  const activeIndex = event.structureState?.activeIndex;
  const parentIndex = event.structureState?.parentIndex;
  const swapped = new Set(event.swappedIndices || []);

  // Precomputed coordinates for a complete binary tree of up to 15 nodes
  const treeCoords = [
    { x: 260, y: 35 },  // 0
    { x: 140, y: 95 },  // 1
    { x: 380, y: 95 },  // 2
    { x: 80, y: 160 },  // 3
    { x: 200, y: 160 }, // 4
    { x: 320, y: 160 }, // 5
    { x: 440, y: 160 }, // 6
    { x: 50, y: 225 },  // 7
    { x: 110, y: 225 }  // 8
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "1rem",
        gap: "1.5rem"
      }}
    >
      {/* Title & Dual-View Badge */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "center" }}>
        <span className="badge badge-indigo">Dual Synchronized View</span>
        <span className="badge badge-cyan">Complete Tree (Logical)</span>
        <span className="badge badge-emerald">Contiguous Array (Physical)</span>
      </div>

      {/* 1. Complete Binary Tree View (Logical) */}
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "250px",
          position: "relative",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <svg width="520" height="240" style={{ overflow: "visible" }}>
          {/* Tree Edges: child i connects to parent floor((i - 1) / 2) */}
          {heap.map((_, idx) => {
            if (idx === 0) return null;
            const parent = Math.floor((idx - 1) / 2);
            const pCoord = treeCoords[parent];
            const cCoord = treeCoords[idx];
            if (!pCoord || !cCoord) return null;

            const isEdgeActive =
              (activeIndex === idx && parentIndex === parent) ||
              (activeIndex === parent && parentIndex === idx);

            return (
              <line
                key={`edge-${idx}`}
                x1={pCoord.x}
                y1={pCoord.y}
                x2={cCoord.x}
                y2={cCoord.y}
                stroke={isEdgeActive ? "var(--cyan-400)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth={isEdgeActive ? "3" : "1.5"}
                style={{ transition: "all var(--transition-normal)" }}
              />
            );
          })}

          {/* Tree Nodes */}
          {heap.map((val, idx) => {
            const coord = treeCoords[idx];
            if (!coord) return null;

            const isActive = activeIndex === idx;
            const isParent = parentIndex === idx;
            const isSwapped = swapped.has(idx);

            let fillColor = "var(--bg-tertiary)";
            let strokeColor = "var(--border-medium)";

            if (isSwapped) {
              fillColor = "rgba(244, 63, 94, 0.35)";
              strokeColor = "var(--rose-400)";
            } else if (isActive) {
              fillColor = "var(--indigo-500)";
              strokeColor = "var(--cyan-400)";
            } else if (isParent) {
              fillColor = "rgba(245, 158, 11, 0.3)";
              strokeColor = "var(--amber-400)";
            }

            return (
              <g key={`tree-node-${idx}`}>
                {isActive && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="24"
                    fill="none"
                    stroke="var(--cyan-400)"
                    strokeWidth="2"
                    style={{ animation: "pulseGlow 1.5s infinite" }}
                  />
                )}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="18"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2"
                  style={{ transition: "all var(--transition-smooth)" }}
                />
                <text
                  x={coord.x}
                  y={coord.y + 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
                {/* Index tag below node */}
                <text
                  x={coord.x}
                  y={coord.y + 26}
                  textAnchor="middle"
                  fill="var(--text-dim)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  [{idx}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. Contiguous 1D Array Storage (Physical) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          overflowX: "auto",
          maxWidth: "100%",
          padding: "0.5rem"
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "0.5rem" }}>
          Physical Array:
        </span>
        {heap.map((val, idx) => {
          const isActive = activeIndex === idx;
          const isParent = parentIndex === idx;
          const isSwapped = swapped.has(idx);

          return (
            <div
              key={`array-${idx}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--text-dim)" }}>
                {idx}
              </span>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: isSwapped
                    ? "rgba(244, 63, 94, 0.3)"
                    : isActive
                    ? "rgba(99, 102, 241, 0.35)"
                    : isParent
                    ? "rgba(245, 158, 11, 0.25)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: isSwapped
                    ? "2px solid var(--rose-400)"
                    : isActive
                    ? "2px solid var(--cyan-400)"
                    : isParent
                    ? "2px solid var(--amber-400)"
                    : "1px solid var(--border-subtle)",
                  color: isSwapped
                    ? "var(--rose-400)"
                    : isActive
                    ? "var(--cyan-400)"
                    : "#ffffff",
                  transition: "all var(--transition-normal)"
                }}
              >
                {val}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
