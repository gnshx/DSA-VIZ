import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace, CallStackFrame } from "../../types/trace";

export interface TreeNodeSnapshot {
  id: string;
  val: number;
  leftId: string | null;
  rightId: string | null;
  x?: number;
  y?: number;
}

export const bstSearchAlgorithm: AlgorithmDefinition = {
  id: "bst_search",
  name: "Binary Search Tree (Search)",
  category: "trees",
  structureType: "tree",
  difficulty: "Easy",
  description:
    "Searches for a target value in a Binary Search Tree (BST). Exploits the BST invariant: every node in the left subtree has key < root, and every node in the right subtree has key > root.",
  timeComplexity: "O(h) where h is tree height (O(log n) balanced)",
  spaceComplexity: "O(h) recursive stack",
  mentalModel: [
    "A 2D tree version of Binary Search.",
    "At each node: if target is smaller, steer left; if target is larger, steer right; if equal, found!",
    "Never need to explore both subtrees."
  ],
  invariants: [
    "All values in LeftSubtree(node) < node.val",
    "All values in RightSubtree(node) > node.val"
  ],
  commonMistakes: [
    "Assuming BST property holds only locally (parent vs child) instead of globally across all subtree descendants.",
    "Not handling null root correctly."
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
    ],
    target: 60
  },
  code: {
    python: `def search_bst(root, target):
    if not root or root.val == target:
        return root
        
    if target < root.val:
        return search_bst(root.left, target)
    else:
        return search_bst(root.right, target)`,
    javascript: `function searchBST(root, target) {
    if (!root || root.val === target) {
        return root;
    }
    
    if (target < root.val) {
        return searchBST(root.left, target);
    } else {
        return searchBST(root.right, target);
    }
}`,
    cpp: `TreeNode* searchBST(TreeNode* root, int target) {
    if (!root || root->val == target) {
        return root;
    }
    
    if (target < root->val) {
        return searchBST(root->left, target);
    } else {
        return searchBST(root->right, target);
    }
}`,
    java: `public TreeNode searchBST(TreeNode root, int target) {
    if (root == null || root.val == target) {
        return root;
    }
    
    if (target < root.val) {
        return searchBST(root.left, target);
    } else {
        return searchBST(root.right, target);
    }
}`
  },
  generateTrace: (input = { target: 60 }): ExecutionTrace => {
    const rawNodes: TreeNodeSnapshot[] = [
      { id: "50", val: 50, leftId: "30", rightId: "70" },
      { id: "30", val: 30, leftId: "20", rightId: "40" },
      { id: "70", val: 70, leftId: "60", rightId: "80" },
      { id: "20", val: 20, leftId: null, rightId: null },
      { id: "40", val: 40, leftId: null, rightId: null },
      { id: "60", val: 60, leftId: null, rightId: null },
      { id: "80", val: 80, leftId: null, rightId: null }
    ];
    const target: number = input.target ?? 60;
    const events: ExecutionEvent[] = [];
    let step = 0;

    const nodeMap = new Map<string, TreeNodeSnapshot>();
    rawNodes.forEach((n) => nodeMap.set(n.id, n));

    let currentId: string | null = "50";
    const callStack: CallStackFrame[] = [{ id: "frame_0", name: "search_bst", args: { node: 50, target }, line: 2 }];

    events.push({
      step: ++step,
      type: "CALL",
      sourceLine: 1,
      codeSnippet: "search_bst(root, target)",
      explanation: `Starting BST search for target ${target} at root node (50).`,
      variables: { target, currentNode: 50 },
      pointers: { current: "50" },
      callStack: [...callStack],
      structureType: "tree",
      structureState: { nodes: rawNodes, rootId: "50", activeNodeId: "50" },
      activeNodes: ["50"]
    });

    while (currentId) {
      const node: TreeNodeSnapshot = nodeMap.get(currentId)!;

      // Base comparison
      events.push({
        step: ++step,
        type: "COMPARE",
        sourceLine: 2,
        codeSnippet: "if not root or root.val == target:",
        explanation: `Comparing current node value (${node.val}) with target (${target}).`,
        expressionEvaluation: {
          rawExpression: "root.val == target",
          substitutedExpression: `${node.val} == ${target}`,
          result: node.val === target,
          effectDescription:
            node.val === target
              ? "MATCH FOUND! Returning node."
              : `Unequal. Need to traverse ${target < node.val ? "left" : "right"} subtree.`
        },
        variables: { "root.val": node.val, target },
        pointers: { current: node.id },
        callStack: [...callStack],
        structureType: "tree",
        structureState: { nodes: rawNodes, rootId: "50", activeNodeId: node.id },
        activeNodes: [node.id],
        prediction: {
          question: `At node ${node.val}, target is ${target}. Where do we traverse next?`,
          options: [
            {
              id: "found",
              text: `Target matches node ${node.val}!`,
              isCorrect: node.val === target,
              explanation: node.val === target ? "Correct!" : "Values do not match."
            },
            {
              id: "left",
              text: `Go Left (${target} < ${node.val})`,
              isCorrect: target < node.val,
              explanation: target < node.val ? `Correct! Target ${target} < ${node.val}, so search left subtree.` : "Incorrect."
            },
            {
              id: "right",
              text: `Go Right (${target} > ${node.val})`,
              isCorrect: target > node.val,
              explanation: target > node.val ? `Correct! Target ${target} > ${node.val}, so search right subtree.` : "Incorrect."
            }
          ]
        }
      });

      if (node.val === target) {
        events.push({
          step: ++step,
          type: "COMPLETE",
          sourceLine: 3,
          codeSnippet: "return root",
          explanation: `Node with value ${target} successfully located in BST!`,
          variables: { result: `Node(${node.val})` },
          pointers: { current: node.id },
          callStack: [...callStack],
          structureType: "tree",
          structureState: { nodes: rawNodes, rootId: "50", activeNodeId: node.id },
          activeNodes: [node.id]
        });
        break;
      } else if (target < node.val) {
        currentId = node.leftId;
        callStack.push({
          id: `frame_${callStack.length}`,
          name: "search_bst",
          args: { node: currentId ? nodeMap.get(currentId)?.val : null, target },
          line: 6
        });
        events.push({
          step: ++step,
          type: "CALL",
          sourceLine: 6,
          codeSnippet: "return search_bst(root.left, target)",
          explanation: `${target} < ${node.val}: Steer LEFT into left child (${currentId ? nodeMap.get(currentId)?.val : "null"}).`,
          variables: { nextBranch: "left", target },
          pointers: { current: currentId || "null" },
          callStack: [...callStack],
          structureType: "tree",
          structureState: { nodes: rawNodes, rootId: "50", activeNodeId: currentId },
          activeNodes: currentId ? [currentId] : []
        });
      } else {
        currentId = node.rightId;
        callStack.push({
          id: `frame_${callStack.length}`,
          name: "search_bst",
          args: { node: currentId ? nodeMap.get(currentId)?.val : null, target },
          line: 8
        });
        events.push({
          step: ++step,
          type: "CALL",
          sourceLine: 8,
          codeSnippet: "return search_bst(root.right, target)",
          explanation: `${target} > ${node.val}: Steer RIGHT into right child (${currentId ? nodeMap.get(currentId)?.val : "null"}).`,
          variables: { nextBranch: "right", target },
          pointers: { current: currentId || "null" },
          callStack: [...callStack],
          structureType: "tree",
          structureState: { nodes: rawNodes, rootId: "50", activeNodeId: currentId },
          activeNodes: currentId ? [currentId] : []
        });
      }
    }

    return {
      id: "bst_search_trace",
      algorithmId: "bst_search",
      title: "Binary Search Tree Execution Trace",
      structureType: "tree",
      totalSteps: events.length,
      events
    };
  }
};
