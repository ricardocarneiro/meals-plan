import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type Meal = {
  id: string;
  user_id: string;
  category: string;
  icon: string | null;
  food: string;
  amount: string | null;
  meal_date: string;
  status: "planned" | "tracked" | "missed" | "swapped";
  position: number;
};

export function useMeals(userId: string | undefined, date?: string) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date ?? new Date().toISOString().slice(0, 10);

  const fetchMeals = useCallback(async () => {
    if (!userId) { setMeals([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .eq("meal_date", targetDate)
      .order("position", { ascending: true });
    if (error) setError(error.message);
    else setMeals((data ?? []) as Meal[]);
    setLoading(false);
  }, [userId, targetDate]);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  // Update meal status (Track / Missed / Swap)
  const updateStatus = async (mealId: string, status: Meal["status"]) => {
    setMeals((prev) => prev.map((m) => m.id === mealId ? { ...m, status } : m));
    const { error } = await supabase
      .from("meals")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", mealId);
    if (error) {
      await fetchMeals();
      return { error: error.message };
    }
    return { error: null };
  };

  // Reset today's meals back to "planned"
  const resetToday = async () => {
    if (!userId) return { error: "No user" };
    // Optimistic
    setMeals((prev) => prev.map((m) => ({ ...m, status: "planned" as const })));
    const { error } = await supabase
      .from("meals")
      .update({ status: "planned", updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("meal_date", targetDate);
    if (error) {
      await fetchMeals();
      return { error: error.message };
    }
    return { error: null };
  };

  // Reset the last N days back to "planned" (default: 7)
  const resetLastNDays = async (days = 7) => {
    if (!userId) return { error: "No user" };
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10);

    const { error } = await supabase
      .from("meals")
      .update({ status: "planned", updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .gte("meal_date", sinceStr);

    if (error) return { error: error.message };
    await fetchMeals(); // refresh current view
    return { error: null };
  };

  return { meals, loading, error, updateStatus, resetToday, resetLastNDays, refetch: fetchMeals };
}