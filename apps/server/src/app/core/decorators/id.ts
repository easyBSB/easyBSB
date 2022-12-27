const usedIds = new Set();

export function Id(prefix = 'generated_id') {
  return function(target: unknown, key: PropertyKey): void {
    let id: string;
    do {
      id = Math.random().toString(32).substring(2);
    } while (usedIds.has(id));
    usedIds.add(id);

    const descriptor: PropertyDescriptor = {
      get(): string {
        // called multiple times
        // but on top is called only once
        return prefix + '_' + id;
      },
      enumerable: true,
      configurable: false
    }
    Object.defineProperty(target, key, descriptor);
  }
}
