export default function groupBy<K, V>(arr: V[], fn: (v: V) => K): Map<K, V[]> {
  const map = new Map<K, V[]>();
  arr.forEach(e => {
    const key = fn(e);
    if (!map.has(key)) {
      map.set(key, [] as V[]);
    }
    map.get(key)!.push(e);
  });
  return map;
}