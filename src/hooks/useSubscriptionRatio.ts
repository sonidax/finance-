import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mockSubscriptionRatio, SubscriptionRatioRow } from '../lib/mockData';

export type { SubscriptionRatioRow };

export function useSubscriptionRatio() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionRatioRow[]>(mockSubscriptionRatio);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await api.getSubscriptionRatio();
        if (data && data.length > 0) {
          setSubscriptionData(data);
        } else {
          setSubscriptionData(mockSubscriptionRatio);
        }
      } catch (err) {
        setSubscriptionData(mockSubscriptionRatio);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { subscriptionData, loading, error: null };
}
