import React from "react";
import { ExecutionEvent } from "../types/trace";
import { ListNodeSnapshot } from "../engine/algorithms/linkedList";

interface LinkedListVisualizerProps {
  event: ExecutionEvent;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ event }) => {
  const state = event.structureState || {};
  const nodes: ListNodeSnapshot[] = state.nodes || [];
  const headId = state.headId;
  const prevId = state.prevId;
  const currId = state.currId;
  const nextTempId = state.nextTempId;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "2rem 1rem",
        overflowX: "auto"
      }}
    >
      {/* Legend */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <span className="badge badge-indigo">prev</span>
        <span className="badge badge-cyan">curr</span>
        <span className="badge badge-amber">next_temp</span>
        <span className="badge badge-emerald">head</span>
      </div>

      {/* Nodes Track */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          padding: "2rem 1rem",
          minHeight: "220px",
          position: "relative"
        }}
      >
        {nodes.map((node) => {
          const isCurr = currId === node.id;
          const isPrev = prevId === node.id;
          const isNextTemp = nextTempId === node.id;
          const isHead = headId === node.id;

          // Target node pointed to by node.nextId
          const nextTarget = node.nextId ? nodes.find((n) => n.id === node.nextId) : null;
          const pointsBackward = nextTarget && nodes.indexOf(nextTarget) < nodes.indexOf(node);

          return (
            <div
              key={node.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                position: "relative"
              }}
            >
              {/* Pointer Markers above */}
              <div
                style={{
                  position: "absolute",
                  top: "-42px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.2rem",
                  whiteSpace: "nowrap"
                }}
              >
                {isHead && <span className="badge badge-emerald">HEAD</span>}
                {isCurr && <span className="badge badge-cyan">curr</span>}
                {isPrev && <span className="badge badge-indigo">prev</span>}
                {isNextTemp && <span className="badge badge-amber">next_temp</span>}
              </div>

              {/* Node Card */}
              <div
                style={{
                  display: "flex",
                  borderRadius: "12px",
                  border: isCurr
                    ? "2px solid var(--cyan-400)"
                    : isPrev
                    ? "2px solid var(--indigo-400)"
                    : "1px solid var(--border-subtle)",
                  background: isCurr
                    ? "linear-gradient(145deg, rgba(6, 182, 212, 0.2), rgba(15, 23, 42, 0.8))"
                    : isPrev
                    ? "linear-gradient(145deg, rgba(99, 102, 241, 0.2), rgba(15, 23, 42, 0.8))"
                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(15, 23, 42, 0.6))",
                  boxShadow: isCurr
                    ? "var(--shadow-glow-cyan)"
                    : isPrev
                    ? "var(--shadow-glow-indigo)"
                    : "var(--shadow-sm)",
                  overflow: "hidden",
                  transform: isCurr ? "scale(1.05)" : "none",
                  transition: "all var(--transition-smooth)"
                }}
              >
                {/* Value compartment */}
                <div
                  style={{
                    padding: "0.85rem 1.1rem",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-primary)",
                    borderRight: "1px solid var(--border-subtle)"
                  }}
                >
                  {node.val}
                </div>

                {/* Next Pointer compartment */}
                <div
                  style={{
                    padding: "0.85rem 0.75rem",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: node.nextId ? "var(--cyan-400)" : "var(--rose-400)",
                    background: "rgba(0, 0, 0, 0.25)"
                  }}
                >
                  {node.nextId ? "next •" : "null"}
                </div>
              </div>

              {/* Arrow linking to next node */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: pointsBackward ? "var(--rose-400)" : "var(--cyan-400)",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  transform: pointsBackward ? "scaleX(-1)" : "none",
                  transition: "transform 0.4s ease-in-out"
                }}
              >
                ➔
              </div>
            </div>
          );
        })}

        {/* Tail Null Node */}
        <div
          style={{
            padding: "0.6rem 0.9rem",
            borderRadius: "8px",
            border: "1px dashed var(--border-medium)",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            fontFamily: "var(--font-mono)"
          }}
        >
          NULL
        </div>
      </div>
    </div>
  );
};
