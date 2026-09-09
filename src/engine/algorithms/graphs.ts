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

export const dijkstraAlgorithm: AlgorithmDefinition = {
  id: "dijkstra_shortest_path",
  name: "Dijkstra's Shortest Path",
  category: "graphs",
  structureType: "graph",
  difficulty: "Hard",
  description:
    "Finds the shortest paths between nodes in a weighted graph with non-negative edge weights. Greedily selects the unvisited node with the smallest tentative distance, relaxes its outgoing edges, and finalizes its shortest path.",
  timeComplexity: "O((V + E) log V)",
  spaceComplexity: "O(V) distances and priority queue",
  mentalModel: [
    "Expanding wave of verified shortest distances from origin.",
    "Greedy choice: The unvisited node with smallest current distance can never be reached with a shorter distance through other nodes (since all weights are >= 0).",
    "Edge relaxation: if dist[u] + weight(u, v) < dist[v], update dist[v]."
  ],
  invariants: [
    "For all finalized (visited) nodes, dist[u] is guaranteed to be the true minimal distance from source.",
    "Tentative distances are strictly non-increasing monotonically."
  ],
  commonMistakes: [
    "Using Dijkstra with negative edge weights (fails greedy property; requires Bellman-Ford).",
    "Not using a priority queue, leading to O(V²) unoptimized complexity."
  ],
  defaultInput: { startNode: "A" },
  code: {
    python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)
        
        for v, weight in graph[u]:
            if curr_dist + weight < distances[v]:
                distances[v] = curr_dist + weight
                heapq.heappush(pq, (distances[v], v))
                
    return distances`,
    javascript: `function dijkstra(graph, start) {
    const distances = {};
    for (const node in graph) distances[node] = Infinity;
    distances[start] = 0;
    
    const pq = [[0, start]]; // [dist, node]
    const visited = new Set();
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [currDist, u] = pq.shift();
        if (visited.has(u)) continue;
        visited.add(u);
        
        for (const [v, weight] of graph[u]) {
            if (currDist + weight < distances[v]) {
                distances[v] = currDist + weight;
                pq.push([distances[v], v]);
            }
        }
    }
    return distances;
}`,
    cpp: `std::unordered_map<char, int> dijkstra(
    const std::unordered_map<char, std::vector<std::pair<char, int>>>& graph, 
    char start
) {
    std::unordered_map<char, int> dist;
    for (const auto& [node, _] : graph) dist[node] = INT_MAX;
    dist[start] = 0;
    
    std::priority_queue<std::pair<int, char>, 
                        std::vector<std::pair<int, char>>, 
                        std::greater<>> pq;
    pq.push({0, start});
    std::unordered_set<char> visited;
    
    while (!pq.empty()) {
        auto [currDist, u] = pq.top();
        pq.pop();
        if (visited.count(u)) continue;
        visited.insert(u);
        
        for (const auto& [v, weight] : graph.at(u)) {
            if (currDist + weight < dist[v]) {
                dist[v] = currDist + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
    java: `public Map<Character, Integer> dijkstra(
    Map<Character, List<int[]>> graph, 
    char start
) {
    Map<Character, Integer> dist = new HashMap<>();
    for (char node : graph.keySet()) dist.put(node, Integer.MAX_VALUE);
    dist.put(start, 0);
    
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.offer(new int[]{0, start});
    Set<Character> visited = new HashSet<>();
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int currDist = curr[0];
        char u = (char) curr[1];
        if (visited.contains(u)) continue;
        visited.add(u);
        
        for (int[] edge : graph.get(u)) {
            char v = (char) edge[0];
            int weight = edge[1];
            if (currDist + weight < dist.get(v)) {
                dist.put(v, currDist + weight);
                pq.offer(new int[]{dist.get(v), v});
            }
        }
    }
    return dist;
}`
  },
  generateTrace: (input = { startNode: "A" }): ExecutionTrace => {
    const start = input.startNode || "A";
    const events: ExecutionEvent[] = [];
    let step = 0;

    const nodes = [
      { id: "A", label: "A", x: 80, y: 150 },
      { id: "B", label: "B", x: 230, y: 70 },
      { id: "C", label: "C", x: 230, y: 230 },
      { id: "D", label: "D", x: 380, y: 70 },
      { id: "E", label: "E", x: 380, y: 230 }
    ];

    const edges: { u: string; v: string; weight: number }[] = [
      { u: "A", v: "B", weight: 4 },
      { u: "A", v: "C", weight: 2 },
      { u: "C", v: "B", weight: 1 },
      { u: "C", v: "E", weight: 5 },
      { u: "B", v: "D", weight: 2 },
      { u: "B", v: "E", weight: 3 },
      { u: "D", v: "E", weight: 1 }
    ];

    const adj: Record<string, { v: string; weight: number }[]> = {
      A: [
        { v: "B", weight: 4 },
        { v: "C", weight: 2 }
      ],
      B: [
        { v: "D", weight: 2 },
        { v: "E", weight: 3 }
      ],
      C: [
        { v: "B", weight: 1 },
        { v: "E", weight: 5 }
      ],
      D: [{ v: "E", weight: 1 }],
      E: []
    };

    const dist: Record<string, number> = { A: 0, B: 999, C: 999, D: 999, E: 999 };
    const visited: string[] = [];
    const pq: { dist: number; node: string }[] = [{ dist: 0, node: start }];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 4,
      codeSnippet: "distances[start] = 0, pq = [(0, start)]",
      explanation: `Initialize distances with ∞. Source '${start}' set to 0. Enqueued (0, '${start}').`,
      variables: { distances: { ...dist }, visited: [] },
      pointers: { source: start },
      callStack: [{ id: "main", name: "dijkstra", args: { start }, line: 4 }],
      structureType: "graph",
      structureState: {
        nodes,
        edges,
        visited: [],
        frontier: [start],
        activeNode: start,
        activeEdge: null
      },
      activeNodes: [start]
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { dist: currDist, node: u } = pq.shift()!;

      if (visited.includes(u)) continue;
      visited.push(u);

      events.push({
        step: ++step,
        type: "VISIT_NODE",
        sourceLine: 10,
        codeSnippet: "curr_dist, u = heapq.heappop(pq)",
        explanation: `Extracted minimum distance node '${u}' with shortest distance ${currDist}. Node '${u}' is now FINALIZED!`,
        expressionEvaluation: {
          rawExpression: "heapq.heappop(pq)",
          substitutedExpression: `Extract min (${currDist}, '${u}')`,
          result: `dist[${u}] = ${currDist}`,
          effectDescription: `Shortest distance to '${u}' is guaranteed to be ${currDist}. Relaxing outgoing edges.`
        },
        variables: { currentNode: u, finalizedDistance: currDist, distances: { ...dist }, visited: [...visited] },
        pointers: { current: u },
        callStack: [{ id: "main", name: "dijkstra", args: { u, currDist }, line: 10 }],
        structureType: "graph",
        structureState: {
          nodes,
          edges,
          visited: [...visited],
          frontier: pq.map((p) => p.node),
          activeNode: u,
          activeEdge: null
        },
        activeNodes: [u]
      });

      const neighbors = adj[u] || [];
      for (const { v, weight } of neighbors) {
        const newDist = currDist + weight;
        const oldDist = dist[v];
        const relaxes = newDist < oldDist;

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 17,
          codeSnippet: `if curr_dist + weight < distances[${v}]:`,
          explanation: `Inspecting edge (${u} -> ${v}, weight ${weight}): ${currDist} + ${weight} = ${newDist} vs current dist[${v}] = ${
            oldDist === 999 ? "∞" : oldDist
          }. ${relaxes ? "SHORTER PATH FOUND! RELAXING." : "No improvement."}`,
          expressionEvaluation: {
            rawExpression: "curr_dist + weight < distances[v]",
            substitutedExpression: `${currDist} + ${weight} < ${oldDist === 999 ? "∞" : oldDist}`,
            result: relaxes,
            effectDescription: relaxes
              ? `Update dist[${v}] = ${newDist} and push to Priority Queue`
              : `Current distance to '${v}' is already shorter or equal`
          },
          variables: { edge: `(${u} -> ${v})`, weight, newDist, oldDist: oldDist === 999 ? "∞" : oldDist },
          pointers: { current: u, target: v },
          callStack: [{ id: "main", name: "dijkstra", args: { u, v, weight }, line: 17 }],
          structureType: "graph",
          structureState: {
            nodes,
            edges,
            visited: [...visited],
            frontier: pq.map((p) => p.node),
            activeNode: u,
            activeEdge: [u, v]
          },
          activeNodes: [u, v],
          activeEdges: [[u, v]]
        });

        if (relaxes) {
          dist[v] = newDist;
          pq.push({ dist: newDist, node: v });

          events.push({
            step: ++step,
            type: "WRITE",
            sourceLine: 18,
            codeSnippet: `distances[${v}] = ${newDist}, heapq.heappush(pq, (${newDist}, '${v}'))`,
            explanation: `Relaxed! dist[${v}] updated from ${oldDist === 999 ? "∞" : oldDist} to ${newDist}. Added (${newDist}, '${v}') to Priority Queue.`,
            variables: { distances: { ...dist }, updatedNode: v, newDistance: newDist },
            pointers: { current: u, relaxed: v },
            callStack: [{ id: "main", name: "dijkstra", args: { v, newDist }, line: 18 }],
            structureType: "graph",
            structureState: {
              nodes,
              edges,
              visited: [...visited],
              frontier: pq.map((p) => p.node),
              activeNode: u,
              activeEdge: [u, v]
            },
            activeNodes: [v],
            activeEdges: [[u, v]]
          });
        }
      }
    }

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 21,
      codeSnippet: "return distances",
      explanation: `Dijkstra completed! Shortest distances from '${start}': A: ${dist.A}, B: ${dist.B}, C: ${dist.C}, D: ${dist.D}, E: ${dist.E}.`,
      variables: { result: { ...dist } },
      pointers: {},
      callStack: [{ id: "main", name: "dijkstra", args: {}, line: 21 }],
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
      id: "dijkstra_trace",
      algorithmId: "dijkstra_shortest_path",
      title: "Dijkstra's Algorithm Execution Trace",
      structureType: "graph",
      totalSteps: events.length,
      events
    };
  }
};
