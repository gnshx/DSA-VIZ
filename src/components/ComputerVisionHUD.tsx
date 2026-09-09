import React from "react";
import { ExecutionEvent } from "../types/trace";
import { Eye, HelpCircle } from "lucide-react";

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

  return (
    <div
      className="glass-panel"
      style={{
        padding: "0.85rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <Eye size={16} color="var(--cyan-400)" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.02em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
            What the Computer Sees
          </span>
        </div>
        {getTypeBadge(event.type)}
      </div>

      {evalData ? (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem"
          }}
        >
          {/* Expression transformation: Raw -> Substituted -> Result */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {evalData.rawExpression}
            </span>
            <span style={{ color: "var(--text-dim)" }}>➔</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.825rem", color: "var(--cyan-400)", fontWeight: 600 }}>
              {evalData.substitutedExpression}
            </span>
            <span style={{ color: "var(--text-dim)" }}>➔</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.825rem",
                fontWeight: 700,
                color:
                  evalData.result === true || evalData.result === "EQUAL"
                    ? "var(--emerald-400)"
                    : evalData.result === false || evalData.result === "MISMATCH"
                    ? "var(--rose-400)"
                    : "var(--amber-400)"
              }}
            >
              [{String(evalData.result).toUpperCase()}]
            </span>
          </div>

          {/* Concrete effect description */}
          <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)" }}>
            ⚡ {evalData.effectDescription}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "0.6rem 0.75rem",
            fontSize: "0.775rem",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)"
          }}
        >
          Evaluating: {event.codeSnippet}
        </div>
      )}
    </div>
  );
};
