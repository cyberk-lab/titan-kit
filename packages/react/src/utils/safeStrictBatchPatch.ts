type MethodPatch<T, K extends keyof T> = T[K] extends (...args: any[]) => any
  ? (original: T[K], ...args: Parameters<T[K]>) => ReturnType<T[K]>
  : never;

type PropertyPatch<T, K extends keyof T> = T[K];

type DescriptorPatch = PropertyDescriptor;

type PatchConfig<T> = {
  [K in keyof T]?: MethodPatch<T, K> | PropertyPatch<T, K> | DescriptorPatch;
};

export function safeStrictBatchPatch<T>(
  target: T,
  patches: PatchConfig<T>
): void {
  (Object.keys(patches) as (keyof T)[]).forEach((key) => {
    const patch = patches[key];
    const original = target[key];

    const isDescriptor =
      patch &&
      typeof patch === 'object' &&
      (typeof (patch as PropertyDescriptor).get === 'function' ||
        typeof (patch as PropertyDescriptor).set === 'function');

    if (isDescriptor) {
      const descriptor = patch as PropertyDescriptor;
      const originalDescriptor = Object.getOwnPropertyDescriptor(target, key);
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: originalDescriptor ? originalDescriptor.enumerable : true,
        ...descriptor,
      });
    } else if (typeof original === 'function' && typeof patch === 'function') {
      // ⬇ 这里精准类型推导
      type OrigFunc = typeof original;
      type Args = OrigFunc extends (...args: infer P) => any ? P : never;
      type Ret = OrigFunc extends (...args: any[]) => infer R ? R : any;

      (target as any)[key] = function (...args: Args): Ret {
        return (patch as MethodPatch<T, typeof key>).call(
          this,
          original.bind(this),
          ...args
        );
      };
    } else {
      (target as any)[key] = patch;
    }
  });
}
