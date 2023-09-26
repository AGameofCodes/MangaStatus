declare interface MapConstructor {
  groupBy<K, V>(arr: V[], fn: (v: V) => K): Map<K, V[]>;
}