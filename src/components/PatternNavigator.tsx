import React, { useState, useMemo } from "react";
import { ALL_PATTERN_FAMILIES, ALL_PATTERN_COMBINATIONS } from "../engine/patterns";
import { SubcaseDefinition, PatternCombination } from "../types/patterns";
import {
  ArrowRight,
  Layers,
  Play,
  Search,
  Puzzle,
  Code,
  Sparkles,
  Zap,
  BookOpen
} from "lucide-react";

interface PatternNavigatorProps {
  onSelectSubcase: (algorithmId: string) => void;
  selectedAlgorithmId?: string;
}

export const PatternNavigator: React.FC<PatternNavigatorProps> = ({
  onSelectSubcase,
  selectedAlgorithmId
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "combinations">("catalog");
  const [activeFamilyId, setActiveFamilyId] = useState<string>("two_pointers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Filtered families by search query
  const filteredFamilies = useMemo(() => {
    if (!searchQuery.trim()) return ALL_PATTERN_FAMILIES;
    const q = searchQuery.toLowerCase();
    return ALL_PATTERN_FAMILIES.filter((fam) => {
      const matchFam = fam.name.toLowerCase().includes(q) || fam.description.toLowerCase().includes(q);
      const matchSub = fam.subcases.some(
        (sub) =>
          sub.subcaseTitle.toLowerCase().includes(q) ||
          sub.coreMechanism.toLowerCase().includes(q) ||
          sub.classicProblems.some((p) => p.title.toLowerCase().includes(q))
      );
      return matchFam || matchSub;
    });
  }, [searchQuery]);

  const activeFamily =
    filteredFamilies.find((f) => f.id === activeFamilyId) ||
    filteredFamilies[0] ||
    ALL_PATTERN_FAMILIES[0];

  // Filtered combinations by search
  const filteredCombinations = useMemo(() => {
    if (!searchQuery.trim()) return ALL_PATTERN_COMBINATIONS;
    const q = searchQuery.toLowerCase();
    return ALL_PATTERN_COMBINATIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.whyItWorks.toLowerCase().includes(q) ||
        c.recognitionSignals.some((s) => s.toLowerCase().includes(q)) ||
        c.representativeProblems.some((p) => p.title.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const totalSubcases = useMemo(() => {
    return ALL_PATTERN_FAMILIES.reduce((acc, f) => acc + f.subcases.length, 0);
  }, []);

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return {
          bg: "rgba(0, 184, 163, 0.15)",
          color: "#00b8a3",
          border: "1px solid rgba(0, 184, 163, 0.3)"
        };
      case "hard":
        return {
          bg: "rgba(255, 55, 95, 0.15)",
          color: "#ff375f",
          border: "1px solid rgba(255, 55, 95, 0.3)"
        };
      default:
        return {
          bg: "rgba(255, 192, 30, 0.15)",
          color: "#ffc01e",
          border: "1px solid rgba(255, 192, 30, 0.3)"
        };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      {/* LeetCode Explore Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "1.75rem 2rem",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          borderRadius: "16px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="badge badge-indigo" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
              LEETCODE DSA PATTERN EXPLORE
            </span>
            <span className="badge badge-cyan" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
              {ALL_PATTERN_FAMILIES.length} TOPIC FAMILIES • {totalSubcases} SUB-PATTERNS
            </span>
            <span className="badge badge-emerald" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
              {ALL_PATTERN_COMBINATIONS.length} MULTI-PATTERN SYNERGIES
            </span>
          </div>

          <h2 style={{ fontSize: "1.65rem", fontWeight: 800, marginTop: "0.5rem", letterSpacing: "-0.015em", color: "var(--text-primary)" }}>
            DSA Algorithmic Patterns & Visual Execution Engine
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.4rem", maxWidth: "860px", lineHeight: 1.55 }}>
            Master technical interview patterns organized by <strong>Category → Operational Sub-Variants → LeetCode Problems</strong>.
            Select any pattern subcase to launch deterministic, step-by-step state visualization.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            onClick={() => setActiveTab("catalog")}
            className="btn"
            style={{
              padding: "0.6rem 1.1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              background: activeTab === "catalog" ? "linear-gradient(135deg, var(--indigo-500), #4f46e5)" : "var(--chip-inactive-bg)",
              color: activeTab === "catalog" ? "#ffffff" : "var(--chip-inactive-text)",
              border: activeTab === "catalog" ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "10px",
              boxShadow: activeTab === "catalog" ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none"
            }}
          >
            <Layers size={16} />
            <span>Pattern Showcase ({ALL_PATTERN_FAMILIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("combinations")}
            className="btn"
            style={{
              padding: "0.6rem 1.1rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              background: activeTab === "combinations" ? "linear-gradient(135deg, var(--cyan-500), #0284c7)" : "var(--chip-inactive-bg)",
              color: activeTab === "combinations" ? "#ffffff" : "var(--chip-inactive-text)",
              border: activeTab === "combinations" ? "1px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "10px",
              boxShadow: activeTab === "combinations" ? "0 4px 12px rgba(6, 182, 212, 0.3)" : "none"
            }}
          >
            <Puzzle size={16} />
            <span>Synergy Combinations ({ALL_PATTERN_COMBINATIONS.length})</span>
          </button>
        </div>
      </div>

      {/* LeetCode Search & Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          borderRadius: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: "280px" }}>
          <Search size={18} color="var(--cyan-400)" />
          <input
            type="text"
            placeholder="Search LeetCode problem or pattern (e.g., 167, Two Sum, Koko Bananas, Sliding Window, DP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              outline: "none",
              width: "100%"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: ALL PATTERNS CATALOG */}
      {activeTab === "catalog" && (
        <>
          {/* LeetCode Category Pills Bar */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
              scrollbarWidth: "thin"
            }}
          >
            {filteredFamilies.map((fam) => {
              const isSelected = fam.id === activeFamily?.id;
              return (
                <button
                  key={fam.id}
                  onClick={() => setActiveFamilyId(fam.id)}
                  className="btn"
                  style={{
                    padding: "0.55rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: "nowrap",
                    background: isSelected
                      ? "linear-gradient(135deg, var(--indigo-600), var(--indigo-500))"
                      : "var(--chip-inactive-bg)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    border: isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                    boxShadow: isSelected ? "0 4px 14px rgba(99, 102, 241, 0.35)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "10px"
                  }}
                >
                  <span>{fam.name}</span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "999px",
                      background: isSelected ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
                      color: isSelected ? "#ffffff" : "var(--text-dim)",
                      fontWeight: 700
                    }}
                  >
                    {fam.subcases.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Pattern Family Spotlight */}
          {activeFamily && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Pattern Overview Card */}
              <div
                className="glass-panel"
                style={{
                  padding: "1.25rem 1.5rem",
                  background: "var(--bg-tertiary)",
                  borderRadius: "14px",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="badge badge-indigo" style={{ fontSize: "0.7rem" }}>TOPIC ARCHITECTURE</span>
                    <span className="badge badge-cyan" style={{ fontSize: "0.7rem" }}>{activeFamily.subcases.length} SUB-VARIANTS</span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.3rem", color: "var(--text-primary)" }}>
                    {activeFamily.name}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem", lineHeight: 1.5, maxWidth: "900px" }}>
                    {activeFamily.description}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={`badge ${activeFamily.badgeColor}`} style={{ fontSize: "0.75rem", padding: "0.3rem 0.75rem" }}>
                    {activeFamily.name.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Subcases Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))",
                  gap: "1.5rem"
                }}
              >
                {activeFamily.subcases.map((subcase: SubcaseDefinition) => {
                  const isCurrentlyVisualizing = selectedAlgorithmId === subcase.algorithmId;
                  return (
                    <div
                      key={subcase.id}
                      className="glass-panel"
                      style={{
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "1.25rem",
                        border: isCurrentlyVisualizing
                          ? "2px solid var(--cyan-400)"
                          : "1px solid var(--border-medium)",
                        background: isCurrentlyVisualizing
                          ? "linear-gradient(145deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.06))"
                          : "var(--bg-card)",
                        borderRadius: "14px",
                        boxShadow: isCurrentlyVisualizing ? "var(--shadow-glow-cyan)" : "var(--shadow-sm)"
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        {/* Title & Complexity Badges */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                          <div>
                            <span className="badge badge-indigo" style={{ fontSize: "0.68rem" }}>
                              SUBCASE TOPOLOGY
                            </span>
                            <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "0.35rem", color: "var(--text-primary)" }}>
                              {subcase.subcaseTitle}
                            </h4>
                          </div>

                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <span className="badge badge-cyan" style={{ fontSize: "0.72rem" }}>
                              Time: {subcase.timeComplexity}
                            </span>
                            <span className="badge badge-emerald" style={{ fontSize: "0.72rem" }}>
                              Space: {subcase.spaceComplexity}
                            </span>
                          </div>
                        </div>

                        {/* Visual Summary Mechanism Box */}
                        <div
                          style={{
                            padding: "0.7rem 0.9rem",
                            borderRadius: "10px",
                            background: "var(--box-bg)",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem"
                          }}
                        >
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                            STATE TOPOLOGY:
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.85rem",
                              color: "var(--cyan-400)",
                              fontWeight: 700
                            }}
                          >
                            {subcase.visualSummary}
                          </span>
                        </div>

                        {/* Core Mechanism Description */}
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                          {subcase.coreMechanism}
                        </p>

                        {/* Pointer & State Roles */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                            Pointer & State Invariants:
                          </span>
                          {Object.entries(subcase.pointerRoles).map(([ptr, role]) => (
                            <div
                              key={ptr}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.8rem",
                                fontFamily: "var(--font-mono)",
                                background: "rgba(255, 255, 255, 0.02)",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "6px",
                                border: "1px solid var(--border-subtle)"
                              }}
                            >
                              <span style={{ color: "var(--indigo-400)", fontWeight: 700 }}>{ptr}:</span>
                              <span style={{ color: "var(--text-secondary)" }}>{role}</span>
                            </div>
                          ))}
                        </div>

                        {/* LeetCode Representative Problems */}
                        <div>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                            LeetCode Problem Patterns:
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                            {subcase.classicProblems.map((prob, idx) => {
                              const badgeStyle = getDifficultyBadge(prob.difficulty);
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    fontSize: "0.75rem",
                                    padding: "0.25rem 0.6rem",
                                    background: "var(--box-bg)",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border-subtle)"
                                  }}
                                >
                                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{prob.title}</span>
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      fontWeight: 700,
                                      padding: "0.1rem 0.35rem",
                                      borderRadius: "4px",
                                      background: badgeStyle.bg,
                                      color: badgeStyle.color,
                                      border: badgeStyle.border
                                    }}
                                  >
                                    {prob.difficulty}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Trigger */}
                      <button
                        onClick={() => onSelectSubcase(subcase.algorithmId)}
                        className={`btn ${isCurrentlyVisualizing ? "btn-secondary" : "btn-primary"}`}
                        style={{
                          width: "100%",
                          padding: "0.7rem 1.25rem",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.6rem",
                          marginTop: "0.5rem",
                          borderRadius: "10px"
                        }}
                      >
                        <Play size={16} />
                        <span>{isCurrentlyVisualizing ? "Currently Visualizing" : "Visualize State Trace"}</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: MULTI-PATTERN SYNERGIES */}
      {activeTab === "combinations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            className="glass-panel"
            style={{
              padding: "1.25rem 1.5rem",
              background: "rgba(6, 182, 212, 0.08)",
              borderRadius: "14px",
              border: "1px solid rgba(6, 182, 212, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Puzzle size={20} color="var(--cyan-400)" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Multi-Pattern Synergy & Recognition Layer
              </h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.4rem", lineHeight: 1.5 }}>
              FAANG and top tech interviews focus heavily on multi-pattern compositions (e.g. <code>HashMap + Prefix Sum</code>, <code>Binary Search + Greedy</code>). Recognize key problem cues and master the mathematical synergy.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
              gap: "1.5rem"
            }}
          >
            {filteredCombinations.map((combo: PatternCombination) => (
              <div
                key={combo.id}
                className="glass-panel"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  borderRadius: "14px",
                  border: "1px solid var(--border-medium)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="badge badge-indigo">{combo.primaryPattern}</span>
                    <span style={{ color: "var(--cyan-400)", fontWeight: 800 }}>+</span>
                    <span className="badge badge-cyan">{combo.secondaryPattern}</span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.5rem" }}>
                    {combo.name}
                  </h3>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.4rem", lineHeight: 1.5 }}>
                    {combo.whyItWorks}
                  </p>

                  {/* Recognition Signals */}
                  <div style={{ marginTop: "0.85rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Recognition Cues & Problem Signals:
                    </span>
                    <ul style={{ paddingLeft: "1.2rem", margin: "0.4rem 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      {combo.recognitionSignals.map((sig, i) => (
                        <li key={i} style={{ marginBottom: "0.25rem" }}>
                          {sig}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Code Snippet Box */}
                  <div
                    style={{
                      marginTop: "0.85rem",
                      background: "var(--box-bg)",
                      padding: "0.75rem 0.9rem",
                      borderRadius: "8px",
                      fontSize: "0.78rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--cyan-400)",
                      border: "1px solid var(--border-subtle)",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {combo.exampleSnippet}
                  </div>

                  {/* Representative Problems */}
                  <div style={{ marginTop: "0.85rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Representative LeetCode Problems:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                      {combo.representativeProblems.map((prob, i) => {
                        const badgeStyle = getDifficultyBadge(prob.difficulty);
                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              fontSize: "0.75rem",
                              padding: "0.25rem 0.6rem",
                              background: "var(--box-bg)",
                              borderRadius: "6px",
                              border: "1px solid var(--border-subtle)"
                            }}
                          >
                            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{prob.title}</span>
                            <span
                              style={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                padding: "0.1rem 0.35rem",
                                borderRadius: "4px",
                                background: badgeStyle.bg,
                                color: badgeStyle.color,
                                border: badgeStyle.border
                              }}
                            >
                              {prob.difficulty}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

