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
      },
      {
        id: "array_traversal",
        subcaseTitle: "3. Single-Pass Traversal & In-Place Modification",
        algorithmId: "prefix_sum_1d",
        topology: "read_write",
        pointerRoles: { i: "Scanning index", result: "In-place write head" },
        coreMechanism: "Traverse once, modifying in-place or building result. Insert shifts elements right O(n); delete shifts left O(n). Understand cost before choosing arrays.",
        visualSummary: "scan[i] -> modify in-place -> O(n) insert/delete cost",
        classicProblems: [
          { title: "189. Rotate Array", difficulty: "Medium" },
          { title: "41. First Missing Positive", difficulty: "Hard" },
          { title: "48. Rotate Image", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "frequency_counting",
        subcaseTitle: "4. Frequency Counting (Array / HashMap)",
        algorithmId: "hash_table_two_sum",
        topology: "hash_frequency",
        pointerRoles: { current: "Element being counted", freq: "Count accumulator map" },
        coreMechanism: "Use array of size k (fixed-range) or HashMap (arbitrary range) to tally element occurrences in O(n) time.",
        visualSummary: "freq[x]++ as you scan -> O(n) histogram build",
        classicProblems: [
          { title: "347. Top K Frequent Elements", difficulty: "Medium" },
          { title: "242. Valid Anagram", difficulty: "Easy" },
          { title: "1. Two Sum", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(k)"
      },
      {
        id: "suffix_sum",
        subcaseTitle: "5. Suffix Sum & Left/Right Pass Problems",
        algorithmId: "prefix_sum_1d",
        topology: "prefix_1d",
        pointerRoles: { rightPtr: "Builds suffix aggregate", leftPtr: "Reads prefix up to i" },
        coreMechanism: "Build suffix[i] = sum(arr[i..n-1]) in a right-to-left pass. Combine with prefix in a left pass for O(n) product-except-self style problems.",
        visualSummary: "prefix[i] * suffix[i+1] -> product without division",
        classicProblems: [
          { title: "238. Product of Array Except Self", difficulty: "Medium" },
          { title: "42. Trapping Rain Water", difficulty: "Hard" },
          { title: "1732. Find the Highest Altitude", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "kadane",
        subcaseTitle: "6. Kadane's Algorithm (Maximum Subarray Sum)",
        algorithmId: "kadane_max_subarray",
        topology: "dp_1d",
        pointerRoles: { current: "Scanning element", localMax: "Best ending here", globalMax: "Best seen overall" },
        coreMechanism: "local_max = max(num, local_max + num). If all negative, local_max resets to current element. global_max tracks the answer.",
        visualSummary: "local = max(num, local+num); global = max(global, local)",
        classicProblems: [
          { title: "53. Maximum Subarray", difficulty: "Medium" },
          { title: "918. Maximum Sum Circular Subarray", difficulty: "Medium" },
          { title: "152. Maximum Product Subarray", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "matrix_2d",
        subcaseTitle: "7. Matrix / 2D Array (Row-Column & In-Place)",
        algorithmId: "prefix_sum_1d",
        topology: "prefix_2d",
        pointerRoles: { r: "Row index", c: "Column index", layer: "Spiral boundary layer" },
        coreMechanism: "Traverse row-by-row or column-by-column. For in-place rotation: transpose then reverse rows. For spiral: maintain 4 boundaries top, bottom, left, right.",
        visualSummary: "transpose: arr[r][c] <-> arr[c][r]; then reverse",
        classicProblems: [
          { title: "54. Spiral Matrix", difficulty: "Medium" },
          { title: "48. Rotate Image", difficulty: "Medium" },
          { title: "73. Set Matrix Zeroes", difficulty: "Medium" }
        ],
        timeComplexity: "O(m * n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "subarray_counting",
        subcaseTitle: "8. Subarrays vs Subsequences & Counting",
        algorithmId: "prefix_sum_hashmap",
        topology: "prefix_hashmap",
        pointerRoles: { l: "Left subarray boundary", r: "Right subarray boundary", count: "Valid subarray counter" },
        coreMechanism: "Subarrays are contiguous (C(n,2) possible). Subsequences are non-contiguous (2^n subsets). For counting subarrays with a condition, use prefix sum + hashmap or sliding window.",
        visualSummary: "contiguous [l..r] vs non-contiguous subsequence",
        classicProblems: [
          { title: "560. Subarray Sum Equals K", difficulty: "Medium" },
          { title: "930. Binary Subarrays With Sum", difficulty: "Medium" },
          { title: "1248. Count Number of Nice Subarrays", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "array_insert_delete",
        subcaseTitle: "7. Insertion, Deletion & Shifting Costs",
        algorithmId: "two_pointers_read_write",
        topology: "read_write",
        pointerRoles: { write: "Insertion/compaction index", read: "Scan pointer", shiftEnd: "Tail boundary" },
        coreMechanism: "Array elements reside in contiguous memory. Inserting or deleting at index k requires shifting n - k elements: O(n) worst/average cost. Appending at end is O(1) amortized. In-place compaction avoids O(n) auxiliary memory.",
        visualSummary: "arr[k..n-1] shifts right for insert, shifts left for delete",
        classicProblems: [
          { title: "27. Remove Element", difficulty: "Easy" },
          { title: "26. Remove Duplicates from Sorted Array", difficulty: "Easy" },
          { title: "189. Rotate Array", difficulty: "Medium" }
        ],
        timeComplexity: "O(n) per insert/delete, O(1) append",
        spaceComplexity: "O(1)"
      },
      {
        id: "array_sorting_techniques",
        subcaseTitle: "8. Sorting-Based Array Techniques (Sort then Scan / Two-Pointer)",
        algorithmId: "two_pointers_opposite_ends",
        topology: "opposite_ends",
        pointerRoles: { left: "Lower candidate after sort", right: "Upper candidate after sort", current: "Scan boundary" },
        coreMechanism: "When array order is not rigid, sorting in O(n log n) enables: (1) Sort then scan for adjacent duplicates or intervals, (2) Sort then two-pointer to eliminate quadratic search (3-Sum, Pair-Sum).",
        visualSummary: "sort(arr) -> adjacent scans or left/right converging search",
        classicProblems: [
          { title: "15. 3Sum", difficulty: "Medium" },
          { title: "56. Merge Intervals", difficulty: "Medium" },
          { title: "977. Squares of a Sorted Array", difficulty: "Easy" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1) or O(n)"
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
      },
      {
        id: "hashset_existence",
        subcaseTitle: "4. HashSet Existence Checks & Deduplication",
        algorithmId: "hash_set_consecutive_sequence",
        topology: "hash_table_lookup",
        pointerRoles: { current: "Element under inspection", seen: "Set of visited elements" },
        coreMechanism: "Add elements to a set as you scan. Check membership in O(1). Deduplication: a set automatically discards duplicates; useful for intersection and union.",
        visualSummary: "if x in seen: duplicate! else seen.add(x)",
        classicProblems: [
          { title: "217. Contains Duplicate", difficulty: "Easy" },
          { title: "349. Intersection of Two Arrays", difficulty: "Easy" },
          { title: "202. Happy Number", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "hash_duplicate_detection",
        subcaseTitle: "5. Duplicate Detection with Maps",
        algorithmId: "hash_table_two_sum",
        topology: "hash_frequency",
        pointerRoles: { current: "Scanning element", freq: "Occurrence count map" },
        coreMechanism: "Track seen values and their indices or frequencies. If freq[x] > 1 or index stored previously, duplicate found. Enables O(1) per-element decision.",
        visualSummary: "if x in map: found duplicate at map[x]",
        classicProblems: [
          { title: "219. Contains Duplicate II", difficulty: "Easy" },
          { title: "287. Find the Duplicate Number", difficulty: "Medium" },
          { title: "442. Find All Duplicates in an Array", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "hash_grouping",
        subcaseTitle: "6. Grouping by Key (Anagram Groups)",
        algorithmId: "hash_table_two_sum",
        topology: "hash_grouping",
        pointerRoles: { current: "Incoming string/element", key: "Canonical signature (sorted string or freq tuple)", group: "Bucket in map" },
        coreMechanism: "Map each element to a canonical key (sorted characters for anagrams, freq tuple, etc.). Elements sharing a key go into the same bucket. Runs in O(n * k log k).",
        visualSummary: "key = tuple(sorted(word)) -> groups[key].append(word)",
        classicProblems: [
          { title: "49. Group Anagrams", difficulty: "Medium" },
          { title: "438. Find All Anagrams in a String", difficulty: "Medium" },
          { title: "266. Palindrome Permutation", difficulty: "Easy" }
        ],
        timeComplexity: "O(n * k log k)",
        spaceComplexity: "O(n * k)"
      }
    ]
  },

  // ==========================================================================
  // 03. STRINGS & SUBSTRING TECHNIQUES
  // ==========================================================================
  {
    id: "strings",
    name: "Strings & Substring Techniques",
    tier: "tier1_core",
    category: "strings",
    description:
      "Character frequency maps, two-pointer palindromes, expand-around-center, substring windows, and canonical anagram signatures.",
    badgeColor: "badge-emerald",
    iconName: "Type",
    defaultSubcaseId: "str_traversal",
    structureType: "array",
    subcases: [
      {
        id: "str_traversal",
        subcaseTitle: "1. String Traversal, Building & Reversal",
        algorithmId: "two_pointers_opposite_ends",
        topology: "string_scan",
        pointerRoles: { left: "Front character pointer", right: "Tail character pointer", builder: "List accumulator" },
        coreMechanism: "Strings are immutable in Python/Java. Build via list accumulators and ''.join(list) in O(n) rather than string concatenation O(n^2). In-place reversal swaps characters from opposite ends.",
        visualSummary: "chars = list(s); swap(chars[l], chars[r]); ''.join(chars)",
        classicProblems: [
          { title: "344. Reverse String", difficulty: "Easy" },
          { title: "541. Reverse String II", difficulty: "Easy" },
          { title: "151. Reverse Words in a String", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n) in immutable languages, O(1) in mutable"
      },
      {
        id: "str_palindrome",
        subcaseTitle: "2. Palindrome Checking (Two-Pointer & Expand-Around-Center)",
        algorithmId: "two_pointers_opposite_ends",
        topology: "opposite_ends",
        pointerRoles: { left: "Left mirror bound", right: "Right mirror bound", center: "Seed expansion index" },
        coreMechanism: "Verification: converge from ends (s[l] == s[r]). Substring discovery: expand outward from 2n - 1 centers (single-char odd centers and adjacent-pair even centers) while s[l] == s[r].",
        visualSummary: "expand: s[center - d] == s[center + d] while within bounds",
        classicProblems: [
          { title: "125. Valid Palindrome", difficulty: "Easy" },
          { title: "680. Valid Palindrome II", difficulty: "Easy" },
          { title: "5. Longest Palindromic Substring", difficulty: "Medium" },
          { title: "647. Palindromic Substrings", difficulty: "Medium" }
        ],
        timeComplexity: "O(n) verify, O(n²) expand search",
        spaceComplexity: "O(1)"
      },
      {
        id: "str_anagram",
        subcaseTitle: "3. Anagram Detection (Frequency vs Sorted Signature)",
        algorithmId: "hash_table_two_sum",
        topology: "hash_frequency",
        pointerRoles: { char: "Current character", freqCount: "26-length int array or dict", signKey: "tuple(sorted(s))" },
        coreMechanism: "Two strings are anagrams if character frequencies match. Method A: count frequencies via 26-element array in O(n) time and O(1) auxiliary space. Method B: compare sorted signatures in O(n log n).",
        visualSummary: "count[ord(c) - 97]++ for s1, -- for s2; all zero check",
        classicProblems: [
          { title: "242. Valid Anagram", difficulty: "Easy" },
          { title: "49. Group Anagrams", difficulty: "Medium" },
          { title: "438. Find All Anagrams in a String", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) alphabet bounded"
      },
      {
        id: "str_substr_vs_subseq",
        subcaseTitle: "4. Substrings vs Subsequences (Contiguous vs Ordered Subset)",
        algorithmId: "lcs_string_dp",
        topology: "two_sequences",
        pointerRoles: { sPtr: "Pointer on target sequence", subPtr: "Pointer on pattern candidate" },
        coreMechanism: "Substrings are contiguous slices (n*(n+1)/2 total). Subsequences preserve relative order without requiring contiguity (2^n total). Subsequence matching uses two pointers advancing subPtr only on character match.",
        visualSummary: "if s[sPtr] == sub[subPtr]: subPtr++; sPtr++",
        classicProblems: [
          { title: "392. Is Subsequence", difficulty: "Easy" },
          { title: "1143. Longest Common Subsequence", difficulty: "Medium" },
          { title: "58. Length of Last Word", difficulty: "Easy" }
        ],
        timeComplexity: "O(n) subsequence check, O(m * n) LCS",
        spaceComplexity: "O(1) to O(m * n)"
      },
      {
        id: "str_hashmap",
        subcaseTitle: "5. HashMap + Strings (Character Frequency Maps)",
        algorithmId: "hash_table_two_sum",
        topology: "hash_frequency",
        pointerRoles: { char: "Stream character", countMap: "Map of character frequencies or last seen indices" },
        coreMechanism: "Build frequency map or last-seen index map in a single linear pass. Provides O(1) queries for unique characters, majority characters, and character balance.",
        visualSummary: "map[char] = map.get(char, 0) + 1; query in O(1)",
        classicProblems: [
          { title: "387. First Unique Character in a String", difficulty: "Easy" },
          { title: "383. Ransom Note", difficulty: "Easy" },
          { title: "451. Sort Characters By Frequency", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) bounded by character set"
      },
      {
        id: "str_two_pointers",
        subcaseTitle: "6. Two Pointers + Strings (In-Place Inversion & Filtering)",
        algorithmId: "two_pointers_opposite_ends",
        topology: "opposite_ends",
        pointerRoles: { left: "Forward scanner (skips invalid)", right: "Backward scanner (skips invalid)" },
        coreMechanism: "Left and right pointers scan inward, skipping non-alphanumeric characters or non-vowels, then swap or compare matching targets.",
        visualSummary: "while not valid(s[l]): l++; while not valid(s[r]): r--; check",
        classicProblems: [
          { title: "345. Reverse Vowels of a String", difficulty: "Easy" },
          { title: "917. Reverse Only Letters", difficulty: "Easy" },
          { title: "844. Backspace String Compare", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "str_sliding_window",
        subcaseTitle: "7. Sliding Window + Strings (Longest / Shortest Substring)",
        algorithmId: "sliding_window_dynamic",
        topology: "sliding_dynamic",
        pointerRoles: { left: "Window start boundary", right: "Window end boundary", charMap: "Frequency or index map inside window" },
        coreMechanism: "Expand right to include characters until window violates constraint (e.g., duplicate character, insufficient required characters). Contract left until constraint is satisfied.",
        visualSummary: "[ left ~~~ valid character substring ~~~ right ]",
        classicProblems: [
          { title: "3. Longest Substring Without Repeating Characters", difficulty: "Medium" },
          { title: "76. Minimum Window Substring", difficulty: "Hard" },
          { title: "424. Longest Repeating Character Replacement", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(n, alphabet_size))"
      }
    ]
  },

  // ==========================================================================
  // 04. TWO POINTERS
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
      },
      {
        id: "sw_frequency_map",
        subcaseTitle: "3. Frequency-Map Window (Character / Element Count Constraints)",
        algorithmId: "sliding_window_dynamic",
        topology: "sliding_dynamic",
        pointerRoles: { left: "Shrink boundary when constraint broken", right: "Grow boundary adding frequencies", windowMap: "Window element counts" },
        coreMechanism: "Maintain frequency count of elements inside current window [l, r]. If any count violates the problem condition (e.g. at most k distinct elements or required character target count), increment left and decrement windowMap[arr[l]] until valid.",
        visualSummary: "windowMap[c]++; while invalid(windowMap): windowMap[s[l]]--; l++",
        classicProblems: [
          { title: "340. Longest Substring with At Most K Distinct Characters", difficulty: "Medium" },
          { title: "424. Longest Repeating Character Replacement", difficulty: "Medium" },
          { title: "1004. Max Consecutive Ones III", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(k)"
      },
      {
        id: "sw_min_max",
        subcaseTitle: "4. Min / Max Window Problems (Smallest / Largest Valid Window)",
        algorithmId: "sliding_window_dynamic",
        topology: "sliding_dynamic",
        pointerRoles: { left: "Contracting pointer", right: "Expanding pointer", minLen: "Smallest valid length seen" },
        coreMechanism: "Two fundamental objectives: (1) Longest valid: expand right greedily, shrink left only when invalid, recording max(r - l + 1). (2) Shortest valid: expand right until valid, then shrink left as much as possible while remaining valid, recording min(r - l + 1).",
        visualSummary: "valid? record minLen, shrink left : expand right",
        classicProblems: [
          { title: "76. Minimum Window Substring", difficulty: "Hard" },
          { title: "209. Minimum Size Subarray Sum", difficulty: "Medium" },
          { title: "904. Fruit Into Baskets", difficulty: "Medium" }
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
      },
      {
        id: "bs_2d_matrix",
        subcaseTitle: "5. 2D Matrix Binary Search (Sorted Matrix as 1D)",
        algorithmId: "binary_search",
        topology: "binary_search_exact",
        pointerRoles: { left: "Index 0", mid: "Flattened index", right: "m*n - 1" },
        coreMechanism: "Treat m×n sorted matrix as a virtual 1D array of length m*n. Index mid maps to matrix[mid // n][mid % n]. Standard binary search on this flattened view.",
        visualSummary: "matrix[mid // n][mid % n]; search in [0 .. m*n-1]",
        classicProblems: [
          { title: "74. Search a 2D Matrix", difficulty: "Medium" },
          { title: "240. Search a 2D Matrix II", difficulty: "Medium" }
        ],
        timeComplexity: "O(log(m * n))",
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
      },
      {
        id: "sort_selection",
        subcaseTitle: "3. Select Minimum (Selection Sort)",
        algorithmId: "selection_sort",
        topology: "selection_scan",
        pointerRoles: { i: "Sorted-prefix boundary", j: "Unsorted scan", min: "Smallest value seen" },
        coreMechanism: "Scan the unsorted suffix, remember its smallest element, and swap it once into the next sorted position.",
        visualSummary: "scan -> remember minimum -> one placement swap",
        classicProblems: [{ title: "912. Sort an Array", difficulty: "Medium" }],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
      },
      {
        id: "sort_merge",
        subcaseTitle: "4. Merge Sort (Divide & Conquer, Stable)",
        algorithmId: "merge_sort",
        topology: "two_sequences",
        pointerRoles: { left: "Left half pointer", right: "Right half pointer", mid: "Split point" },
        coreMechanism: "Divide array in half recursively until single elements. Merge step: compare left[i] and right[j], place smaller first. Stable: equal elements keep original order. O(n log n) guaranteed.",
        visualSummary: "split in half -> recurse -> merge sorted halves",
        classicProblems: [
          { title: "912. Sort an Array", difficulty: "Medium" },
          { title: "148. Sort List", difficulty: "Medium" },
          { title: "88. Merge Sorted Array", difficulty: "Easy" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "sort_quick",
        subcaseTitle: "5. Quick Sort (Partition & Pivot)",
        algorithmId: "bubble_sort",
        topology: "partition_dnf",
        pointerRoles: { pivot: "Chosen partition element", lo: "Left scan", hi: "Right scan" },
        coreMechanism: "Choose a pivot (random/median-of-3). Partition: elements < pivot go left, > pivot go right. Recurse on both halves. Worst case O(n²) with bad pivots; average O(n log n). In-place but NOT stable.",
        visualSummary: "partition around pivot; recurse left half, right half",
        classicProblems: [
          { title: "912. Sort an Array", difficulty: "Medium" },
          { title: "215. Kth Largest Element (Quickselect)", difficulty: "Medium" }
        ],
        timeComplexity: "O(n log n) avg, O(n²) worst",
        spaceComplexity: "O(log n)"
      },
      {
        id: "sort_custom",
        subcaseTitle: "6. Custom Sorting in Python (key= & Multi-Key)",
        algorithmId: "bubble_sort",
        topology: "read_write",
        pointerRoles: { key: "Comparison key function", stable: "Preserves equal-element order" },
        coreMechanism: "sorted(arr, key=lambda x: ...) or .sort(key=...). Multi-key: key=lambda x: (x[0], -x[1]). Python's Timsort is stable O(n log n). Use reverse=True for descending. cmp_to_key for custom comparators.",
        visualSummary: "sorted(arr, key=lambda x: (x[0], -x[1]))",
        classicProblems: [
          { title: "179. Largest Number", difficulty: "Medium" },
          { title: "56. Merge Intervals", difficulty: "Medium" },
          { title: "1122. Relative Sort Array", difficulty: "Easy" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "sort_insertion",
        subcaseTitle: "7. Insertion Sort (Incremental Online Sorting)",
        algorithmId: "bubble_sort",
        topology: "read_write",
        pointerRoles: { i: "Current element to insert", j: "Shifting pointer in sorted prefix", key: "Saved value" },
        coreMechanism: "Iterate through array from index 1. Cache arr[i] as key, shift elements of arr[0..i-1] greater than key one position to the right, insert key into hole. O(n) best-case for nearly-sorted data; stable; in-place O(1) space.",
        visualSummary: "shift sorted prefix elements right until key fits",
        classicProblems: [
          { title: "147. Insertion Sort List", difficulty: "Medium" },
          { title: "912. Sort an Array", difficulty: "Medium" }
        ],
        timeComplexity: "O(n²) worst/avg, O(n) best for nearly sorted",
        spaceComplexity: "O(1)"
      },
      {
        id: "sort_heap_counting",
        subcaseTitle: "8. Heap Sort & Counting Sort (Comparison vs Non-Comparison)",
        algorithmId: "min_heap",
        topology: "heap_sift",
        pointerRoles: { heapRoot: "Extracted min/max element", countArray: "Frequency bucket array", target: "Output index" },
        coreMechanism: "Heap Sort: builds max-heap in O(n), repeatedly swaps root to end and sifts down: guaranteed O(n log n) time and O(1) space, but unstable. Counting Sort: counts occurrences into index array of size Range(k): runs in O(n + k) non-comparison linear time when range is small.",
        visualSummary: "heap: extract max O(1) space | counting: index buckets O(n+k)",
        classicProblems: [
          { title: "912. Sort an Array", difficulty: "Medium" },
          { title: "75. Sort Colors", difficulty: "Medium" },
          { title: "1051. Height Checker", difficulty: "Easy" }
        ],
        timeComplexity: "Heap: O(n log n), Counting: O(n + k)",
        spaceComplexity: "Heap: O(1), Counting: O(k)"
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
      },
      {
        id: "stack_min_max",
        subcaseTitle: "3. Min/Max Stack (Auxiliary Stack O(1) Access)",
        algorithmId: "valid_parentheses",
        topology: "stack_lifo",
        pointerRoles: { main: "Main stack", aux: "Auxiliary min/max stack", top: "Current min or max" },
        coreMechanism: "Maintain a parallel auxiliary stack that only pushes when new element is <= (min) or >= (max) current top. Pop auxiliary only when main pops its minimum/maximum.",
        visualSummary: "main.push(x); if x <= aux.top: aux.push(x)",
        classicProblems: [
          { title: "155. Min Stack", difficulty: "Medium" },
          { title: "716. Max Stack", difficulty: "Hard" }
        ],
        timeComplexity: "O(1) per push/pop/getMin",
        spaceComplexity: "O(n)"
      },
      {
        id: "stack_monotonic_histogram",
        subcaseTitle: "4. Monotonic Stack — Histogram Style (Largest Rectangle)",
        algorithmId: "monotonic_stack_temperatures",
        topology: "stack_monotonic_dec",
        pointerRoles: { i: "Right boundary trigger", stack: "Candidate bar indices (increasing heights)", popped: "Bar whose right boundary is now known" },
        coreMechanism: "Maintain stack of indices with increasing heights. When a shorter bar arrives, pop and calculate area using the popped bar as height, current index as right bound, and new stack top as left bound.",
        visualSummary: "area = h[popped] * (right - left - 1) on each pop",
        classicProblems: [
          { title: "84. Largest Rectangle in Histogram", difficulty: "Hard" },
          { title: "85. Maximal Rectangle", difficulty: "Hard" },
          { title: "42. Trapping Rain Water", difficulty: "Hard" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 08. QUEUE, DEQUE & MONOTONIC DEQUE
  // ==========================================================================
  {
    id: "queue_deque",
    name: "Queue, Deque & Monotonic Deque",
    tier: "tier1_core",
    category: "queue_deque",
    description:
      "First-In First-Out (FIFO) processing, circular wrap-around buffers, level-order BFS frontiers, and monotonic deque window extremums.",
    badgeColor: "badge-cyan",
    iconName: "ArrowRightLeft",
    defaultSubcaseId: "queue_fundamentals",
    structureType: "array",
    subcases: [
      {
        id: "queue_fundamentals",
        subcaseTitle: "1. Queue Fundamentals (FIFO & collections.deque)",
        algorithmId: "bfs_traversal",
        topology: "queue_fifo",
        pointerRoles: { front: "Dequeue point (O(1) popleft)", rear: "Enqueue point (O(1) append)" },
        coreMechanism: "Strict FIFO discipline. In Python, list.pop(0) is O(n) due to shifting memory; collections.deque provides O(1) append and popleft via doubly-linked blocks. Fundamental for order preservation and buffering.",
        visualSummary: "enqueue at rear -> [head ... tail] -> dequeue from front",
        classicProblems: [
          { title: "232. Implement Queue using Stacks", difficulty: "Easy" },
          { title: "225. Implement Stack using Queues", difficulty: "Easy" },
          { title: "933. Number of Recent Calls", difficulty: "Easy" }
        ],
        timeComplexity: "O(1) push and pop",
        spaceComplexity: "O(n)"
      },
      {
        id: "queue_circular",
        subcaseTitle: "2. Circular Queue Concept (Wrap-Around Indexing)",
        algorithmId: "bfs_traversal",
        topology: "queue_circular",
        pointerRoles: { head: "Read pointer: (head + 1) % cap", tail: "Write pointer: (tail + 1) % cap", count: "Occupied slots" },
        coreMechanism: "Pre-allocated fixed-capacity buffer avoiding reallocations. Modulo arithmetic (idx + 1) % capacity recycles slots freed at the front when the tail wraps past the array end.",
        visualSummary: "idx = (idx + 1) % capacity; full when count == capacity",
        classicProblems: [
          { title: "622. Design Circular Queue", difficulty: "Medium" },
          { title: "641. Design Circular Deque", difficulty: "Medium" }
        ],
        timeComplexity: "O(1) all operations",
        spaceComplexity: "O(k) fixed capacity"
      },
      {
        id: "queue_bfs",
        subcaseTitle: "3. BFS Using a Queue (Level-Order Processing)",
        algorithmId: "bfs_traversal",
        topology: "queue_fifo",
        pointerRoles: { queue: "Active layer frontier", levelSize: "Count of nodes in current distance tier" },
        coreMechanism: "Process nodes tier-by-tier. Snapshotting size = len(queue) at each iteration ensures all nodes at hop distance d are extracted and processed before nodes at distance d+1.",
        visualSummary: "for _ in range(len(queue)): node = q.popleft(); push children",
        classicProblems: [
          { title: "102. Binary Tree Level Order Traversal", difficulty: "Medium" },
          { title: "994. Rotting Oranges", difficulty: "Medium" },
          { title: "127. Word Ladder", difficulty: "Hard" }
        ],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)"
      },
      {
        id: "deque_monotonic_sliding",
        subcaseTitle: "4. Sliding Window Using Deque (Monotonic Deque Max/Min)",
        algorithmId: "sliding_window_max_deque",
        topology: "monotonic_deque",
        pointerRoles: { deque: "Monotonic decreasing index store", right: "Incoming element index", left: "Trailing window bound" },
        coreMechanism: "Store indices of candidate maximums. Before appending right, pop all indices from the back whose values <= arr[right]. Evict front index if it falls behind window start r - k + 1. Front element is always current window maximum in O(1) amortized.",
        visualSummary: "pop back while arr[back] <= arr[r]; pop front if expired; max = arr[deque[0]]",
        classicProblems: [
          { title: "239. Sliding Window Maximum", difficulty: "Hard" },
          { title: "1425. Constrained Subsequence Sum", difficulty: "Hard" },
          { title: "862. Shortest Subarray with Sum at Least K", difficulty: "Hard" }
        ],
        timeComplexity: "O(n) amortized (each element pushed and popped at most once)",
        spaceComplexity: "O(k)"
      },
      {
        id: "queue_priority_comparison",
        subcaseTitle: "5. Priority Queue vs Regular Queue (Priority-Ordered Servicing)",
        algorithmId: "min_heap",
        topology: "heap_top_k",
        pointerRoles: { minElement: "Root of heap (min/max key)", queueFront: "Oldest item (FIFO)" },
        coreMechanism: "Regular queue serves by arrival order (FIFO) in O(1). Priority queue serves by comparison key in O(log n) insertion/extraction. Choose priority queue when urgency, cost, or weight overrides arrival order (Dijkstra, Huffman, A*, Task Scheduling).",
        visualSummary: "FIFO (O(1) arrival) vs Heap (O(log n) priority key extraction)",
        classicProblems: [
          { title: "621. Task Scheduler", difficulty: "Medium" },
          { title: "743. Network Delay Time", difficulty: "Medium" },
          { title: "23. Merge k Sorted Lists", difficulty: "Hard" }
        ],
        timeComplexity: "O(log n) insert/extract, O(1) peek",
        spaceComplexity: "O(n)"
      }
    ]
  },

  // ==========================================================================
  // 09. LINKED LIST PATTERNS
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
      },
      {
        id: "ll_fast_slow",
        subcaseTitle: "2. Fast/Slow Pointers on Lists (Floyd's Cycle)",
        algorithmId: "two_pointers_fast_slow",
        topology: "fast_slow",
        pointerRoles: { slow: "Moves 1 node per step", fast: "Moves 2 nodes per step" },
        coreMechanism: "If cycle exists, fast laps slow and they meet. To find cycle start: reset slow to head, move both 1 step. To find middle: when fast reaches end, slow is at midpoint.",
        visualSummary: "fast meets slow in cycle; slow at mid when fast done",
        classicProblems: [
          { title: "141. Linked List Cycle", difficulty: "Easy" },
          { title: "142. Linked List Cycle II", difficulty: "Medium" },
          { title: "876. Middle of the Linked List", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "ll_merge",
        subcaseTitle: "3. Merge Two Sorted Lists (Zipper Pattern)",
        algorithmId: "reverse_linked_list",
        topology: "two_sequences",
        pointerRoles: { p1: "Pointer on list 1", p2: "Pointer on list 2", curr: "Tail of merged result" },
        coreMechanism: "Compare p1.val and p2.val; attach the smaller node to curr.next, advance that pointer. When one list exhausts, attach the remaining list directly.",
        visualSummary: "p1.val < p2.val ? attach p1, advance p1 : attach p2",
        classicProblems: [
          { title: "21. Merge Two Sorted Lists", difficulty: "Easy" },
          { title: "23. Merge k Sorted Lists", difficulty: "Hard" }
        ],
        timeComplexity: "O(m + n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "ll_dummy_head",
        subcaseTitle: "4. Dummy Head Node (Edge-Case Simplification)",
        algorithmId: "reverse_linked_list",
        topology: "read_write",
        pointerRoles: { dummy: "Sentinel before head", curr: "Active node traversal" },
        coreMechanism: "A dummy sentinel before the real head eliminates special-case logic for deleting or inserting at head. Return dummy.next as the final result.",
        visualSummary: "dummy -> real_head -> ... ; return dummy.next",
        classicProblems: [
          { title: "203. Remove Linked List Elements", difficulty: "Easy" },
          { title: "82. Remove Duplicates from Sorted List II", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "ll_remove_nth",
        subcaseTitle: "5. Remove Nth From End (Two-Pointer Gap)",
        algorithmId: "reverse_linked_list",
        topology: "fast_slow",
        pointerRoles: { fast: "Advances n+1 steps ahead first", slow: "Trails n positions behind fast" },
        coreMechanism: "Move fast n+1 steps ahead. Then move both until fast is None. slow.next is the target to delete; set slow.next = slow.next.next.",
        visualSummary: "fast n+1 ahead; move together; slow.next = target",
        classicProblems: [
          { title: "19. Remove Nth Node From End of List", difficulty: "Medium" },
          { title: "61. Rotate List", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "ll_basics",
        subcaseTitle: "6. Singly & Doubly Linked List Basics (Node Structure & Traversal)",
        algorithmId: "reverse_linked_list",
        topology: "read_write",
        pointerRoles: { head: "List entry reference", curr: "Traversing pointer", prev: "Preceding node reference in doubly linked list" },
        coreMechanism: "Nodes store `val` and `next` (plus `prev` in doubly linked lists). Traversal is sequential O(n). Inserting/deleting given node reference is O(1) pointer updates: `node.prev.next = node.next; node.next.prev = node.prev` without element shifts.",
        visualSummary: "curr = head; while curr: process(curr.val); curr = curr.next",
        classicProblems: [
          { title: "707. Design Linked List", difficulty: "Medium" },
          { title: "146. LRU Cache", difficulty: "Medium" },
          { title: "430. Flatten a Multilevel Doubly Linked List", difficulty: "Medium" }
        ],
        timeComplexity: "O(n) traversal/search, O(1) node insertion/deletion",
        spaceComplexity: "O(1)"
      }
    ]
  },

  // ==========================================================================
  // 10. RECURSION FUNDAMENTALS & CALL STACK
  // ==========================================================================
  {
    id: "recursion",
    name: "Recursion Fundamentals & Call Stack",
    tier: "tier1_core",
    category: "recursion",
    description:
      "Base cases, recursive decomposition, call stack depth, recursion trees, and conversion between recursion and iteration.",
    badgeColor: "badge-amber",
    iconName: "GitFork",
    defaultSubcaseId: "recursion_fundamentals",
    structureType: "array",
    subcases: [
      {
        id: "recursion_fundamentals",
        subcaseTitle: "1. Base Case & Recursive Case (Designing Correct Termination)",
        algorithmId: "reverse_linked_list",
        topology: "tree_dfs",
        pointerRoles: { state: "Current input argument", baseCheck: "Boundary termination condition" },
        coreMechanism: "Every recursive function requires: (1) One or more base cases that return without recursing (e.g. n <= 1 or node is None), (2) A recursive step that strictly reduces input size toward the base case. Missing base cases cause stack overflow.",
        visualSummary: "if base_condition(n): return base_val; return f(reduced_n)",
        classicProblems: [
          { title: "509. Fibonacci Number", difficulty: "Easy" },
          { title: "50. Pow(x, n)", difficulty: "Medium" },
          { title: "231. Power of Two", difficulty: "Easy" }
        ],
        timeComplexity: "O(n) or O(log n)",
        spaceComplexity: "O(depth) call stack frames"
      },
      {
        id: "recursion_call_stack",
        subcaseTitle: "2. Call Stack & Recursion Tree (Visualizing Recursive Frames)",
        algorithmId: "invert_binary_tree",
        topology: "tree_dfs",
        pointerRoles: { frame: "Activation record (local vars + return address)", depth: "Maximum stack height" },
        coreMechanism: "Each call pushes a stack frame with its local state onto OS stack memory. Max depth determines space complexity. Branching factor b and depth d produce O(b^d) recursion tree leaves.",
        visualSummary: "Call: push frame -> Recurse children -> Return: pop frame & compute",
        classicProblems: [
          { title: "104. Maximum Depth of Binary Tree", difficulty: "Easy" },
          { title: "22. Generate Parentheses", difficulty: "Medium" },
          { title: "779. K-th Symbol in Grammar", difficulty: "Medium" }
        ],
        timeComplexity: "O(b^d)",
        spaceComplexity: "O(d) auxiliary stack space"
      },
      {
        id: "recursion_decomposition",
        subcaseTitle: "3. Recursive Problem Decomposition (Divide into Subproblems)",
        algorithmId: "bubble_sort",
        topology: "two_sequences",
        pointerRoles: { sub1: "First decomposed subproblem", sub2: "Second decomposed subproblem", combine: "Merge logic" },
        coreMechanism: "Express solution to problem of size n in terms of smaller identical subproblems: Divide -> Conquer subproblems recursively -> Combine results (Merge Sort, Binary Tree Height, Towers of Hanoi).",
        visualSummary: "solve(n) = combine(solve(n/2), solve(n/2))",
        classicProblems: [
          { title: "912. Sort an Array (Merge Sort)", difficulty: "Medium" },
          { title: "241. Different Ways to Add Parentheses", difficulty: "Medium" },
          { title: "101. Symmetric Tree", difficulty: "Easy" }
        ],
        timeComplexity: "Master Theorem: T(n) = aT(n/b) + f(n)",
        spaceComplexity: "O(log n) to O(n) depth"
      },
      {
        id: "recursion_vs_iteration",
        subcaseTitle: "4. Recursion vs Iteration (Call Stack vs Explicit Stack/Loops)",
        algorithmId: "reverse_linked_list",
        topology: "read_write",
        pointerRoles: { explicitStack: "Emulated stack on heap", loopVar: "State tracking counter" },
        coreMechanism: "Any recursive algorithm can be converted to iterative form using a loop or an explicit heap stack. Eliminates risk of stack overflow (Python default limit 1000 frames) and avoids function call overhead.",
        visualSummary: "recursion: dfs(root) vs iteration: while stack: node = stack.pop()",
        classicProblems: [
          { title: "206. Reverse Linked List (Iterative vs Recursive)", difficulty: "Easy" },
          { title: "94. Binary Tree Inorder Traversal", difficulty: "Easy" },
          { title: "144. Binary Tree Preorder Traversal", difficulty: "Easy" }
        ],
        timeComplexity: "Equivalent time complexity O(n)",
        spaceComplexity: "Iterative: O(1) or explicit heap O(h) vs OS call stack O(h)"
      }
    ]
  },

  // ==========================================================================
  // 11. BACKTRACKING & COMBINATORIAL SEARCH
  // ==========================================================================
  {
    id: "backtracking",
    name: "Backtracking & Combinatorial Search",
    tier: "tier1_core",
    category: "backtracking",
    description:
      "Exploration of combinatorial state spaces with Choose -> Explore -> Undo (backtrack) and early constraint pruning.",
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
      },
      {
        id: "backtrack_permutations",
        subcaseTitle: "3. Permutations (Visited-Tracking / Swap-Based)",
        algorithmId: "backtracking_subsets",
        topology: "backtrack_permutations",
        pointerRoles: { used: "Boolean visited array", current: "Partial permutation state" },
        coreMechanism: "For each position, iterate over all unused elements. Mark used[i] = True before recursing, reset to False on backtrack. Generates n! permutations.",
        visualSummary: "for i: if not used[i]: choose -> recurse -> undo",
        classicProblems: [
          { title: "46. Permutations", difficulty: "Medium" },
          { title: "47. Permutations II (Duplicates)", difficulty: "Medium" },
          { title: "60. Permutation Sequence", difficulty: "Hard" }
        ],
        timeComplexity: "O(n * n!)",
        spaceComplexity: "O(n)"
      },
      {
        id: "backtrack_constraint",
        subcaseTitle: "4. Constraint-Based Search (N-Queens / Sudoku)",
        algorithmId: "backtracking_combination_sum",
        topology: "backtrack_constraint",
        pointerRoles: { row: "Current row being placed", cols: "Set of used columns", diag1: "Used / diagonals", diag2: "Used \\ diagonals" },
        coreMechanism: "At each position, check all constraints before placing. If valid, recurse. On return, undo placement. Early pruning via constraint sets eliminates invalid subtrees immediately.",
        visualSummary: "if valid(row, col): place -> recurse -> remove",
        classicProblems: [
          { title: "51. N-Queens", difficulty: "Hard" },
          { title: "52. N-Queens II", difficulty: "Hard" },
          { title: "37. Sudoku Solver", difficulty: "Hard" }
        ],
        timeComplexity: "O(n!)",
        spaceComplexity: "O(n)"
      }
    ]
  },


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
        algorithmId: "invert_binary_tree",
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
      },
      {
        id: "tree_traversals",
        subcaseTitle: "3. DFS Traversals (Pre / In / Post Order)",
        algorithmId: "tree_dfs_traversals",
        topology: "tree_dfs",
        pointerRoles: { node: "Current tree node", left: "Left subtree", right: "Right subtree" },
        coreMechanism: "Preorder: root-left-right (copy, serialize). Inorder: left-root-right (BST sorted order). Postorder: left-right-root (delete, evaluate). All O(n) time.",
        visualSummary: "pre: root->L->R | in: L->root->R | post: L->R->root",
        classicProblems: [
          { title: "94. Binary Tree Inorder Traversal", difficulty: "Easy" },
          { title: "144. Binary Tree Preorder Traversal", difficulty: "Easy" },
          { title: "145. Binary Tree Postorder Traversal", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: "tree_level_order",
        subcaseTitle: "4. Level-Order BFS (Right-Side View / Level Views)",
        algorithmId: "bfs_traversal",
        topology: "tree_bfs",
        pointerRoles: { queue: "Current level's nodes", level: "Level index for grouping" },
        coreMechanism: "Use a queue. Process all nodes at the current level (queue size) before pushing their children. The last node processed at each level is visible from the right.",
        visualSummary: "for _ in range(len(queue)): process level -> next level",
        classicProblems: [
          { title: "102. Binary Tree Level Order Traversal", difficulty: "Medium" },
          { title: "199. Binary Tree Right Side View", difficulty: "Medium" },
          { title: "637. Average of Levels in Binary Tree", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "tree_path_sum",
        subcaseTitle: "5. Path-Based Problems (Root-to-Leaf Path Sum)",
        algorithmId: "invert_binary_tree",
        topology: "tree_path_sum",
        pointerRoles: { curr: "Active node", remaining: "Target - path sum so far", path: "Accumulated path list" },
        coreMechanism: "DFS with running sum: subtract node.val from target. At a leaf, check if remaining == 0. Backtrack path list on return. For max path sum, return max(left, right) + node.val.",
        visualSummary: "remain - node.val == 0 at leaf? -> valid path",
        classicProblems: [
          { title: "112. Path Sum", difficulty: "Easy" },
          { title: "113. Path Sum II", difficulty: "Medium" },
          { title: "124. Binary Tree Maximum Path Sum", difficulty: "Hard" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: "tree_lca",
        subcaseTitle: "6. Lowest Common Ancestor (General Binary Tree)",
        algorithmId: "invert_binary_tree",
        topology: "tree_lca",
        pointerRoles: { left: "LCA result from left subtree", right: "LCA result from right subtree", node: "Current node" },
        coreMechanism: "Recursive postorder: if node == p or q, return node. If left and right both non-null, current node is LCA. Else propagate the non-null result upward.",
        visualSummary: "both sides found p,q -> node is LCA; else propagate",
        classicProblems: [
          { title: "236. Lowest Common Ancestor of a Binary Tree", difficulty: "Medium" },
          { title: "1644. LCA of Binary Tree II", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: "tree_construct",
        subcaseTitle: "7. Constructing Tree from Traversal Arrays",
        algorithmId: "invert_binary_tree",
        topology: "tree_dfs",
        pointerRoles: { preIdx: "Current preorder root index", inLeft: "Inorder left bound", inRight: "Inorder right bound" },
        coreMechanism: "Preorder[0] is always the root. Find root in inorder to split into left/right subtrees. Recurse with adjusted bounds. HashMap maps inorder values to indices for O(1) lookup.",
        visualSummary: "pre[0]=root; split inorder at root -> recurse L and R",
        classicProblems: [
          { title: "105. Construct Binary Tree from Preorder and Inorder", difficulty: "Medium" },
          { title: "106. Construct Binary Tree from Inorder and Postorder", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "bst_kth_smallest",
        subcaseTitle: "8. Kth Smallest / Largest in BST (Inorder Property)",
        algorithmId: "bst_search",
        topology: "tree_dfs",
        pointerRoles: { inorderCount: "Nodes visited so far in inorder", k: "Target rank" },
        coreMechanism: "BST inorder traversal yields nodes in ascending order. Stop at the k-th node visited. For kth largest: reverse inorder (right-root-left) or count from n-k+1.",
        visualSummary: "inorder[k-1] = kth smallest; count to k then stop",
        classicProblems: [
          { title: "230. Kth Smallest Element in a BST", difficulty: "Medium" },
          { title: "538. Convert BST to Greater Tree", difficulty: "Medium" }
        ],
        timeComplexity: "O(h + k)",
        spaceComplexity: "O(h)"
      },
      {
        id: "tree_recursion_properties",
        subcaseTitle: "9. Tree Recursion Properties (Height, Diameter & Balance Check)",
        algorithmId: "invert_binary_tree",
        topology: "tree_reduction",
        pointerRoles: { node: "Active subtree root", leftH: "Left subtree height", rightH: "Right subtree height", maxDiameter: "Global path tracker" },
        coreMechanism: "Height = 1 + max(leftH, rightH). Balanced if |leftH - rightH| <= 1 for all nodes (return -1 early on imbalance). Diameter through node = leftH + rightH; maximize across all nodes via bottom-up postorder traversal.",
        visualSummary: "height = 1 + max(L, R); diameter = max(maxDiameter, L + R)",
        classicProblems: [
          { title: "104. Maximum Depth of Binary Tree", difficulty: "Easy" },
          { title: "543. Diameter of Binary Tree", difficulty: "Easy" },
          { title: "110. Balanced Binary Tree", difficulty: "Easy" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: "bst_validate",
        subcaseTitle: "10. Validate BST (Range-Based Invariant Validation)",
        algorithmId: "bst_search",
        topology: "tree_dfs",
        pointerRoles: { node: "Current subtree node", low: "Strict lower bound (-inf)", high: "Strict upper bound (+inf)" },
        coreMechanism: "A node is valid BST node iff low < node.val < high. When recursing left: high becomes node.val. When recursing right: low becomes node.val. Initial bounds: (-inf, +inf). Inorder strictly increasing check is an alternative O(n) method.",
        visualSummary: "low < node.val < high; recurse(L, low, val) & recurse(R, val, high)",
        classicProblems: [
          { title: "98. Validate Binary Search Tree", difficulty: "Medium" },
          { title: "501. Find Mode in Binary Search Tree", difficulty: "Easy" },
          { title: "99. Recover Binary Search Tree", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)"
      },
      {
        id: "bst_insert_delete",
        subcaseTitle: "11. BST Insertion & Deletion (0, 1, or 2 Children Cases)",
        algorithmId: "bst_search",
        topology: "tree_dfs",
        pointerRoles: { curr: "Node under evaluation", successor: "Inorder successor (min in right subtree)" },
        coreMechanism: "Insert: search down until null, link new node in O(h). Delete: Case 1 (leaf): delete directly. Case 2 (1 child): replace node with child. Case 3 (2 children): replace node value with inorder successor (min of right subtree), then delete successor recursively.",
        visualSummary: "2 children delete: node.val = successor.val; delete(node.right, successor.val)",
        classicProblems: [
          { title: "701. Insert into a Binary Search Tree", difficulty: "Medium" },
          { title: "450. Delete Node in a BST", difficulty: "Medium" },
          { title: "235. Lowest Common Ancestor of a BST", difficulty: "Medium" }
        ],
        timeComplexity: "O(h) average, O(n) worst on skewed tree",
        spaceComplexity: "O(h)"
      }
    ]
  },

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
      },
      {
        id: "heap_top_k",
        subcaseTitle: "2. Top-K Pattern (Fixed-Size Min-Heap of Size K)",
        algorithmId: "min_heap",
        topology: "heap_top_k",
        pointerRoles: { heap: "Min-heap of size K", incoming: "Stream element under review" },
        coreMechanism: "To find K largest elements: maintain a min-heap of size K. For each element x: if x > heap[0], pop and push x. At the end, heap contains the K largest elements in O(n log k) time and O(k) space, avoiding O(n log n) total sort.",
        visualSummary: "size < k ? push(x) : if x > min: heappushpop(heap, x)",
        classicProblems: [
          { title: "215. Kth Largest Element in an Array", difficulty: "Medium" },
          { title: "347. Top K Frequent Elements", difficulty: "Medium" },
          { title: "973. K Closest Points to Origin", difficulty: "Medium" }
        ],
        timeComplexity: "O(n log k)",
        spaceComplexity: "O(k)"
      },
      {
        id: "heap_streaming_median",
        subcaseTitle: "3. Heap with Streaming Data (Two-Heap Running Median)",
        algorithmId: "min_heap",
        topology: "heap_two_heaps",
        pointerRoles: { maxHeapLower: "Max-heap storing lower half", minHeapUpper: "Min-heap storing upper half" },
        coreMechanism: "Balance numbers into two halves: maxHeap for lower half (roots largest among smalls) and minHeap for upper half (roots smallest among bigs). Size difference <= 1. Median is either top of larger heap or average of both tops in O(1). Insert is O(log n).",
        visualSummary: "max_heap [lower half] <= median <= min_heap [upper half]",
        classicProblems: [
          { title: "295. Find Median from Data Stream", difficulty: "Hard" },
          { title: "480. Sliding Window Median", difficulty: "Hard" }
        ],
        timeComplexity: "O(log n) addNum, O(1) findMedian",
        spaceComplexity: "O(n)"
      },
      {
        id: "heap_k_way_merge",
        subcaseTitle: "4. Merging Sorted Structures with a Heap (K-Way Merge Pattern)",
        algorithmId: "min_heap",
        topology: "heap_top_k",
        pointerRoles: { heap: "Min-heap of size K with tuples (val, listIdx, elemIdx)", headNode: "Next smallest element" },
        coreMechanism: "Insert first element from each of the K sorted lists into min-heap. Pop minimum root, append to output, and push the next element from that list into the heap. Guarantees overall sorted order in O(N log K) where N is total elements.",
        visualSummary: "pop min (val, i, j) -> append val -> push (list[i][j+1], i, j+1)",
        classicProblems: [
          { title: "23. Merge k Sorted Lists", difficulty: "Hard" },
          { title: "378. Kth Smallest Element in a Sorted Matrix", difficulty: "Medium" },
          { title: "373. Find K Pairs with Smallest Sums", difficulty: "Medium" }
        ],
        timeComplexity: "O(N log K)",
        spaceComplexity: "O(K)"
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
      },
      {
        id: "greedy_activity_scheduling",
        subcaseTitle: "2. Activity / Interval Scheduling (Earliest End Time)",
        algorithmId: "merge_intervals",
        topology: "greedy_intervals",
        pointerRoles: { lastEnd: "End time of last selected activity", current: "Candidate interval" },
        coreMechanism: "Sort by end time. Greedily pick the activity with the earliest finish that doesn't conflict with the last selected. This maximizes the number of non-overlapping activities.",
        visualSummary: "sort by end; if curr.start >= last_end: pick, update last_end",
        classicProblems: [
          { title: "435. Non-overlapping Intervals", difficulty: "Medium" },
          { title: "452. Minimum Number of Arrows to Burst Balloons", difficulty: "Medium" },
          { title: "646. Maximum Length of Pair Chain", difficulty: "Medium" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "greedy_resource",
        subcaseTitle: "3. Resource Minimization (Gas Station / Circular)",
        algorithmId: "greedy_jump_game",
        topology: "greedy_jump",
        pointerRoles: { start: "Candidate starting station", tank: "Running fuel sum", total: "Global fuel feasibility" },
        coreMechanism: "Track cumulative gas gain. If tank < 0, current start is infeasible; reset start to next station and reset tank. If total_gain >= 0, a solution exists.",
        visualSummary: "if tank < 0: start = i+1, reset tank; total >= 0 -> solution",
        classicProblems: [
          { title: "134. Gas Station", difficulty: "Medium" },
          { title: "330. Patching Array", difficulty: "Hard" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "greedy_sort_first",
        subcaseTitle: "4. Sorting + Greedy (Sort First, then Make Greedy Picks)",
        algorithmId: "merge_intervals",
        topology: "greedy_intervals",
        pointerRoles: { sortedCandidate: "Ordered items by critical ratio/cost", chosenAcc: "Greedy selection set" },
        coreMechanism: "Greedy Choice Property justification: sort inputs along a crucial dimension (e.g. deadline, size, end time). Processing items in this sorted order guarantees that the locally optimal pick at each step is globally optimal, eliminating search backtracks.",
        visualSummary: "sort(items) -> greedily take if feasible -> global optimum",
        classicProblems: [
          { title: "455. Assign Cookies", difficulty: "Easy" },
          { title: "406. Queue Reconstruction by Height", difficulty: "Medium" },
          { title: "135. Candy", difficulty: "Hard" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1) or O(n)"
      }
    ]
  },

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
      },
      {
        id: "intervals_insert",
        subcaseTitle: "2. Insert Interval into Sorted List",
        algorithmId: "merge_intervals",
        topology: "intervals_merge",
        pointerRoles: { newInterval: "Interval to insert", i: "Scan pointer over existing intervals" },
        coreMechanism: "Collect all intervals ending before newInterval starts. Merge all overlapping intervals into newInterval. Collect all intervals starting after newInterval ends.",
        visualSummary: "left non-overlap | merge overlaps | right non-overlap",
        classicProblems: [
          { title: "57. Insert Interval", difficulty: "Medium" },
          { title: "986. Interval List Intersections", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      },
      {
        id: "intervals_non_overlapping",
        subcaseTitle: "3. Non-Overlapping Intervals (Minimum Removals)",
        algorithmId: "merge_intervals",
        topology: "greedy_intervals",
        pointerRoles: { lastEnd: "End time of last kept interval", count: "Number of removals" },
        coreMechanism: "Sort by end time. For each interval, if start < lastEnd it overlaps — remove it (increment count). Else keep it and update lastEnd. Minimizes total removals.",
        visualSummary: "sort by end; if overlap: remove (count++); else keep",
        classicProblems: [
          { title: "435. Non-overlapping Intervals", difficulty: "Medium" },
          { title: "452. Minimum Number of Arrows to Burst Balloons", difficulty: "Medium" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "intervals_sweep_line",
        subcaseTitle: "4. Sweep-Line / Event-Based Processing",
        algorithmId: "merge_intervals",
        topology: "sweep_line",
        pointerRoles: { events: "Sorted start/end event list", active: "Count of active intervals" },
        coreMechanism: "Decompose intervals into +1 (start) and -1 (end) events. Sort events by time. Sweep left-to-right, tracking active count. Peak active count = max simultaneous overlap.",
        visualSummary: "+1 at start, -1 at end; sort; sweep -> max(active)",
        classicProblems: [
          { title: "253. Meeting Rooms II", difficulty: "Medium" },
          { title: "1094. Car Pooling", difficulty: "Medium" },
          { title: "218. The Skyline Problem", difficulty: "Hard" }
        ],
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
      }
    ]
  },

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
      },
      {
        id: "graph_dfs",
        subcaseTitle: "3. DFS (Connected Components & Recursive/Iterative)",
        algorithmId: "graph_dfs_traversal",
        topology: "graph_dfs",
        pointerRoles: { stack: "Explicit stack or call stack", visited: "Processed set" },
        coreMechanism: "Explore as deep as possible before backtracking. Recursive: dfs(node) visits node, marks visited, recurses on unvisited neighbors. Iterative: use explicit stack. Counts connected components.",
        visualSummary: "visit -> mark -> recurse on unvisited neighbors -> backtrack",
        classicProblems: [
          { title: "200. Number of Islands", difficulty: "Medium" },
          { title: "547. Number of Provinces", difficulty: "Medium" },
          { title: "323. Number of Connected Components", difficulty: "Medium" }
        ],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)"
      },
      {
        id: "graph_cycle",
        subcaseTitle: "4. Cycle Detection (Directed & Undirected)",
        algorithmId: "graph_dfs_traversal",
        topology: "graph_dfs",
        pointerRoles: { color: "WHITE/GRAY/BLACK (or in_stack boolean)", parent: "Previous node (undirected)" },
        coreMechanism: "Directed: 3-color DFS — if a GRAY (in-stack) node is revisited, a cycle exists. Undirected: if a visited neighbor is not the parent, cycle found. BFS: topological sort — if processed < V, cycle.",
        visualSummary: "directed: revisit GRAY = cycle; undirected: visited != parent",
        classicProblems: [
          { title: "207. Course Schedule", difficulty: "Medium" },
          { title: "802. Find Eventual Safe States", difficulty: "Medium" },
          { title: "684. Redundant Connection", difficulty: "Medium" }
        ],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)"
      },
      {
        id: "graph_grid",
        subcaseTitle: "5. Grid as Graph (Flood Fill / Island Problems)",
        algorithmId: "bfs_traversal",
        topology: "graph_bfs",
        pointerRoles: { r: "Row index", c: "Column index", dirs: "4-directional neighbors [(0,1),(0,-1),(1,0),(-1,0)]" },
        coreMechanism: "Treat each cell as a node with edges to its 4 (or 8) neighbors. BFS/DFS from unvisited land cells to explore connected components. Mark visited in-place or with a set.",
        visualSummary: "for dr,dc in dirs: if valid(nr,nc) and not visited: explore",
        classicProblems: [
          { title: "200. Number of Islands", difficulty: "Medium" },
          { title: "733. Flood Fill", difficulty: "Easy" },
          { title: "695. Max Area of Island", difficulty: "Medium" }
        ],
        timeComplexity: "O(m * n)",
        spaceComplexity: "O(m * n)"
      },
      {
        id: "graph_bipartite",
        subcaseTitle: "6. Bipartite Graph Check (2-Coloring)",
        algorithmId: "bfs_traversal",
        topology: "graph_bipartite",
        pointerRoles: { color: "0 or 1 assigned to each node", queue: "BFS frontier" },
        coreMechanism: "BFS/DFS coloring: assign color 0 to start, color 1 to its neighbors. If a neighbor already has the same color, the graph is NOT bipartite. Bipartite iff no odd-length cycles.",
        visualSummary: "color[node] = 0; neighbors get 1; conflict = not bipartite",
        classicProblems: [
          { title: "785. Is Graph Bipartite?", difficulty: "Medium" },
          { title: "886. Possible Bipartition", difficulty: "Medium" }
        ],
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)"
      },
      {
        id: "graph_representations",
        subcaseTitle: "7. Graph Representations (Adjacency List vs Matrix & Weights)",
        algorithmId: "bfs_traversal",
        topology: "graph_bfs",
        pointerRoles: { adjList: "Map: u -> list of (v, weight)", matrix: "2D grid: matrix[u][v] = weight" },
        coreMechanism: "Adjacency List uses O(V + E) memory and iterates incident edges in O(degree(u)); ideal for sparse graphs. Adjacency Matrix uses O(V²) memory and queries edge existence in O(1); ideal for dense graphs. Directed graphs maintain asymmetric edges; undirected duplicate edges in both directions.",
        visualSummary: "List: u -> [(v1, w1), (v2, w2)] vs Matrix: grid[u][v] = weight",
        classicProblems: [
          { title: "133. Clone Graph", difficulty: "Medium" },
          { title: "841. Keys and Rooms", difficulty: "Medium" },
          { title: "1791. Find Center of Star Graph", difficulty: "Easy" }
        ],
        timeComplexity: "List: O(V + E) traversal; Matrix: O(V²)",
        spaceComplexity: "List: O(V + E); Matrix: O(V²)"
      }
    ]
  },

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
      },
      {
        id: "dp_1d_linear",
        subcaseTitle: "4. 1D DP (Fibonacci / Climbing Stairs Style)",
        algorithmId: "unique_paths",
        topology: "dp_1d",
        pointerRoles: { i: "Current state index", prev: "dp[i-1]", prevprev: "dp[i-2]" },
        coreMechanism: "dp[i] = dp[i-1] + dp[i-2] (or similar linear recurrence). Base cases: dp[0]=1, dp[1]=1. Can optimize to O(1) space by keeping only prev two values.",
        visualSummary: "dp[i] = dp[i-1] + dp[i-2]; only keep last 2 values",
        classicProblems: [
          { title: "70. Climbing Stairs", difficulty: "Easy" },
          { title: "746. Min Cost Climbing Stairs", difficulty: "Easy" },
          { title: "198. House Robber", difficulty: "Medium" }
        ],
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      },
      {
        id: "dp_partition",
        subcaseTitle: "5. Partition DP (Splitting Sequence into Optimal Parts)",
        algorithmId: "unique_paths",
        topology: "dp_1d",
        pointerRoles: { i: "End of partition", j: "Split point within [0..i]", cost: "Partition cost function" },
        coreMechanism: "dp[i] = min over all valid split points j of (dp[j] + cost(j..i)). Each state tries all possible last-segment boundaries. Common in word break, palindrome partitioning, and rod cutting.",
        visualSummary: "dp[i] = min(dp[j] + cost(j..i)) for all valid j",
        classicProblems: [
          { title: "139. Word Break", difficulty: "Medium" },
          { title: "132. Palindrome Partitioning II", difficulty: "Hard" },
          { title: "279. Perfect Squares", difficulty: "Medium" }
        ],
        timeComplexity: "O(n²)",
        spaceComplexity: "O(n)"
      }
    ]
  },

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
      },
      {
        id: "trie_word_search",
        subcaseTitle: "2. Trie-Based Word Problems (Autocomplete & Word Search II)",
        algorithmId: "trie_prefix_tree",
        topology: "trie_prefix",
        pointerRoles: { currTrieNode: "Branching character path", boardR: "Grid row", boardC: "Grid col" },
        coreMechanism: "Prune grid/matrix DFS backtracking by checking prefix existence in the Trie. If current path is not in Trie, backtrack immediately without searching deeper. Also powers autocomplete by searching subtree leaves from a prefix node.",
        visualSummary: "grid DFS guided by trieNode.children[c]; prune on null",
        classicProblems: [
          { title: "212. Word Search II", difficulty: "Hard" },
          { title: "211. Design Add and Search Words Data Structure", difficulty: "Medium" },
          { title: "1268. Search Suggestions System", difficulty: "Medium" }
        ],
        timeComplexity: "O(M * N * 4^L) with aggressive Trie pruning",
        spaceComplexity: "O(total words * L)"
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
        subcaseTitle: "2. Brian Kernighan (Set-Bit Counting & Power of Two)",
        algorithmId: "bit_manipulation_kernighan",
        topology: "bit_kernighan",
        pointerRoles: { n: "Active integer", count: "Number of 1s" },
        coreMechanism: "n & (n - 1) clears the rightmost set bit in a single step. Power-of-two check: (n > 0) && (n & (n - 1)) == 0. Iterates only as many times as there are 1-bits.",
        visualSummary: "n &= (n - 1) clears lowest 1-bit; power of 2: n & (n - 1) == 0",
        classicProblems: [
          { title: "191. Number of 1 Bits", difficulty: "Easy" },
          { title: "231. Power of Two", difficulty: "Easy" },
          { title: "338. Counting Bits", difficulty: "Easy" }
        ],
        timeComplexity: "O(k) where k = number of 1s",
        spaceComplexity: "O(1)"
      },
      {
        id: "bit_mask_ops",
        subcaseTitle: "3. Bitmask Operations (Set, Check, Clear, Toggle & State)",
        algorithmId: "bit_manipulation_kernighan",
        topology: "bit_kernighan",
        pointerRoles: { mask: "Bit pattern", bitIdx: "Target bit position (1 << i)" },
        coreMechanism: "Check: (mask >> i) & 1. Set: mask | (1 << i). Clear: mask & ~(1 << i). Toggle: mask ^ (1 << i). Represent subsets of size n <= 30 using a single integer; test inclusion in O(1).",
        visualSummary: "check: mask & (1<<i) | set: mask | (1<<i) | clear: mask & ~(1<<i)",
        classicProblems: [
          { title: "190. Reverse Bits", difficulty: "Easy" },
          { title: "78. Subsets (Bitmask Approach)", difficulty: "Medium" },
          { title: "847. Shortest Path Visiting All Nodes", difficulty: "Hard" }
        ],
        timeComplexity: "O(1) bitwise operations",
        spaceComplexity: "O(1)"
      }
    ]
  },

  // ==========================================================================
  // 20. COMPLEXITY ANALYSIS
  // ==========================================================================
  {
    id: "complexity",
    name: "Complexity Analysis & Data Structure Costs",
    tier: "tier1_core",
    category: "complexity",
    description:
      "Asymptotic time and space complexity classes, amortized analysis, call stack budgeting, and native Python collection operation costs.",
    badgeColor: "badge-indigo",
    iconName: "Clock",
    defaultSubcaseId: "complexity_time_classes",
    structureType: "array",
    subcases: [
      {
        id: "complexity_time_classes",
        subcaseTitle: "1. Time Complexity Classes (O(1) through O(n!))",
        algorithmId: "binary_search",
        topology: "complexity_analysis",
        pointerRoles: { n: "Input size magnitude", growthRate: "Order of asymptotic growth" },
        coreMechanism: "Hierarchy: O(1) Constant < O(log n) Logarithmic < O(n) Linear < O(n log n) Linearithmic < O(n²) Quadratic < O(2ⁿ) Exponential < O(n!) Factorial. Rule of thumb for LeetCode (10^7 operations/sec): n <= 12 -> O(n!); n <= 25 -> O(2ⁿ); n <= 10^3 -> O(n²); n <= 10^5 -> O(n log n); n <= 10^7 -> O(n).",
        visualSummary: "O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)",
        classicProblems: [
          { title: "704. Binary Search (O(log n))", difficulty: "Easy" },
          { title: "912. Sort an Array (O(n log n))", difficulty: "Medium" },
          { title: "46. Permutations (O(n!))", difficulty: "Medium" }
        ],
        timeComplexity: "Theoretical Asymptotic Upper Bound O(f(n))",
        spaceComplexity: "Memory Consumption Class O(g(n))"
      },
      {
        id: "complexity_space",
        subcaseTitle: "2. Space Complexity (Auxiliary Space vs Input & Call Stack)",
        algorithmId: "reverse_linked_list",
        topology: "complexity_analysis",
        pointerRoles: { heapMemory: "Explicit allocated data structures", stackFrames: "Recursion depth memory" },
        coreMechanism: "Space complexity includes Auxiliary Space (allocated hash tables, lists, matrices) PLUS Call Stack Space (depth of recursion tree frames). Input space is typically excluded unless modified. In-place algorithms achieve O(1) auxiliary space.",
        visualSummary: "Total Space = Auxiliary Data Structures + Call Stack Frames",
        classicProblems: [
          { title: "206. Reverse Linked List (O(1) iterative vs O(n) recursive)", difficulty: "Easy" },
          { title: "104. Maximum Depth of Binary Tree (O(h) call stack)", difficulty: "Easy" },
          { title: "78. Subsets (O(n * 2^n) output space)", difficulty: "Medium" }
        ],
        timeComplexity: "O(1) to O(2ⁿ)",
        spaceComplexity: "Auxiliary + Call Stack analysis"
      },
      {
        id: "complexity_cases_amortized",
        subcaseTitle: "3. Best / Average / Worst Case & Amortized Analysis",
        algorithmId: "bubble_sort",
        topology: "complexity_analysis",
        pointerRoles: { worstCase: "Adversarial input trigger", amortized: "Average cost across sequence" },
        coreMechanism: "Best case (e.g. sorted input for Insertion Sort: O(n)). Worst case (e.g. Quicksort with bad pivot: O(n²)). Amortized analysis: cost averaged over a sequence of N operations. Example: dynamic array doubling costs O(N) once, but amortizes to O(1) per append.",
        visualSummary: "Amortized Cost: (sum of costs across k operations) / k = O(1)",
        classicProblems: [
          { title: "912. Sort an Array (Quick Sort avg O(n log n), worst O(n²))", difficulty: "Medium" },
          { title: "232. Implement Queue using Stacks (Amortized O(1) pop)", difficulty: "Easy" },
          { title: "146. LRU Cache (Strict O(1) per get/put)", difficulty: "Medium" }
        ],
        timeComplexity: "O(1) amortized vs O(n) worst spike",
        spaceComplexity: "O(1) to O(n)"
      },
      {
        id: "complexity_python_collections",
        subcaseTitle: "4. Complexity of Python Collections (list, dict, set, deque, heapq)",
        algorithmId: "hash_table_two_sum",
        topology: "complexity_analysis",
        pointerRoles: { listCost: "O(1) append/pop, O(n) insert/pop(0)", dictSetCost: "O(1) avg in/get/add, O(n) worst hash collision", dequeCost: "O(1) append/popleft", heapqCost: "O(log n) heappush/heappop, O(1) heap[0]" },
        coreMechanism: "List: index O(1), append O(1) amortized, insert(0)/pop(0) O(n). Deque: append/popleft O(1). Dict/Set: lookup/insert/delete O(1) avg, O(n) worst. Heapq: heappush/heappop O(log n), peek heap[0] O(1), heapify O(n). Strings: concatenation s += c is O(n²); use ''.join(list) for O(n).",
        visualSummary: "dict/set: O(1) | deque: O(1) ends | list: O(n) front | heapq: O(log n)",
        classicProblems: [
          { title: "1. Two Sum (dict lookup O(1))", difficulty: "Easy" },
          { title: "239. Sliding Window Maximum (deque O(1))", difficulty: "Hard" },
          { title: "215. Kth Largest Element (heapq O(n log k))", difficulty: "Medium" }
        ],
        timeComplexity: "Exact per-operation lookup reference",
        spaceComplexity: "Collection overhead and memory models"
      }
    ]
  },

  // ==========================================================================
  // 21. FINAL PATTERN RECALL & RAPID REVISION
  // ==========================================================================
  {
    id: "recall",
    name: "Final Pattern Recall & Rapid Revision",
    tier: "tier1_core",
    category: "recall",
    description:
      "High-density cognitive triggers and recognition signals for instant pattern selection during interviews.",
    badgeColor: "badge-emerald",
    iconName: "Zap",
    defaultSubcaseId: "recall_linear_structures",
    structureType: "array",
    subcases: [
      {
        id: "recall_linear_structures",
        subcaseTitle: "1. Linear Structures Recall (Arrays, Hashing & Pointers)",
        algorithmId: "two_pointers_opposite_ends",
        topology: "pattern_recall",
        pointerRoles: { signal: "Problem phrasing trigger", pattern: "Target optimal pattern" },
        coreMechanism: "• 'Two elements sum to X' -> HashMap lookup or Two Pointers (if sorted)\n• 'Count frequencies / find duplicates' -> Frequency counting / HashSet\n• 'Subarray sum equals K / multiple of K' -> Prefix Sum + HashMap\n• 'Contiguous subarray with max/min condition' -> Sliding Window\n• 'In-place compaction / duplicate removal' -> Fast/Slow Read-Write pointers\n• 'Cycle detection / linked list middle' -> Floyd's Fast & Slow pointers.",
        visualSummary: "Sum to Target? -> Hash / Sorted Pointers | Subarray Sum K? -> Prefix+Map",
        classicProblems: [
          { title: "1. Two Sum (HashMap)", difficulty: "Easy" },
          { title: "560. Subarray Sum Equals K (Prefix + Map)", difficulty: "Medium" },
          { title: "3. Longest Substring Without Repeating (Sliding Window)", difficulty: "Medium" }
        ],
        timeComplexity: "O(n) typical goal",
        spaceComplexity: "O(1) to O(n)"
      },
      {
        id: "recall_sorting_searching",
        subcaseTitle: "2. Search, Ordering & Monotonicity Recall (Binary Search & Stacks)",
        algorithmId: "binary_search",
        topology: "pattern_recall",
        pointerRoles: { monotonicity: "Sorting or monotonic predicate indicator", stackSignal: "Next greater or histogram shape" },
        coreMechanism: "• 'Sorted array search / find inflection' -> Binary Search / Rotated BS\n• 'Minimize the maximum / maximize the minimum' -> Binary Search on Answer Space\n• 'Next greater element / daily temperatures' -> Monotonic Decreasing Stack\n• 'Largest rectangle / histogram / stock spans' -> Monotonic Stack\n• 'Parentheses matching / nested structures' -> LIFO Stack\n• 'Sort and greedily pick' -> Sorting + Greedy.",
        visualSummary: "Minimax answer? -> BS on Answer | Next Greater? -> Monotonic Stack",
        classicProblems: [
          { title: "875. Koko Eating Bananas (BS on Answer)", difficulty: "Medium" },
          { title: "739. Daily Temperatures (Monotonic Stack)", difficulty: "Medium" },
          { title: "20. Valid Parentheses (LIFO Stack)", difficulty: "Easy" }
        ],
        timeComplexity: "O(log n) or O(n)",
        spaceComplexity: "O(1) to O(n)"
      },
      {
        id: "recall_trees_graphs_dp",
        subcaseTitle: "3. Non-Linear & State Space Recall (Trees, Graphs & DP)",
        algorithmId: "bfs_traversal",
        topology: "pattern_recall",
        pointerRoles: { graphSignal: "Connectivity / shortest path", dpSignal: "Optimal substructure & overlapping subproblems" },
        coreMechanism: "• 'Shortest path in unweighted graph / level order' -> BFS with queue\n• 'Shortest path with non-negative weights' -> Dijkstra with min-heap\n• 'Connected components / cycle in undirected' -> Union-Find (DSU) or DFS\n• 'Prerequisite dependencies / topological order' -> Kahn's algorithm (indegree BFS)\n• 'Top-K frequent / running median' -> Heap / Two-Heaps\n• 'All combinations / permutations / constraint search' -> Backtracking with pruning\n• 'Count total ways / maximize profit with overlapping subproblems' -> DP (1D, 2D grid, or Knapsack).",
        visualSummary: "Unweighted Shortest Path -> BFS | Weighted -> Dijkstra | Subsets -> Backtrack | Ways -> DP",
        classicProblems: [
          { title: "200. Number of Islands (BFS/DFS)", difficulty: "Medium" },
          { title: "207. Course Schedule (Topological Sort)", difficulty: "Medium" },
          { title: "1143. Longest Common Subsequence (DP)", difficulty: "Medium" }
        ],
        timeComplexity: "O(V + E) graphs, O(m * n) DP",
        spaceComplexity: "O(V) graphs, O(m * n) DP"
      }
    ]
  }
];
