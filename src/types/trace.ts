// Universal Trace Protocol (Language-Agnostic Intermediate Representation)

export type EventType =
  | "LINE"
  | "COMPARE"
  | "SWAP"
  | "ASSIGN"
  | "READ"
  | "WRITE"
  | "POINTER_MOVE"
  | "PUSH"
  | "POP"
  | "CALL"
  | "RETURN"
  | "VISIT_NODE"
  | "HIGHLIGHT_RANGE"
  | "BRANCH"
  | "COMPLETE";

export type StructureType =
  | "array"
  | "stack"
  | "queue"
  | "linked_list"
  | "tree"
  | "graph"
  | "heap";

export interface CallStackFrame {
  id: string;
  name: string;
  args: Record<string, any>;
  line: number;
}

export interface ExpressionEvaluation {
  rawExpression: string;         // e.g. "arr[mid] < target"
  substitutedExpression: string;  // e.g. "5 < 12"
  result: string | boolean | number; // e.g. true
  effectDescription: string;     // e.g. "5 is less than 12, so eliminate left half"
}

export interface PredictionChallenge {
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ExecutionEvent {
  step: number;
  type: EventType;
  sourceLine: number;            // 1-based line number in active language
  codeSnippet: string;           // code line currently executing
  explanation: string;           // human-readable mental explanation

  // "What the computer sees" HUD
  expressionEvaluation?: ExpressionEvaluation;

  // Variables in local scope
  variables: Record<string, any>;
  
  // Pointers (e.g., { i: 0, j: 3, left: 1, right: 4, mid: 2, slow: 1, fast: 2 })
  pointers: Record<string, number | string>;

  // Call stack state
  callStack: CallStackFrame[];

  // Primary data structure snapshot
  structureType: StructureType;
  structureState: any;

  // Visual diff highlights
  highlightedIndices?: number[];
  swappedIndices?: [number, number];
  activeNodes?: (string | number)[];
  activeEdges?: [string | number, string | number][];
  windowRange?: [number, number];

  // Optional interactive prediction trigger at this key branch
  prediction?: PredictionChallenge;
}

export interface ExecutionTrace {
  id: string;
  algorithmId: string;
  title: string;
  structureType: StructureType;
  totalSteps: number;
  events: ExecutionEvent[];
}
