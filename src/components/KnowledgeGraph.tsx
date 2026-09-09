import React, { useState } from "react";
import { CS_KNOWLEDGE_GRAPH } from "../engine/algorithms";
import { ConceptNode } from "../types/algorithm";
import { ArrowRight, BookOpen, Layers, Sparkles } from "lucide-react";

interface KnowledgeGraphProps {
  onSelectAlgorithm: (algoId: string) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onSelectAlgorithm }) => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode>(CS_KNOWLEDGE_GRAPH[0]);

  // Edges computed from prerequisites
  const edges: { from: ConceptNode; to: ConceptNode }[] = [];
  CS_KNOWLEDGE_GRAPH.forEach((concept) => {
    concept.prerequisites.forEach((prereqId) => {
      const parent = CS_KNOWLEDGE_GRAPH.find((c) => c.id === prereqId);
      if (parent) {
        edges.push({ from: parent, to: concept });
      }
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", height: "100%" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={22} color="var(--indigo-400)" />
            <span>Computer Science Knowledge Graph</span>
          </h2>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Explore how data structures and algorithms build on top of each other. Click any node to inspect or simulate.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", flex: 1, minHeight: "480px" }}>
        {/* Interactive SVG DAG Canvas */}
        <div
          className="glass-panel"
          style={{
            position: "relative",
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, rgba(8, 12, 20, 0.8) 100%)",
            padding: "1rem"
          }}
        >
          <svg width="600" height="460" style={{ overflow: "visible" }}>
            <defs>
              <marker
                id="graph-arrow"
                markerWidth="8"
                markerHeight="6"
                refX="20"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="rgba(99, 102, 241, 0.5)" />
              </marker>
            </defs>

            {/* Render Prerequisite Edges */}
            {edges.map((edge, idx) => {
              const x1 = edge.from.x || 100;
              const y1 = edge.from.y || 100;
              const x2 = edge.to.x || 200;
              const y2 = edge.to.y || 200;
              const isSelectedPath = selectedConcept.id === edge.to.id || selectedConcept.id === edge.from.id;

              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isSelectedPath ? "var(--cyan-400)" : "rgba(255, 255, 255, 0.12)"}
                  strokeWidth={isSelectedPath ? "2.5" : "1.5"}
                  strokeDasharray={isSelectedPath ? "none" : "4,4"}
                  markerEnd="url(#graph-arrow)"
                  style={{ transition: "all var(--transition-normal)" }}
                />
              );
            })}

            {/* Render Concept Nodes */}
            {CS_KNOWLEDGE_GRAPH.map((node) => {
              const isSelected = selectedConcept.id === node.id;
              const x = node.x || 100;
              const y = node.y || 100;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedConcept(node)}
                  style={{ cursor: "pointer" }}
                >
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="44"
                      fill="none"
                      stroke="var(--cyan-400)"
                      strokeWidth="2"
                      opacity="0.5"
                      style={{ animation: "pulseGlow 1.5s infinite" }}
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r="34"
                    fill={isSelected ? "var(--indigo-500)" : "var(--bg-tertiary)"}
                    stroke={isSelected ? "var(--cyan-400)" : "var(--border-medium)"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    style={{
                      transition: "all var(--transition-smooth)",
                      filter: isSelected ? "drop-shadow(0 0 15px rgba(6, 182, 212, 0.6))" : "none"
                    }}
                  />

                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="var(--font-sans)"
                  >
                    {node.label.split(" ")[0]}
                  </text>
                  <text
                    x={x}
                    y={y + 16}
                    textAnchor="middle"
                    fill={isSelected ? "var(--cyan-400)" : "var(--text-muted)"}
                    fontSize="9"
                    fontFamily="var(--font-sans)"
                  >
                    Lvl {node.level}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Detail & Quick Jump Card */}
        <div
          className="glass-panel"
          style={{
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={18} color="var(--cyan-400)" />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{selectedConcept.label}</h3>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span className="badge badge-indigo">LEVEL {selectedConcept.level}</span>
            <span className="badge badge-cyan">{selectedConcept.category.toUpperCase()}</span>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {selectedConcept.description}
          </p>

          {/* Prerequisites */}
          <div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.4rem" }}>
              Prerequisites
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {selectedConcept.prerequisites.length === 0 ? (
                <span style={{ fontSize: "0.75rem", color: "var(--emerald-400)", fontStyle: "italic" }}>
                  None (Foundational Concept)
                </span>
              ) : (
                selectedConcept.prerequisites.map((pId) => {
                  const pNode = CS_KNOWLEDGE_GRAPH.find((n) => n.id === pId);
                  return (
                    <span key={pId} className="badge badge-amber" style={{ fontSize: "0.68rem" }}>
                      {pNode?.label || pId}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Related Simulations */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.725rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
              Launch Observable Simulation
            </div>
            {selectedConcept.relatedAlgorithms.map((algoId) => (
              <button
                key={algoId}
                onClick={() => onSelectAlgorithm(algoId)}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "space-between", padding: "0.6rem 1rem" }}
              >
                <span>Simulate {selectedConcept.label}</span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
