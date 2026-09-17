# ⚡ DSA-VIZ: Observable Computation & Interactive CS Laboratory

<div align="center">

**"Don't visualize code. Visualize the state changes caused by code. Make computation observable."**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://dsa-viz-rho.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Multi-Language](https://img.shields.io/badge/Supported-Python%20%7C%20JS%20%7C%20C%2B%2B%20%7C%20Java-cyan.svg)](#multi-language-support)
[![Vite](https://img.shields.io/badge/Built%20with-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev/)

[**Live Demo**](https://dsa-viz-rho.vercel.app/) • [**Architecture**](#architecture) • [**Trace Protocol**](#universal-trace-protocol-ir) • [**Visualizers**](#canonical-visualization-sdk) • [**Modes**](#the-5-learning-modes)

</div>

---

## 🎯 The Philosophy

Most visualizers build animations for specific code snippets. If the code changes or the language switches from Python to C++, the visualizer breaks.

**DSA-VIZ flips the paradigm:**
```
Source Code (Python / JS / C++ / Java)
              ↓
  Stepped Instrumentation
              ↓
 Universal Execution Trace Protocol (IR)
              ↓
    Visualization SDK (Canvas/SVG)
              ↓
   Interactive Time-Travel Player
```

The rendering engine never inspects raw code strings. Instead, it consumes **universal deterministic state transitions**. This guarantees:
- **Language Independence:** Python, JavaScript, C++, and Java code drive the exact same canonical state changes.
- **Time-Travel Debugging:** Scrub forward, backward, or jump to critical events without side effects.
- **"What the Computer Sees":** Live evaluation of dynamic expressions (e.g. `arr[mid] < target` $\to$ `5 < 12` $\to$ `true`).
- **Mental Model Training:** Interactive prediction challenges that test if the learner can anticipate state changes before pressing "Next".

---

## 🏛 Architecture

```
                         ┌───────────────────────┐
                         │       USER            │
                         │ Problem / Code / URL  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    DSA-VIZ ENGINE     │
                         │ Multi-Language AST    │
                         │ Stepped Execution     │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   TRACE / IR FORMAT   │
                         │ Events + State +      │
                         │ Expressions + Stack   │
                         └───────────┬───────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  ▼                  ▼                  ▼
           ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
           │ Array/Pointers│  │ Tree/Heap   │    │ Network     │
           │ Visualizer  │    │ Visualizer  │    │ Graph Viz   │
           └─────────────┘    └─────────────┘    └─────────────┘
                  │                  │                  │
                  └──────────────────┼──────────────────┘
                                     ▼
                         ┌───────────────────────┐
                         │   TIME-TRAVEL PLAYER  │
                         │ Timeline Scrubber     │
                         │ Code Highlighter      │
                         │ "What Computer Sees"  │
                         │ Memory & Call Stack   │
                         └───────────────────────┘
```

---

## 📜 Universal Trace Protocol (IR)

The universal language connecting execution engines with visualizers:

```typescript
export interface ExecutionEvent {
  step: number;
  type: "LINE" | "COMPARE" | "SWAP" | "ASSIGN" | "POINTER_MOVE" | "PUSH" | "POP" | "CALL" | "RETURN" | "VISIT_NODE";
  sourceLine: number;
  codeSnippet: string;
  explanation: string;
  
  // Expression evaluation HUD ("What the computer sees")
  expressionEvaluation?: {
    rawExpression: string;         // e.g. "arr[mid] < target"
    substitutedExpression: string;  // e.g. "5 < 12"
    result: string | boolean | number;
    effectDescription: string;
  };

  variables: Record<string, any>;
  pointers: Record<string, number | string>;
  callStack: CallStackFrame[];
  structureType: "array" | "stack" | "queue" | "linked_list" | "tree" | "graph" | "heap";
  structureState: any;
}
```

---

## 🌐 Multi-Language Support

Switch between **Python**, **JavaScript**, **C++**, and **Java** with 1 click:

| Feature | Python | JavaScript | C++ (STL) | Java |
|---|:---:|:---:|:---:|:---:|
| Syntax Line Highlighting | ✅ | ✅ | ✅ | ✅ |
| Memory Pointer Tracking | ✅ | ✅ | ✅ | ✅ |
| Custom Input Execution | ✅ | ✅ | ✅ | ✅ |
| Call Stack Mapping | ✅ | ✅ | ✅ | ✅ |

---

## 🎨 Canonical Visualization SDK

1. **Array & Pointers:** Multi-pointers ($i, j, \text{left}, \text{right}, \text{mid}, \text{slow}, \text{fast}$), animated swap arcs, range window boundaries, and element comparison glows.
2. **Stack & Queue:** Vertical transparent canister with open top, LIFO push/pop drop motions, and top indicator.
3. **Linked List:** Value and Next compartments, with directional arrows that dynamically flip backwards during in-place pointer reversal (`curr.next = prev`).
4. **Binary Tree & BST:** Hierarchical 2D layout with depth-calculated branches and recursive traversal path highlights.
5. **Network Graph:** SVG graph with visited sets, frontier queues, and edge traversal glows.
6. **Heap (Dual Synchronized View):** Complete binary tree on top and 1D contiguous array on the bottom, with simultaneous sift-up swap animations!

---

## 🚀 The 5 Learning Modes

- **Mode 1 — Learn:** Guided concept pathways with mental models, complexity blueprints ($O(N)$, $O(1)$), visual invariants, and synchronized simulations.
- **Mode 2 — Visualize:** Flagship interactive workbench with algorithm picker, custom input parser, code studio, timeline scrubber, and memory inspector.
- **Mode 3 — Solve:** LeetCode-style problem studio with test case runner and visual verification.
- **Mode 4 — Predict:** Mental model gym that pauses before critical state changes, challenging learners to predict the next branch, with accuracy scoring and confetti celebrations.
- **Mode 5 — Revise & Graph:** Interactive Computer Science Knowledge Graph (DAG) + pattern recognition cheat sheets and trap warnings.

---

## 📚 Comprehensive Pattern Recognition Catalog (21 Families)

DSA-VIZ features a complete hierarchical pattern recognition tree covering every canonical technical interview topic:

| # | Family | Core Techniques & Invariants | Classic LeetCode Benchmarks |
|---|---|---|---|
| 01 | **Arrays & Prefix Techniques** | Traversal, In-place modification, Insertion/deletion costs, 1D/2D Prefix sum, Suffix sum, Kadane's max subarray, 2D Matrix rotations, Sorting-based array scans | 560, 53, 48, 15, 27, 238 |
| 02 | **Hashing & Sets** | O(1) Complement search, Frequency counting, HashSet deduplication, Group-by-key (anagrams), Prefix Sum + HashMap | 1, 217, 49, 128, 560 |
| 03 | **Strings & Substrings** | Immutability-aware traversal, Palindromes (expand-around-center), Anagram frequency signatures, Substrings vs Subsequences, Window constraints | 344, 125, 5, 242, 392, 3, 76 |
| 04 | **Two Pointers** | Opposite ends (converging), Backward writing, Fast & slow pointers, Read/write in-place compaction, Two sequences parallel | 167, 11, 88, 283, 21 |
| 05 | **Sliding Window** | Fixed-width aggregates ($K$), Dynamic expanding/contracting windows, Frequency-map constraints, Min/max window tracking | 643, 3, 76, 424, 209 |
| 06 | **Binary Search & Answer Space** | Exact target, Lower/upper bounds, Rotated sorted pivot inflection, Search on monotonic answer space, 2D Matrix binary search | 704, 35, 33, 875, 1011, 74 |
| 07 | **Sorting & Partitioning** | Dutch National Flag (3-way partition), Bubble, Selection, Insertion, Merge Sort (stable D&C), Quick Sort (pivot partitioning), Custom Python sorting (`key=`, multi-key) | 75, 912, 148, 179, 56 |
| 08 | **Stack & Monotonic Stack** | LIFO parenthesis matching, Min/Max auxiliary stack, Monotonic increasing/decreasing stacks, Histogram area calculation | 20, 155, 739, 496, 84, 85 |
| 09 | **Queue, Deque & Monotonic Deque** | FIFO discipline (`collections.deque`), Circular queue wrap-around, Level-order BFS, Monotonic deque window maximums | 232, 622, 102, 239, 862 |
| 10 | **Linked Lists** | Singly/doubly linked list traversal, In-place reversal (3-pointer), Floyd's cycle detection, Dummy heads, Remove Nth from end | 206, 141, 142, 21, 19, 146 |
| 11 | **Recursion Fundamentals** | Base cases & correct termination, Call stack depth & frame allocation, Problem decomposition, Recursion vs Iteration | 509, 50, 104, 22, 912 |
| 12 | **Backtracking** | Choose-Explore-Undo mechanics, Power set include/exclude trees, Permutation generation, Combination Sum target pruning, Constraint-based search (N-Queens, Sudoku) | 78, 90, 46, 39, 51, 37 |
| 13 | **Trees & Binary Search Trees** | Pre/In/Post order DFS, Level-order BFS (views), Subtree reduction (invert), Tree recursion (height, diameter, balance), Path sum, Lowest Common Ancestor, Tree construction, BST search/validate/insert/delete, Inorder rank | 102, 199, 226, 104, 543, 112, 236, 105, 98, 230 |
| 14 | **Heaps & Priority Queues** | Sift-up/sift-down heap property, Fixed-size Top-K min-heap, Dual-heap running median, K-way sorted merge | 215, 347, 295, 23, 378 |
| 15 | **Greedy Algorithms** | Jump Game horizon expansion, Earliest deadline activity scheduling, Resource minimization (Gas Station), Sorting + Greedy | 55, 45, 435, 452, 134, 455 |
| 16 | **Intervals & Sweep-Line** | Interval sorting, Overlapping merge, Insert interval into sorted lists, Minimum removals for non-overlap, Event-based sweep-line | 56, 57, 435, 253, 1094, 218 |
| 17 | **Graph Fundamentals** | Adjacency list/matrix, Unweighted BFS shortest path, Recursive/iterative DFS, Directed/undirected cycle detection, Grid as graph (islands), Dijkstra weighted shortest paths, Bipartite 2-coloring | 200, 733, 207, 743, 785, 127 |
| 18 | **Topological Sort & DSU** | Kahn's in-degree BFS, Disjoint Set Union (path compression + union by rank), Dynamic connectivity & Kruskal's MST | 207, 210, 684, 547, 1584 |
| 19 | **Dynamic Programming** | 1D linear recurrences, 2D Grid pathing, 0/1 Knapsack decision table, Subsequence DP (LCS, LIS), Partition DP | 70, 198, 62, 64, 416, 1143, 139 |
| 20 | **Trie & Bit Manipulation** | Prefix tree insert/search/startsWith, Trie-guided grid pruning, XOR cancellation, Brian Kernighan bit clearing, Bitmask subset representations | 208, 212, 136, 191, 231, 78 |
| 21 | **Complexity Analysis & Pattern Recall** | Asymptotic bounds $O(1) \dots O(n!)$, Auxiliary vs stack space, Amortized analysis, Python collection costs (`list`, `dict`, `set`, `deque`, `heapq`), Rapid cognitive trigger cheat sheet | 704, 239, 146, 215, 1 |

---

## 🛠 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone git@github.com:gnshx/DSA-VIZ.git
cd DSA-VIZ

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser, or explore the live deployment directly at [https://dsa-viz-rho.vercel.app/](https://dsa-viz-rho.vercel.app/).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play / Pause simulation |
| `←` (Left Arrow) | Step Backward (Time Travel) |
| `→` (Right Arrow) | Step Forward |
| `Home` | Jump to Start |
| `End` | Jump to End |

---

## 📄 License

MIT License. Designed with visual excellence for computer science learners worldwide.
