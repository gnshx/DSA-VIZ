// Algorithm, Language, and Problem types
import { StructureType, ExecutionTrace } from "./trace";

export type SupportedLanguage = "python" | "javascript" | "cpp" | "java";

export type AlgorithmCategory =
  | "arrays"
  | "hashing"
  | "two_pointers"
  | "sliding_window"
  | "searching"
  | "sorting"
  | "stack_queue"
  | "linked_list"
  | "recursion"
  | "backtracking"
  | "trees"
  | "heaps"
  | "greedy"
  | "intervals"
  | "graphs"
  | "topological_sort"
  | "union_find"
  | "shortest_paths"
  | "dp"
  | "trie"
  | "bit_manipulation"
  | "range_queries";

export interface CodeImplementation {
  code: string;
  lineMapping?: Record<number, number>; // maps step sourceLine to language-specific lines
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  category: AlgorithmCategory;
  patternFamily?: string;
  subPatternId?: string;
  structureType: StructureType;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  mentalModel: string[];
  invariants: string[];
  commonMistakes: string[];
  code: Record<SupportedLanguage, string>;
  generateTrace: (input?: any) => ExecutionTrace;
  defaultInput?: any;
}

export interface ProblemDefinition {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: AlgorithmCategory;
  statement: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  algorithmId: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  category: AlgorithmCategory;
  description: string;
  prerequisites: string[];
  relatedAlgorithms: string[];
  x?: number;
  y?: number;
  level: number;
}
