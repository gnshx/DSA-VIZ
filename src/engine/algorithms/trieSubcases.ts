import { AlgorithmDefinition } from "../../types/algorithm";
import { ExecutionEvent, ExecutionTrace } from "../../types/trace";

// ============================================================================
// Trie / Prefix Tree (Insert, Search, and StartsWith - LC 208)
// ============================================================================
export const triePrefixTreeAlgorithm: AlgorithmDefinition = {
  id: "trie_prefix_tree",
  name: "Trie: Prefix Tree (Insert, Search, StartsWith)",
  category: "trie",
  patternFamily: "trie",
  subPatternId: "trie_prefix",
  structureType: "tree",
  difficulty: "Medium",
  description:
    "A tree data structure used for high-efficiency prefix matching and retrieval of keys in a dataset of strings. Each node represents a character, branching to children nodes. Common prefixes share paths, allowing insert and search in O(L) time where L is the string length, completely independent of total words stored.",
  timeComplexity: "O(L) per word operation",
  spaceComplexity: "O(alphabet_size * L * N)",
  mentalModel: [
    "A phonebook directory where all words starting with 'ap' share the same initial branch ('a' -> 'p').",
    "A boolean flag 'is_end_of_word' distinguishes true dictionary words from mere subprefixes (e.g. 'app' vs 'apple')."
  ],
  invariants: [
    "Root node represents the empty string ''.",
    "A path from root to any node forms a unique prefix.",
    "is_end_of_word is True if and only if that prefix constitutes a complete word."
  ],
  commonMistakes: [
    "Returning true for search(prefix) when prefix exists in the trie but is_end_of_word is False.",
    "Using array indexing without converting char to index: ord(c) - ord('a')."
  ],
  defaultInput: { words: ["app", "apple", "bat"], queries: ["app", "appl", "ap"] },
  code: {
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end
        
    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
    javascript: `class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    insert(word) {
        let node = this.root;
        for (const c of word) {
            if (!node.children[c]) node.children[c] = new TrieNode();
            node = node.children[c];
        }
        node.isEnd = true;
    }
    search(word) {
        let node = this.root;
        for (const c of word) {
            if (!node.children[c]) return false;
            node = node.children[c];
        }
        return node.isEnd;
    }
    startsWith(prefix) {
        let node = this.root;
        for (const c of prefix) {
            if (!node.children[c]) return false;
            node = node.children[c];
        }
        return true;
    }
}`,
    cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};
class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) node->children[c] = new TrieNode();
            node = node->children[c];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return true;
    }
};`,
    java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}
public class Trie {
    private TrieNode root = new TrieNode();
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return node.isEnd;
    }
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return true;
    }
}`
  },
  generateTrace: (input = { words: ["app", "apple", "bat"], queries: ["app", "appl", "ap"] }): ExecutionTrace => {
    const words: string[] = input.words || ["app", "apple", "bat"];
    const events: ExecutionEvent[] = [];
    let step = 0;

    events.push({
      step: ++step,
      type: "LINE",
      sourceLine: 7,
      codeSnippet: "trie = Trie(); root = TrieNode()",
      explanation: "Initialized empty Trie with root node ''.",
      variables: { words },
      pointers: { current: "root" },
      callStack: [{ id: "main", name: "Trie", args: {}, line: 7 }],
      structureType: "tree",
      structureState: { id: "root", value: "root", left: null, right: null }
    });

    for (const word of words) {
      events.push({
        step: ++step,
        type: "WRITE",
        sourceLine: 10,
        codeSnippet: `trie.insert("${word}")`,
        explanation: `INSERTING WORD "${word}": traversing/creating character branches for '${word.split("").join("' -> '")}'. Marking last node is_end = True.`,
        expressionEvaluation: {
          rawExpression: "insert(word)",
          substitutedExpression: `insert("${word}")`,
          result: `"${word}" stored`,
          effectDescription: `Shared prefixes reused; word termination flag set.`
        },
        variables: { insertedWord: word },
        pointers: { inserting: word },
        callStack: [{ id: "main", name: "insert", args: { word }, line: 10 }],
        structureType: "tree",
        structureState: { id: "root", value: `root (+${word})`, left: null, right: null }
      });
    }

    // Query 1: search("app") -> True
    events.push({
      step: ++step,
      type: "COMPARE",
      sourceLine: 18,
      codeSnippet: 'trie.search("app")',
      explanation: 'SEARCH("app"): found path \'a\' -> \'p\' -> \'p\'. Node is_end == True. Result = TRUE (valid complete word).',
      expressionEvaluation: {
        rawExpression: "node.is_end",
        substitutedExpression: "node('app').is_end == True",
        result: true,
        effectDescription: '"app" is a complete dictionary word.'
      },
      variables: { query: "app", isEnd: true, searchResult: true },
      pointers: { matchingNode: "app" },
      callStack: [{ id: "main", name: "search", args: { word: "app" }, line: 18 }],
      structureType: "tree",
      structureState: { id: "app", value: "app [END]", left: null, right: null }
    });

    // Query 2: search("appl") -> False (prefix exists, but not end of word)
    events.push({
      step: ++step,
      type: "COMPARE",
      sourceLine: 23,
      codeSnippet: 'trie.search("appl")',
      explanation: 'SEARCH("appl"): found path \'a\' -> \'p\' -> \'p\' -> \'l\'. But node is_end == FALSE (only "apple" is stored). Result = FALSE.',
      expressionEvaluation: {
        rawExpression: "node.is_end",
        substitutedExpression: "node('appl').is_end == False",
        result: false,
        effectDescription: '"appl" is a prefix of "apple", but NOT a registered full word.'
      },
      variables: { query: "appl", isEnd: false, searchResult: false },
      pointers: { matchingNode: "appl" },
      callStack: [{ id: "main", name: "search", args: { word: "appl" }, line: 23 }],
      structureType: "tree",
      structureState: { id: "appl", value: "appl [NOT END]", left: null, right: null }
    });

    // Query 3: starts_with("ap") -> True
    events.push({
      step: ++step,
      type: "COMPARE",
      sourceLine: 26,
      codeSnippet: 'trie.starts_with("ap")',
      explanation: 'STARTS_WITH("ap"): path \'a\' -> \'p\' exists. Prefix match succeeds! Result = TRUE.',
      expressionEvaluation: {
        rawExpression: "node != None",
        substitutedExpression: "prefix 'ap' exists in trie",
        result: true,
        effectDescription: 'At least one word ("app", "apple") begins with prefix "ap".'
      },
      variables: { prefix: "ap", startsWithResult: true },
      pointers: { matchingNode: "ap" },
      callStack: [{ id: "main", name: "starts_with", args: { prefix: "ap" }, line: 26 }],
      structureType: "tree",
      structureState: { id: "ap", value: "ap", left: null, right: null }
    });

    events.push({
      step: ++step,
      type: "COMPLETE",
      sourceLine: 31,
      codeSnippet: "Trie operations verified",
      explanation: "Trie prefix traversal and search completed in O(L) time.",
      variables: { wordsStored: words.length },
      pointers: {},
      callStack: [{ id: "main", name: "Trie", args: {}, line: 31 }],
      structureType: "tree",
      structureState: { id: "root", value: "Trie Ready", left: null, right: null }
    });

    return {
      id: "trie_prefix_tree_trace",
      algorithmId: "trie_prefix_tree",
      title: "Trie (Prefix Tree - Insert, Search, StartsWith)",
      structureType: "tree",
      totalSteps: events.length,
      events
    };
  }
};
