import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  daily_calories_goal: number;
  water_min_goal: number;
  water_max_goal: number;
  exercise_min_goal: number;
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca o perfil quando o userId muda
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setProfile(data as Profile);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  // Função para atualizar campos do perfil
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return { error: "No user" };
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (!error && data) setProfile(data as Profile);
    return { error: error?.message ?? null };
  };

  return { profile, loading, error, updateProfile };
}