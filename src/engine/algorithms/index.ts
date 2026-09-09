import { AlgorithmDefinition, ConceptNode, ProblemDefinition } from "../../types/algorithm";
import { bubbleSortAlgorithm } from "./sorting";
import { binarySearchAlgorithm, twoPointersAlgorithm, slidingWindowAlgorithm } from "./searching";
import { reverseLinkedListAlgorithm } from "./linkedList";
import { validParenthesesAlgorithm } from "./stackQueue";
import { bstSearchAlgorithm } from "./trees";
import { bfsAlgorithm, dijkstraAlgorithm } from "./graphs";
import { minHeapAlgorithm } from "./heaps";
import { uniquePathsAlgorithm } from "./dp";

export const ALL_ALGORITHMS: AlgorithmDefinition[] = [
  bubbleSortAlgorithm,
  binarySearchAlgorithm,
  twoPointersAlgorithm,
  slidingWindowAlgorithm,
  reverseLinkedListAlgorithm,
  validParenthesesAlgorithm,
  bstSearchAlgorithm,
  bfsAlgorithm,
  dijkstraAlgorithm,
  minHeapAlgorithm,
  uniquePathsAlgorithm
];

export const ALL_PROBLEMS: ProblemDefinition[] = [
  {
    id: "lc-1",
    title: "1. Two Sum (Sorted Array)",
    difficulty: "Easy",
    category: "two_pointers",
    algorithmId: "two_pointers",
    statement:
      "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers.",
    examples: [
      { input: "numbers = [2,7,11,15], target = 9", output: "[0, 1]", explanation: "2 + 7 = 9" },
      { input: "numbers = [2,3,4], target = 6", output: "[0, 2]", explanation: "2 + 4 = 6" }
    ],
    constraints: [
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "numbers is sorted in non-decreasing order."
    ],
    starterCode: {
      python: `def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
      javascript: `function twoSum(numbers, target) {
    let left = 0, right = numbers.length - 1;
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) return [left, right];
        if (sum < target) left++;
        else right--;
    }
    return [];
}`,
      cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left, right};
        if (sum < target) left++;
        else right--;
    }
    return {};
}`,
      java: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`
    }
  },
  {
    id: "lc-20",
    title: "20. Valid Parentheses",
    difficulty: "Easy",
    category: "stack_queue",
    algorithmId: "valid_parentheses",
    statement:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    starterCode: {
      python: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      javascript: `function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const c of s) {
        if (map[c]) {
            if (stack.pop() !== map[c]) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.length === 0;
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char t = st.top(); st.pop();
            if (c == ')' && t != '(') return false;
            if (c == '}' && t != '{') return false;
            if (c == ']' && t != '[') return false;
        }
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}`
    }
  },
  {
    id: "lc-206",
    title: "206. Reverse Linked List",
    difficulty: "Easy",
    category: "linked_list",
    algorithmId: "reverse_linked_list",
    statement:
      "Given the head of a singly linked list, reverse the list, and return the reversed list's head.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" }
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
    starterCode: {
      python: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      javascript: `function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`
    }
  },
  {
    id: "lc-704",
    title: "704. Binary Search",
    difficulty: "Easy",
    category: "searching",
    algorithmId: "binary_search",
    statement:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists at index 4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist" }
    ],
    constraints: ["1 <= nums.length <= 10^4", "All elements are unique.", "nums is sorted in ascending order."],
    starterCode: {
      python: `def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        m = l + (r - l) // 2
        if nums[m] == target:
            return m
        elif nums[m] < target:
            l = m + 1
        else:
            r = m - 1
    return -1`,
      javascript: `function search(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        const m = Math.floor(l + (r - l) / 2);
        if (nums[m] === target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
      cpp: `int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
      java: `public int search(int[] nums, int target) {
    int l = 0, r = nums.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
    }
  },
  {
    id: "lc-62",
    title: "62. Unique Paths (2D DP Grid)",
    difficulty: "Medium",
    category: "sliding_window",
    algorithmId: "unique_paths",
    statement:
      "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
    examples: [
      { input: "m = 3, n = 4", output: "10", explanation: "Paths to reach grid[2][3]" },
      { input: "m = 3, n = 2", output: "3", explanation: "From (0,0): Right->Down->Down, Down->Down->Right, Down->Right->Down" }
    ],
    constraints: ["1 <= m, n <= 100"],
    starterCode: {
      python: `def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    return dp[m - 1][n - 1]`,
      javascript: `function uniquePaths(m, n) {
    const dp = Array.from({ length: m }, () => Array(n).fill(1));
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
      cpp: `int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
      java: `public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`
    }
  }
];

export const CS_KNOWLEDGE_GRAPH: ConceptNode[] = [
  {
    id: "arrays",
    label: "Arrays & Memory",
    category: "sorting",
    description: "Contiguous memory storage, random access O(1), and cache locality.",
    prerequisites: [],
    relatedAlgorithms: ["bubble_sort"],
    level: 1,
    x: 100,
    y: 80
  },
  {
    id: "two_pointers",
    label: "Two Pointers",
    category: "two_pointers",
    description: "Dual-directional convergence or fast/slow chasing in linear arrays.",
    prerequisites: ["arrays"],
    relatedAlgorithms: ["two_pointers"],
    level: 2,
    x: 280,
    y: 80
  },
  {
    id: "binary_search",
    label: "Binary Search",
    category: "searching",
    description: "Logarithmic interval halving on monotonic domains.",
    prerequisites: ["arrays"],
    relatedAlgorithms: ["binary_search"],
    level: 2,
    x: 100,
    y: 220
  },
  {
    id: "linked_list",
    label: "Linked Lists",
    category: "linked_list",
    description: "Pointer-connected dynamic nodes with O(1) head/tail insertions.",
    prerequisites: [],
    relatedAlgorithms: ["reverse_linked_list"],
    level: 1,
    x: 460,
    y: 80
  },
  {
    id: "stack_queue",
    label: "Stacks & Queues",
    category: "stack_queue",
    description: "Restricted LIFO and FIFO pipelines for state history and breadth exploration.",
    prerequisites: ["arrays", "linked_list"],
    relatedAlgorithms: ["valid_parentheses"],
    level: 2,
    x: 460,
    y: 220
  },
  {
    id: "trees",
    label: "Trees & BST",
    category: "trees",
    description: "Hierarchical non-linear structures, recursive invariants, and search paths.",
    prerequisites: ["linked_list", "binary_search"],
    relatedAlgorithms: ["bst_search"],
    level: 3,
    x: 280,
    y: 360
  },
  {
    id: "heaps",
    label: "Heaps & Priority Queues",
    category: "heaps",
    description: "Complete binary trees stored as arrays with O(1) peek and O(log n) extract.",
    prerequisites: ["arrays", "trees"],
    relatedAlgorithms: ["min_heap"],
    level: 3,
    x: 100,
    y: 360
  },
  {
    id: "graphs",
    label: "Graphs & Networks",
    category: "graphs",
    description: "Vertices and edges, cycle detection, BFS level traversal, and DFS backtracking.",
    prerequisites: ["trees", "stack_queue"],
    relatedAlgorithms: ["bfs_traversal"],
    level: 4,
    x: 460,
    y: 360
  },
  {
    id: "dp",
    label: "Dynamic Programming",
    category: "sliding_window",
    description: "Optimal substructure, overlapping subproblems, and state memoization tables.",
    prerequisites: ["arrays", "trees"],
    relatedAlgorithms: ["unique_paths"],
    level: 4,
    x: 280,
    y: 220
  }
];
