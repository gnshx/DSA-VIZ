# ⚡ DSA-VIZ: Observable Computation & Interactive CS Laboratory

<div align="center">

**"Don't visualize code. Visualize the state changes caused by code. Make computation observable."**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Multi-Language](https://img.shields.io/badge/Supported-Python%20%7C%20JS%20%7C%20C%2B%2B%20%7C%20Java-cyan.svg)](#multi-language-support)
[![Vite](https://img.shields.io/badge/Built%20with-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev/)

[**Live Demo**](http://localhost:5173/) • [**Architecture**](#architecture) • [**Trace Protocol**](#universal-trace-protocol-ir) • [**Visualizers**](#canonical-visualization-sdk) • [**Modes**](#the-5-learning-modes)

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

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

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
