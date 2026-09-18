import React from "react";
import { ExecutionEvent } from "../types/trace";
import { Cpu } from "lucide-react";

interface MemoryInspectorProps {
  event: ExecutionEvent;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({ event }) => {
  const variables = event.variables || {};
  const pointers = event.pointers || {};

  return (
    <div className="glass-panel inspector">
      <div className="inspector-head">
        <div className="inspector-title">
          <Cpu size={16} color="var(--indigo-400)" />
          <span>Memory &amp; Variables</span>
        </div>
      </div>

      <div>
        <div className="inspector-title" style={{ marginBottom: "0.35rem", fontSize: "0.7rem" }}>
          Active Pointers
        </div>
        <div className="chip-list">
          {Object.keys(pointers).length === 0 ? (
            <span className="inspector-mono" style={{ fontStyle: "italic" }}>
              None active
            </span>
          ) : (
            Object.entries(pointers).map(([name, val]) => (
              <div key={name} className="chip">
                <span style={{ color: "var(--indigo-400)", fontWeight: 700 }}>{name}:</span>
                <span style={{ color: "var(--text-primary)" }}>{String(val)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="inspector-title" style={{ marginBottom: "0.35rem", fontSize: "0.7rem" }}>
          Local Scope Variables
        </div>
        <div className="var-list">
          {Object.keys(variables).length === 0 ? (
            <span className="inspector-mono" style={{ fontStyle: "italic" }}>
              No local variables
            </span>
          ) : (
            Object.entries(variables).map(([key, value]) => {
              const displayVal = typeof value === "object" ? JSON.stringify(value) : String(value);
              return (
                <div key={key} className="var-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span style={{ color: "var(--cyan-400)", fontWeight: 600 }}>{key}</span>
                  <span style={{ color: "var(--text-primary)", wordBreak: "break-word", overflowWrap: "anywhere", maxWidth: "100%", textAlign: "right" }}>
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
