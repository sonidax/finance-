import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mockCommodities, Commodity } from '../lib/mockData';

export type { Commodity };

export function useCommodities() {
  const [commodities, setCommodities] = useState<Commodity[]>(mockCommodities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCommodities() {
      try {
        setLoading(true);
        const data = await api.getCommodities();
        if (data && data.length > 0) {
          setCommodities(data);
        } else {
          setCommodities(mockCommodities);
        }
      } catch (err) {
        setCommodities(mockCommodities);
      } finally {
        setLoading(false);
      }
    }
    fetchCommodities();
  }, []);

  return { commodities, loading, error: null };
}
