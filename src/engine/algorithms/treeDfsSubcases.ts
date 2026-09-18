import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";
import { TreeNodeSnapshot } from "./trees";

export const treeDfsTraversalsAlgorithm: AlgorithmDefinition = {
  id: "tree_dfs_traversals",
  name: "Binary Tree DFS (Inorder Traversal)",
  category: "trees",
  structureType: "tree",
  difficulty: "Easy",
  description:
    "Recursively visits every node in a binary tree following Inorder depth-first traversal (Left -> Root -> Right). For Binary Search Trees, Inorder traversal yields strictly sorted keys in non-decreasing order.",
  timeComplexity: "O(n) visits every node exactly once",
  spaceComplexity: "O(h) where h is tree height (call stack frames)",
  mentalModel: [
    "Descend completely down the left spine before processing any root value.",
    "Visit (record) current node only after its entire left subtree has returned.",
    "Transition to right subtree and repeat the recursive invariant.",
    "BST Inorder property: Left < Root < Right guarantees monotonic sorted output."
  ],
  invariants: [
    "At any node, all left subtree descendants are visited before the node itself.",
    "The node itself is visited before any right subtree descendants are traversed."
  ],
  commonMistakes: [
    "Confusing traversal orders: Preorder (Root, L, R), Inorder (L, Root, R), Postorder (L, R, Root).",
    "Missing base case check when root is null/None."
  ],
  defaultInput: {
    tree: [
      { id: "50", val: 50, leftId: "30", rightId: "70" },
      { id: "30", val: 30, leftId: "20", rightId: "40" },
      { id: "70", val: 70, leftId: "60", rightId: "80" },
      { id: "20", val: 20, leftId: null, rightId: null },
      { id: "40", val: 40, leftId: null, rightId: null },
      { id: "60", val: 60, leftId: null, rightId: null },
      { id: "80", val: 80, leftId: null, rightId: null }
    ]
  },
  code: {
    python: `def inorder_traversal(root):
    result = []
    
    def dfs(node):
        if not node:
            return
            
        dfs(node.left)       # 1. Left subtree
        result.append(node.val) # 2. Visit root
        dfs(node.right)      # 3. Right subtree
        
    dfs(root)
    return result`,
    javascript: `function inorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        
        dfs(node.left);
        result.push(node.val);
        dfs(node.right);
    }
    
    dfs(root);
    return result;
}`,
    cpp: `void dfs(TreeNode* node, std::vector<int>& result) {
    if (!node) return;
    
    dfs(node->left, result);
    result.push_back(node->val);
    dfs(node->right, result);
}

std::vector<int> inorderTraversal(TreeNode* root) {
    std::vector<int> result;
    dfs(root, result);
    return result;
}`,
    java: `public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    
    dfs(node.left, result);
    result.add(node.val);
    dfs(node.right, result);
}`
  },
  generateTrace: (input?: any): ExecutionTrace => {
    const rawNodes: TreeNodeSnapshot[] = input?.tree || [
      { id: "50", val: 50, leftId: "30", rightId: "70" },
      { id: "30", val: 30, leftId: "20", rightId: "40" },
      { id: "70", val: 70, leftId: "60", rightId: "80" },
      { id: "20", val: 20, leftId: null, rightId: null },
      { id: "40", val: 40, leftId: null, rightId: null },
      { id: "60", val: 60, leftId: null, rightId: null },
      { id: "80", val: 80, leftId: null, rightId: null }
    ];

    const nodeMap = new Map<string, TreeNodeSnapshot>();
    rawNodes.forEach((n) => nodeMap.set(n.id, n));

    const events: ExecutionEvent[] = [];
    let step = 0;
    const order: number[] = [];
    const callStack: { id: string; name: string; args: Record<string, unknown>; line: number }[] = [];

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "result = []",
      explanation: "Initialize Inorder DFS Traversal. Root node is 50.",
      variables: { result: [] },
      pointers: { root: 50 },
      callStack: [{ id: "main", name: "inorderTraversal", args: { root: "50" }, line: 2 }],
      structureType: "tree",
      structureState: {
        nodes: rawNodes,
        activeNodeId: "50"
      },
      activeNodes: ["50"]
    });

    const traverse = (nodeId: string | null) => {
      if (!nodeId) {
        return;
      }
      const node = nodeMap.get(nodeId);
      if (!node) return;

      callStack.push({ id: `dfs_${node.id}`, name: "dfs", args: { node: node.val }, line: 8 });

      events.push({
        step: ++step,
        type: "VISIT_NODE",
        sourceLine: 8,
        codeSnippet: `dfs(node.left) -> Descending to left of ${node.val}`,
        explanation: `At node ${node.val}. Recurse into left child: ${node.leftId ? `node ${nodeMap.get(node.leftId)?.val}` : "null (leaf)"}.`,
        variables: { currentNode: node.val, leftChild: node.leftId ? nodeMap.get(node.leftId)?.val : null, result: [...order] },
        pointers: { current: node.val },
        callStack: [...callStack],
        structureType: "tree",
        structureState: {
          nodes: rawNodes,
          activeNodeId: node.id
        },
        activeNodes: [node.id]
      });

      traverse(node.leftId);

      // Visit current node
      order.push(node.val);

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 9,
        codeSnippet: `result.append(${node.val})`,
        explanation: `Left subtree of node ${node.val} completed! Visited node ${node.val}. Appended to traversal order: [${order.join(", ")}].`,
        expressionEvaluation: {
          rawExpression: "result.append(node.val)",
          substitutedExpression: `Append ${node.val} in sorted BST order`,
          result: node.val,
          effectDescription: `Inorder traversal yields sorted output so far: [${order.join(", ")}]`
        },
        variables: { visitedVal: node.val, traversalOrder: [...order] },
        pointers: { current: node.val },
        callStack: [...callStack],
        structureType: "tree",
        structureState: {
          nodes: rawNodes,
          activeNodeId: node.id
        },
        activeNodes: [node.id]
      });

      // Traverse right
      if (node.rightId) {
        events.push({
          step: ++step,
          type: "BRANCH",
          sourceLine: 10,
          codeSnippet: `dfs(node.right) -> Right child of ${node.val}`,
          explanation: `Recurse into right child of ${node.val}: node ${nodeMap.get(node.rightId)?.val}.`,
          variables: { currentNode: node.val, rightChild: nodeMap.get(node.rightId)?.val },
          pointers: { current: node.val },
          callStack: [...callStack],
          structureType: "tree",
          structureState: {
            nodes: rawNodes,
            activeNodeId: node.rightId
          },
          activeNodes: [node.rightId]
        });
      }

      traverse(node.rightId);

      callStack.pop();
    };

    traverse("50");

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 12,
      codeSnippet: "return result",
      explanation: `Inorder DFS traversal complete! Sorted sequence: [${order.join(" -> ")}].`,
      variables: { result: [...order] },
      pointers: {},
      callStack: [],
      structureType: "tree",
      structureState: {
        nodes: rawNodes,
        activeNodeId: null
      }
    });

    return {
      id: "tree_dfs_traversals_trace",
      algorithmId: "tree_dfs_traversals",
      title: "Binary Tree DFS (Inorder) Execution Trace",
      structureType: "tree",
      totalSteps: events.length,
      events
    };
  }
};
