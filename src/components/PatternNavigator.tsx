import React, { useState, useMemo } from "react";
import { ALL_PATTERN_FAMILIES, ALL_PATTERN_COMBINATIONS } from "../engine/patterns";
import { SubcaseDefinition, PatternCombination, PatternFamilyDefinition } from "../types/patterns";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Layers,
  Play,
  Search,
  Puzzle,
  CheckCircle2,
  Clock,
  Cpu,
  BookOpen,
  Info
} from "lucide-react";

interface PatternNavigatorProps {
  onSelectSubcase: (algorithmId: string) => void;
  selectedAlgorithmId?: string;
}

/**
 * PatternNavigator Component
 * Hierarchical Drill-Down Catalog:
 * Level 1: Pattern Family List with brief definitions
 * Level 2: Subcategories / Subcases with core mechanisms & pointer roles
 * Level 3: Examples & Interactive Testcases with 1-click "Run & Check Trace"
 */
export const PatternNavigator: React.FC<PatternNavigatorProps> = ({
  onSelectSubcase,
  selectedAlgorithmId
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "combinations">("catalog");
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({
    two_pointers: true,
    sliding_window: true
  });
  const [expandedSubcases, setExpandedSubcases] = useState<Record<string, boolean>>({
    tp_opposite_ends: true,
    sw_fixed: true
  });
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFamily = (familyId: string) => {
    setExpandedFamilies((prev) => ({ ...prev, [familyId]: !prev[familyId] }));
  };

  const toggleSubcase = (subcaseId: string) => {
    setExpandedSubcases((prev) => ({ ...prev, [subcaseId]: !prev[subcaseId] }));
  };

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
        return { bg: "rgba(16, 185, 129, 0.15)", color: "var(--emerald-400)", border: "1px solid rgba(16, 185, 129, 0.3)" };
      case "hard":
        return { bg: "rgba(244, 63, 94, 0.15)", color: "var(--rose-400)", border: "1px solid rgba(244, 63, 94, 0.3)" };
      default:
        return { bg: "rgba(245, 158, 11, 0.15)", color: "var(--amber-400)", border: "1px solid rgba(245, 158, 11, 0.3)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {/* Top Banner & Tab Controls */}
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          borderRadius: "16px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span className="badge badge-indigo" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
              DSA PATTERN MASTER CATALOG
            </span>
            <span className="badge badge-cyan" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
              {ALL_PATTERN_FAMILIES.length} PATTERN FAMILIES • {totalSubcases} SUBCATEGORIES
            </span>
            <span className="badge badge-emerald" style={{ padding: "0.25rem 0.65rem", fontSize: "0.72rem" }}>
              100% VERIFIED TRACES
            </span>
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "0.4rem", color: "var(--text-primary)" }}>
            Hierorithmic Pattern Tree & Interactive Trace Explorer
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.3rem", maxWidth: "860px", lineHeight: 1.5 }}>
            Expand any <strong>Pattern Family</strong> to view its <strong>Subcategories</strong>, brief definitions, pointer invariants, and representative LeetCode testcases. Click <strong>"Run & Check Trace"</strong> to launch the observable execution engine.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            onClick={() => setActiveTab("catalog")}
            className="btn"
            style={{
              padding: "0.55rem 1.05rem",
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
            <span>Hierarchical Tree ({ALL_PATTERN_FAMILIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("combinations")}
            className="btn"
            style={{
              padding: "0.55rem 1.05rem",
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
            <span>Multi-Pattern Synergies ({ALL_PATTERN_COMBINATIONS.length})</span>
          </button>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "0.85rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          borderRadius: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1 }}>
          <Search size={18} color="var(--cyan-400)" />
          <input
            type="text"
            placeholder="Search pattern, subcategory, or LeetCode problem (e.g., Two Pointers, 167, Sliding Window, Prefix Sum, DP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.875rem",
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

      {/* TAB 1: HIERARCHICAL DRILL-DOWN CATALOG */}
      {activeTab === "catalog" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredFamilies.map((family: PatternFamilyDefinition) => {
            const isFamilyExpanded = expandedFamilies[family.id] || Boolean(searchQuery.trim());
            return (
              <div
                key={family.id}
                className={`accordion-item ${isFamilyExpanded ? "accordion-item-active" : ""}`}
              >
                {/* Level 1: Pattern Family Header */}
                <div
                  className="accordion-header"
                  onClick={() => toggleFamily(family.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <div
                      style={{
                        color: "var(--indigo-400)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {isFamilyExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span className={`badge ${family.badgeColor}`}>
                          {family.name.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          {family.subcases.length} SUBCATEGORIES
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "0.25rem", color: "var(--text-primary)" }}>
                        {family.name}
                      </h3>
                      <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.2rem", maxWidth: "900px" }}>
                        {family.description}
                      </p>
                    </div>
                  </div>

                  <span className="badge badge-cyan" style={{ fontSize: "0.7rem" }}>
                    {family.tier.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {/* Level 2: Subcategories / Subcases Accordion Content */}
                {isFamilyExpanded && (
                  <div className="accordion-content">
                    {family.subcases.map((subcase: SubcaseDefinition) => {
                      const isSubcaseExpanded = expandedSubcases[subcase.id] || Boolean(searchQuery.trim());
                      const isCurrentlyVisualizing = selectedAlgorithmId === subcase.algorithmId;
                      return (
                        <div
                          key={subcase.id}
                          className="glass-panel"
                          style={{
                            borderRadius: "10px",
                            border: isCurrentlyVisualizing ? "2px solid var(--cyan-400)" : "1px solid var(--border-medium)",
                            background: isCurrentlyVisualizing
                              ? "linear-gradient(145deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.06))"
                              : "var(--bg-tertiary)",
                            overflow: "hidden"
                          }}
                        >
                          {/* Subcategory Header */}
                          <div
                            style={{
                              padding: "0.85rem 1.15rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              background: "rgba(255, 255, 255, 0.02)",
                              borderBottom: isSubcaseExpanded ? "1px solid var(--border-subtle)" : "none"
                            }}
                            onClick={() => toggleSubcase(subcase.id)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{ color: "var(--cyan-400)" }}>
                                {isSubcaseExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              </div>
                              <div>
                                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                                  {subcase.subcaseTitle}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                                  {subcase.coreMechanism}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span className="badge badge-cyan" style={{ fontSize: "0.68rem" }}>{subcase.timeComplexity}</span>
                              <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>{subcase.spaceComplexity}</span>
                            </div>
                          </div>

                          {/* Subcategory Details & Level 3 Testcases */}
                          {isSubcaseExpanded && (
                            <div style={{ padding: "1.15rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                              {/* Topology & Invariants Summary */}
                              <div
                                style={{
                                  padding: "0.65rem 0.85rem",
                                  borderRadius: "8px",
                                  background: "var(--box-bg)",
                                  border: "1px solid var(--border-subtle)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "0.5rem",
                                  flexWrap: "wrap"
                                }}
                              >
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                                  STATE TOPOLOGY:
                                </div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.825rem", color: "var(--cyan-400)", fontWeight: 700 }}>
                                  {subcase.visualSummary}
                                </div>
                              </div>

                              {/* Pointer Roles */}
                              <div>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                                  Pointer & State Invariants:
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.4rem" }}>
                                  {Object.entries(subcase.pointerRoles).map(([ptr, role]) => (
                                    <div
                                      key={ptr}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        fontSize: "0.775rem",
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
                              </div>

                              {/* Level 3: Representative LeetCode Problems & Testcase Trigger */}
                              <div>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                                  Representative LeetCode Examples & Interactive Testcases:
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                  {subcase.classicProblems.map((prob, idx) => {
                                    const diffStyle = getDifficultyBadge(prob.difficulty);
                                    return (
                                      <div
                                        key={idx}
                                        style={{
                                          padding: "0.6rem 0.85rem",
                                          borderRadius: "8px",
                                          background: "var(--box-bg)",
                                          border: "1px solid var(--border-subtle)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          gap: "0.5rem"
                                        }}
                                      >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                          <BookOpen size={15} color="var(--indigo-400)" />
                                          <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                            {prob.title}
                                          </span>
                                        </div>

                                        <span
                                          style={{
                                            fontSize: "0.65rem",
                                            fontWeight: 700,
                                            padding: "0.15rem 0.4rem",
                                            borderRadius: "4px",
                                            background: diffStyle.bg,
                                            color: diffStyle.color,
                                            border: diffStyle.border
                                          }}
                                        >
                                          {prob.difficulty}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Action Trigger: Run & Check Trace */}
                              <button
                                onClick={() => onSelectSubcase(subcase.algorithmId)}
                                className={`btn ${isCurrentlyVisualizing ? "btn-secondary" : "btn-primary"}`}
                                style={{
                                  padding: "0.65rem 1.15rem",
                                  fontSize: "0.85rem",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "0.6rem",
                                  borderRadius: "8px"
                                }}
                              >
                                <Play size={15} />
                                <span>{isCurrentlyVisualizing ? "Currently Visualizing Trace" : "Run & Check Trace"}</span>
                                <ArrowRight size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MULTI-PATTERN SYNERGIES */}
      {activeTab === "combinations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.3rem", lineHeight: 1.5 }}>
              Recognize multi-pattern compositions (e.g. <code>HashMap + Prefix Sum</code>, <code>Binary Search + Greedy</code>).
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "1.25rem" }}>
            {filteredCombinations.map((combo: PatternCombination) => (
              <div
                key={combo.id}
                className="glass-panel"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border-medium)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="badge badge-indigo">{combo.primaryPattern}</span>
                    <span style={{ color: "var(--cyan-400)", fontWeight: 800 }}>+</span>
                    <span className="badge badge-cyan">{combo.secondaryPattern}</span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "0.4rem" }}>
                    {combo.name}
                  </h3>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.3rem", lineHeight: 1.5 }}>
                    {combo.whyItWorks}
                  </p>

                  <div style={{ marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Recognition Cues:
                    </span>
                    <ul style={{ paddingLeft: "1.2rem", margin: "0.3rem 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      {combo.recognitionSignals.map((sig, i) => (
                        <li key={i} style={{ marginBottom: "0.2rem" }}>
                          {sig}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      marginTop: "0.75rem",
                      background: "var(--box-bg)",
                      padding: "0.65rem 0.85rem",
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
