import { clientNotExistError } from './errors';

// travelObject
export const travelObject = (obj: any, paths: string[]) => {
  try {
    const object = paths.reduce((acc, key) => {
      return acc[key];
    }, obj);
    return object;
  } catch (error) {
    return undefined;
  }
};

export const getClientFromExtension = async (key: string | string[]) => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const keys = Array.isArray(key) ? key : key.split('.');

  const wallet = travelObject(window, keys);

  if (wallet) {
    return wallet;
  }

  if (document.readyState === 'complete') {
    if (wallet) {
      return wallet;
    } else {
      throw clientNotExistError;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const wallet = travelObject(window as never, keys);

        if (wallet) {
          resolve(wallet);
        } else {
          reject(clientNotExistError);
        }

        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
