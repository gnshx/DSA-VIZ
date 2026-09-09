import React from "react";
import { CallStackFrame } from "../types/trace";
import { Layers } from "lucide-react";

interface CallStackPanelProps {
  callStack: CallStackFrame[];
}

export const CallStackPanel: React.FC<CallStackPanelProps> = ({ callStack }) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: "0.85rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        height: "100%",
        overflowY: "auto"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <Layers size={16} color="var(--indigo-400)" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.02em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Call Stack
          </span>
        </div>
        <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
          DEPTH {callStack.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column-reverse", gap: "0.4rem" }}>
        {callStack.map((frame, idx) => {
          const isTop = idx === callStack.length - 1;
          return (
            <div
              key={frame.id || idx}
              style={{
                padding: "0.45rem 0.65rem",
                borderRadius: "6px",
                background: isTop ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.03)",
                border: isTop ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                transition: "all var(--transition-fast)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: isTop ? "var(--cyan-400)" : "var(--text-primary)"
                  }}
                >
                  {frame.name}()
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  line {frame.line}
                </span>
              </div>

              {frame.args && Object.keys(frame.args).length > 0 && (
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  args: {JSON.stringify(frame.args)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
