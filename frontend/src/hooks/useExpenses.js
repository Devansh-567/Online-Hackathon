/** Loads paginated expenses for dashboard views. */

import { useCallback, useEffect, useState } from 'react';
import { fetchExpenses } from '../services/expenseService.js';

export function useExpenses() {
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: null, result: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await fetchExpenses({ page, limit: 50 });
      setState({ loading: false, error: null, result });
    } catch (e) {
      setState({ loading: false, error: e, result: null });
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return { page, setPage, ...state, reload: load };
}
