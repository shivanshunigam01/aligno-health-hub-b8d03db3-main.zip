/** Bridge between api layer and store cache — avoids circular imports */
type Listener = () => void;

const listeners = new Set<Listener>();
const cache = new Map<string, unknown>();
let storeVersion = 0;

export function storeSubscribe(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function storeEmit() {
  storeVersion += 1;
  listeners.forEach((l) => l());
}

export function storeWrite<T>(key: string, value: T) {
  cache.set(key, value);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota */
    }
  }
  storeEmit();
}

export function storeRead<T>(key: string, fallback?: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        cache.set(key, parsed);
        return parsed;
      }
    } catch {
      /* ignore */
    }
  }
  if (fallback !== undefined) {
    cache.set(key, fallback);
    return fallback;
  }
  return [] as T;
}

export function getStoreVersion() {
  return storeVersion;
}
