import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { brand } from "../../theme/tokens";
import { AuthShell } from "./AuthShell";
import { Field } from "./Field";

export function ForgotPasswordPage({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <AuthShell>
      <div className="bg-white rounded-2xl shadow-xl shadow-emerald-100/50 p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: brand.ink }}>Reset password</h1>
        <p className="text-sm mb-6" style={{ color: brand.inkSoft }}>
          Enter your email and we'll send you a reset link.
        </p>
        {sent ? (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            Check your email for a password reset link.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                     placeholder="you@example.com"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
            </Field>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-semibold transition transform hover:-translate-y-0.5 hover:shadow-lg shadow-emerald-300/40 disabled:opacity-60"
                    style={{ background: brand.primary }}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
        <p className="text-center text-sm mt-6" style={{ color: brand.inkSoft }}>
          <button onClick={onBack} className="font-semibold" style={{ color: brand.primary }}>
            Back to login
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
