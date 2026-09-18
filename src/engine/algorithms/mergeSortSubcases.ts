import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

export const mergeSortAlgorithm: AlgorithmDefinition = {
  id: "merge_sort",
  name: "Merge Sort (Divide & Conquer)",
  category: "sorting",
  structureType: "array",
  difficulty: "Medium",
  description:
    "A classic divide-and-conquer algorithm that recursively splits an array in half until single-element subarrays remain, then merges sorted subarrays using a two-pointer technique into a fully sorted sequence.",
  timeComplexity: "O(n log n) guaranteed across all cases",
  spaceComplexity: "O(n) auxiliary space for merging buffer",
  mentalModel: [
    "Divide: Cut problem space in half until arrays have size 1 (trivially sorted).",
    "Conquer: Merge two already-sorted halves using two pointers pointing to heads of left and right segments.",
    "Stability: Maintains original relative order of equal elements by favoring left-sublist elements on equality."
  ],
  invariants: [
    "Before merging left [L..M] and right [M+1..R], both subarrays are strictly sorted.",
    "After merging, the segment [L..R] is strictly sorted."
  ],
  commonMistakes: [
    "Using <= when calculating midpoint, causing infinite recursion on 2-element arrays if mid = (left + right + 1) // 2.",
    "Forgetting to flush remaining unmerged elements from left or right half into the destination array."
  ],
  defaultInput: { array: [38, 27, 43, 3, 9, 82, 10] },
  code: {
    python: `def merge_sort(arr, l=0, r=None):
    if r is None:
        r = len(arr) - 1
    if l >= r:
        return
        
    mid = (l + r) // 2
    merge_sort(arr, l, mid)
    merge_sort(arr, mid + 1, r)
    
    # Merge step
    merged = []
    i, j = l, mid + 1
    while i <= mid and j <= r:
        if arr[i] <= arr[j]:
            merged.append(arr[i])
            i += 1
        else:
            merged.append(arr[j])
            j += 1
            
    while i <= mid:
        merged.append(arr[i])
        i += 1
    while j <= r:
        merged.append(arr[j])
        j += 1
        
    for k in range(len(merged)):
        arr[l + k] = merged[k]`,
    javascript: `function mergeSort(arr, l = 0, r = arr.length - 1) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    
    const merged = [];
    let i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) {
            merged.push(arr[i++]);
        } else {
            merged.push(arr[j++]);
        }
    }
    while (i <= mid) merged.push(arr[i++]);
    while (j <= r) merged.push(arr[j++]);
    
    for (let k = 0; k < merged.length; k++) {
        arr[l + k] = merged[k];
    }
}`,
    cpp: `void merge(std::vector<int>& arr, int l, int mid, int r) {
    std::vector<int> merged;
    int i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) merged.push_back(arr[i++]);
        else merged.push_back(arr[j++]);
    }
    while (i <= mid) merged.push_back(arr[i++]);
    while (j <= r) merged.push_back(arr[j++]);
    for (int k = 0; k < (int)merged.size(); ++k) {
        arr[l + k] = merged[k];
    }
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}`,
    java: `public void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    
    int[] merged = new int[r - l + 1];
    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) merged[k++] = arr[i++];
        else merged[k++] = arr[j++];
    }
    while (i <= mid) merged[k++] = arr[i++];
    while (j <= r) merged[k++] = arr[j++];
    
    for (int idx = 0; idx < merged.length; idx++) {
        arr[l + idx] = merged[idx];
    }
}`
  },
  generateTrace: (input = { array: [38, 27, 43, 3, 9, 82, 10] }): ExecutionTrace => {
    const rawArr = (input.array as number[]) || [38, 27, 43, 3, 9, 82, 10];
    const arr = [...rawArr];
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 2,
      codeSnippet: "merge_sort(arr, 0, len(arr) - 1)",
      explanation: `Begin Merge Sort on array of size ${arr.length}. Initial array: [${arr.join(", ")}].`,
      variables: { left: 0, right: arr.length - 1 },
      pointers: { left: 0, right: arr.length - 1 },
      callStack: [{ id: "root", name: "mergeSort", args: { l: 0, r: arr.length - 1 }, line: 2 }],
      structureType: "array",
      structureState: [...arr],
      windowRange: [0, arr.length - 1]
    });

    const sortRange = (l: number, r: number) => {
      if (l >= r) return;
      const mid = Math.floor((l + r) / 2);

      events.push({
        step: ++step,
        type: "BRANCH",
        sourceLine: 6,
        codeSnippet: `mid = (${l} + ${r}) // 2 = ${mid}`,
        explanation: `Divide: Subarray [${l} ... ${r}] halved at midpoint ${mid}. Left half: [${l} ... ${mid}], Right half: [${mid + 1} ... ${r}].`,
        variables: { l, r, mid },
        pointers: { left: l, mid, right: r },
        callStack: [{ id: `frame_${l}_${r}`, name: "mergeSort", args: { l, r, mid }, line: 6 }],
        structureType: "array",
        structureState: [...arr],
        highlightedIndices: [mid],
        windowRange: [l, r]
      });

      sortRange(l, mid);
      sortRange(mid + 1, r);

      // Merge
      const merged: number[] = [];
      let i = l;
      let j = mid + 1;

      while (i <= mid && j <= r) {
        const leftVal = arr[i];
        const rightVal = arr[j];
        const takeLeft = leftVal <= rightVal;

        events.push({
          step: ++step,
          type: "COMPARE",
          sourceLine: 13,
          codeSnippet: `if arr[${i}] (${leftVal}) <= arr[${j}] (${rightVal}):`,
          explanation: `Compare left element arr[${i}]=${leftVal} with right element arr[${j}]=${rightVal}. ${
            takeLeft ? `Taking ${leftVal} from left half.` : `Taking ${rightVal} from right half.`
          }`,
          expressionEvaluation: {
            rawExpression: "arr[i] <= arr[j]",
            substitutedExpression: `${leftVal} <= ${rightVal}`,
            result: takeLeft,
            effectDescription: takeLeft ? `Append ${leftVal} to buffer` : `Append ${rightVal} to buffer`
          },
          variables: { i, j, leftVal, rightVal, buffer: [...merged] },
          pointers: { i, j },
          callStack: [{ id: `merge_${l}_${r}`, name: "merge", args: { l, mid, r, i, j }, line: 13 }],
          structureType: "array",
          structureState: [...arr],
          highlightedIndices: [i, j],
          windowRange: [l, r]
        });

        if (takeLeft) {
          merged.push(leftVal);
          i++;
        } else {
          merged.push(rightVal);
          j++;
        }
      }

      while (i <= mid) {
        merged.push(arr[i]);
        i++;
      }
      while (j <= r) {
        merged.push(arr[j]);
        j++;
      }

      // Copy merged back
      for (let k = 0; k < merged.length; k++) {
        arr[l + k] = merged[k];
      }

      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 28,
        codeSnippet: `arr[${l}..${r}] = merged: [${merged.join(", ")}]`,
        explanation: `Merged sorted segment [${l} ... ${r}]: [${merged.join(", ")}]. Copied back to main array.`,
        variables: { l, r, mergedSegment: [...merged] },
        pointers: { left: l, right: r },
        callStack: [{ id: `merge_${l}_${r}`, name: "merge", args: { l, r }, line: 28 }],
        structureType: "array",
        structureState: [...arr],
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        windowRange: [l, r]
      });
    };

    sortRange(0, arr.length - 1);

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 29,
      codeSnippet: "Sorted Array Ready",
      explanation: `Merge Sort complete! Array fully sorted: [${arr.join(", ")}].`,
      variables: { result: [...arr] },
      pointers: { left: 0, right: arr.length - 1 },
      callStack: [],
      structureType: "array",
      structureState: [...arr],
      highlightedIndices: arr.map((_, idx) => idx),
      windowRange: [0, arr.length - 1]
    });

    return {
      id: "merge_sort_trace",
      algorithmId: "merge_sort",
      title: "Merge Sort Execution Trace",
      structureType: "array",
      totalSteps: events.length,
      events
    };
  }
};
