import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { brand } from "../../theme/tokens";
import { AuthShell } from "./AuthShell";
import { Field } from "./Field";

export function ResetPasswordPage({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else onDone();
  };

  return (
    <AuthShell>
      <div className="bg-white rounded-2xl shadow-xl shadow-emerald-100/50 p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: brand.ink }}>New password</h1>
        <p className="text-sm mb-6" style={{ color: brand.inkSoft }}>
          Choose a new password for your account.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="New password">
            <div className="relative">
              <input type={showPw ? "text" : "password"} required minLength={6} value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold transition transform hover:-translate-y-0.5 hover:shadow-lg shadow-emerald-300/40 disabled:opacity-60"
                  style={{ background: brand.primary }}>
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
