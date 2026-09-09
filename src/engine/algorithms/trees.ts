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

export const invertTreeAlgorithm: AlgorithmDefinition = {
  id: "invert_binary_tree",
  name: "Invert Binary Tree",
  category: "trees",
  structureType: "tree",
  difficulty: "Easy",
  description:
    "Inverts a binary tree by swapping the left and right subtrees for every node in the tree recursively (creating its mirror image).",
  timeComplexity: "O(n)",
  spaceComplexity: "O(h) call stack",
  mentalModel: [
    "Looking in a mirror: left becomes right, and right becomes left.",
    "Post-order or pre-order traversal: visit node, swap node.left and node.right, then recurse on children.",
    "Every subtree down to the leaves is mirrored."
  ],
  invariants: [
    "For every node processed, LeftSubtree(node) and RightSubtree(node) have been interchanged.",
    "Tree shape is preserved but horizontally flipped."
  ],
  commonMistakes: [
    "Swapping references after recursing without holding temporary pointers, or confusing post-order with in-order traversal which might invert the same subtree twice."
  ],
  defaultInput: {},
  code: {
    python: `def invert_tree(root):
    if not root:
        return None
        
    root.left, root.right = root.right, root.left
    
    invert_tree(root.left)
    invert_tree(root.right)
    
    return root`,
    javascript: `function invertTree(root) {
    if (!root) return null;
    
    const temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}`,
    cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    
    std::swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
    
    return root;
}`,
    java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}`
  },
  generateTrace: (): ExecutionTrace => {
    const events: ExecutionEvent[] = [];
    let step = 0;

    const currentNodes: TreeNodeSnapshot[] = [
      { id: "50", val: 50, leftId: "30", rightId: "70" },
      { id: "30", val: 30, leftId: "20", rightId: "40" },
      { id: "70", val: 70, leftId: "60", rightId: "80" },
      { id: "20", val: 20, leftId: null, rightId: null },
      { id: "40", val: 40, leftId: null, rightId: null },
      { id: "60", val: 60, leftId: null, rightId: null },
      { id: "80", val: 80, leftId: null, rightId: null }
    ];

    const callStack: CallStackFrame[] = [
      { id: "frame_0", name: "invert_tree", args: { root: 50 }, line: 2 }
    ];

    events.push({
      step: ++step,
      type: "CALL",
      sourceLine: 1,
      codeSnippet: "invert_tree(root)",
      explanation: "Begin recursive tree inversion at root node (50).",
      variables: { currentNode: 50 },
      pointers: { current: "50" },
      callStack: [...callStack],
      structureType: "tree",
      structureState: { nodes: JSON.parse(JSON.stringify(currentNodes)), rootId: "50", activeNodeId: "50" },
      activeNodes: ["50"]
    });

    // 1. Invert root (50): swap 30 and 70
    const rootNode = currentNodes.find((n) => n.id === "50")!;
    const tempLeft = rootNode.leftId;
    rootNode.leftId = rootNode.rightId;
    rootNode.rightId = tempLeft;

    events.push({
      step: ++step,
      type: "SWAP",
      sourceLine: 5,
      codeSnippet: "root.left, root.right = root.right, root.left",
      explanation: `Swapped children of Node(50). Left is now Node(70), Right is now Node(30).`,
      expressionEvaluation: {
        rawExpression: "swap(root.left, root.right)",
        substitutedExpression: "swap(Node(30), Node(70))",
        result: "SWAPPED",
        effectDescription: "Mirroring left and right subtrees of root"
      },
      variables: { "root.val": 50, newLeft: 70, newRight: 30 },
      pointers: { current: "50" },
      callStack: [...callStack],
      structureType: "tree",
      structureState: { nodes: JSON.parse(JSON.stringify(currentNodes)), rootId: "50", activeNodeId: "50" },
      activeNodes: ["50", "70", "30"]
    });

    // 2. Recurse left on 70: swap 60 and 80
    callStack.push({ id: "frame_1", name: "invert_tree", args: { root: 70 }, line: 7 });
    const node70 = currentNodes.find((n) => n.id === "70")!;
    const temp70 = node70.leftId;
    node70.leftId = node70.rightId;
    node70.rightId = temp70;

    events.push({
      step: ++step,
      type: "SWAP",
      sourceLine: 5,
      codeSnippet: "root.left, root.right = root.right, root.left",
      explanation: `Inverted children of Node(70). Left is now Node(80), Right is now Node(60).`,
      expressionEvaluation: {
        rawExpression: "swap(root.left, root.right)",
        substitutedExpression: "swap(Node(60), Node(80))",
        result: "SWAPPED",
        effectDescription: "Mirrored children of Node(70)"
      },
      variables: { "root.val": 70, newLeft: 80, newRight: 60 },
      pointers: { current: "70" },
      callStack: [...callStack],
      structureType: "tree",
      structureState: { nodes: JSON.parse(JSON.stringify(currentNodes)), rootId: "50", activeNodeId: "70" },
      activeNodes: ["70", "80", "60"]
    });

    callStack.pop();

    // 3. Recurse right on 30: swap 20 and 40
    callStack.push({ id: "frame_2", name: "invert_tree", args: { root: 30 }, line: 8 });
    const node30 = currentNodes.find((n) => n.id === "30")!;
    const temp30 = node30.leftId;
    node30.leftId = node30.rightId;
    node30.rightId = temp30;

    events.push({
      step: ++step,
      type: "SWAP",
      sourceLine: 5,
      codeSnippet: "root.left, root.right = root.right, root.left",
      explanation: `Inverted children of Node(30). Left is now Node(40), Right is now Node(20).`,
      expressionEvaluation: {
        rawExpression: "swap(root.left, root.right)",
        substitutedExpression: "swap(Node(20), Node(40))",
        result: "SWAPPED",
        effectDescription: "Mirrored children of Node(30)"
      },
      variables: { "root.val": 30, newLeft: 40, newRight: 20 },
      pointers: { current: "30" },
      callStack: [...callStack],
      structureType: "tree",
      structureState: { nodes: JSON.parse(JSON.stringify(currentNodes)), rootId: "50", activeNodeId: "30" },
      activeNodes: ["30", "40", "20"]
    });

    callStack.pop();

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 10,
      codeSnippet: "return root",
      explanation: "Binary tree successfully inverted across all subtrees!",
      variables: { result: "Mirrored Tree" },
      pointers: { root: "50" },
      callStack: [{ id: "main", name: "invert_tree", args: {}, line: 10 }],
      structureType: "tree",
      structureState: { nodes: JSON.parse(JSON.stringify(currentNodes)), rootId: "50", activeNodeId: null }
    });

    return {
      id: "invert_tree_trace",
      algorithmId: "invert_binary_tree",
      title: "Invert Binary Tree Execution Trace",
      structureType: "tree",
      totalSteps: events.length,
      events
    };
  }
};
