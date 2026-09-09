import React from "react";
import { ExecutionEvent } from "../types/trace";
import { Cpu, Layers } from "lucide-react";

interface MemoryInspectorProps {
  event: ExecutionEvent;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({ event }) => {
  const variables = event.variables || {};
  const pointers = event.pointers || {};

  return (
    <div
      className="glass-panel"
      style={{
        padding: "0.85rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        height: "100%",
        overflowY: "auto"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        <Cpu size={16} color="var(--indigo-400)" />
        <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.02em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
          Memory & Variables
        </span>
      </div>

      {/* Pointers Section */}
      <div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.35rem", fontWeight: 600 }}>
          Active Pointers
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {Object.keys(pointers).length === 0 ? (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              None active
            </span>
          ) : (
            Object.entries(pointers).map(([name, val]) => (
              <div
                key={name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  borderRadius: "6px",
                  padding: "0.2rem 0.45rem",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)"
                }}
              >
                <span style={{ color: "var(--indigo-400)", fontWeight: 700 }}>{name}:</span>
                <span style={{ color: "#ffffff" }}>{String(val)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Local Scope Variables */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.35rem", fontWeight: 600 }}>
          Local Scope Variables
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            background: "rgba(0, 0, 0, 0.25)",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)"
          }}
        >
          {Object.keys(variables).length === 0 ? (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              No local variables
            </span>
          ) : (
            Object.entries(variables).map(([key, value]) => {
              const displayVal = typeof value === "object" ? JSON.stringify(value) : String(value);
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.775rem",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  <span style={{ color: "var(--cyan-400)", fontWeight: 600 }}>{key}</span>
                  <span style={{ color: "var(--text-primary)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayVal}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
