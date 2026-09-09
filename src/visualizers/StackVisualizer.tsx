import React from "react";
import { ExecutionEvent } from "../types/trace";

interface StackVisualizerProps {
  event: ExecutionEvent;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ event }) => {
  const stack: string[] = Array.isArray(event.structureState)
    ? event.structureState
    : event.structureState?.stack || [];

  const isPush = event.type === "PUSH";
  const isPop = event.type === "POP";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "2rem",
        minHeight: "360px"
      }}
    >
      {/* Operation Status */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <span className="badge badge-indigo">LIFO Stack (Size: {stack.length})</span>
        {isPush && <span className="badge badge-emerald">Operation: PUSH</span>}
        {isPop && <span className="badge badge-rose">Operation: POP</span>}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
        {/* Top Pointer Indicator */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: "0.75rem", minWidth: "80px" }}>
          {stack.length > 0 && (
            <div className="pointer-marker" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span className="badge badge-amber">TOP</span>
              <span style={{ fontSize: "1.2rem", color: "var(--amber-400)" }}>➔</span>
            </div>
          )}
        </div>

        {/* Stack Cylinder Chamber */}
        <div
          style={{
            width: "140px",
            minHeight: "260px",
            borderLeft: "3px solid var(--border-medium)",
            borderRight: "3px solid var(--border-medium)",
            borderBottom: "6px solid var(--indigo-500)",
            borderRadius: "0 0 12px 12px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(99,102,241,0.06) 100%)",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column-reverse",
            gap: "0.5rem",
            position: "relative",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.5)"
          }}
        >
          {stack.length === 0 ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontStyle: "italic",
                whiteSpace: "nowrap"
              }}
            >
              (Stack Empty)
            </div>
          ) : (
            stack.map((item, idx) => {
              const isTop = idx === stack.length - 1;
              return (
                <div
                  key={idx}
                  style={{
                    height: "44px",
                    width: "100%",
                    borderRadius: "8px",
                    background: isTop
                      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.25))"
                      : "rgba(255, 255, 255, 0.05)",
                    border: isTop ? "2px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: isTop ? "#ffffff" : "var(--text-secondary)",
                    boxShadow: isTop ? "var(--shadow-glow-indigo)" : "none",
                    animation: isTop && isPush ? "pulseGlow 1.5s infinite" : "none",
                    transition: "all var(--transition-normal)"
                  }}
                >
                  {item}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
