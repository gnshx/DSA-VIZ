import React from "react";
import { ExecutionEvent } from "../types/trace";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { StackVisualizer } from "./StackVisualizer";
import { LinkedListVisualizer } from "./LinkedListVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";
import { HeapVisualizer } from "./HeapVisualizer";
import { GridVisualizer } from "./GridVisualizer";
import { RotateCcw, Sparkles } from "lucide-react";

interface SimulationStageProps {
  event: ExecutionEvent;
  title: string;
  onReset?: () => void;
}

export const SimulationStage: React.FC<SimulationStageProps> = ({ event, title, onReset }) => {
  const renderVisualizer = () => {
    switch (event.structureType) {
      case "array":
        return <ArrayVisualizer event={event} />;
      case "stack":
      case "queue":
        return <StackVisualizer event={event} />;
      case "linked_list":
        return <LinkedListVisualizer event={event} />;
      case "tree":
        return <TreeVisualizer event={event} />;
      case "graph":
        return <GraphVisualizer event={event} />;
      case "heap":
        return <HeapVisualizer event={event} />;
      case "grid":
        return <GridVisualizer event={event} />;
      default:
        return <ArrayVisualizer event={event} />;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "420px",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Top Simulation Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(0, 0, 0, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Sparkles size={18} color="var(--cyan-400)" />
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
            {title}
          </span>
          <span className="badge badge-indigo" style={{ fontSize: "0.7rem" }}>
            {event.structureType.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {onReset && (
            <button
              onClick={onReset}
              className="btn btn-ghost btn-icon"
              title="Reset View"
              style={{ width: "32px", height: "32px" }}
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Stage Canvas Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.04) 0%, rgba(8, 12, 20, 0.6) 100%)",
          position: "relative",
          overflow: "auto"
        }}
      >
        {renderVisualizer()}
      </div>

      {/* Explanation Banner */}
      <div
        style={{
          padding: "0.85rem 1.25rem",
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(11, 16, 28, 0.9)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}
      >
        <span className="badge badge-cyan" style={{ flexShrink: 0 }}>
          STEP {event.step}
        </span>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
          {event.explanation}
        </p>
      </div>
    </div>
  );
};
