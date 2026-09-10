import React, { useState, useMemo } from "react";
import { ALL_PATTERN_FAMILIES, ALL_PATTERN_COMBINATIONS } from "../engine/patterns";
import { SubcaseDefinition, PatternCombination } from "../types/patterns";
import {
  ArrowRight,
  Layers,
  Play,
  Search,
  Puzzle
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
  const [selectedTier, setSelectedTier] = useState<string>("all");

  // Filtered families by search query
  const filteredFamilies = useMemo(() => {
    if (!searchQuery.trim()) {
      if (selectedTier === "all") return ALL_PATTERN_FAMILIES;
      return ALL_PATTERN_FAMILIES.filter((f) => f.tier === selectedTier);
    }
    const q = searchQuery.toLowerCase();
    return ALL_PATTERN_FAMILIES.filter((fam) => {
      const matchFam = fam.name.toLowerCase().includes(q) || fam.description.toLowerCase().includes(q);
      const matchSub = fam.subcases.some(
        (sub) =>
          sub.subcaseTitle.toLowerCase().includes(q) ||
          sub.coreMechanism.toLowerCase().includes(q) ||
          sub.classicProblems.some((p) => p.title.toLowerCase().includes(q))
      );
      const matchTier = selectedTier === "all" || fam.tier === selectedTier;
      return (matchFam || matchSub) && matchTier;
    });
  }, [searchQuery, selectedTier]);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {/* Header Banner */}
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
          gap: "1rem"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-indigo">COMPLETE DSA PATTERN MAP</span>
            <span className="badge badge-cyan">{ALL_PATTERN_FAMILIES.length} FAMILIES • {totalSubcases} SUB-VARIANTS</span>
            <span className="badge badge-emerald">{ALL_PATTERN_COMBINATIONS.length} COMBINATIONS</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "0.4rem", letterSpacing: "-0.01em" }}>
            Master DSA Pattern & Subcase Architecture
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.3rem", maxWidth: "820px" }}>
            Organized strictly by <strong>Pattern → Operational Subcases → Representative Problems</strong>.
            Recognize core mechanics, identify multi-pattern synergies (e.g. HashMap + Prefix Sum), and launch interactive state traces.
          </p>
        </div>

        {/* Top Level View Mode Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("catalog")}
            className="btn"
            style={{
              padding: "0.5rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              background: activeTab === "catalog" ? "var(--indigo-500)" : "rgba(255, 255, 255, 0.04)",
              color: activeTab === "catalog" ? "#ffffff" : "var(--text-secondary)",
              border: activeTab === "catalog" ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Layers size={15} />
            <span>All Patterns ({ALL_PATTERN_FAMILIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("combinations")}
            className="btn"
            style={{
              padding: "0.5rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              background: activeTab === "combinations" ? "var(--cyan-500)" : "rgba(255, 255, 255, 0.04)",
              color: activeTab === "combinations" ? "#0f172a" : "var(--text-secondary)",
              border: activeTab === "combinations" ? "1px solid var(--cyan-400)" : "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Puzzle size={15} />
            <span>Pattern Combinations Layer ({ALL_PATTERN_COMBINATIONS.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Tier Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "0.75rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "260px" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter by keyword or problem (e.g. 560, koko, dsu, cycle, trie, sliding, greedy)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none",
              width: "100%"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.75rem" }}
            >
              Clear
            </button>
          )}
        </div>

        {activeTab === "catalog" && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>TIER:</span>
            {[
              { id: "all", label: "All Tiers" },
              { id: "tier1_core", label: "Tier 1: Core" },
              { id: "tier2_advanced", label: "Tier 2: Advanced" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                style={{
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.72rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: selectedTier === t.id ? "rgba(99, 102, 241, 0.25)" : "transparent",
                  color: selectedTier === t.id ? "var(--indigo-300)" : "var(--text-muted)",
                  fontWeight: selectedTier === t.id ? 700 : 500
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: ALL PATTERNS CATALOG */}
      {activeTab === "catalog" && (
        <>
          {/* Pattern Family Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              overflowX: "auto",
              paddingBottom: "0.4rem",
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
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.8rem",
                    fontWeight: isSelected ? 700 : 500,
                    whiteSpace: "nowrap",
                    background: isSelected
                      ? "linear-gradient(135deg, var(--indigo-600), var(--indigo-500))"
                      : "rgba(255, 255, 255, 0.04)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    border: isSelected ? "1px solid var(--indigo-400)" : "1px solid var(--border-subtle)",
                    boxShadow: isSelected ? "0 4px 14px rgba(99, 102, 241, 0.35)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    borderRadius: "8px"
                  }}
                >
                  <span>{fam.name}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "0.1rem 0.35rem",
                      borderRadius: "999px",
                      background: isSelected ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
                      color: isSelected ? "#ffffff" : "var(--text-dim)"
                    }}
                  >
                    {fam.subcases.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Family Overview */}
          {activeFamily && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem"
                }}
              >
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--cyan-400)", fontWeight: 700, textTransform: "uppercase" }}>
                    Pattern Family Overview
                  </span>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    {activeFamily.description}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={`badge ${activeFamily.badgeColor}`}>{activeFamily.name.toUpperCase()}</span>
                  <span className="badge badge-cyan">{activeFamily.subcases.length} SUB-VARIANTS</span>
                </div>
              </div>

              {/* Subcases Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
                  gap: "1.25rem"
                }}
              >
                {activeFamily.subcases.map((subcase: SubcaseDefinition) => {
                  const isCurrentlyVisualizing = selectedAlgorithmId === subcase.algorithmId;
                  return (
                    <div
                      key={subcase.id}
                      className="glass-panel"
                      style={{
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "1rem",
                        border: isCurrentlyVisualizing
                          ? "2px solid var(--cyan-400)"
                          : "1px solid var(--border-medium)",
                        background: isCurrentlyVisualizing
                          ? "linear-gradient(145deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.06))"
                          : "var(--bg-card)",
                        borderRadius: "12px"
                      }}
                    >
                      <div>
                        {/* Header: Title & Complexity */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                          <div>
                            <span className="badge badge-indigo" style={{ fontSize: "0.65rem" }}>
                              SUBCASE TOPOLOGY
                            </span>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.3rem", color: "var(--text-primary)" }}>
                              {subcase.subcaseTitle}
                            </h3>
                          </div>

                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            <span className="badge badge-cyan" style={{ fontSize: "0.7rem" }}>
                              {subcase.timeComplexity}
                            </span>
                            <span className="badge badge-emerald" style={{ fontSize: "0.7rem" }}>
                              {subcase.spaceComplexity}
                            </span>
                          </div>
                        </div>

                        {/* Visual Topology Diagram */}
                        <div
                          style={{
                            marginTop: "0.75rem",
                            padding: "0.6rem 0.85rem",
                            borderRadius: "8px",
                            background: "rgba(0, 0, 0, 0.4)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem"
                          }}
                        >
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            MECHANISM / TOPOLOGY:
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.825rem",
                              color: "var(--cyan-300)",
                              fontWeight: 700
                            }}
                          >
                            {subcase.visualSummary}
                          </span>
                        </div>

                        {/* Core Mechanism */}
                        <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.75rem", lineHeight: 1.45 }}>
                          {subcase.coreMechanism}
                        </p>

                        {/* Pointer & State Roles */}
                        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                            Pointer & State Roles:
                          </span>
                          {Object.entries(subcase.pointerRoles).map(([ptr, role]) => (
                            <div
                              key={ptr}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                fontSize: "0.78rem",
                                fontFamily: "var(--font-mono)",
                                background: "rgba(255, 255, 255, 0.02)",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "6px"
                              }}
                            >
                              <span style={{ color: "var(--indigo-400)", fontWeight: 700 }}>{ptr}:</span>
                              <span style={{ color: "var(--text-muted)" }}>{role}</span>
                            </div>
                          ))}
                        </div>

                        {/* Representative LeetCode Problems */}
                        <div style={{ marginTop: "0.75rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                            Representative LeetCode Problems:
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
                            {subcase.classicProblems.map((prob, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "0.72rem",
                                  padding: "0.2rem 0.5rem",
                                  background: "rgba(255, 255, 255, 0.03)",
                                  borderRadius: "4px",
                                  border: "1px solid var(--border-subtle)",
                                  color: "var(--text-secondary)"
                                }}
                              >
                                {prob.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Launch Simulation Button */}
                      <button
                        onClick={() => onSelectSubcase(subcase.algorithmId)}
                        className={`btn ${isCurrentlyVisualizing ? "btn-secondary" : "btn-primary"}`}
                        style={{
                          width: "100%",
                          padding: "0.6rem 1rem",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          marginTop: "0.5rem"
                        }}
                      >
                        <Play size={15} />
                        <span>{isCurrentlyVisualizing ? "Currently Visualizing" : "Visualize This Subcase"}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: PATTERN COMBINATIONS LAYER */}
      {activeTab === "combinations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              padding: "0.85rem 1.25rem",
              background: "rgba(6, 182, 212, 0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(6, 182, 212, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Puzzle size={18} color="var(--cyan-400)" />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                The Synergy Recognition Layer: Multi-Pattern Combinations
              </span>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
              Top FAANG interview problems rarely test one isolated pattern. Real mastery lies in recognizing the
              <strong> combination of two complementary patterns</strong> (e.g. why <code>HashMap + Prefix Sum</code> solves Subarray Sum Equals K, or why <code>Binary Search + Greedy</code> solves Koko Eating Bananas).
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))",
              gap: "1.25rem"
            }}
          >
            {filteredCombinations.map((combo: PatternCombination) => (
              <div
                key={combo.id}
                className="glass-panel"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.85rem",
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

                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: "0.4rem" }}>
                    {combo.name}
                  </h3>

                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.4rem", lineHeight: 1.45 }}>
                    {combo.whyItWorks}
                  </p>

                  {/* Recognition Signals */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Recognition Cues:
                    </span>
                    <ul style={{ paddingLeft: "1.2rem", margin: "0.3rem 0 0 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      {combo.recognitionSignals.map((sig, i) => (
                        <li key={i} style={{ marginBottom: "0.2rem" }}>
                          {sig}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Snippet */}
                  <div
                    style={{
                      marginTop: "0.75rem",
                      background: "rgba(0, 0, 0, 0.4)",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--cyan-300)",
                      border: "1px solid var(--border-subtle)",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {combo.exampleSnippet}
                  </div>

                  {/* Problems */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Representative LeetCode Problems:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
                      {combo.representativeProblems.map((prob, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.2rem 0.5rem",
                            background: "rgba(255, 255, 255, 0.03)",
                            borderRadius: "4px",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-secondary)"
                          }}
                        >
                          {prob.title}
                        </span>
                      ))}
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
