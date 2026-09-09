import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export interface GraphSnapshot {
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { u: string; v: string; weight?: number }[];
  visited: string[];
  frontier: string[];
  activeNode: string | null;
  activeEdge: [string, string] | null;
}

export const bfsAlgorithm: AlgorithmDefinition = {
  id: "bfs_traversal",
  name: "Breadth-First Search (BFS)",
  category: "graphs",
  structureType: "graph",
  difficulty: "Medium",
  description:
    "Traverses a graph level by level starting from a source node using a First-In, First-Out (FIFO) queue. Explores all neighbor nodes at current depth before moving to nodes at the next depth level.",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V) for queue and visited set",
  mentalModel: [
    "A ripple expanding outward in concentric rings from a stone dropped in a pond.",
    "Every node in queue is at distance d or d+1 from start node.",
    "Guarantees shortest path in unweighted graphs."
  ],
  invariants: [
    "All nodes enqueued have been marked as visited to prevent duplicate processing and infinite loops.",
    "Nodes are visited strictly in non-decreasing order of their distance from the source."
  ],
  commonMistakes: [
    "Marking nodes as visited upon popping from queue instead of when pushing into queue, causing redundant enqueuing.",
    "Not handling disconnected components or isolated vertices."
  ],
  defaultInput: { startNode: "A" },
  code: {
    python: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    
    while queue:
        node = queue.popleft()
        order.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return order`,
    javascript: `function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    const order = [];
    
    while (queue.length > 0) {
        const node = queue.shift();
        order.push(node);
        
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return order;
}`,
    cpp: `std::vector<char> bfs(const std::unordered_map<char, std::vector<char>>& graph, char start) {
    std::unordered_set<char> visited;
    std::queue<char> q;
    std::vector<char> order;
    
    visited.insert(start);
    q.push(start);
    
    while (!q.empty()) {
        char node = q.front();
        q.pop();
        order.push_back(node);
        
        for (char neighbor : graph.at(node)) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return order;
}`,
    java: `public List<Character> bfs(Map<Character, List<Character>> graph, char start) {
    Set<Character> visited = new HashSet<>();
    Queue<Character> queue = new LinkedList<>();
    List<Character> order = new ArrayList<>();
    
    visited.add(start);
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        char node = queue.poll();
        order.add(node);
        
        for (char neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
    return order;
}`
  },
  generateTrace: (input = { startNode: "A" }): ExecutionTrace => {
    const startNode = input.startNode || "A";
    const events: ExecutionEvent[] = [];
    let step = 0;

    // Canonical Graph: A -> B, C; B -> D, E; C -> F; D -> ; E -> F
    const nodes = [
      { id: "A", label: "A", x: 250, y: 50 },
      { id: "B", label: "B", x: 130, y: 140 },
      { id: "C", label: "C", x: 370, y: 140 },
      { id: "D", label: "D", x: 80, y: 240 },
      { id: "E", label: "E", x: 200, y: 240 },
      { id: "F", label: "F", x: 340, y: 240 }
    ];

    const edges: { u: string; v: string }[] = [
      { u: "A", v: "B" },
      { u: "A", v: "C" },
      { u: "B", v: "D" },
      { u: "B", v: "E" },
      { u: "C", v: "F" },
      { u: "E", v: "F" }
    ];

    const adj: Record<string, string[]> = {
      A: ["B", "C"],
      B: ["D", "E"],
      C: ["F"],
      D: [],
      E: ["F"],
      F: []
    };

    const visited: string[] = [startNode];
    const queue: string[] = [startNode];
    const order: string[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 4,
      codeSnippet: `visited = set([start]), queue = deque([start])`,
      explanation: `Initialize BFS. Source node '${startNode}' marked as visited and enqueued.`,
      variables: { start: startNode, visited: [...visited], queue: [...queue], order: [] },
      pointers: { current: startNode },
      callStack: [{ id: "main", name: "bfs", args: { start: startNode }, line: 4 }],
      structureType: "graph",
      structureState: {
        nodes,
        edges,
        visited: [...visited],
        frontier: [...queue],
        activeNode: startNode,
        activeEdge: null
      },
      activeNodes: [startNode]
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);

      events.push({
        step: ++step,
        type: "VISIT_NODE",
        sourceLine: 9,
        codeSnippet: "node = queue.popleft()",
        explanation: `Dequeued node '${node}'. Now processing its outgoing edges.`,
        expressionEvaluation: {
          rawExpression: "queue.popleft()",
          substitutedExpression: `pop '${node}' from front of queue`,
          result: node,
          effectDescription: `Node '${node}' is now actively expanding its neighbors.`
        },
        variables: { currentNode: node, queue: [...queue], visited: [...visited], order: [...order] },
        pointers: { current: node },
        callStack: [{ id: "main", name: "bfs", args: { node }, line: 9 }],
        structureType: "graph",
        structureState: {
          nodes,
          edges,
          visited: [...visited],
          frontier: [...queue],
          activeNode: node,
          activeEdge: null
        },
        activeNodes: [node]
      });

      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        const isAlreadyVisited = visited.includes(neighbor);

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 13,
          codeSnippet: `if neighbor not in visited: (neighbor = '${neighbor}')`,
          explanation: `Inspecting edge (${node} -> ${neighbor}). Neighbor '${neighbor}' is ${
            isAlreadyVisited ? "ALREADY VISITED. Skipping." : "UNVISITED! Enqueuing."
          }`,
          expressionEvaluation: {
            rawExpression: "neighbor not in visited",
            substitutedExpression: `'${neighbor}' not in [${visited.join(", ")}]`,
            result: !isAlreadyVisited,
            effectDescription: isAlreadyVisited
              ? `Avoid duplicate cycle; ignore node '${neighbor}'`
              : `Mark '${neighbor}' visited & push to queue`
          },
          variables: { currentNode: node, neighbor, isVisited: isAlreadyVisited },
          pointers: { current: node, inspecting: neighbor },
          callStack: [{ id: "main", name: "bfs", args: { node, neighbor }, line: 13 }],
          structureType: "graph",
          structureState: {
            nodes,
            edges,
            visited: [...visited],
            frontier: [...queue],
            activeNode: node,
            activeEdge: [node, neighbor]
          },
          activeNodes: [node, neighbor],
          activeEdges: [[node, neighbor]]
        });

        if (!isAlreadyVisited) {
          visited.push(neighbor);
          queue.push(neighbor);

          events.push({
            step: ++step,
            type: "PUSH",
            sourceLine: 15,
            codeSnippet: "visited.add(neighbor), queue.append(neighbor)",
            explanation: `Added neighbor '${neighbor}' to visited set and pushed into queue. Queue: [${queue.join(", ")}].`,
            variables: { neighbor, queue: [...queue], visited: [...visited] },
            pointers: { current: node, enqueued: neighbor },
            callStack: [{ id: "main", name: "bfs", args: { neighbor }, line: 15 }],
            structureType: "graph",
            structureState: {
              nodes,
              edges,
              visited: [...visited],
              frontier: [...queue],
              activeNode: node,
              activeEdge: [node, neighbor]
            },
            activeNodes: [neighbor],
            activeEdges: [[node, neighbor]]
          });
        }
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 17,
      codeSnippet: "return order",
      explanation: `BFS complete! Traversal order: [${order.join(" -> ")}].`,
      variables: { result: order },
      pointers: {},
      callStack: [{ id: "main", name: "bfs", args: {}, line: 17 }],
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
      id: "bfs_trace",
      algorithmId: "bfs_traversal",
      title: "Breadth-First Search Execution Trace",
      structureType: "graph",
      totalSteps: events.length,
      events
    };
  }
};
