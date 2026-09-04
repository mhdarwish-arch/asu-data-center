// Deterministic pseudo-random generator so "dummy" numbers are stable across
// renders and coherent across related views, instead of Math.random() noise.
export function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // returns a value in [0, 1)
  return ((h >>> 0) % 100000) / 100000;
}

// value in [min, max) deterministically seeded by a string key
export function seededRange(key, min, max) {
  return min + seeded(key) * (max - min);
}
