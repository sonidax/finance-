import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface IPOBid {
  id: number;
  user_id: number;
  ipo_id: number;
  investor_type: 'Retail' | 'HNI' | 'QIB';
  number_of_lots: number;
  bid_price: number;
  total_investment: number;
  pan_number: string;
  dp_id: string;
  allotment_status: 'Applied' | 'Allotted' | 'Not Allotted';
  created_at: string;
  // joined from ipos
  ipo_name?: string;
  status?: string;
  price_band?: string;
}

export interface SubmitBidPayload {
  ipo_id: number;
  investor_type: string;
  number_of_lots: number;
  bid_price: number;
  total_investment: number;
  pan_number: string;
  dp_id: string;
}

export function useIPOBids() {
  const [bids, setBids] = useState<IPOBid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const data = await api.getUserBids();
      setBids(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const submitBid = async (bid: SubmitBidPayload) => {
    try {
      setLoading(true);
      const data = await api.submitIPOBid(bid);
      await fetchBids(); // refresh list
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { bids, loading, error, submitBid };
}
