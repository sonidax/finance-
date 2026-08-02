import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mockIPOs, mockGMPData, IPO, GMPRow } from '../lib/mockData';

export type { IPO, GMPRow };

export function useIPOs(status?: 'Open' | 'Upcoming' | 'Listed') {
  const [ipos, setIPOs] = useState<IPO[]>(
    status ? mockIPOs.filter((i) => i.status === status) : mockIPOs
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchIPOs() {
      try {
        setLoading(true);
        const data = await api.getIPOs(status);
        if (data && data.length > 0) {
          setIPOs(data);
        } else {
          setIPOs(status ? mockIPOs.filter((i) => i.status === status) : mockIPOs);
        }
      } catch (err) {
        setIPOs(status ? mockIPOs.filter((i) => i.status === status) : mockIPOs);
      } finally {
        setLoading(false);
      }
    }
    fetchIPOs();
  }, [status]);

  return { ipos, loading, error: null };
}

export function useGMPData() {
  const [gmpData, setGMPData] = useState<GMPRow[]>(mockGMPData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGMP() {
      try {
        setLoading(true);
        const data = await api.getGMPData();
        if (data && data.length > 0) {
          setGMPData(data);
        } else {
          setGMPData(mockGMPData);
        }
      } catch (err) {
        setGMPData(mockGMPData);
      } finally {
        setLoading(false);
      }
    }
    fetchGMP();
  }, []);

  return { gmpData, loading, error: null };
}
