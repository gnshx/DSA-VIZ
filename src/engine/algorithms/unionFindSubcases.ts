import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// Union-Find / DSU with Path Compression and Union by Rank (LC 684)
// ============================================================================
export const unionFindDsuAlgorithm: AlgorithmDefinition = {
  id: "union_find_dsu",
  name: "Union-Find: Disjoint Set Union (Path Compression & Rank)",
  category: "union_find",
  patternFamily: "union_find",
  subPatternId: "graph_dsu",
  structureType: "graph",
  difficulty: "Medium",
  description:
    "Disjoint Set Union (DSU) maintains partitions of connected components with near-constant O(α(n)) amortized operations. Employs two dual optimizations: (1) Path Compression: flattens the tree during find(x) so all nodes directly point to the root; (2) Union by Rank: attaches the shallower tree under the deeper tree to prevent skewing.",
  timeComplexity: "O(α(n)) amortized per op",
  spaceComplexity: "O(n)",
  mentalModel: [
    "Every disjoint group has a single chosen Team Captain (root).",
    "find(x): climb the chain of delegates until you meet the captain. On your way down, hand your phone number directly to the captain (path compression)!",
    "union(x, y): team captains meet. The smaller team captain pledges allegiance to the larger team captain."
  ],
  invariants: [
    "parent[root] == root for all component representatives.",
    "If find(u) == find(v), adding edge (u, v) creates a CYCLE."
  ],
  commonMistakes: [
    "Omitting path compression, which degrades find(x) to linear O(n).",
    "Uniting children nodes directly instead of uniting their root representatives: union(find(u), find(v))."
  ],
  defaultInput: {
    n: 5,
    edges: [
      [0, 1],
      [1, 2],
      [3, 4],
      [1, 4],
      [0, 2] // redundant edge (creates cycle!)
    ]
  },
  code: {
    python: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        
    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]
        
    def union(self, i, j):
        root_i, root_j = self.find(i), self.find(j)
        if root_i == root_j:
            return False  # Cycle detected!
        # Union by rank
        if self.rank[root_i] < self.rank[root_j]:
            self.parent[root_i] = root_j
        elif self.rank[root_i] > self.rank[root_j]:
            self.parent[root_j] = root_i
        else:
            self.parent[root_j] = root_i
            self.rank[root_i] += 1
        return True`,
    javascript: `class DSU {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]); // Path compression
    }
    union(i, j) {
        const rootI = this.find(i), rootJ = this.find(j);
        if (rootI === rootJ) return false; // Cycle!
        if (this.rank[rootI] < this.rank[rootJ]) {
            this.parent[rootI] = rootJ;
        } else if (this.rank[rootI] > this.rank[rootJ]) {
            this.parent[rootJ] = rootI;
        } else {
            this.parent[rootJ] = rootI;
            this.rank[rootI]++;
        }
        return true;
    }
}`,
    cpp: `class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        return parent[i] == i ? i : (parent[i] = find(parent[i]));
    }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
        else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
        else { parent[rootJ] = rootI; rank[rootI]++; }
        return true;
    }
};`,
    java: `class DSU {
    int[] parent, rank;
    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    public boolean union(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
        else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
        else { parent[rootJ] = rootI; rank[rootI]++; }
        return true;
    }
}`
  },
  generateTrace: (input = { n: 5, edges: [[0, 1], [1, 2], [3, 4], [1, 4], [0, 2]] }): ExecutionTrace => {
    const n = input.n ?? 5;
    const edges: [number, number][] = input.edges || [[0, 1], [1, 2], [3, 4], [1, 4], [0, 2]];
    const events: ExecutionEvent[] = [];
    let step = 0;

    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    const rank: number[] = new Array(n).fill(0);

    const graphNodes = Array.from({ length: n }, (_, i) => ({
      id: `${i}`,
      label: `Node ${i} (parent:${parent[i]})`
    }));
    const activeEdgesList: [string | number, string | number][] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `parent = [${parent.join(", ")}], rank = [${rank.join(", ")}]`,
      explanation: `Initialized DSU for ${n} vertices: each node is initially its own root parent: parent[i] = i.`,
      variables: { n, parent: [...parent], rank: [...rank] },
      pointers: {},
      callStack: [{ id: "main", name: "DSU", args: { n }, line: 2 }],
      structureType: "graph",
      structureState: { nodes: graphNodes, edges: [] }
    });

    function findRoot(x: number): number {
      let curr = x;
      while (curr !== parent[curr]) {
        curr = parent[curr];
      }
      // Path compress
      parent[x] = curr;
      return curr;
    }

    for (let eIdx = 0; eIdx < edges.length; eIdx++) {
      const [u, v] = edges[eIdx];
      const rootU = findRoot(u);
      const rootV = findRoot(v);

      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 12,
        codeSnippet: `union(${u}, ${v}): find(${u}) = ${rootU}, find(${v}) = ${rootV}`,
        explanation: `Processing edge (${u}, ${v}): representative of ${u} is ${rootU}; representative of ${v} is ${rootV}. ${
          rootU === rootV ? "ROOTS MATCH! Redundant connection (cycle detected)!" : "Different components: merging."
        }`,
        expressionEvaluation: {
          rawExpression: "find(u) == find(v)",
          substitutedExpression: `${rootU} == ${rootV}`,
          result: rootU === rootV,
          effectDescription:
            rootU === rootV
              ? `Both nodes belong to same component ${rootU}. Edge (${u}, ${v}) closes a CYCLE!`
              : `Different trees: attaching component ${rootV} to ${rootU}.`
        },
        variables: { edge: [u, v], rootU, rootV, parent: [...parent], isCycle: rootU === rootV },
        pointers: { nodeU: `${u}`, nodeV: `${v}` },
        callStack: [{ id: "main", name: "union", args: { u, v }, line: 12 }],
        structureType: "graph",
        structureState: {
          nodes: graphNodes.map((gn, idx) => ({ ...gn, label: `${idx} (root:${parent[idx]})` })),
          edges: activeEdgesList.map(([from, to]) => ({ from: `${from}`, to: `${to}`, weight: 1 }))
        },
        activeNodes: [`${u}`, `${v}`, `${rootU}`, `${rootV}`]
      });

      if (rootU === rootV) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 14,
          codeSnippet: `return [${u}, ${v}] (CYCLE DETECTED)`,
          explanation: `Redundant connection discovered! Edge (${u}, ${v}) is redundant and creates a cycle in component ${rootU}.`,
          variables: { redundantEdge: [u, v] },
          pointers: { cycleEdgeStart: `${u}`, cycleEdgeEnd: `${v}` },
          callStack: [{ id: "main", name: "union", args: {}, line: 14 }],
          structureType: "graph",
          structureState: {
            nodes: graphNodes.map((gn, idx) => ({ ...gn, label: `${idx} (root:${parent[idx]})` })),
            edges: activeEdgesList.map(([from, to]) => ({ from: `${from}`, to: `${to}`, weight: 1 }))
          },
          activeNodes: [`${u}`, `${v}`]
        });

        return {
          id: "union_find_dsu_trace",
          algorithmId: "union_find_dsu",
          title: "Union-Find (DSU with Path Compression & Rank)",
          structureType: "graph",
          totalSteps: events.length,
          events
        };
      }

      // Union by rank
      if (rank[rootU] < rank[rootV]) {
        parent[rootU] = rootV;
      } else if (rank[rootU] > rank[rootV]) {
        parent[rootV] = rootU;
      } else {
        parent[rootV] = rootU;
        rank[rootU]++;
      }

      activeEdgesList.push([u, v]);

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 20,
        codeSnippet: `parent[${rootV}] = ${rootU}; rank[${rootU}] = ${rank[rootU]}`,
        explanation: `UNITED components: parent of root ${rootV} set to ${rootU}. Rank of ${rootU} = ${rank[rootU]}. Components merged successfully.`,
        variables: { parent: [...parent], rank: [...rank] },
        pointers: { combinedRoot: `${rootU}` },
        callStack: [{ id: "main", name: "union", args: { rootU, rootV }, line: 20 }],
        structureType: "graph",
        structureState: {
          nodes: graphNodes.map((gn, idx) => ({ ...gn, label: `${idx} (root:${parent[idx]})` })),
          edges: activeEdgesList.map(([from, to]) => ({ from: `${from}`, to: `${to}`, weight: 1 }))
        },
        activeEdges: [[`${u}`, `${v}`]]
      });
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 22,
      codeSnippet: "return True",
      explanation: "All edges processed into forest with no cycles.",
      variables: { parent, rank },
      pointers: {},
      callStack: [{ id: "main", name: "union", args: {}, line: 22 }],
      structureType: "graph",
      structureState: { nodes: graphNodes, edges: activeEdgesList }
    });

    return {
      id: "union_find_dsu_trace",
      algorithmId: "union_find_dsu",
      title: "Union-Find (DSU with Path Compression & Rank)",
      structureType: "graph",
      totalSteps: events.length,
      events
    };
  }
};
