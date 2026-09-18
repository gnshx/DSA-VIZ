import React from "react";
import { CallStackFrame } from "../types/trace";
import { Layers } from "lucide-react";

interface CallStackPanelProps {
  callStack: CallStackFrame[];
}

export const CallStackPanel: React.FC<CallStackPanelProps> = ({ callStack }) => {
  return (
    <div className="glass-panel inspector">
      <div className="inspector-head">
        <div className="inspector-title">
          <Layers size={16} color="var(--indigo-400)" />
          <span>Call Stack</span>
        </div>
        <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
          DEPTH {callStack.length}
        </span>
      </div>

      <div className="stack-list">
        {callStack.map((frame, idx) => {
          const isTop = idx === callStack.length - 1;
          return (
            <div
              key={frame.id || idx}
              className="stack-frame"
              data-top={isTop}
            >
              <div className="inspector-row" style={{ justifyContent: "space-between" }}>
                <span
                  className="inspector-mono"
                  style={{ fontWeight: 700, color: isTop ? "var(--cyan-400)" : "var(--text-primary)" }}
                >
                  {frame.name}()
                </span>
                <span className="inspector-mono" style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                  line {frame.line}
                </span>
              </div>

              {frame.args && Object.keys(frame.args).length > 0 && (
                <div className="inspector-mono" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
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
