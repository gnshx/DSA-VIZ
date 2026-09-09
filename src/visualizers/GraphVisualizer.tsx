import React from "react";
import { ExecutionEvent } from "../types/trace";
import { GraphSnapshot } from "../engine/algorithms/graphs";

interface GraphVisualizerProps {
  event: ExecutionEvent;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ event }) => {
  const state: GraphSnapshot = event.structureState || {
    nodes: [],
    edges: [],
    visited: [],
    frontier: [],
    activeNode: null,
    activeEdge: null
  };

  const visitedSet = new Set(state.visited || []);
  const frontierSet = new Set(state.frontier || []);
  const activeNode = state.activeNode;
  const activeEdge = state.activeEdge;

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
      {/* Legend & Stats */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem", justifyContent: "center" }}>
        <span className="badge badge-indigo">Active: {activeNode || "None"}</span>
        <span className="badge badge-cyan">Frontier Queue: [{state.frontier.join(", ")}]</span>
        <span className="badge badge-emerald">Visited Set: [{state.visited.join(", ")}]</span>
      </div>

      <svg width="480" height="300" style={{ overflow: "visible" }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="22"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255, 255, 255, 0.4)" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="22"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--cyan-400)" />
          </marker>
        </defs>

        {/* Edges */}
        {state.edges.map((edge) => {
          const uNode = state.nodes.find((n) => n.id === edge.u);
          const vNode = state.nodes.find((n) => n.id === edge.v);
          if (!uNode || !vNode) return null;

          const isEdgeActive =
            activeEdge && activeEdge[0] === edge.u && activeEdge[1] === edge.v;

          return (
            <line
              key={`${edge.u}-${edge.v}`}
              x1={uNode.x}
              y1={uNode.y}
              x2={vNode.x}
              y2={vNode.y}
              stroke={isEdgeActive ? "var(--cyan-400)" : "rgba(255, 255, 255, 0.15)"}
              strokeWidth={isEdgeActive ? "3.5" : "1.5"}
              markerEnd={isEdgeActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              style={{ transition: "all var(--transition-normal)" }}
            />
          );
        })}

        {/* Nodes */}
        {state.nodes.map((node) => {
          const isActive = activeNode === node.id;
          const isFrontier = frontierSet.has(node.id);
          const isVisited = visitedSet.has(node.id);

          let nodeColor = "var(--bg-tertiary)";
          let strokeColor = "var(--border-medium)";

          if (isActive) {
            nodeColor = "var(--indigo-500)";
            strokeColor = "var(--cyan-400)";
          } else if (isVisited) {
            nodeColor = "rgba(16, 185, 129, 0.25)";
            strokeColor = "var(--emerald-400)";
          } else if (isFrontier) {
            nodeColor = "rgba(6, 182, 212, 0.2)";
            strokeColor = "var(--cyan-400)";
          }

          return (
            <g key={node.id}>
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="28"
                  fill="none"
                  stroke="var(--cyan-400)"
                  strokeWidth="2"
                  opacity="0.6"
                  style={{ animation: "pulseGlow 1.5s infinite" }}
                />
              )}

              <circle
                cx={node.x}
                cy={node.y}
                r="22"
                fill={nodeColor}
                stroke={strokeColor}
                strokeWidth={isActive ? "2.5" : "1.5"}
                style={{
                  transition: "all var(--transition-smooth)",
                  filter: isActive ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))" : "none"
                }}
              />

              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="14"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
