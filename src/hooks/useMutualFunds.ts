import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mockMutualFunds, MutualFund } from '../lib/mockData';

export type { MutualFund };

export function useMutualFunds() {
  const [funds, setFunds] = useState<MutualFund[]>(mockMutualFunds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFunds() {
      try {
        setLoading(true);
        const data = await api.getMutualFunds();
        if (data && data.length > 0) {
          setFunds(data);
        } else {
          setFunds(mockMutualFunds);
        }
      } catch (err) {
        setFunds(mockMutualFunds);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  return { funds, loading, error: null };
}
