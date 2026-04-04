// Interview questions data organized by company

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  code?: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  questionCount: number;
}

export const COMPANIES: Company[] = [
  {
    id: "google",
    name: "Google",
    logo: "🔍",
    color: "#4285F4",
    description: "Algorithm-heavy with system design focus",
    questionCount: 5,
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "📦",
    color: "#FF9900",
    description: "Leadership principles + coding + system design",
    questionCount: 5,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "🪟",
    color: "#00A4EF",
    description: "Coding fundamentals and problem solving",
    questionCount: 5,
  },
  {
    id: "meta",
    name: "Meta",
    logo: "👥",
    color: "#0668E1",
    description: "Algorithms, system design, and product sense",
    questionCount: 5,
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "🎬",
    color: "#E50914",
    description: "System design and culture fit focus",
    questionCount: 4,
  },
  {
    id: "apple",
    name: "Apple",
    logo: "🍎",
    color: "#555555",
    description: "Technical deep dives and product design",
    questionCount: 4,
  },
];

export const INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  google: [
    {
      id: "g1",
      question: "Find the first missing positive integer in an unsorted array",
      answer: "Use the array itself as a hash map by placing each number in its correct index position. Traverse the array again to find the first index that doesn't match its value.",
      code: `function firstMissingPositive(nums: number[]): number {
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n &&
           nums[nums[i] - 1] !== nums[i]) {
      const temp = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = temp;
    }
  }

  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }

  return n + 1;
}`,
      difficulty: "hard",
      topic: "Arrays",
    },
    {
      id: "g2",
      question: "Design a LRU (Least Recently Used) Cache",
      answer: "Use a combination of HashMap for O(1) lookups and Doubly Linked List for O(1) removal and insertion. The HashMap stores key to node references.",
      code: `class LRUCache {
  private capacity: number;
  private cache: Map<number, ListNode>;
  private head: ListNode;
  private tail: ListNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new ListNode(0, 0);
    this.tail = new ListNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key)!;
    this.remove(node);
    this.add(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.remove(this.cache.get(key)!);
    }
    const node = new ListNode(key, value);
    this.add(node);
    this.cache.set(key, node);

    if (this.cache.size > this.capacity) {
      const lru = this.head.next!;
      this.remove(lru);
      this.cache.delete(lru.key);
    }
  }
}`,
      difficulty: "medium",
      topic: "System Design",
    },
    {
      id: "g3",
      question: "Merge K Sorted Linked Lists",
      answer: "Use a min-heap to efficiently get the smallest element among all lists. Alternatively, use divide and conquer to merge pairs of lists.",
      code: `function mergeKLists(lists: ListNode[]): ListNode | null {
  const minHeap = new MinHeap<ListNode>((a, b) => a.val - b.val);

  for (const list of lists) {
    if (list) minHeap.push(list);
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (!minHeap.isEmpty()) {
    const node = minHeap.pop()!;
    current.next = node;
    current = node;
    if (node.next) minHeap.push(node.next);
  }

  return dummy.next;
}`,
      difficulty: "medium",
      topic: "Linked Lists",
    },
    {
      id: "g4",
      question: "Design a web crawler",
      answer: "Key components: URL frontier (queue), fetcher, parser, content filter, duplicate detector (Bloom filter), and storage. Handle politeness with rate limiting and distribute across multiple workers.",
      code: `class WebCrawler {
  private visited: Set<string>;
  private queue: string[];
  private workers: number;

  constructor(seedUrls: string[], workers: number = 5) {
    this.visited = new Set();
    this.queue = [...seedUrls];
    this.workers = workers;
  }

  async crawl(): Promise<void> {
    const promises = [];
    for (let i = 0; i < this.workers; i++) {
      promises.push(this.worker());
    }
    await Promise.all(promises);
  }

  private async worker(): Promise<void> {
    while (this.queue.length > 0) {
      const url = this.queue.shift()!;
      if (this.visited.has(url)) continue;

      try {
        const content = await this.fetch(url);
        this.visited.add(url);
        const links = this.extractLinks(content);

        for (const link of links) {
          if (!this.visited.has(link)) {
            this.queue.push(link);
          }
        }
      } catch (e) {
        console.error(\`Failed to fetch \${url}\`);
      }
    }
  }
}`,
      difficulty: "hard",
      topic: "System Design",
    },
    {
      id: "g5",
      question: "Serialize and Deserialize a Binary Tree",
      answer: "Use pre-order traversal with null markers for serialization. For deserialization, use the same order to reconstruct the tree.",
      code: `class Codec {
  serialize(root: TreeNode | null): string {
    const result: string[] = [];

    function preorder(node: TreeNode | null) {
      if (!node) {
        result.push("null");
        return;
      }
      result.push(String(node.val));
      preorder(node.left);
      preorder(node.right);
    }

    preorder(root);
    return result.join(",");
  }

  deserialize(data: string): TreeNode | null {
    const values = data.split(",");
    let index = 0;

    function build(): TreeNode | null {
      if (values[index] === "null") {
        index++;
        return null;
      }

      const node = new TreeNode(parseInt(values[index]));
      index++;
      node.left = build();
      node.right = build();
      return node;
    }

    return build();
  }
}`,
      difficulty: "medium",
      topic: "Trees",
    },
  ],
  amazon: [
    {
      id: "a1",
      question: "Two Sum - Find indices of two numbers that add up to target",
      answer: "Use a hash map to store complement values. For each number, check if it exists in the map. If yes, return indices. If no, add the complement to the map.",
      code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}`,
      difficulty: "easy",
      topic: "Arrays",
    },
    {
      id: "a2",
      question: "Maximum subarray sum (Kadane's Algorithm)",
      answer: "Keep track of current sum and global max. If current sum becomes negative, reset to zero. Update global max at each step.",
      code: `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}`,
      difficulty: "medium",
      topic: "Arrays",
    },
    {
      id: "a3",
      question: "Design an elevator system",
      answer: "Key components: Elevator controller, elevator cars, request queue. Use state machine for elevator (idle, moving_up, moving_down). Implement SCAN algorithm for efficient floor servicing.",
      code: `class ElevatorSystem {
    private elevators: Elevator[];
    private requests: Request[];

    constructor(numElevators: number) {
      this.elevators = Array(numElevators)
        .fill(null)
        .map((_, i) => new Elevator(i));
      this.requests = [];
    }

    requestElevator(floor: number, direction: Direction): void {
      const elevator = this.findBestElevator(floor, direction);
      elevator.addStop(floor);
    }

    private findBestElevator(floor: number, direction: Direction): Elevator {
      return this.elevators.reduce((best, elev) => {
        const score = elev.calculateScore(floor, direction);
        return score > best.calculateScore(floor, direction)
          ? elev : best;
      });
    }
}

class Elevator {
    private id: number;
    private currentFloor: number;
    private stops: Set<number>;
    private state: ElevatorState;

    calculateScore(floor: number, direction: Direction): number {
      const distance = Math.abs(this.currentFloor - floor);
      const sameDirection = this.state === direction;
      return sameDirection ? 100 - distance : -distance;
    }
}`,
      difficulty: "hard",
      topic: "System Design",
    },
    {
      id: "a4",
      question: "Valid Parentheses - Check if string has balanced brackets",
      answer: "Use a stack. Push opening brackets, pop and check when encountering closing brackets. Stack should be empty at the end for valid string.",
      code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
      difficulty: "easy",
      topic: "Stacks",
    },
    {
      id: "a5",
      question: "Rotting Oranges - Minimum time until no fresh oranges remain",
      answer: "Use BFS starting from all rotten oranges simultaneously. Track time levels and count fresh oranges. Return time if no fresh oranges left, else -1.",
      code: `function orangesRotting(grid: number[][]): number {
  const queue: [number, number][] = [];
  let fresh = 0;
  let minutes = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 2) queue.push([i, j]);
      if (grid[i][j] === 1) fresh++;
    }
  }

  const directions = [[0,1], [0,-1], [1,0], [-1,0]];

  while (queue.length && fresh) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;

      for (const [dr, dc] of directions) {
        const nr = r + dr, nc = c + dc;
        if (grid[nr]?.[nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
    if (queue.length) minutes++;
  }

  return fresh === 0 ? minutes : -1;
}`,
      difficulty: "medium",
      topic: "BFS",
    },
  ],
  microsoft: [
    {
      id: "m1",
      question: "Reverse a linked list iteratively and recursively",
      answer: "Iterative: Keep track of prev, current, and next nodes. Recursive: Recurse to end, then reverse links as stack unwinds.",
      code: `// Iterative
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// Recursive
function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}`,
      difficulty: "medium",
      topic: "Linked Lists",
    },
    {
      id: "m2",
      question: "Implement a Trie (Prefix Tree)",
      answer: "Each node contains children map and isEndOfWord flag. Insert adds characters creating nodes as needed. Search checks if path exists and ends at a word.",
      code: `class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
  }

  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  private findNode(str: string): TrieNode | null {
    let node = this.root;
    for (const char of str) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char)!;
    }
    return node;
  }
}`,
      difficulty: "medium",
      topic: "Trees",
    },
    {
      id: "m3",
      question: "Find the longest substring without repeating characters",
      answer: "Use sliding window with a Set. Expand right pointer, add to set. If duplicate found, shrink from left until valid. Track max length.",
      code: `function lengthOfLongestSubstring(s: string): number {
  const set = new Set<string>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
      difficulty: "medium",
      topic: "Strings",
    },
    {
      id: "m4",
      question: "Clone a graph using DFS/BFS",
      answer: "Use a map to track visited nodes (old -> new). For each neighbor, recursively clone if not visited, or return existing clone.",
      code: `function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;

  const visited = new Map<Node, Node>();

  function dfs(original: Node): Node {
    if (visited.has(original)) {
      return visited.get(original)!;
    }

    const clone = new Node(original.val);
    visited.set(original, clone);

    for (const neighbor of original.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }

    return clone;
  }

  return dfs(node);
}`,
      difficulty: "medium",
      topic: "Graphs",
    },
    {
      id: "m5",
      question: "Design a rate limiter",
      answer: "Token bucket: Tokens refill at fixed rate, requests consume tokens. Sliding window: Track request timestamps in a queue, remove old ones.",
      code: `class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private capacity: number;
  private refillRate: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  allowRequest(): boolean {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const newTokens = Math.floor(elapsed * this.refillRate / 1000);

    this.tokens = Math.min(this.capacity, this.tokens + newTokens);
    this.lastRefill = now;
  }
}

// Usage
const limiter = new TokenBucket(10, 1); // 10 requests, 1 per second
if (limiter.allowRequest()) {
  // Process request
} else {
  // Rate limit exceeded
}`,
      difficulty: "medium",
      topic: "System Design",
    },
  ],
  meta: [
    {
      id: "meta1",
      question: "Find median of two sorted arrays",
      answer: "Use binary search to find the correct partition point. Ensure left half elements are smaller than right half elements.",
      code: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }

  const m = nums1.length, n = nums2.length;
  let left = 0, right = m;

  while (left <= right) {
    const partitionX = Math.floor((left + right) / 2);
    const partitionY = Math.floor((m + n + 1) / 2) - partitionX;

    const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
    const minRightX = partitionX === m ? Infinity : nums1[partitionX];
    const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];
    const minRightY = partitionY === n ? Infinity : nums2[partitionY];

    if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
      }
      return Math.max(maxLeftX, maxLeftY);
    } else if (maxLeftX > minRightY) {
      right = partitionX - 1;
    } else {
      left = partitionX + 1;
    }
  }

  throw new Error("Input arrays are not sorted");
}`,
      difficulty: "hard",
      topic: "Binary Search",
    },
    {
      id: "meta2",
      question: "Regular Expression Matching with . and *",
      answer: "Use dynamic programming. dp[i][j] means if s[0..i-1] matches p[0..j-1]. Handle * by checking zero or more occurrences.",
      code: `function isMatch(s: string, p: string): boolean {
  const dp: boolean[][] = Array(s.length + 1)
    .fill(null)
    .map(() => Array(p.length + 1).fill(false));

  dp[0][0] = true;

  // Handle patterns like a*b*c*
  for (let j = 1; j <= p.length; j++) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }

  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= p.length; j++) {
      if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2]; // zero occurrences
        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
          dp[i][j] = dp[i][j] || dp[i - 1][j]; // one or more
        }
      }
    }
  }

  return dp[s.length][p.length];
}`,
      difficulty: "hard",
      topic: "Dynamic Programming",
    },
    {
      id: "meta3",
      question: "Design a news feed system (like Facebook)",
      answer: "Fan-out on write for active users (push model), fan-out on read for celebrities (pull model). Use ranking algorithm for feed ordering.",
      code: `class NewsFeedService {
  // Fan-out on write
  async createPost(userId: string, content: string): Promise<void> {
    const post = await this.db.posts.create({ userId, content });
    const followers = await this.getFollowers(userId);

    // For normal users: push to followers' feeds
    if (followers.length < FANOUT_THRESHOLD) {
      await Promise.all(followers.map(fid =>
        this.cache.addToFeed(fid, post)
      ));
    } else {
      // For celebrities: mark as hot post
      await this.cache.markAsHot(userId);
    }
  }

  // Fan-out on read
  async getFeed(userId: string, page: number): Promise<Post[]> {
    const following = await this.getFollowing(userId);
    const [cachedFeed, hotPosts] = await Promise.all([
      this.cache.getFeed(userId, page),
      this.getHotPosts(following)
    ]);

    // Merge and rank
    return this.rankAndMerge(cachedFeed, hotPosts);
  }

  private rankAndMerge(feed: Post[], hotPosts: Post[]): Post[] {
    return [...feed, ...hotPosts]
      .sort((a, b) => this.calculateScore(b) - this.calculateScore(a))
      .slice(0, FEED_SIZE);
  }

  private calculateScore(post: Post): number {
    // Time decay + engagement score
    const hoursSincePost = (Date.now() - post.createdAt) / 3600000;
    return (post.likes * 2 + post.comments * 3) / Math.pow(hoursSincePost + 2, 1.5);
  }
}`,
      difficulty: "hard",
      topic: "System Design",
    },
    {
      id: "meta4",
      question: "Container With Most Water",
      answer: "Use two pointers from both ends. Calculate area and update max. Move the pointer with smaller height inward.",
      code: `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const area = width * Math.min(height[left], height[right]);
    maxArea = Math.max(maxArea, area);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}`,
      difficulty: "medium",
      topic: "Two Pointers",
    },
    {
      id: "meta5",
      question: "Task Scheduler with cooling interval",
      answer: "Count task frequencies. Greedy approach: always schedule the most frequent task. Calculate idle slots needed.",
      code: `function leastInterval(tasks: string[], n: number): number {
  const freq: Record<string, number> = {};
  let maxFreq = 0, maxCount = 0;

  for (const task of tasks) {
    freq[task] = (freq[task] || 0) + 1;
    maxFreq = Math.max(maxFreq, freq[task]);
  }

  for (const task in freq) {
    if (freq[task] === maxFreq) maxCount++;
  }

  const partCount = maxFreq - 1;
  const partLength = n - (maxCount - 1);
  const emptySlots = partCount * partLength;
  const availableTasks = tasks.length - maxFreq * maxCount;
  const idles = Math.max(0, emptySlots - availableTasks);

  return tasks.length + idles;
}`,
      difficulty: "medium",
      topic: "Greedy",
    },
  ],
  netflix: [
    {
      id: "n1",
      question: "Design a video streaming service",
      answer: "Key components: CDN for content delivery, transcoding service for multiple bitrates, recommendation engine, and DRM for content protection. Use adaptive bitrate streaming.",
      code: `class VideoStreamingService {
  // Upload and transcode
  async uploadVideo(video: File, metadata: VideoMetadata): Promise<void> {
    // Store original in object storage
    const videoId = await this.storage.upload(video);

    // Queue for transcoding to multiple resolutions
    await this.transcodingQueue.add({
      videoId,
      formats: ['1080p', '720p', '480p', '360p'],
      codecs: ['h264', 'h265']
    });

    // Update metadata index
    await this.searchIndex.add(metadata);
  }

  // Stream with adaptive bitrate
  async getStreamManifest(videoId: string, userBandwidth: number): Promise<Manifest> {
    const availableQualities = await this.cdn.getAvailableQualities(videoId);

    // Select appropriate quality based on bandwidth
    const selectedQuality = this.selectQuality(
      availableQualities,
      userBandwidth
    );

    return this.generateManifest(videoId, selectedQuality);
  }

  // CDN selection based on location
  private selectCDN(userLocation: Location): CDNEndpoint {
    const availableCDNs = this.cdnTopology.getNearest(userLocation);
    return availableCDNs.reduce((best, cdn) =>
      cdn.latency < best.latency ? cdn : best
    );
  }
}`,
      difficulty: "hard",
      topic: "System Design",
    },
    {
      id: "n2",
      question: "Design a recommendation system",
      answer: "Hybrid approach: Collaborative filtering (users like you), content-based (item similarity), and popularity. Use ML models for ranking.",
      code: `class RecommendationEngine {
  async getRecommendations(
    userId: string,
    context: RequestContext
  ): Promise<Recommendation[]> {

    // Parallel fetch from multiple sources
    const [collaborative, contentBased, trending] = await Promise.all([
      this.collaborativeFilter.getRecommendations(userId),
      this.contentBased.getRecommendations(userId),
      this.getTrending(context.region)
    ]);

    // Merge and deduplicate
    const candidates = this.mergeCandidates(
      collaborative,
      contentBased,
      trending
    );

    // ML ranking model
    const ranked = await this.rankingModel.predict(
      candidates.map(c => ({
        ...c,
        userFeatures: await this.getUserFeatures(userId),
        contextFeatures: context
      }))
    );

    // Diversity boost
    return this.diversify(ranked, DIVERSITY_THRESHOLD);
  }

  private diversify(items: Item[], threshold: number): Item[] {
    const selected: Item[] = [];
    const embeddings = items.map(i => i.embedding);

    for (const item of items) {
      if (selected.length === 0) {
        selected.push(item);
        continue;
      }

      const minSimilarity = Math.min(
        ...selected.map(s => cosineSimilarity(s.embedding, item.embedding))
      );

      if (minSimilarity < threshold) {
        selected.push(item);
      }

      if (selected.length >= PAGE_SIZE) break;
    }

    return selected;
  }
}`,
      difficulty: "hard",
      topic: "System Design",
    },
    {
      id: "n3",
      question: "Find top K frequent elements",
      answer: "Use a min-heap of size k. Or use bucket sort by frequency. Return k most frequent elements.",
      code: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();

  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Bucket sort approach
  const buckets: number[][] = Array(nums.length + 1)
    .fill(null)
    .map(() => []);

  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }

  return result.slice(0, k);
}`,
      difficulty: "medium",
      topic: "Heaps",
    },
    {
      id: "n4",
      question: "Word Break - Can string be segmented into dictionary words?",
      answer: "Dynamic programming. dp[i] means s[0..i-1] can be segmented. Check all possible breaks for each position.",
      code: `function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const dp: boolean[] = Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}`,
      difficulty: "medium",
      topic: "Dynamic Programming",
    },
  ],
  apple: [
    {
      id: "ap1",
      question: "Design an autocomplete/type-ahead system",
      answer: "Use a Trie for prefix matching. Store top suggestions at each node. Use caching for popular queries.",
      code: `class AutocompleteSystem {
  private trie: TrieNode;
  private hotCache: Map<string, string[]>;

  constructor() {
    this.trie = new TrieNode();
    this.hotCache = new Map();
  }

  // Build from historical queries
  buildIndex(queries: QueryRecord[]): void {
    for (const { term, frequency } of queries) {
      let node = this.trie;

      for (const char of term) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];

        // Update top suggestions at this node
        node.suggestions.push({ term, frequency });
        node.suggestions.sort((a, b) => b.frequency - a.frequency);
        node.suggestions = node.suggestions.slice(0, 5);
      }
      node.isEnd = true;
    }
  }

  getSuggestions(prefix: string): string[] {
    // Check cache first
    if (this.hotCache.has(prefix)) {
      return this.hotCache.get(prefix)!;
    }

    let node = this.trie;
    for (const char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const suggestions = node.suggestions.map(s => s.term);

    // Cache popular prefixes
    if (node.suggestions[0]?.frequency > HOT_THRESHOLD) {
      this.hotCache.set(prefix, suggestions);
    }

    return suggestions;
  }
}

class TrieNode {
  children: Record<string, TrieNode> = {};
  suggestions: { term: string; frequency: number }[] = [];
  isEnd = false;
}`,
      difficulty: "medium",
      topic: "System Design",
    },
    {
      id: "ap2",
      question: "Flatten a multilevel doubly linked list",
      answer: "Use DFS to traverse child lists. Insert child nodes between current and next, maintaining proper prev/next pointers.",
      code: `function flatten(head: Node | null): Node | null {
  if (!head) return null;

  const dummy = new Node(0, null, head, null);
  let prev = dummy;
  const stack: Node[] = [head];

  while (stack.length > 0) {
    const curr = stack.pop()!;

    prev.next = curr;
    curr.prev = prev;

    // Push next first so child is processed first (DFS)
    if (curr.next) {
      stack.push(curr.next);
    }
    if (curr.child) {
      stack.push(curr.child);
      curr.child = null; // Remove child reference
    }

    prev = curr;
  }

  dummy.next!.prev = null;
  return dummy.next;
}`,
      difficulty: "medium",
      topic: "Linked Lists",
    },
    {
      id: "ap3",
      question: "Design a distributed key-value store",
      answer: "Consistent hashing for data distribution, replication for availability, gossip protocol for failure detection, and read repair for consistency.",
      code: `class DistributedKVStore {
  private ring: ConsistentHashRing;
  private nodes: Map<string, Node>;
  private replicationFactor: number;

  constructor(nodes: Node[], replicationFactor: number = 3) {
    this.ring = new ConsistentHashRing(nodes.map(n => n.id));
    this.nodes = new Map(nodes.map(n => [n.id, n]));
    this.replicationFactor = replicationFactor;
  }

  async put(key: string, value: string): Promise<void> {
    const coordinators = this.ring.getNodes(key, this.replicationFactor);
    const timestamp = Date.now();

    // Write to coordinator nodes
    const writePromises = coordinators.map(nodeId =>
      this.nodes.get(nodeId)!.store.write(key, value, timestamp)
    );

    // Wait for quorum (W)
    const quorumSize = Math.floor(this.replicationFactor / 2) + 1;
    await Promise.allSettled(writePromises.slice(0, quorumSize));

    // Async replication to remaining nodes
    writePromises.slice(quorumSize).forEach(p => p.catch(() => {
      this.queueForRepair(key, coordinators[0]);
    }));
  }

  async get(key: string): Promise<string | null> {
    const nodeIds = this.ring.getNodes(key, this.replicationFactor);

    const results = await Promise.all(
      nodeIds.map(id => this.nodes.get(id)!.store.read(key))
    );

    // Return most recent version
    const validResults = results.filter(r => r !== null);
    if (validResults.length === 0) return null;

    const latest = validResults.reduce((max, curr) =>
      curr.timestamp > max.timestamp ? curr : max
    );

    // Trigger read repair if versions differ
    if (validResults.some(r => r.timestamp !== latest.timestamp)) {
      this.readRepair(key, latest);
    }

    return latest.value;
  }

  private readRepair(key: string, correctValue: VersionedValue): void {
    const nodes = this.ring.getNodes(key, this.replicationFactor);
    nodes.forEach(nodeId => {
      this.nodes.get(nodeId)!.store.repair(key, correctValue);
    });
  }
}`,
      difficulty: "hard",
      topic: "System Design",
    },
    {
      id: "ap4",
      question: "LRU Cache with O(1) operations",
      answer: "Combine HashMap with Doubly Linked List. HashMap provides O(1) lookup, linked list provides O(1) removal and insertion.",
      code: `class LRUCache {
  private capacity: number;
  private cache: Map<number, DLinkedNode>;
  private head: DLinkedNode;
  private tail: DLinkedNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new DLinkedNode(0, 0);
    this.tail = new DLinkedNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key)!;
    this.moveToHead(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);

      if (this.cache.size > this.capacity) {
        const tail = this.removeTail();
        this.cache.delete(tail.key);
      }
    }
  }

  private addToHead(node: DLinkedNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: DLinkedNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToHead(node: DLinkedNode): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeTail(): DLinkedNode {
    const res = this.tail.prev!;
    this.removeNode(res);
    return res;
  }
}

class DLinkedNode {
  key: number;
  value: number;
  prev: DLinkedNode | null = null;
  next: DLinkedNode | null = null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
  }
}`,
      difficulty: "medium",
      topic: "Data Structures",
    },
  ],
};

export function getRandomQuestions(companyId: string, count: number = 3): InterviewQuestion[] {
  const questions = INTERVIEW_QUESTIONS[companyId] || [];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getCompanyById(companyId: string): Company | undefined {
  return COMPANIES.find(c => c.id === companyId);
}

export const DIFFICULTY_COLORS = {
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#ef4444",
};
