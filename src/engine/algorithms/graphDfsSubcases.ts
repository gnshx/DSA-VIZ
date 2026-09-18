import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const graphDfsAlgorithm: AlgorithmDefinition = {
  id: "graph_dfs_traversal",
  name: "Depth-First Search (DFS & Cycle Detection)",
  category: "graphs",
  structureType: "graph",
  difficulty: "Medium",
  description:
    "Explores vertices as deep as possible along each branch before backtracking. Uses a recursive call stack or explicit LIFO stack, tracking visited vertices and active recursion paths to detect cycles and explore components.",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V) recursion call stack",
  mentalModel: [
    "Navigating a labyrinth by unrolling a ball of thread (call stack) and rewinding upon reaching a dead end.",
    "Cycle detection: if an outgoing edge points to a vertex currently in the active recursion stack (an ancestor), a directed cycle exists.",
    "Backtracking cleanly pops the current vertex off the active recursion stack before returning to the caller."
  ],
  invariants: [
    "Vertices marked in rec_stack form a strictly contiguous directed path from the root of the DFS tree to the active vertex.",
    "A back-edge u -> v where v in rec_stack proves the existence of a directed cycle."
  ],
  commonMistakes: [
    "Forgetting to remove vertices from the recursion stack on return, causing false cycle detections.",
    "Not handling disconnected graph components by restarting DFS on unvisited nodes."
  ],
  defaultInput: { startNode: "A" },
  code: {
    python: `def dfs(graph, node, visited=None, rec_stack=None):
    if visited is None:
        visited, rec_stack = set(), set()
        
    visited.add(node)
    rec_stack.add(node)
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            if dfs(graph, neighbor, visited, rec_stack):
                return True # cycle detected
        elif neighbor in rec_stack:
            return True # cycle back-edge
            
    rec_stack.remove(node)
    return False`,
    javascript: `function dfs(graph, node, visited = new Set(), recStack = new Set()) {
    visited.add(node);
    recStack.add(node);
    
    for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
            if (dfs(graph, neighbor, visited, recStack)) return true;
        } else if (recStack.has(neighbor)) {
            return true; // cycle detected
        }
    }
    
    recStack.delete(node);
    return false;
}`,
    cpp: `bool dfs(
    const std::unordered_map<char, std::vector<char>>& graph, 
    char node, 
    std::unordered_set<char>& visited, 
    std::unordered_set<char>& recStack
) {
    visited.insert(node);
    recStack.insert(node);
    
    for (char neighbor : graph.at(node)) {
        if (!visited.count(neighbor)) {
            if (dfs(graph, neighbor, visited, recStack)) return true;
        } else if (recStack.count(neighbor)) {
            return true; // cycle found
        }
    }
    
    recStack.erase(node);
    return false;
}`,
    java: `public boolean dfs(
    Map<Character, List<Character>> graph, 
    char node, 
    Set<Character> visited, 
    Set<Character> recStack
) {
    visited.add(node);
    recStack.add(node);
    
    for (char neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            if (dfs(graph, neighbor, visited, recStack)) return true;
        } else if (recStack.contains(neighbor)) {
            return true; // cycle found
        }
    }
    
    recStack.remove(node);
    return false;
}`
  },
  generateTrace: (input = { startNode: "A" }): ExecutionTrace => {
    const startNode = (input as { startNode?: string }).startNode || "A";
    const events: ExecutionEvent[] = [];
    let step = 0;

    const nodes = [
      { id: "A", label: "A", x: 250, y: 50 },
      { id: "B", label: "B", x: 130, y: 140 },
      { id: "C", label: "C", x: 370, y: 140 },
      { id: "D", label: "D", x: 100, y: 240 },
      { id: "E", label: "E", x: 230, y: 240 }
    ];

    const edges: { u: string; v: string }[] = [
      { u: "A", v: "B" },
      { u: "A", v: "C" },
      { u: "B", v: "D" },
      { u: "D", v: "E" },
      { u: "E", v: "B" } // Directed back-edge forming cycle B -> D -> E -> B
    ];

    const adj: Record<string, string[]> = {
      A: ["B", "C"],
      B: ["D"],
      C: [],
      D: ["E"],
      E: ["B"]
    };

    const visited: string[] = [];
    const recStack: string[] = [];
    const callStack: { id: string; name: string; args: Record<string, unknown>; line: number }[] = [];

    const runDfs = (u: string): boolean => {
      visited.push(u);
      recStack.push(u);
      callStack.push({ id: `frame_${u}`, name: "dfs", args: { node: u }, line: 5 });

      events.push({
        step: ++step,
        type: "VISIT_NODE",
        sourceLine: 5,
        codeSnippet: `visited.add('${u}'), rec_stack.add('${u}')`,
        explanation: `Entered vertex '${u}'. Pushed onto recursion stack: [${recStack.join(" -> ")}].`,
        variables: { currentNode: u, visited: [...visited], recStack: [...recStack] },
        pointers: { current: u },
        callStack: [...callStack],
        structureType: "graph",
        structureState: {
          nodes,
          edges,
          visited: [...visited],
          frontier: [...recStack],
          activeNode: u,
          activeEdge: null
        },
        activeNodes: [u]
      });

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        const isVisited = visited.includes(v);
        const inRecStack = recStack.includes(v);

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 8,
          codeSnippet: `Inspect edge (${u} -> ${v})`,
          explanation: `Inspecting directed edge (${u} -> ${v}). Neighbor '${v}' status: ${
            inRecStack
              ? "IN RECURSION STACK! BACK-EDGE DETECTED (CYCLE FOUND!)"
              : isVisited
              ? "already visited, forward/cross edge"
              : "unvisited, recursively traversing deep"
          }.`,
          expressionEvaluation: {
            rawExpression: "neighbor in rec_stack",
            substitutedExpression: `'${v}' in [${recStack.join(", ")}]`,
            result: inRecStack,
            effectDescription: inRecStack ? `Back-edge to ancestor '${v}' triggers cycle detection` : `Traversing to neighbor '${v}'`
          },
          variables: { from: u, to: v, isVisited, inRecStack },
          pointers: { current: u, inspecting: v },
          callStack: [...callStack],
          structureType: "graph",
          structureState: {
            nodes,
            edges,
            visited: [...visited],
            frontier: [...recStack],
            activeNode: u,
            activeEdge: [u, v]
          },
          activeNodes: [u, v],
          activeEdges: [[u, v]]
        });

        if (!isVisited) {
          if (runDfs(v)) return true;
        } else if (inRecStack) {
          events.push({
            step: ++step,
            type: "BRANCH",
            sourceLine: 12,
            codeSnippet: `return True  # Cycle: ${recStack.join(" -> ")} -> ${v}`,
            explanation: `CYCLE CONFIRMED! Directed loop found along path: ${recStack.join(" -> ")} -> ${v}.`,
            variables: { cycle: `${recStack.join(" -> ")} -> ${v}` },
            pointers: { cycleHead: v, cycleTail: u },
            callStack: [...callStack],
            structureType: "graph",
            structureState: {
              nodes,
              edges,
              visited: [...visited],
              frontier: [...recStack],
              activeNode: u,
              activeEdge: [u, v]
            },
            activeNodes: [u, v],
            activeEdges: [[u, v]]
          });
          return true;
        }
      }

      recStack.pop();
      callStack.pop();

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 14,
        codeSnippet: `rec_stack.remove('${u}')  # Backtrack`,
        explanation: `Backtracking from vertex '${u}'. Popped from active recursion stack. Remaining stack: [${recStack.join(" -> ")}].`,
        variables: { backtrackedFrom: u, recStack: [...recStack] },
        pointers: recStack.length > 0 ? { current: recStack[recStack.length - 1] } : {},
        callStack: [...callStack],
        structureType: "graph",
        structureState: {
          nodes,
          edges,
          visited: [...visited],
          frontier: [...recStack],
          activeNode: recStack[recStack.length - 1] || null,
          activeEdge: null
        },
        activeNodes: recStack.slice(-1)
      });

      return false;
    };

    runDfs(startNode);

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 15,
      codeSnippet: "DFS Execution Completed",
      explanation: "DFS traversal and cycle detection analysis concluded.",
      variables: { totalVisited: visited.length, visitedNodes: visited },
      pointers: {},
      callStack: [],
      structureType: "graph",
      structureState: {
        nodes,
        edges,
        visited: [...visited],
        frontier: [],
        activeNode: null,
        activeEdge: null
      }
    });

    return {
      id: "graph_dfs_trace",
      algorithmId: "graph_dfs_traversal",
      title: "Graph Depth-First Search Execution Trace",
      structureType: "graph",
      totalSteps: events.length,
      events
    };
  }
};
