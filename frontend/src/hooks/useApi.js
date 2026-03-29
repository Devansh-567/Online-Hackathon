/** Generic async state hook for API calls. */

import { useCallback, useState } from 'react';

export function useApi(fn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { data, error, loading, run };
}
