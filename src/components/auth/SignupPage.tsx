import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { brand } from "../../theme/tokens";
import { AuthShell } from "./AuthShell";
import { Field } from "./Field";

export function SignupPage({ onSignup, onSwitch }: { onSignup: () => void; onSwitch: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (data.session) onSignup();
    else setInfo("Check your email to confirm your account, then log in.");
  };

  return (
    <AuthShell>
      <div className="bg-white rounded-2xl shadow-xl shadow-emerald-100/50 p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: brand.ink }}>Create your account</h1>
        <p className="text-sm mb-6" style={{ color: brand.inkSoft }}>
          Start planning meals that fit your goals.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name">
            <input required value={form.name} onChange={upd("name")} placeholder="Jane Doe"
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={upd("email")} placeholder="you@example.com"
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
          </Field>
          <Field label="Password">
            <input type="password" required value={form.password} onChange={upd("password")} placeholder="At least 8 characters"
                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
          </Field>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>
          )}
          {info && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">{info}</div>
          )}
          <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold transition transform hover:-translate-y-0.5 hover:shadow-lg shadow-emerald-300/40 disabled:opacity-60"
                  style={{ background: brand.primary }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: brand.inkSoft }}>
          Already have an account?{" "}
          <button onClick={onSwitch} className="font-semibold" style={{ color: brand.primary }}>Log in</button>
        </p>
      </div>
    </AuthShell>
  );
}