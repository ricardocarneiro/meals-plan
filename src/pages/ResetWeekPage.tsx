import { useState } from "react";
import { RotateCcw, Check, AlertCircle } from "lucide-react";
import { brand } from "../theme/tokens";
import { useMeals } from "../hooks/useMeals";

type Props = {
  userId: string;
  onDone: () => void;
};

export function ResetWeekPage({ userId, onDone }: Props) {
  const { resetLastNDays } = useMeals(userId);
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setError(null);
    const { error } = await resetLastNDays(7);
    setResetting(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
    setTimeout(onDone, 1500);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
             style={{ background: brand.primarySoft }}>
          <RotateCcw size={28} style={{ color: brand.primary }} />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: brand.ink }}>
          Reset your week
        </h1>
        <p className="text-sm mb-6 max-w-md" style={{ color: brand.inkSoft }}>
          This will set every meal from the last 7 days back to{" "}
          <span className="font-semibold">Planned</span>. Tracked, Missed, and Swapped statuses
          will be cleared. The meals themselves stay — only their status is reset.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {done ? (
          <div className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl"
               style={{ background: brand.primarySoft, color: brand.primaryDark }}>
            <Check size={18} /> Week reset successfully. Returning to Overview…
          </div>
        ) : !confirming ? (
          <button onClick={() => setConfirming(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition hover:shadow-lg shadow-emerald-300/40"
                  style={{ background: brand.primary }}>
            <RotateCcw size={16} /> Reset last 7 days
          </button>
        ) : (
          <div className="flex flex-col gap-3 p-5 rounded-xl border-2 border-amber-200 bg-amber-50">
            <p className="text-sm font-medium" style={{ color: "#92400E" }}>
              Are you sure? This action can't be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirming(false)} disabled={resetting}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
                      style={{ color: brand.ink }}>
                Cancel
              </button>
              <button onClick={handleReset} disabled={resetting}
                      className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60"
                      style={{ background: "#DC2626" }}>
                {resetting ? "Resetting…" : "Yes, reset week"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}