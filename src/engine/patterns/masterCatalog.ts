import { PatternCombination, PatternFamilyDefinition } from "../../types/patterns";

export const MASTER_PATTERN_COMBINATIONS: PatternCombination[] = [
  {
    id: "combo_prefix_hashmap",
    name: "HashMap + Prefix Sum",
    primaryPattern: "Prefix Sum",
    secondaryPattern: "Hashing",
    whyItWorks:
      "Prefix sums reduce range sums to differences: sum(i..j) = prefix[j] - prefix[i-1]. If looking for sum k, we check if prefix[j] - k exists in the hashmap in O(1) time without sorting.",
    recognitionSignals: [
      "Subarray sum equals target K in array with positive AND negative numbers (Two Pointers fails on negatives)",
      "Count of subarrays divisible by K",
      "Contiguous subsegments with equal 0s and 1s"
    ],
    representativeProblems: [
      { title: "560. Subarray Sum Equals K", difficulty: "Medium" },
      { title: "974. Subarray Sums Divisible by K", difficulty: "Medium" },
      { title: "525. Contiguous Array", difficulty: "Medium" }
    ],
    exampleSnippet: `curr_sum += num\nif (curr_sum - k) in prefix_map:\n    count += prefix_map[curr_sum - k]\nprefix_map[curr_sum] = prefix_map.get(curr_sum, 0) + 1`
  },
  {
    id: "combo_bs_greedy",
    name: "Binary Search on Answer + Greedy Feasibility",
    primaryPattern: "Binary Search",
    secondaryPattern: "Greedy",
    whyItWorks:
      "When the question asks to 'minimize the maximum' or 'maximize the minimum', binary search over the numeric answer space. A greedy simulation checks if a candidate value is feasible in O(n) time.",
    recognitionSignals: [
      "'Find the minimum capacity to ship packages within D days'",
      "'Find the minimum eating speed to finish bananas within H hours'",
      "'Split array into K subarrays minimizing the maximum subarray sum'"
    ],
    representativeProblems: [
      { title: "875. Koko Eating Bananas", difficulty: "Medium" },
      { title: "1011. Capacity To Ship Packages Within D Days", difficulty: "Medium" },
      { title: "410. Split Array Largest Sum", difficulty: "Hard" }
    ],
    exampleSnippet: `while left <= right:\n    mid = left + (right - left) // 2\n    if can_ship(mid) <= days:\n        ans = mid; right = mid - 1\n    else: left = mid + 1`
  },
  {
    id: "combo_sort_twopointers",
    name: "Sorting + Two Pointers",
    primaryPattern: "Sorting",
    secondaryPattern: "Two Pointers",
    whyItWorks:
      "Sorting establishes monotonicity. Pointers converging from opposite ends can eliminate one boundary in O(1) based on comparison with target sum, reducing O(n²) to O(n log n).",
    recognitionSignals: [
      "Find pair, triplet, or quadruplet summing to target",
      "Container with most water or trapping rainwater",
      "Minimizing difference between two pointers"
    ],
    representativeProblems: [
      { title: "15. 3Sum", difficulty: "Medium" },
      { title: "167. Two Sum II - Sorted", difficulty: "Easy" },
      { title: "16. 3Sum Closest", difficulty: "Medium" }
    ],
    exampleSnippet: `nums.sort()\nfor i in range(n - 2):\n    left, right = i + 1, n - 1\n    while left < right: ...`
  },
  {
    id: "combo_sort_greedy",
    name: "Sorting + Greedy Scheduling",
    primaryPattern: "Sorting",
    secondaryPattern: "Greedy",
    whyItWorks:
      "Sorting by start time, end time, or value establishes an order where a locally optimal choice is globally optimal.",
    recognitionSignals: [
      "Interval scheduling (pick maximum non-overlapping intervals by earliest end time)",
      "Assigning resources to demands (Assign Cookies)",
      "Gas station circular tour"
    ],
    representativeProblems: [
      { title: "435. Non-overlapping Intervals", difficulty: "Medium" },
      { title: "452. Minimum Number of Arrows to Burst Balloons", difficulty: "Medium" },
      { title: "455. Assign Cookies", difficulty: "Easy" }
    ],
    exampleSnippet: `intervals.sort(key=lambda x: x[1])  # sort by end time\nfor start, end in intervals:\n    if start >= last_end: ...`
  },
  {
    id: "combo_heap_greedy",
    name: "Heap / Priority Queue + Greedy",
    primaryPattern: "Heaps",
    secondaryPattern: "Greedy",
    whyItWorks:
      "When greedy decisions require repeatedly extracting the current absolute minimum or maximum element among a dynamically changing set.",
    recognitionSignals: [
      "Task scheduling with cooldowns (pick highest frequency task first)",
      "Meeting Rooms II (track earliest ending room)",
      "Reorganize string with no adjacent duplicates"
    ],
    representativeProblems: [
      { title: "621. Task Scheduler", difficulty: "Medium" },
      { title: "253. Meeting Rooms II", difficulty: "Medium" },
      { title: "767. Reorganize String", difficulty: "Medium" }
    ],
    exampleSnippet: `for start, end in intervals:\n    if heap and heap[0] <= start: heappop(heap)\n    heappush(heap, end)`
  },
  {
    id: "combo_dfs_memo",
    name: "DFS + Memoization (Top-Down DP)",
    primaryPattern: "Recursion / DFS",
    secondaryPattern: "Dynamic Programming",
    whyItWorks:
      "Expresses problems naturally as recursive state decompositions. Caching the result of (state) in a hash table or array prunes duplicate subtrees, cutting exponential time to polynomial.",
    recognitionSignals: [
      "Word Break, Target Sum, Edit Distance",
      "Game theory minimax (winning/losing states)",
      "Grid paths with obstacles or dynamic choices"
    ],
    representativeProblems: [
      { title: "139. Word Break", difficulty: "Medium" },
      { title: "494. Target Sum", difficulty: "Medium" },
      { title: "329. Longest Increasing Path in Matrix", difficulty: "Hard" }
    ],
    exampleSnippet: `@cache\ndef dfs(state):\n    if base_case: return val\n    return max(dfs(next_state) for next_state in choices)`
  },
  {
    id: "combo_bfs_state",
    name: "BFS + State Space (Product Graph)",
    primaryPattern: "Graphs",
    secondaryPattern: "Queue",
    whyItWorks:
      "When visited status cannot be just visited[node], but must incorporate state visited[node][keys_held] or visited[node][k_stops]. Explores (node, state) pairs level-by-level.",
    recognitionSignals: [
      "Shortest path to get all keys",
      "Shortest path with at most K obstacle eliminations",
      "Cheapest flights with at most K stops"
    ],
    representativeProblems: [
      { title: "864. Shortest Path to Get All Keys", difficulty: "Hard" },
      { title: "1293. Shortest Path in a Grid with Obstacles", difficulty: "Hard" },
      { title: "787. Cheapest Flights Within K Stops", difficulty: "Medium" }
    ],
    exampleSnippet: `queue = deque([(start_r, start_c, 0, 0)])  # r, c, keys_bitmask, steps\nvisited = {(start_r, start_c, 0)}`
  },
  {
    id: "combo_treedfs_dp",
    name: "Tree DFS + Tree DP",
    primaryPattern: "Trees",
    secondaryPattern: "Dynamic Programming",
    whyItWorks:
      "Information is computed bottom-up in post-order: each child returns its optimal states (e.g. [take_node, leave_node]) to parent.",
    recognitionSignals: [
      "House Robber III (rob or not rob tree node)",
      "Binary Tree Maximum Path Sum",
      "Diameter of Binary Tree"
    ],
    representativeProblems: [
      { title: "337. House Robber III", difficulty: "Medium" },
      { title: "124. Binary Tree Maximum Path Sum", difficulty: "Hard" },
      { title: "543. Diameter of Binary Tree", difficulty: "Easy" }
    ],
    exampleSnippet: `def dfs(node):\n    if not node: return (0, 0)  # (rob, not_rob)\n    left = dfs(node.left); right = dfs(node.right)\n    rob = node.val + left[1] + right[1]\n    not_rob = max(left) + max(right)\n    return (rob, not_rob)`
  },
  {
    id: "combo_graph_dsu",
    name: "Graph + Disjoint Set Union (DSU)",
    primaryPattern: "Graphs",
    secondaryPattern: "Union-Find",
    whyItWorks:
      "Maintains dynamic connectivity and cycle detection in undirected graphs in near-constant O(α(n)) amortized time.",
    recognitionSignals: [
      "Finding redundant connection closing a cycle",
      "Number of connected components / provinces",
      "Kruskal's Minimum Spanning Tree"
    ],
    representativeProblems: [
      { title: "684. Redundant Connection", difficulty: "Medium" },
      { title: "547. Number of Provinces", difficulty: "Medium" },
      { title: "1584. Min Cost to Connect All Points", difficulty: "Medium" }
    ],
    exampleSnippet: `for u, v in edges:\n    if not dsu.union(u, v): return [u, v]  # cycle found`
  },
  {
    id: "combo_deque_slidingwindow",
    name: "Monotonic Deque + Sliding Window",
    primaryPattern: "Sliding Window",
    secondaryPattern: "Queue & Deque",
    whyItWorks:
      "Maintains candidate elements in strictly monotonic decreasing order in a double-ended queue. Front always holds the current window maximum in O(1) query time and O(n) total time.",
    recognitionSignals: [
      "Sliding window maximum / minimum of size K",
      "Constrained subsequence sum",
      "Shortest subarray with sum at least K"
    ],
    representativeProblems: [
      { title: "239. Sliding Window Maximum", difficulty: "Hard" },
      { title: "1425. Constrained Subsequence Sum", difficulty: "Hard" },
      { title: "862. Shortest Subarray with Sum at Least K", difficulty: "Hard" }
    ],
    exampleSnippet: `while deque and nums[i] >= nums[deque[-1]]: deque.pop()\ndeque.append(i)\nif deque[0] <= i - k: deque.popleft()\nif i >= k - 1: ans.append(nums[deque[0]])`
  },
  {
    id: "combo_trie_dfs",
    name: "Trie + DFS Backtracking",
    primaryPattern: "Trie",
    secondaryPattern: "Backtracking",
    whyItWorks:
      "When searching a 2D letter board for thousands of dictionary words simultaneously, traversing the Trie alongside the grid prunes dead ends immediately without searching invalid prefixes.",
    recognitionSignals: [
      "Word Search II (find all words from list in 2D character grid)",
      "Boggle board games",
      "Autocomplete path search"
    ],
    representativeProblems: [
      { title: "212. Word Search II", difficulty: "Hard" }
    ],
    exampleSnippet: `def dfs(r, c, node):\n    char = board[r][c]\n    if char not in node.children: return\n    next_node = node.children[char]\n    if next_node.word: result.append(next_node.word)`
  },
  {
    id: "combo_bitmask_dp",
    name: "Bitmask + Dynamic Programming",
    primaryPattern: "Bit Manipulation",
    secondaryPattern: "Dynamic Programming",
    whyItWorks:
      "When n is small (n <= 20), represents subsets of visited nodes or taken items as an integer bitmask (1 << n states), reducing factorial permutations O(n!) to exponential O(n² * 2^n).",
    recognitionSignals: [
      "Traveling Salesperson Problem (TSP)",
      "Assigning N workers to N jobs minimizing cost",
      "Matchsticks to Square / Partition into K Equal Subsets"
    ],
    representativeProblems: [
      { title: "847. Shortest Path Visiting All Nodes", difficulty: "Hard" },
      { title: "473. Matchsticks to Square", difficulty: "Medium" },
      { title: "698. Partition to K Equal Sum Subsets", difficulty: "Medium" }
    ],
    exampleSnippet: `dp[mask | (1 << next_city)] = min(dp[mask | (1 << next_city)], dp[mask] + dist[curr][next_city])`
  },
  {
    id: "combo_sweepline_heap",
    name: "Sweep Line + Priority Queue",
    primaryPattern: "Intervals",
    secondaryPattern: "Heaps",
    whyItWorks:
      "Converts 2D intervals or geometric boxes into 1D time events (start and end). As a virtual vertical line sweeps left-to-right, a max-heap maintains active heights or counts.",
    recognitionSignals: [
      "The Skyline Problem",
      "Maximum simultaneous meeting rooms",
      "Employee free time"
    ],
    representativeProblems: [
      { title: "218. The Skyline Problem", difficulty: "Hard" },
      { title: "253. Meeting Rooms II", difficulty: "Medium" }
    ],
    exampleSnippet: `events.sort()  # (x, -height) for start, (x, height) for end\nfor x, h in events:\n    if h < 0: heappush(heap, h) else: remove(h)`
  }
];

export const MASTER_PATTERN_FAMILIES: PatternFamilyDefinition[] = [
  // ==========================================================================
  // 01. ARRAYS & PREFIX TECHNIQUES
  // ==========================================================================
  {
    id: "arrays",
    name: "Arrays & Prefix Techniques",
    tier: "tier1_core",
    category: "arrays",
    description:
      "Precomputing cumulative sums, difference arrays, and in-place transformations to turn expensive range queries and updates into O(1) operations.",
    badgeColor: "badge-indigo",
    iconName: "Rows",
    defaultSubcaseId: "prefix_1d",
    structureType: "array",
    subcases: [
      {
        id: "prefix_1d",
        subcaseTitle: "1. 1D Prefix Sum (O(1) Range Sum)",
        algorithmId: "prefix_sum_1d",
        topology: "prefix_1d",
        pointerRoles: { current: "Accumulator", leftBound: "Query L", rightBound: "Query R + 1" },
        coreMechanism: "prefix[i+1] = prefix[i] + arr[i]. rangeSum(L, R) = prefix[R+1] - prefix[L].",
        visualSummary: "prefix[R+1] - prefix[L] -> O(1) query",
        classicProblems: [
          { title: "303. Range Sum Query - Immutable", difficulty: "Easy" },
          { title: "724. Find Pivot Index", difficulty: "Easy" }
        ],
        timeComplexity: "O(n) build, O(1) query",
        spaceComplexity: "O(n)"
      },
      {
        id: "diff_array",
        subcaseTitle: "2. Difference Array (O(1) Range Updates)",
        algorithmId: "difference_array",
        topology: "diff_array",
        pointerRoles: { left: "Turn on (+val)", rightCancel: "Turn off (-val)" },
        coreMechanism: "diff[L] += val, diff[R+1] -= val. Final prefix sum pass reconstructs updated array.",
        visualSummary: "diff[L] += val, diff[R+1] -= val -> single prefix pass",
        classicProblems: [
          { title: "1109. Corporate Flight Bookings", difficulty: "Medium" },
          { title: "1094. Car Pooling", difficulty: "Medium" },
          { title: "370. Range Addition", difficulty: "Medium" }
        ],
        timeComplexity: "O(n + q)",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 02. HASHING
  // ==========================================================================
  {
    id: "hashing",
    name: "Hashing & HashMaps",
    tier: "tier1_core",
    category: "hashing",
    description:
      "O(1) expected lookup, frequency mapping, complement pairing, and boundary detection without sorting.",
    badgeColor: "badge-cyan",
    iconName: "Hash",
    defaultSubcaseId: "hash_table_lookup",
    structureType: "array",
    subcases: [
      {
        id: "hash_table_lookup",
        subcaseTitle: "1. Complement Lookup (Two Sum O(n))",
        algorithmId: "hash_table_two_sum",
        topology: "hash_table_lookup",
        pointerRoles: { current: "Scanning index", complement: "Target - current in map" },
        coreMechanism: "Check if (target - num) exists in map. If yes, pair found; else map[num] = index.",
        visualSummary: "target - x in map? -> O(1) match",
        classicProblems: [
          { title: "1. Two Sum", difficulty: "Easy" },
          { title: "1679. Max Number of K-Sum Pairs", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "prefix_hashmap",
        subcaseTitle: "2. Prefix Sum + HashMap (Subarray Sum K)",
        algorithmId: "prefix_sum_hashmap",
        topology: "prefix_hashmap",
        pointerRoles: { current: "Running prefix sum", targetPrefix: "curr_sum - k" },
        coreMechanism: "If (curr_sum - k) in map, every prior occurrence represents a valid subsegment.",
        visualSummary: "map[curr_sum - k] -> count matches",
        classicProblems: [
          { title: "560. Subarray Sum Equals K", difficulty: "Medium" },
          { title: "974. Subarray Sums Divisible by K", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "hash_consecutive",
        subcaseTitle: "3. HashSet Consecutive Sequence",
        algorithmId: "hash_set_consecutive_sequence",
        topology: "hash_consecutive",
        pointerRoles: { streakHead: "x with (x-1) not in set", runner: "x + 1 in set" },
        coreMechanism: "Only start counting when (x - 1) is NOT in set, ensuring each item visited at most twice.",
        visualSummary: "if (num - 1) not in set: count forward",
        classicProblems: [
          { title: "128. Longest Consecutive Sequence", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 03. TWO POINTERS
  // ==========================================================================
  {
    id: "two_pointers",
    name: "Two Pointers",
    tier: "tier1_core",
    category: "two_pointers",
    description:
      "Coordinated traversal of arrays and sequences to reduce quadratic brute force down to linear O(n).",
    badgeColor: "badge-indigo",
    iconName: "MoveHorizontal",
    defaultSubcaseId: "tp_opposite_ends",
    structureType: "array",
    subcases: [
      {
        id: "tp_opposite_ends",
        subcaseTitle: "1. Opposite Ends / Converging",
        algorithmId: "two_pointers_opposite_ends",
        topology: "opposite_ends",
        pointerRoles: { left: "Start boundary (increments)", right: "End boundary (decrements)" },
        coreMechanism: "Pointers converge toward center based on comparison with target sum in sorted array.",
        visualSummary: "left -> [ ... ] <- right",
        classicProblems: [
          { title: "167. Two Sum II", difficulty: "Easy" },
          { title: "11. Container With Most Water", difficulty: "Medium" },
          { title: "125. Valid Palindrome", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "tp_both_at_end",
        subcaseTitle: "2. Both at End / Backward Direction",
        algorithmId: "two_pointers_both_at_end",
        topology: "both_at_end",
        pointerRoles: { p1: "nums1 end", p2: "nums2 end", write: "buffer tail" },
        coreMechanism: "Writing from back to front prevents overwriting unprocessed source elements.",
        visualSummary: "<- p1, <- p2 writing to <- write",
        classicProblems: [
          { title: "88. Merge Sorted Array", difficulty: "Easy" },
          { title: "844. Backspace String Compare", difficulty: "Easy" }
        ],
        timeComplexity: "O(m + n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "tp_one_fixed_two_shifting",
        subcaseTitle: "3. One Fixed, Two Shifting (3Sum)",
        algorithmId: "two_pointers_one_fixed_two_shifting",
        topology: "one_fixed_two_shifting",
        pointerRoles: { i: "Fixed outer anchor", left: "Inner start", right: "Inner end" },
        coreMechanism: "Fix index i; inner pointers converge to find nums[i] + nums[left] + nums[right] == 0.",
        visualSummary: "[i (fixed)] ... left -> [ ... ] <- right",
        classicProblems: [
          { title: "15. 3Sum", difficulty: "Medium" },
          { title: "16. 3Sum Closest", difficulty: "Medium" }
        ],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
      },
      {
        id: "tp_fast_slow",
        subcaseTitle: "4. Fast & Slow (Tortoise & Hare)",
        algorithmId: "two_pointers_fast_slow",
        topology: "fast_slow",
        pointerRoles: { slow: "Advances 1x speed", fast: "Advances 2x speed" },
        coreMechanism: "Dual speed: when fast finishes, slow is at midpoint. In a cycle, fast laps slow.",
        visualSummary: "slow (1x) ->  fast (2x) ->->",
        classicProblems: [
          { title: "876. Middle of the Linked List", difficulty: "Easy" },
          { title: "141. Linked List Cycle", difficulty: "Easy" },
          { title: "287. Find the Duplicate Number", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "tp_read_write",
        subcaseTitle: "5. Same Direction (Read-Write Compaction)",
        algorithmId: "two_pointers_read_write",
        topology: "read_write",
        pointerRoles: { read: "Scans ahead", write: "Anchors valid partition" },
        coreMechanism: "In-place compaction: read explores forward, write commits valid elements without allocation.",
        visualSummary: "write (anchor) -> read (scanner) ->",
        classicProblems: [
          { title: "283. Move Zeroes", difficulty: "Easy" },
          { title: "26. Remove Duplicates from Sorted Array", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "tp_two_sequences",
        subcaseTitle: "6. Two Sequences Parallel",
        algorithmId: "two_pointers_two_arrays",
        topology: "two_sequences",
        pointerRoles: { pA: "Array A pointer", pB: "Array B pointer" },
        coreMechanism: "Zipper-style merge: compare elements and advance whichever is smaller.",
        visualSummary: "arrA[pA] -> vs arrB[pB] ->",
        classicProblems: [
          { title: "21. Merge Two Sorted Lists", difficulty: "Easy" },
          { title: "350. Intersection of Two Arrays II", difficulty: "Easy" }
        ],
        timeComplexity: "O(m + n)",
        spaceComplexity: "O(m + n)"
      }
    ]
  },

  // ==========================================================================
  // 04. SLIDING WINDOW
  // ==========================================================================
  {
    id: "sliding_window",
    name: "Sliding Window",
    tier: "tier1_core",
    category: "sliding_window",
    description:
      "Capturing contiguous subsegments and updating window state in O(1) time as boundaries advance.",
    badgeColor: "badge-cyan",
    iconName: "SlidersHorizontal",
    defaultSubcaseId: "sw_fixed",
    structureType: "array",
    subcases: [
      {
        id: "sw_fixed",
        subcaseTitle: "1. Fixed-Size Window (Width K)",
        algorithmId: "sliding_window_fixed",
        topology: "sliding_fixed",
        pointerRoles: { left: "Drops outgoing", right: "Absorbs incoming" },
        coreMechanism: "Maintain exact width K: sum += incoming - outgoing in O(1) per step.",
        visualSummary: "[ left ... size K ... right ] ->",
        classicProblems: [
          { title: "643. Maximum Average Subarray I", difficulty: "Easy" },
          { title: "567. Permutation in String", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "sw_dynamic",
        subcaseTitle: "2. Dynamic / Variable-Size Window",
        algorithmId: "sliding_window_dynamic",
        topology: "sliding_dynamic",
        pointerRoles: { left: "Contracts to restore validity", right: "Expands forward" },
        coreMechanism: "Expand right until invalid condition; contract left until validity is restored.",
        visualSummary: "[ left ~~~ variable width ~~~ right ]",
        classicProblems: [
          { title: "3. Longest Substring Without Repeating Characters", difficulty: "Medium" },
          { title: "209. Minimum Size Subarray Sum", difficulty: "Medium" },
          { title: "76. Minimum Window Substring", difficulty: "Hard" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(k)"
      }
    ]
  },

  // ==========================================================================
  // 05. BINARY SEARCH & SEARCH ON ANSWER
  // ==========================================================================
  {
    id: "searching",
    name: "Binary Search & Search on Answer",
    tier: "tier1_core",
    category: "searching",
    description:
      "Logarithmic search by eliminating half of candidate space on arrays or monotonic feasibility functions.",
    badgeColor: "badge-emerald",
    iconName: "Search",
    defaultSubcaseId: "bs_exact",
    structureType: "array",
    subcases: [
      {
        id: "bs_exact",
        subcaseTitle: "1. Standard Exact Target Search",
        algorithmId: "binary_search",
        topology: "binary_search_exact",
        pointerRoles: { left: "Lower bound", mid: "Midpoint", right: "Upper bound" },
        coreMechanism: "Halves search space each step: if arr[mid] < target left = mid + 1 else right = mid - 1.",
        visualSummary: "[left ... (mid) ... right]",
        classicProblems: [
          { title: "704. Binary Search", difficulty: "Easy" },
          { title: "35. Search Insert Position", difficulty: "Easy" }
        ],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "bs_boundary",
        subcaseTitle: "2. Boundary Search (Lower Bound / First Match)",
        algorithmId: "binary_search_first_occurrence",
        topology: "binary_search_boundary",
        pointerRoles: { left: "Lower bound", mid: "Candidate", right: "Clamps to mid - 1" },
        coreMechanism: "When match found, record candidate and clamp right = mid - 1 to explore earlier matches.",
        visualSummary: "match at mid -> clamp right = mid - 1",
        classicProblems: [
          { title: "34. Find First and Last Position", difficulty: "Medium" },
          { title: "278. First Bad Version", difficulty: "Easy" }
        ],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "bs_rotated",
        subcaseTitle: "3. Rotated Sorted Array (Pivot Inflection)",
        algorithmId: "binary_search_rotated",
        topology: "binary_search_rotated",
        pointerRoles: { left: "Rotated start", mid: "Pivot", right: "Rotated end" },
        coreMechanism: "Test which half is sorted; check if target falls within sorted range to prune half.",
        visualSummary: "Is left half or right half sorted ramp?",
        classicProblems: [
          { title: "33. Search in Rotated Sorted Array", difficulty: "Medium" },
          { title: "153. Find Minimum in Rotated Sorted Array", difficulty: "Medium" }
        ],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "search_answer",
        subcaseTitle: "4. Binary Search on Answer Space",
        algorithmId: "binary_search_on_answer",
        topology: "binary_search_answer",
        pointerRoles: { leftSpeed: "Min speed (1)", testSpeed: "Mid candidate", rightSpeed: "Max speed" },
        coreMechanism: "Searches candidate values [1 ... max_val]. Evaluates monotonic feasibility predicate canFinish(mid).",
        visualSummary: "canFinish(mid) <= H ? try slower : try faster",
        classicProblems: [
          { title: "875. Koko Eating Bananas", difficulty: "Medium" },
          { title: "1011. Capacity To Ship Packages", difficulty: "Medium" },
          { title: "410. Split Array Largest Sum", difficulty: "Hard" }
        ],
        timeComplexity: "O(n * log(max_val))",
        spaceComplexity: "O(1)"
      }
    ]
  },

  // ==========================================================================
  // 06. SORTING & PARTITIONING
  // ==========================================================================
  {
    id: "sorting",
    name: "Sorting & Partitioning",
    tier: "tier1_core",
    category: "sorting",
    description:
      "Total order rearrangement, divide & conquer, and 3-way partition algorithms.",
    badgeColor: "badge-amber",
    iconName: "ArrowDownUp",
    defaultSubcaseId: "dnf_partition",
    structureType: "array",
    subcases: [
      {
        id: "dnf_partition",
        subcaseTitle: "1. Dutch National Flag (3-Way Partition: Low, Mid, High)",
        algorithmId: "dutch_national_flag",
        topology: "partition_dnf",
        pointerRoles: { low: "0s boundary", mid: "Scanning pointer", high: "2s boundary" },
        coreMechanism: "Sorts 0s, 1s, 2s in single pass. When mid == 2, swap with high without advancing mid.",
        visualSummary: "[0s .. low] [1s .. mid] [unclassified] [high .. 2s]",
        classicProblems: [
          { title: "75. Sort Colors", difficulty: "Medium" },
          { title: "324. Wiggle Sort II", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "sort_bubble",
        subcaseTitle: "2. Adjacent Inversion Swap (Bubble Sort)",
        algorithmId: "bubble_sort",
        topology: "opposite_ends",
        pointerRoles: { i: "Pass counter", j: "Adjacent comparison" },
        coreMechanism: "Pairwise compare & swap adjacent elements to bubble maximum to the end.",
        visualSummary: "swap(arr[j], arr[j+1]) if out of order",
        classicProblems: [{ title: "912. Sort an Array", difficulty: "Medium" }],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
      }
    ]
  },

  // ==========================================================================
  // 07. STACK & MONOTONIC STACK
  // ==========================================================================
  {
    id: "stack_queue",
    name: "Stack & Monotonic Stack",
    tier: "tier1_core",
    category: "stack_queue",
    description:
      "LIFO nested matching, undo operations, and monotonic span queries resolving next greater/smaller elements.",
    badgeColor: "badge-rose",
    iconName: "Layers",
    defaultSubcaseId: "stack_monotonic_dec",
    structureType: "stack",
    subcases: [
      {
        id: "stack_monotonic_dec",
        subcaseTitle: "1. Monotonic Decreasing Stack (Next Greater Element)",
        algorithmId: "monotonic_stack_temperatures",
        topology: "stack_monotonic_dec",
        pointerRoles: { currentDay: "Incoming element", stackTop: "Pending cooler days" },
        coreMechanism: "Stack maintains decreasing elements. Larger incoming element pops all smaller elements on top.",
        visualSummary: "Stack: [75, 71, 69] <- incoming 72 pops 69, 71",
        classicProblems: [
          { title: "739. Daily Temperatures", difficulty: "Medium" },
          { title: "496. Next Greater Element I", difficulty: "Easy" },
          { title: "84. Largest Rectangle in Histogram", difficulty: "Hard" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "stack_lifo",
        subcaseTitle: "2. LIFO Matching (Parentheses & Delimiters)",
        algorithmId: "valid_parentheses",
        topology: "stack_lifo",
        pointerRoles: { char: "Current symbol", top: "Most recent open symbol" },
        coreMechanism: "Push open symbols; pop and match closing symbols against stack top.",
        visualSummary: "Push '(', pop and match on ')'",
        classicProblems: [
          { title: "20. Valid Parentheses", difficulty: "Easy" },
          { title: "71. Simplify Path", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 08. LINKED LIST PATTERNS
  // ==========================================================================
  {
    id: "linked_list",
    name: "Linked List Patterns",
    tier: "tier1_core",
    category: "linked_list",
    description:
      "In-place pointer reversal, dummy heads, and fast/slow cycle detection without contiguous memory.",
    badgeColor: "badge-indigo",
    iconName: "GitCommit",
    defaultSubcaseId: "ll_reverse",
    structureType: "linked_list",
    subcases: [
      {
        id: "ll_reverse",
        subcaseTitle: "1. In-Place Reversal (3-Pointer prev, curr, next)",
        algorithmId: "reverse_linked_list",
        topology: "read_write",
        pointerRoles: { prev: "Reversed list head", curr: "Active node", next: "Remaining list reference" },
        coreMechanism: "curr.next = prev; prev = curr; curr = next. Flips arrows in-place in O(n) time and O(1) space.",
        visualSummary: "prev <- curr  next ->",
        classicProblems: [
          { title: "206. Reverse Linked List", difficulty: "Easy" },
          { title: "92. Reverse Linked List II", difficulty: "Medium" },
          { title: "25. Reverse Nodes in k-Group", difficulty: "Hard" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      }
    ]
  },

  // ==========================================================================
  // 09. RECURSION & BACKTRACKING
  // ==========================================================================
  {
    id: "backtracking",
    name: "Recursion & Backtracking",
    tier: "tier1_core",
    category: "backtracking",
    description:
      "Exploration of combinatorial state spaces with Choose -> Explore -> Undo (backtrack) and pruning.",
    badgeColor: "badge-rose",
    iconName: "Split",
    defaultSubcaseId: "backtrack_subsets",
    structureType: "array",
    subcases: [
      {
        id: "backtrack_subsets",
        subcaseTitle: "1. Subsets / Power Set (Include / Exclude)",
        algorithmId: "backtracking_subsets",
        topology: "backtrack_subsets",
        pointerRoles: { index: "Active decision depth", current: "Accumulated subset state" },
        coreMechanism: "Binary choice tree: branch 1 includes nums[i]; branch 2 excludes nums[i]. Generates all 2^n subsets.",
        visualSummary: "Choose -> Explore -> Backtrack -> Exclude",
        classicProblems: [
          { title: "78. Subsets", difficulty: "Medium" },
          { title: "90. Subsets II", difficulty: "Medium" }
        ],
        timeComplexity: "O(n * 2^n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "backtrack_combinations",
        subcaseTitle: "2. Combination Sum (Target Pruning)",
        algorithmId: "backtracking_combination_sum",
        topology: "backtrack_combinations",
        pointerRoles: { start: "Candidate index reuse", remain: "Remaining target" },
        coreMechanism: "Recursively subtract candidate from target. Prune when remain < 0; record when remain == 0.",
        visualSummary: "remain - candidate: prune if < 0, record if == 0",
        classicProblems: [
          { title: "39. Combination Sum", difficulty: "Medium" },
          { title: "40. Combination Sum II", difficulty: "Medium" }
        ],
        timeComplexity: "O(2^target)",
        spaceComplexity: "O(target)"
      }
    ]
  },

  // ==========================================================================
  // 10. TREES
  // ==========================================================================
  {
    id: "trees",
    name: "Trees & Binary Search Trees",
    tier: "tier1_core",
    category: "trees",
    description:
      "Hierarchical traversal, subtree reduction, BST monotonic search, and Lowest Common Ancestor (LCA).",
    badgeColor: "badge-emerald",
    iconName: "GitBranch",
    defaultSubcaseId: "tree_reduction",
    structureType: "tree",
    subcases: [
      {
        id: "tree_reduction",
        subcaseTitle: "1. Subtree Reduction (Invert Tree / Mirroring)",
        algorithmId: "invert_tree",
        topology: "tree_reduction",
        pointerRoles: { root: "Subtree root", left: "Left branch", right: "Right branch" },
        coreMechanism: "Recursively invert subtrees post-order, then swap root.left and root.right.",
        visualSummary: "swap(node.left, node.right) post-order",
        classicProblems: [
          { title: "226. Invert Binary Tree", difficulty: "Easy" },
          { title: "101. Symmetric Tree", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: "tree_bst_search",
        subcaseTitle: "2. BST Search & Branching",
        algorithmId: "bst_search",
        topology: "tree_dfs",
        pointerRoles: { node: "Inspected node", target: "Search key" },
        coreMechanism: "If target < node.val go left; else go right in O(h) logarithmic time on balanced BSTs.",
        visualSummary: "target < val ? go left : go right",
        classicProblems: [
          { title: "700. Search in a Binary Search Tree", difficulty: "Easy" },
          { title: "98. Validate Binary Search Tree", difficulty: "Medium" },
          { title: "235. Lowest Common Ancestor of a BST", difficulty: "Medium" }
        ],
        timeComplexity: "O(h)",
        spaceComplexity: "O(h)"
      }
    ]
  },

  // ==========================================================================
  // 11. HEAPS & PRIORITY QUEUES
  // ==========================================================================
  {
    id: "heaps",
    name: "Heaps & Top-K Patterns",
    tier: "tier1_core",
    category: "heaps",
    description:
      "Constant time access to minimum or maximum elements with logarithmic updates for streaming and top-K queries.",
    badgeColor: "badge-amber",
    iconName: "TrendingUp",
    defaultSubcaseId: "heap_sift",
    structureType: "heap",
    subcases: [
      {
        id: "heap_sift",
        subcaseTitle: "1. Binary Heap Sift-Up & Sift-Down",
        algorithmId: "min_heap",
        topology: "heap_sift",
        pointerRoles: { parent: "(i-1)//2", left: "2i+1", right: "2i+2" },
        coreMechanism: "Enforces heap property: parent <= children. Sift-up on insertion; sift-down on extract-min.",
        visualSummary: "Swap child with parent while child < parent",
        classicProblems: [
          { title: "215. Kth Largest Element in an Array", difficulty: "Medium" },
          { title: "295. Find Median from Data Stream", difficulty: "Hard" },
          { title: "23. Merge k Sorted Lists", difficulty: "Hard" }
        ],
        timeComplexity: "O(log n) insert/extract, O(1) peek",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 12. GREEDY ALGORITHMS
  // ==========================================================================
  {
    id: "greedy",
    name: "Greedy Algorithms",
    tier: "tier1_core",
    category: "greedy",
    description:
      "Making locally optimal choices at each step that yield a globally optimal solution without backtracking.",
    badgeColor: "badge-cyan",
    iconName: "Zap",
    defaultSubcaseId: "greedy_jump",
    structureType: "array",
    subcases: [
      {
        id: "greedy_jump",
        subcaseTitle: "1. Jump Game (Farthest Reach Horizon)",
        algorithmId: "greedy_jump_game",
        topology: "greedy_jump",
        pointerRoles: { current: "Active index", maxReach: "Farthest illuminated index" },
        coreMechanism: "Greedily extend max_reach = max(max_reach, i + nums[i]). If i > max_reach, unreachable.",
        visualSummary: "max_reach = max(max_reach, i + nums[i])",
        classicProblems: [
          { title: "55. Jump Game", difficulty: "Medium" },
          { title: "45. Jump Game II", difficulty: "Medium" },
          { title: "134. Gas Station", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      }
    ]
  },

  // ==========================================================================
  // 13. INTERVALS
  // ==========================================================================
  {
    id: "intervals",
    name: "Intervals & Sweep Line",
    tier: "tier1_core",
    category: "intervals",
    description:
      "Sorting intervals by start time to consolidate overlaps, calculate spans, or schedule meeting rooms.",
    badgeColor: "badge-indigo",
    iconName: "Calendar",
    defaultSubcaseId: "intervals_merge",
    structureType: "array",
    subcases: [
      {
        id: "intervals_merge",
        subcaseTitle: "1. Merge Overlapping Intervals",
        algorithmId: "merge_intervals",
        topology: "intervals_merge",
        pointerRoles: { inspecting: "Current interval", lastMerged: "Previous active block" },
        coreMechanism: "If curr.start <= lastMerged.end, merge by extending end = max(prev.end, curr.end).",
        visualSummary: "[start ... end] overlaps with [nextStart ... nextEnd]",
        classicProblems: [
          { title: "56. Merge Intervals", difficulty: "Medium" },
          { title: "57. Insert Interval", difficulty: "Medium" },
          { title: "252. Meeting Rooms", difficulty: "Easy" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 14. GRAPH FUNDAMENTALS & TRAVERSAL
  // ==========================================================================
  {
    id: "graphs",
    name: "Graph Fundamentals & Shortest Paths",
    tier: "tier1_core",
    category: "graphs",
    description:
      "Breadth-first exploration, cycle detection, grid flood fills, and Dijkstra's weighted shortest path.",
    badgeColor: "badge-cyan",
    iconName: "Network",
    defaultSubcaseId: "graph_bfs",
    structureType: "graph",
    subcases: [
      {
        id: "graph_bfs",
        subcaseTitle: "1. Breadth-First Search (Unweighted Shortest Path)",
        algorithmId: "bfs_traversal",
        topology: "graph_bfs",
        pointerRoles: { queue: "FIFO frontier", visited: "Processed set" },
        coreMechanism: "Explores neighbors level-by-level, guaranteeing the shortest hop distance in unweighted graphs.",
        visualSummary: "Level 0 -> Level 1 -> Level 2 expansion",
        classicProblems: [
          { title: "127. Word Ladder", difficulty: "Hard" },
          { title: "542. 01 Matrix", difficulty: "Medium" },
          { title: "994. Rotting Oranges", difficulty: "Medium" }
        ],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)"
      },
      {
        id: "graph_dijkstra",
        subcaseTitle: "2. Dijkstra's Algorithm (Weighted Shortest Path)",
        algorithmId: "dijkstra_shortest_path",
        topology: "graph_dijkstra",
        pointerRoles: { pq: "Min-heap (distance, node)", dist: "Shortest distances" },
        coreMechanism: "Greedily extracts the minimum tentative distance node and relaxes all incident outgoing edges.",
        visualSummary: "dist[v] = min(dist[v], dist[u] + weight)",
        classicProblems: [
          { title: "743. Network Delay Time", difficulty: "Medium" },
          { title: "1631. Path with Minimum Effort", difficulty: "Medium" }
        ],
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V)"
      }
    ]
  },

  // ==========================================================================
  // 15. TOPOLOGICAL SORTING
  // ==========================================================================
  {
    id: "topological_sort",
    name: "Topological Sorting (DAG)",
    tier: "tier1_core",
    category: "topological_sort",
    description:
      "Linear ordering of dependencies in Directed Acyclic Graphs (DAGs) and cycle detection via in-degree queues.",
    badgeColor: "badge-emerald",
    iconName: "ListOrdered",
    defaultSubcaseId: "topo_kahn",
    structureType: "graph",
    subcases: [
      {
        id: "topo_kahn",
        subcaseTitle: "1. Kahn's Algorithm (In-Degree Queue BFS)",
        algorithmId: "topological_sort_kahn",
        topology: "graph_topo_kahn",
        pointerRoles: { queue: "Courses with in-degree 0", inDegree: "Dependency count array" },
        coreMechanism: "Queue 0-indegree nodes, pop to order, decrement neighbors. If processed < V, cycle exists.",
        visualSummary: "Enqueue in-degree 0 -> decrement neighbors -> detect cycles",
        classicProblems: [
          { title: "207. Course Schedule", difficulty: "Medium" },
          { title: "210. Course Schedule II", difficulty: "Medium" },
          { title: "269. Alien Dictionary", difficulty: "Hard" }
        ],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V + E)"
      }
    ]
  },

  // ==========================================================================
  // 16. UNION-FIND / DSU
  // ==========================================================================
  {
    id: "union_find",
    name: "Union-Find / Disjoint Set Union (DSU)",
    tier: "tier1_core",
    category: "union_find",
    description:
      "Dynamic connectivity maintenance, cycle detection, and Kruskal's MST in near-constant O(α(n)) amortized time.",
    badgeColor: "badge-indigo",
    iconName: "Share2",
    defaultSubcaseId: "graph_dsu",
    structureType: "graph",
    subcases: [
      {
        id: "graph_dsu",
        subcaseTitle: "1. DSU (Path Compression & Union by Rank)",
        algorithmId: "union_find_dsu",
        topology: "graph_dsu",
        pointerRoles: { parent: "Representative root", rank: "Tree depth estimator" },
        coreMechanism: "Find with path compression flattens tree; union by rank attaches smaller tree under larger tree.",
        visualSummary: "find(u) == find(v) ? cycle! : unite roots",
        classicProblems: [
          { title: "684. Redundant Connection", difficulty: "Medium" },
          { title: "547. Number of Provinces", difficulty: "Medium" },
          { title: "1584. Min Cost to Connect All Points", difficulty: "Medium" }
        ],
        timeComplexity: "O(α(n)) amortized",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 17. DYNAMIC PROGRAMMING
  // ==========================================================================
  {
    id: "dp",
    name: "Dynamic Programming (DP)",
    tier: "tier1_core",
    category: "dp",
    description:
      "State + transition + base case + memoization/tabulation across 1D, 2D grid, Knapsack, and String DP.",
    badgeColor: "badge-rose",
    iconName: "Grid",
    defaultSubcaseId: "dp_2d_grid",
    structureType: "grid",
    subcases: [
      {
        id: "dp_2d_grid",
        subcaseTitle: "1. 2D Grid DP (Unique Paths)",
        algorithmId: "unique_paths",
        topology: "dp_2d_grid",
        pointerRoles: { r: "Row index", c: "Column index" },
        coreMechanism: "dp[r][c] = dp[r-1][c] + dp[r][c-1]. Fills 2D grid table from top-left to bottom-right.",
        visualSummary: "dp[r][c] = dp[r-1][c] + dp[r][c-1]",
        classicProblems: [
          { title: "62. Unique Paths", difficulty: "Medium" },
          { title: "64. Minimum Path Sum", difficulty: "Medium" }
        ],
        timeComplexity: "O(m * n)",
        spaceComplexity: "O(m * n)"
      },
      {
        id: "dp_knapsack",
        subcaseTitle: "2. 0/1 Knapsack Decision Table",
        algorithmId: "knapsack_01",
        topology: "dp_knapsack",
        pointerRoles: { i: "Item index", w: "Remaining capacity" },
        coreMechanism: "dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]) (include vs exclude decision).",
        visualSummary: "max(exclude item, include item)",
        classicProblems: [
          { title: "416. Partition Equal Subset Sum", difficulty: "Medium" },
          { title: "494. Target Sum", difficulty: "Medium" }
        ],
        timeComplexity: "O(n * W)",
        spaceComplexity: "O(n * W)"
      },
      {
        id: "dp_string_lcs",
        subcaseTitle: "3. String DP: Longest Common Subsequence",
        algorithmId: "lcs_string_dp",
        topology: "dp_string_lcs",
        pointerRoles: { i: "s1 index", j: "s2 index" },
        coreMechanism: "If s1[i-1] == s2[j-1]: 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).",
        visualSummary: "Match: 1 + diagonal; Mismatch: max(top, left)",
        classicProblems: [
          { title: "1143. Longest Common Subsequence", difficulty: "Medium" },
          { title: "72. Edit Distance", difficulty: "Medium" },
          { title: "300. Longest Increasing Subsequence", difficulty: "Medium" }
        ],
        timeComplexity: "O(m * n)",
        spaceComplexity: "O(m * n)"
      }
    ]
  },

  // ==========================================================================
  // 18. TRIE & STRING ALGORITHMS
  // ==========================================================================
  {
    id: "trie",
    name: "Trie & String Algorithms",
    tier: "tier1_core",
    category: "trie",
    description:
      "Prefix tree character node branching for O(L) dictionary lookup, autocomplete, and string matching.",
    badgeColor: "badge-cyan",
    iconName: "FolderTree",
    defaultSubcaseId: "trie_prefix",
    structureType: "tree",
    subcases: [
      {
        id: "trie_prefix",
        subcaseTitle: "1. Trie: Prefix Tree (Insert, Search, StartsWith)",
        algorithmId: "trie_prefix_tree",
        topology: "trie_prefix",
        pointerRoles: { node: "Active character node", isEnd: "Word termination flag" },
        coreMechanism: "Traverse character edges. Mark is_end = True. StartsWith checks prefix path existence in O(L).",
        visualSummary: "root -> 'a' -> 'p' -> 'p' [isEnd: True]",
        classicProblems: [
          { title: "208. Implement Trie (Prefix Tree)", difficulty: "Medium" },
          { title: "212. Word Search II", difficulty: "Hard" },
          { title: "421. Maximum XOR of Two Numbers", difficulty: "Medium" }
        ],
        timeComplexity: "O(L) per word operation",
        spaceComplexity: "O(alphabet * L * N)"
      }
    ]
  },

  // ==========================================================================
  // 19. BIT MANIPULATION
  // ==========================================================================
  {
    id: "bit_manipulation",
    name: "Bit Manipulation",
    tier: "tier1_core",
    category: "bit_manipulation",
    description:
      "Bitwise arithmetic (AND, OR, XOR, shifts), bit clearing, parity checks, and bitmask state representation.",
    badgeColor: "badge-amber",
    iconName: "Cpu",
    defaultSubcaseId: "bit_single_number",
    structureType: "array",
    subcases: [
      {
        id: "bit_single_number",
        subcaseTitle: "1. XOR Cancellation (Single Number)",
        algorithmId: "bit_manipulation_single_number",
        topology: "bit_single_number",
        pointerRoles: { current: "Active element", result: "XOR accumulator" },
        coreMechanism: "x ^ x = 0 (self cancellation) and x ^ 0 = x. All pairs cancel to 0, leaving the unique number.",
        visualSummary: "x ^ x = 0; duplicates vanish in O(1) space",
        classicProblems: [
          { title: "136. Single Number", difficulty: "Easy" },
          { title: "268. Missing Number", difficulty: "Easy" },
          { title: "260. Single Number III", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "bit_kernighan",
        subcaseTitle: "2. Brian Kernighan (Set-Bit Counting)",
        algorithmId: "bit_manipulation_kernighan",
        topology: "bit_kernighan",
        pointerRoles: { n: "Active integer", count: "Number of 1s" },
        coreMechanism: "n & (n - 1) clears the rightmost set bit in a single step, running in iterations equal to set bits.",
        visualSummary: "n &= (n - 1) clears lowest 1-bit",
        classicProblems: [
          { title: "191. Number of 1 Bits", difficulty: "Easy" },
          { title: "231. Power of Two", difficulty: "Easy" },
          { title: "338. Counting Bits", difficulty: "Easy" }
        ],
        timeComplexity: "O(k) where k = number of 1s",
        spaceComplexity: "O(1)"
      }
    ]
  }
];
