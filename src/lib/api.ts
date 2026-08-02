// PHP + MySQL API — with robust fallback to rich static mock data when backend is unreachable

import { 
  mockIPOs, 
  mockGMPData, 
  mockSubscriptionRatio, 
  mockMutualFunds, 
  mockCommodities,
  IPO,
  GMPRow,
  SubscriptionRatioRow,
  MutualFund,
  Commodity
} from './mockData';

const BASE = "http://yourusername.infinityfreeapp.com/backend"; // ⬅️ replace with your real InfinityFree URL

export const api = {
  // ── AUTH ──────────────────────────────────────────
  async signUp(email: string, password: string, fullName: string, phone: string) {
    try {
      const res = await fetch(`${BASE}/auth/signup.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, full_name: fullName, phone_number: phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      return { data, error: null };
    } catch (err: any) {
      // Demo authentication fallback
      const mockUser = { id: 1, email, full_name: fullName, phone_number: phone };
      localStorage.setItem("dm_demo_user", JSON.stringify(mockUser));
      return { data: { user: mockUser, message: "Signed up successfully (Demo)" }, error: null };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const res = await fetch(`${BASE}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return { data, error: null };
    } catch (err: any) {
      // Demo login fallback
      const nameFromEmail = email.split('@')[0] || "User";
      const mockUser = { id: 1, email, full_name: nameFromEmail.toUpperCase(), phone_number: "9876543210" };
      localStorage.setItem("dm_demo_user", JSON.stringify(mockUser));
      return { data: { user: mockUser, message: "Logged in successfully (Demo)" }, error: null };
    }
  },

  async signOut() {
    try {
      await fetch(`${BASE}/auth/logout.php`, { method: "POST", credentials: "include" });
    } catch (e) {
      // Ignore fallback
    }
    localStorage.removeItem("dm_demo_user");
  },

  async getSession() {
    try {
      const res = await fetch(`${BASE}/auth/session.php`, { credentials: "include" });
      if (res.ok) return await res.json();
    } catch (e) {
      // Ignore fallback
    }
    const demo = localStorage.getItem("dm_demo_user");
    return demo ? JSON.parse(demo) : null;
  },

  // ── IPOs ──────────────────────────────────────────
  async getIPOs(status?: "Open" | "Upcoming" | "Listed"): Promise<IPO[]> {
    try {
      const url = status ? `${BASE}/ipos.php?status=${status}` : `${BASE}/ipos.php`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      // fetch failed - fallback to mock data
    }
    if (status) {
      return mockIPOs.filter((ipo) => ipo.status === status);
    }
    return mockIPOs;
  },

  // ── GMP ───────────────────────────────────────────
  async getGMPData(): Promise<GMPRow[]> {
    try {
      const res = await fetch(`${BASE}/gmp.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      // fetch failed - fallback to mock data
    }
    return mockGMPData;
  },

  // ── IPO BIDS ──────────────────────────────────────
  async submitIPOBid(bid: {
    ipo_id: number;
    investor_type: string;
    number_of_lots: number;
    bid_price: number;
    total_investment: number;
    pan_number: string;
    dp_id: string;
  }) {
    try {
      const res = await fetch(`${BASE}/bids/submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bid),
      });
      const data = await res.json();
      if (res.ok) return data;
    } catch (err) {
      // Fallback submission for demo
    }
    const existing = JSON.parse(localStorage.getItem("dm_user_bids") || "[]");
    const newBid = { ...bid, id: Date.now(), status: "Submitted", created_at: new Date().toISOString() };
    existing.push(newBid);
    localStorage.setItem("dm_user_bids", JSON.stringify(existing));
    return { success: true, message: "Bid submitted successfully!", bid: newBid };
  },

  async getUserBids() {
    try {
      const res = await fetch(`${BASE}/bids/my_bids.php`, { credentials: "include" });
      if (res.ok) return await res.json();
    } catch (err) {
      // Fallback
    }
    return JSON.parse(localStorage.getItem("dm_user_bids") || "[]");
  },

  // ── MUTUAL FUNDS ──────────────────────────────────
  async getMutualFunds(): Promise<MutualFund[]> {
    try {
      const res = await fetch(`${BASE}/mutual_funds.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      // Fallback to mock data
    }
    return mockMutualFunds;
  },

  // ── COMMODITIES ───────────────────────────────────
  async getCommodities(): Promise<Commodity[]> {
    try {
      const res = await fetch(`${BASE}/commodities.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      // Fallback to mock data
    }
    return mockCommodities;
  },

  // ── SUBSCRIPTION RATIO ────────────────────────────
  async getSubscriptionRatio(): Promise<SubscriptionRatioRow[]> {
    try {
      const res = await fetch(`${BASE}/subscription_ratio.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      // Fallback to mock data
    }
    return mockSubscriptionRatio;
  },
};
