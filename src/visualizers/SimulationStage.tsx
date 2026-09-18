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
    <div className="glass-panel stage">
      <div className="stage-header">
        <div className="stage-title">
          <Sparkles size={18} color="var(--cyan-400)" />
          <h2>{title}</h2>
          <span className="badge badge-indigo" style={{ fontSize: "0.7rem" }}>
            {event.structureType.toUpperCase()}
          </span>
        </div>

        <div>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-icon"
              title="Reset view"
              aria-label="Reset simulation view"
            >
              <RotateCcw size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="stage-canvas">
        <div className="stage-canvas-inner">
          {renderVisualizer()}
        </div>
      </div>

      <div className="stage-footer">
        <span className="badge badge-cyan" style={{ flexShrink: 0 }}>
          STEP {event.step}
        </span>
        <p className="stage-explanation" aria-live="polite">
          {event.explanation}
        </p>
      </div>
    </div>
  );
};
