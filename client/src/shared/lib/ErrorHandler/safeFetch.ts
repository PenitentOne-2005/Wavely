async function safeFetch<T>(
  promise: Promise<T>,
  fallback: T,
  errorMessage?: string,
): Promise<T> {
  try {
    const data = await promise;

    return data ?? fallback;
  } catch (error) {
    if (errorMessage) {
      console.error(errorMessage, error);
    }

    return fallback;
  }
}

export default safeFetch;
