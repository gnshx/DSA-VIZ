import React from "react";
import { ExecutionEvent } from "../types/trace";
import { Eye } from "lucide-react";

interface ComputerVisionHUDProps {
  event: ExecutionEvent;
}

export const ComputerVisionHUD: React.FC<ComputerVisionHUDProps> = ({ event }) => {
  const evalData = event.expressionEvaluation;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "COMPARE":
        return <span className="badge badge-amber">COMPARISON</span>;
      case "SWAP":
        return <span className="badge badge-rose">SWAP MUTATION</span>;
      case "ASSIGN":
      case "WRITE":
        return <span className="badge badge-cyan">WRITE STATE</span>;
      case "CALL":
        return <span className="badge badge-indigo">CALL FRAME</span>;
      case "RETURN":
      case "COMPLETE":
        return <span className="badge badge-emerald">RETURN / DONE</span>;
      case "BRANCH":
        return <span className="badge badge-purple">CONTROL BRANCH</span>;
      default:
        return <span className="badge badge-indigo">{type}</span>;
    }
  };

  const resultColor =
    evalData == null
      ? undefined
      : evalData.result === true || evalData.result === "EQUAL"
      ? "var(--emerald-400)"
      : evalData.result === false || evalData.result === "MISMATCH"
      ? "var(--rose-400)"
      : "var(--amber-400)";

  return (
    <div className="glass-panel inspector">
      <div className="inspector-head">
        <div className="inspector-title">
          <Eye size={16} color="var(--cyan-400)" />
          <span>What the Computer Sees</span>
        </div>
        {getTypeBadge(event.type)}
      </div>

      {evalData ? (
        <div className="inspector-box">
          <div className="inspector-row">
            <span className="inspector-mono">
              {evalData.rawExpression}
            </span>
            <span style={{ color: "var(--text-dim)" }} aria-hidden="true">➔</span>
            <span className="inspector-mono" style={{ color: "var(--cyan-400)", fontWeight: 600 }}>
              {evalData.substitutedExpression}
            </span>
            <span style={{ color: "var(--text-dim)" }} aria-hidden="true">➔</span>
            <span
              className="inspector-mono"
              style={{ fontWeight: 700, color: resultColor }}
            >
              [{String(evalData.result).toUpperCase()}]
            </span>
          </div>

          <div className="inspector-effect">
            ⚡ {evalData.effectDescription}
          </div>
        </div>
      ) : (
        <div className="inspector-box inspector-mono">
          Evaluating: {event.codeSnippet}
        </div>
      )}
    </div>
  );
};
