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
        padding: "0.5rem",
        overflow: "hidden"
      }}
    >
      {/* Legend */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <span className="badge badge-indigo">prev</span>
        <span className="badge badge-cyan">curr</span>
        <span className="badge badge-amber">next_temp</span>
        <span className="badge badge-emerald">head</span>
      </div>

      {/* Nodes Track Wrapper */}
      <div style={{ width: "100%", overflowX: "hidden", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(0.4rem, 1.2vw, 1.25rem)",
            padding: "3rem 1rem 1.25rem 1rem",
            minHeight: "180px",
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto"
          }}
        >
          {nodes.map((node) => {
            const isCurr = currId === node.id;
            const isPrev = prevId === node.id;
            const isNextTemp = nextTempId === node.id;
            const isHead = headId === node.id;

            const nextTarget = node.nextId ? nodes.find((n) => n.id === node.nextId) : null;
            const pointsBackward = nextTarget && nodes.indexOf(nextTarget) < nodes.indexOf(node);

            return (
              <div
                key={node.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(0.2rem, 0.8vw, 0.75rem)",
                  position: "relative",
                  flex: "1 1 0px",
                  maxWidth: "130px",
                  minWidth: "70px"
                }}
              >
                {/* Pointer Markers above */}
                <div
                  style={{
                    position: "absolute",
                    top: "-36px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.2rem",
                    whiteSpace: "nowrap",
                    zIndex: 10
                  }}
                >
                  {isHead && <span className="badge badge-emerald" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>HEAD</span>}
                  {isCurr && <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>curr</span>}
                  {isPrev && <span className="badge badge-indigo" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>prev</span>}
                  {isNextTemp && <span className="badge badge-amber" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>next_temp</span>}
                </div>

                {/* Node Card */}
                <div
                  style={{
                    display: "flex",
                    borderRadius: "10px",
                    border: isCurr
                      ? "2px solid var(--cyan-400)"
                      : isPrev
                      ? "2px solid var(--indigo-400)"
                      : "1px solid var(--border-subtle)",
                    background: isCurr
                      ? "linear-gradient(145deg, rgba(6, 182, 212, 0.2), var(--bg-card))"
                      : isPrev
                      ? "linear-gradient(145deg, rgba(99, 102, 241, 0.2), var(--bg-card))"
                      : "var(--bg-card)",
                    boxShadow: isCurr
                      ? "var(--shadow-glow-cyan)"
                      : isPrev
                      ? "var(--shadow-glow-indigo)"
                      : "var(--shadow-sm)",
                    overflow: "hidden",
                    width: "100%",
                    transition: "all var(--transition-smooth)"
                  }}
                >
                  {/* Value compartment */}
                  <div
                    style={{
                      flex: 1,
                      padding: "0.6rem 0.75rem",
                      fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-primary)",
                      borderRight: "1px solid var(--border-subtle)",
                      textAlign: "center"
                    }}
                  >
                    {node.val}
                  </div>

                  {/* Next Pointer compartment */}
                  <div
                    style={{
                      padding: "0.6rem 0.5rem",
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-mono)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: node.nextId ? "var(--cyan-400)" : "var(--rose-400)",
                      background: "var(--bg-tertiary)"
                    }}
                  >
                    {node.nextId ? "next" : "null"}
                  </div>
                </div>

                {/* Arrow linking to next node */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: pointsBackward ? "var(--rose-400)" : "var(--cyan-400)",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    transform: pointsBackward ? "scaleX(-1)" : "none"
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
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              border: "1px dashed var(--border-medium)",
              color: "var(--text-muted)",
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono)"
            }}
          >
            NULL
          </div>
        </div>
      </div>
    </div>
  );
};
