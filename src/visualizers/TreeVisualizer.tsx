import React from "react";
import { ExecutionEvent } from "../types/trace";
import { TreeNodeSnapshot } from "../engine/algorithms/trees";

interface TreeVisualizerProps {
  event: ExecutionEvent;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ event }) => {
  const state = event.structureState || {};
  const nodes: TreeNodeSnapshot[] = state.nodes || [];
  const activeNodeId = state.activeNodeId;

  // Compute fixed 2D layout coordinates for binary tree
  const coordinates: Record<string, { x: number; y: number }> = {
    "50": { x: 300, y: 50 },
    "30": { x: 180, y: 130 },
    "70": { x: 420, y: 130 },
    "20": { x: 120, y: 220 },
    "40": { x: 240, y: 220 },
    "60": { x: 360, y: 220 },
    "80": { x: 480, y: 220 }
  };

  const nodeMap = new Map<string, TreeNodeSnapshot>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "1rem",
        overflowX: "auto"
      }}
    >
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem" }}>
        <span className="badge badge-indigo">Binary Search Tree</span>
        <span className="badge badge-cyan">Active Traversal: Node {activeNodeId || "None"}</span>
      </div>

      <svg width="600" height="300" style={{ overflow: "visible" }}>
        {/* Draw Edges */}
        {nodes.map((node) => {
          const parentCoord = coordinates[node.id];
          if (!parentCoord) return null;

          const elements: React.ReactNode[] = [];

          if (node.leftId && coordinates[node.leftId]) {
            const leftCoord = coordinates[node.leftId];
            const isPathActive = activeNodeId === node.id || activeNodeId === node.leftId;
            elements.push(
              <line
                key={`${node.id}-left`}
                x1={parentCoord.x}
                y1={parentCoord.y}
                x2={leftCoord.x}
                y2={leftCoord.y}
                stroke={isPathActive ? "var(--cyan-400)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth={isPathActive ? "3" : "1.5"}
                strokeDasharray={isPathActive ? "none" : "3,3"}
                style={{ transition: "all var(--transition-normal)" }}
              />
            );
          }

          if (node.rightId && coordinates[node.rightId]) {
            const rightCoord = coordinates[node.rightId];
            const isPathActive = activeNodeId === node.id || activeNodeId === node.rightId;
            elements.push(
              <line
                key={`${node.id}-right`}
                x1={parentCoord.x}
                y1={parentCoord.y}
                x2={rightCoord.x}
                y2={rightCoord.y}
                stroke={isPathActive ? "var(--cyan-400)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth={isPathActive ? "3" : "1.5"}
                strokeDasharray={isPathActive ? "none" : "3,3"}
                style={{ transition: "all var(--transition-normal)" }}
              />
            );
          }

          return elements;
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const coord = coordinates[node.id];
          if (!coord) return null;
          const isActive = activeNodeId === node.id;

          return (
            <g key={node.id} style={{ cursor: "pointer" }}>
              {/* Outer Pulse Ring */}
              {isActive && (
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="28"
                  fill="none"
                  stroke="var(--cyan-400)"
                  strokeWidth="2"
                  opacity="0.6"
                  style={{ animation: "pulseGlow 1.5s infinite" }}
                />
              )}

              {/* Node Body Circle */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r="22"
                fill={isActive ? "var(--indigo-500)" : "var(--bg-tertiary)"}
                stroke={isActive ? "var(--cyan-400)" : "var(--border-medium)"}
                strokeWidth={isActive ? "2.5" : "1.5"}
                style={{
                  transition: "all var(--transition-smooth)",
                  filter: isActive ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.6))" : "none"
                }}
              />

              {/* Node Value Label */}
              <text
                x={coord.x}
                y={coord.y + 5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {node.val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
