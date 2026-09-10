import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// Topological Sort: Kahn's Algorithm (In-Degree Queue BFS - LC 207 / 210)
// ============================================================================
export const topologicalSortKahnAlgorithm: AlgorithmDefinition = {
  id: "topological_sort_kahn",
  name: "Topological Sort: Kahn's Algorithm (In-Degree Queue BFS)",
  category: "topological_sort",
  patternFamily: "topological_sort",
  subPatternId: "topo_kahn",
  structureType: "graph",
  difficulty: "Medium",
  description:
    "Computes a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v. Uses in-degree counting: enqueues all nodes with in-degree 0 (no dependencies), pops them into the topological order, and decrements neighbors' in-degrees. Detects directed cycles if processed count < numNodes.",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V + E)",
  mentalModel: [
    "University course prerequisites: take courses with 0 prerequisites first.",
    "Completing a course unlocks future courses by decrementing their remaining prerequisite count.",
    "If courses remain but none have 0 prerequisites left, a DEADLOCK / CYCLE exists!"
  ],
  invariants: [
    "A node enters queue if and only if all its predecessors have already been processed.",
    "If topological order length == V, graph is guaranteed acyclic (DAG)."
  ],
  commonMistakes: [
    "Decrementing in-degree of predecessors instead of successors.",
    "Assuming graph is DAG without verifying that processed_count == total_nodes."
  ],
  defaultInput: {
    numCourses: 4,
    prerequisites: [
      [1, 0], // 0 -> 1
      [2, 0], // 0 -> 2
      [3, 1], // 1 -> 3
      [3, 2]  // 2 -> 3
    ]
  },
  code: {
    python: `def find_order(num_courses, prerequisites):
    adj = {i: [] for i in range(num_courses)}
    indegree = [0] * num_courses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
        
    queue = [i for i in range(num_courses) if indegree[i] == 0]
    order = []
    
    while queue:
        node = queue.pop(0)
        order.append(node)
        for nbr in adj[node]:
            indegree[nbr] -= 1
            if indegree[nbr] == 0:
                queue.append(nbr)
                
    return order if len(order) == num_courses else []`,
    javascript: `function findOrder(numCourses, prerequisites) {
    const adj = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);
    for (const [dest, src] of prerequisites) {
        adj[src].push(dest);
        inDegree[dest]++;
    }
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    const order = [];
    while (queue.length > 0) {
        const node = queue.shift();
        order.push(node);
        for (const nbr of adj[node]) {
            inDegree[nbr]--;
            if (inDegree[nbr] === 0) queue.push(nbr);
        }
    }
    return order.length === numCourses ? order : [];
}`,
    cpp: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> inDegree(numCourses, 0);
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return order.size() == numCourses ? order : vector<int>();
}`,
    java: `public int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] inDegree = new int[numCourses];
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) queue.add(i);
    int[] order = new int[numCourses];
    int idx = 0;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order[idx++] = u;
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) queue.add(v);
        }
    }
    return idx == numCourses ? order : new int[0];
}`
  },
  generateTrace: (input = { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] }): ExecutionTrace => {
    const numCourses = input.numCourses ?? 4;
    const prereqs: [number, number][] = input.prerequisites || [[1, 0], [2, 0], [3, 1], [3, 2]];
    const events: ExecutionEvent[] = [];
    let step = 0;

    const adj: Record<number, number[]> = {};
    for (let i = 0; i < numCourses; i++) adj[i] = [];
    const inDegree: number[] = new Array(numCourses).fill(0);

    for (const [dest, src] of prereqs) {
      adj[src].push(dest);
      inDegree[dest]++;
    }

    const nodes = Array.from({ length: numCourses }, (_, i) => ({
      id: `${i}`,
      label: `Course ${i} (in:${inDegree[i]})`
    }));
    const edges = prereqs.map(([dest, src]) => ({
      from: `${src}`,
      to: `${dest}`,
      weight: 1
    }));

    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) queue.push(i);
    }

    const order: number[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: `indegree = [${inDegree.join(", ")}]; queue = [${queue.join(", ")}]`,
      explanation: `Initialized Kahn's Topological Sort: built in-degree table [${inDegree.map((d, i) => `${i}:${d}`).join(", ")}]. Enqueued 0-prerequisite courses: [${queue.join(", ")}].`,
      variables: { inDegree: [...inDegree], queue: [...queue], order: [] },
      pointers: {},
      callStack: [{ id: "main", name: "find_order", args: { numCourses }, line: 2 }],
      structureType: "graph",
      structureState: { nodes, edges },
      activeNodes: [...queue.map(String)]
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);

      events.push({
        step: ++step,
        type: "POP",
        sourceLine: 12,
        codeSnippet: `node = queue.pop(0) (${node}); order.append(${node})`,
        explanation: `Course ${node} has 0 prerequisites remaining. Taken course ${node}! Total courses completed: [${order.join(", ")}].`,
        expressionEvaluation: {
          rawExpression: "indegree[node] == 0",
          substitutedExpression: `indegree[${node}] == 0`,
          result: true,
          effectDescription: `Resolved course ${node}. Relaxing outgoing prerequisites.`
        },
        variables: { currentCourse: node, completedOrder: [...order], remainingQueue: [...queue] },
        pointers: { current: `${node}` },
        callStack: [{ id: "main", name: "find_order", args: { node }, line: 12 }],
        structureType: "graph",
        structureState: { nodes, edges },
        activeNodes: [`${node}`]
      });

      for (const nbr of adj[node]) {
        inDegree[nbr]--;
        const unlocked = inDegree[nbr] === 0;

        events.push({
          step: ++step,
          type: "WRITE",
          sourceLine: 15,
          codeSnippet: `indegree[${nbr}] -= 1 (remaining in-degree: ${inDegree[nbr]})`,
          explanation: `Decremented prerequisite for Course ${nbr}: remaining in-degree = ${inDegree[nbr]}. ${
            unlocked ? `Course ${nbr} is now fully unlocked! Added to queue.` : `Course ${nbr} still requires ${inDegree[nbr]} course(s).`
          }`,
          expressionEvaluation: {
            rawExpression: "indegree[nbr] == 0",
            substitutedExpression: `${inDegree[nbr]} == 0`,
            result: unlocked,
            effectDescription: unlocked ? `Course ${nbr} now has 0 prerequisites! Ready for enrollment.` : `Course ${nbr} waiting on other prerequisites.`
          },
          variables: { prerequisite: node, neighbor: nbr, newInDegree: inDegree[nbr] },
          pointers: { current: `${node}`, unlocked: `${nbr}` },
          callStack: [{ id: "main", name: "find_order", args: { nbr }, line: 15 }],
          structureType: "graph",
          structureState: { nodes, edges },
          activeNodes: [`${node}`, `${nbr}`],
          activeEdges: [[`${node}`, `${nbr}`]]
        });

        if (unlocked) {
          queue.push(nbr);
        }
      }
    }

    const isValidDag = order.length === numCourses;
    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 19,
      codeSnippet: `return order (${isValidDag ? "Valid DAG" : "Cycle Detected!"})`,
      explanation: isValidDag
        ? `Topological Sort complete! Valid course progression: [${order.join(" -> ")}].`
        : `CYCLE DETECTED: Only ${order.length}/${numCourses} courses could be completed due to circular dependencies.`,
      variables: { valid: isValidDag, order },
      pointers: {},
      callStack: [{ id: "main", name: "find_order", args: {}, line: 19 }],
      structureType: "graph",
      structureState: { nodes, edges }
    });

    return {
      id: "topological_sort_kahn_trace",
      algorithmId: "topological_sort_kahn",
      title: "Topological Sort (Kahn's In-Degree Queue BFS)",
      structureType: "graph",
      totalSteps: events.length,
      events
    };
  }
};
