import { BaseWallet } from "@titan-kit/core";

export const decorateWallet = <T extends BaseWallet>(
  wallet: T,
  decorateMethods: Partial<T>
): T => {
  return new Proxy(wallet, {
    get(target, prop, receiver) {
      if (prop in decorateMethods) {
        const value = decorateMethods[prop as keyof T];
        if (typeof value === "function") {
          return value.bind(target);
        }
        return value;
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (prop in decorateMethods) {
        (decorateMethods as any)[prop] = value;
        return true;
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
};
