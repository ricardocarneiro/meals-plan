import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type WaterLog = {
  id: string;
  user_id: string;
  amount_oz: number;
  log_date: string;
  logged_at: string;
};

export function useWaterLogs(userId: string | undefined, date?: string) {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date ?? new Date().toISOString().slice(0, 10);

  const fetchLogs = useCallback(async () => {
    if (!userId) { setLogs([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", targetDate)
      .order("logged_at", { ascending: false });
    if (error) setError(error.message);
    else setLogs((data ?? []) as WaterLog[]);
    setLoading(false);
  }, [userId, targetDate]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Sum of all logs for the day
  const totalOz = logs.reduce((sum, l) => sum + Number(l.amount_oz), 0);

  // Add a new water entry
  const addLog = async (amount_oz: number) => {
    if (!userId) return { error: "No user" };
    if (!amount_oz || amount_oz <= 0) return { error: "Invalid amount" };

    const { data, error } = await supabase
      .from("water_logs")
      .insert({ user_id: userId, amount_oz, log_date: targetDate })
      .select()
      .single();
    if (error) return { error: error.message };
    setLogs((prev) => [data as WaterLog, ...prev]);
    return { error: null };
  };

  // Delete an entry (e.g. user logged wrong amount)
  const deleteLog = async (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    const { error } = await supabase.from("water_logs").delete().eq("id", id);
    if (error) {
      await fetchLogs();
      return { error: error.message };
    }
    return { error: null };
  };

  // Reset all logs for today
  const resetToday = async () => {
    if (!userId) return { error: "No user" };
    setLogs([]);
    const { error } = await supabase
      .from("water_logs")
      .delete()
      .eq("user_id", userId)
      .eq("log_date", targetDate);
    if (error) {
      await fetchLogs();
      return { error: error.message };
    }
    return { error: null };
  };

  return { logs, totalOz, loading, error, addLog, deleteLog, resetToday, refetch: fetchLogs };
}