// Small Levenshtein distance for "did you mean" suggestions at the desk —
// no dependency needed for this scale of data (a few hundred rows/event).
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function fuzzyMatchScore(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (!q) return Infinity;
  if (t.includes(q)) return 0;
  return levenshtein(q, t);
}
