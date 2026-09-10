import { AlgorithmCategory, SupportedLanguage } from "./algorithm";
import { StructureType } from "./trace";

export type PatternMasteryTier = "tier1_core" | "tier2_advanced" | "tier3_competitive";

export type PointerTopology =
  // Two Pointers
  | "opposite_ends"           // left = 0, right = n - 1 (converging)
  | "both_at_end"              // p1 = m - 1, p2 = n - 1, write = m + n - 1 (backward)
  | "one_fixed_two_shifting"   // outer i fixed, left & right converging
  | "fast_slow"               // slow = 1x, fast = 2x
  | "read_write"              // read scans ahead, write anchors placement
  | "two_sequences"           // p1 on arr1, p2 on arr2
  | "partition_dnf"           // low, mid, high 3-way partition
  // Sliding Window
  | "sliding_fixed"           // [start ... end] size k
  | "sliding_dynamic"         // [left ... right] dynamic expand/shrink
  | "monotonic_deque"         // window with monotonic indices
  // Searching
  | "binary_search_exact"     // standard left, mid, right
  | "binary_search_boundary"  // lower/upper bound first/last occurrence
  | "binary_search_rotated"   // pivot inflection
  | "binary_search_answer"    // monotonic predicate on value range
  | "ternary_search"          // unimodal function
  // Arrays & Prefix
  | "prefix_1d"               // running prefix sum
  | "prefix_2d"               // 2D summed-area table
  | "prefix_hashmap"          // prefix sum + hashmap subarray sum k
  | "diff_array"              // range update delta
  | "cyclic_sort"             // index-as-hash cyclic placement
  // Hashing
  | "hash_table_lookup"       // complement lookup value -> index
  | "hash_frequency"          // frequency counting
  | "hash_consecutive"        // hashset boundary expansion
  | "hash_grouping"           // anagram / key signature grouping
  // Stacks & Queues
  | "stack_lifo"              // push/pop matching
  | "stack_monotonic_dec"     // next greater element
  | "stack_monotonic_inc"     // next smaller element
  | "queue_circular"          // circular buffer
  | "queue_fifo"              // standard FIFO BFS
  // Recursion & Backtracking
  | "backtrack_subsets"       // include/exclude decision tree
  | "backtrack_permutations"  // swap / visited recursion
  | "backtrack_combinations"  // target subtraction & pruning
  | "backtrack_constraint"    // N-Queens / Sudoku validation
  // Trees
  | "tree_dfs"                // pre/in/post order traversal
  | "tree_bfs"                // level order with queue
  | "tree_reduction"          // post-order invert/depth
  | "tree_lca"                // lowest common ancestor
  | "tree_path_sum"           // path sum tracking
  // Graphs & Topological Sort
  | "graph_bfs"               // unweighted shortest path
  | "graph_dfs"               // cycle & components
  | "graph_dijkstra"          // weighted priority queue
  | "graph_topo_kahn"         // in-degree Kahn's algorithm
  | "graph_dsu"               // union-find dynamic connectivity
  | "graph_mst_kruskal"       // Kruskal's MST
  | "graph_bipartite"         // 2-color BFS/DFS
  // Heaps & Greedy
  | "heap_sift"               // binary heap array sift
  | "heap_top_k"              // bounded heap of size k
  | "heap_two_heaps"          // continuous median max/min heaps
  | "greedy_jump"             // max horizon jump
  | "greedy_intervals"        // non-overlapping activity choice
  | "intervals_merge"         // sort by start and merge
  // Dynamic Programming
  | "dp_1d"                   // linear recurrence
  | "dp_2d_grid"              // table pathing
  | "dp_knapsack"             // 0/1 knapsack decision matrix
  | "dp_string_lcs"           // 2D string matching
  | "dp_lis"                  // longest increasing subsequence
  // Trie, Strings, & Bits
  | "trie_prefix"             // char node tree traversal
  | "bit_single_number"       // XOR cancellation
  | "bit_kernighan"           // n & (n - 1) bit clearing
  | "sweep_line";             // event points sweep

export interface SubcaseDefinition {
  id: string;
  subcaseTitle: string;
  algorithmId: string;
  topology: PointerTopology;
  pointerRoles: Record<string, string>;
  coreMechanism: string;
  visualSummary: string;
  classicProblems: {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    leetcodeUrl?: string;
  }[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface PatternCombination {
  id: string;
  name: string;
  primaryPattern: string;
  secondaryPattern: string;
  whyItWorks: string;
  recognitionSignals: string[];
  representativeProblems: {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
  exampleSnippet: string;
}

export interface PatternFamilyDefinition {
  id: string;
  name: string;
  tier: PatternMasteryTier;
  category: AlgorithmCategory;
  description: string;
  badgeColor: string;
  iconName: string;
  defaultSubcaseId: string;
  structureType: StructureType;
  subcases: SubcaseDefinition[];
}
