import { useState } from "react";
import { User as UserIcon, Save, Check } from "lucide-react";
import { brand } from "../theme/tokens";
import type { Profile } from "../hooks/useProfile";

type Props = {
  profile: Profile;
  email: string;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
};

export function ProfilePage({ profile, email, updateProfile }: Props) {
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    daily_calories_goal: profile.daily_calories_goal,
    water_min_goal: profile.water_min_goal,
    water_max_goal: profile.water_max_goal,
    exercise_min_goal: profile.exercise_min_goal,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setSaved(false);
    setForm((f) => ({
      ...f,
      [field]: field === "full_name" ? value : Number(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (error) setError(error);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
             style={{ background: brand.primarySoft }}>
          <UserIcon size={24} style={{ color: brand.primary }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: brand.ink }}>Your Profile</h1>
          <p className="text-sm" style={{ color: brand.inkSoft }}>
            Update your info and daily goals
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 p-8 space-y-6">
        <Section title="Personal info">
          <FormField label="Full name">
            <input value={form.full_name} onChange={(e) => handleChange("full_name", e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
          </FormField>
          <FormField label="Email">
            <input value={email} disabled
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
            <p className="text-xs mt-1" style={{ color: brand.inkSoft }}>
              Email is managed by your account and can't be changed here.
            </p>
          </FormField>
        </Section>

        <div className="border-t border-gray-100 pt-6">
          <Section title="Daily goals">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Calories (Cal)">
                <input type="number" value={form.daily_calories_goal}
                       onChange={(e) => handleChange("daily_calories_goal", e.target.value)}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
              </FormField>
              <FormField label="Exercise (min)">
                <input type="number" value={form.exercise_min_goal}
                       onChange={(e) => handleChange("exercise_min_goal", e.target.value)}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
              </FormField>
              <FormField label="Water min (oz)">
                <input type="number" value={form.water_min_goal}
                       onChange={(e) => handleChange("water_min_goal", e.target.value)}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
              </FormField>
              <FormField label="Water max (oz)">
                <input type="number" value={form.water_max_goal}
                       onChange={(e) => handleChange("water_max_goal", e.target.value)}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
              </FormField>
            </div>
          </Section>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition hover:shadow-lg shadow-emerald-300/40 disabled:opacity-60"
                  style={{ background: brand.primary }}>
            <Save size={16} />
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: brand.primaryDark }}>
              <Check size={16} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h2 className="text-xs font-bold tracking-widest" style={{ color: brand.primary }}>
      {title.toUpperCase()}
    </h2>
    {children}
  </div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
          style={{ color: brand.inkSoft }}>{label}</span>
    {children}
  </label>
);