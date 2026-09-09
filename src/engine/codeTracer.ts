import { ALL_ALGORITHMS } from "./algorithms";
import { ExecutionTrace } from "../types/trace";

export function generateTraceForAlgorithm(algorithmId: string, customInput?: any): ExecutionTrace {
  const algo = ALL_ALGORITHMS.find((a) => a.id === algorithmId);
  if (!algo) {
    throw new Error(`Algorithm ${algorithmId} not found`);
  }
  return algo.generateTrace(customInput ?? algo.defaultInput);
}

/**
 * Parses user input strings into arrays, numbers, or objects safely.
 */
export function parseUserInput(inputString: string, structureType: string): any {
  const trimmed = inputString.trim();
  if (!trimmed) return undefined;

  try {
    // Try JSON parse first (e.g. [5, 2, 8, 1])
    if (trimmed.startsWith("[") || trimmed.startsWith("{") || trimmed.startsWith('"')) {
      return JSON.parse(trimmed);
    }
    
    // Comma-separated numbers e.g. "5, 2, 8, 1"
    if (structureType === "array" || structureType === "heap" || structureType === "linked_list") {
      const parts = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
      return parts.map((p) => {
        const num = Number(p);
        return isNaN(num) ? p : num;
      });
    }

    if (structureType === "stack") {
      return trimmed;
    }

    return trimmed;
  } catch {
    return undefined;
  }
}
