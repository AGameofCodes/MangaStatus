export function strip_<T extends {} | object>(obj: T): T {
  Object.keys(obj).filter(e => e.startsWith('_')).forEach(k => delete (obj as any)[k]);
  return obj;
}