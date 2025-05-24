const pendingRequests = new Map<string, Promise<any>>();

/**
 * Deduplicate async calls to avoid multiple identical requests.
 * @param key - A unique key representing the request.
 * @param asyncFn - A function that returns a Promise.
 * @returns A Promise resolving to the result of the async function.
 */
export async function dedupeAsync<T>(
  key: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = asyncFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
