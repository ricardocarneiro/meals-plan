import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type MealTemplate = {
  id: string;
  user_id: string;
  category: string;
  icon: string | null;
  food: string;
  amount: string | null;
  position: number;
};

export type MealTemplateInput = {
  category: string;
  icon?: string | null;
  food: string;
  amount?: string | null;
  position?: number;
};

export function useMealTemplates(userId: string | undefined) {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!userId) { setTemplates([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("meal_templates")
      .select("*")
      .eq("user_id", userId)
      .order("position", { ascending: true });
    if (error) setError(error.message);
    else setTemplates((data ?? []) as MealTemplate[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  // Add a new template
  const addTemplate = async (input: MealTemplateInput) => {
    if (!userId) return { error: "No user" };
    const nextPosition = input.position ?? (templates.at(-1)?.position ?? 0) + 1;
    const { data, error } = await supabase
      .from("meal_templates")
      .insert({ ...input, user_id: userId, position: nextPosition })
      .select()
      .single();
    if (error) return { error: error.message };
    setTemplates((prev) => [...prev, data as MealTemplate]);
    return { error: null };
  };

  // Update an existing template
  const updateTemplate = async (id: string, updates: Partial<MealTemplateInput>) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
    const { error } = await supabase
      .from("meal_templates")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      await fetchTemplates();
      return { error: error.message };
    }
    return { error: null };
  };

  // Delete a template
  const deleteTemplate = async (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    const { error } = await supabase.from("meal_templates").delete().eq("id", id);
    if (error) {
      await fetchTemplates();
      return { error: error.message };
    }
    return { error: null };
  };

  return { templates, loading, error, addTemplate, updateTemplate, deleteTemplate, refetch: fetchTemplates };
}

// Helper: ensure today's meals are instantiated from template
export async function ensureTodaysMeals() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.rpc("ensure_meals_for_date", { target_date: today });
  return { count: data as number | null, error: error?.message ?? null };
}