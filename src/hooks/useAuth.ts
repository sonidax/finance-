import { useState, useEffect } from "react";
import { api } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSession()
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    const result = await api.signUp(email, password, fullName, phone);
    setUser(result.data.user);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await api.signIn(email, password);
    setUser(result.data.user);
    return result;
  };

  const signOut = async () => {
    await api.signOut();
    setUser(null);
    return { error: null };
  };

  return { user, loading, signUp, signIn, signOut };
}
