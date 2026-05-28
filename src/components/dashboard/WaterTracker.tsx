import { useState } from "react";
import { Droplet, Plus, Trash2, Loader2, RotateCcw } from "lucide-react";
import { brand } from "../../theme/tokens";
import { ConfirmModal } from "../shared/ConfirmModal";
import type { WaterLog } from "../../hooks/useWaterLogs";

type Props = {
  logs: WaterLog[];
  totalOz: number;
  loading: boolean;
  minGoal: number;
  maxGoal: number;
  onAdd: (oz: number) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
  onReset: () => Promise<{ error: string | null }>;
};

export function WaterTracker({ logs, totalOz, loading, minGoal, maxGoal, onAdd, onDelete, onReset }: Props) {
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const radius = 70, circ = 2 * Math.PI * radius;
  const pct = Math.min(totalOz / maxGoal, 1);
  const reachedMin = totalOz >= minGoal;
  const reachedMax = totalOz >= maxGoal;

  const handleAdd = async () => {
    const v = parseFloat(input);
    if (isNaN(v) || v <= 0) {
      setError("Enter a positive number");
      return;
    }
    setError(null);
    setAdding(true);
    const { error } = await onAdd(v);
    setAdding(false);
    if (error) setError(error);
    else setInput("");
  };

  const handleReset = async () => {
    await onReset();
    setConfirmReset(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="text-xs font-bold tracking-widest" style={{ color: brand.inkSoft }}>
          WATER TRACKER
        </div>
        {logs.length > 0 && (
          <button onClick={() => setConfirmReset(true)}
                  className="text-[10px] font-semibold inline-flex items-center gap-1 hover:underline"
                  style={{ color: brand.inkSoft }}>
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col items-center gap-5">
        <div className="flex items-center gap-5">
          {/* Circular progress */}
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              <circle cx="90" cy="90" r={radius} fill="none" stroke={brand.line} strokeWidth="6"/>
              <circle cx="90" cy="90" r={radius} fill="none"
                      stroke={reachedMax ? "#1FA876" : brand.primary}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - pct)}
                      style={{ transition: "stroke-dashoffset 0.6s ease" }}/>
              <circle cx="90" cy={90 - radius} r="5" fill={brand.primary} transform="rotate(90 90 90)"/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplet size={20} style={{ color: brand.primary }} />
              <div className="text-3xl font-bold mt-1" style={{ color: brand.ink }}>
                {Math.round(totalOz)}
              </div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: brand.inkSoft }}>
                of {maxGoal} oz
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="flex flex-col gap-3">
            <div className="px-4 py-3 rounded-xl text-center"
                 style={{ background: reachedMin ? brand.primarySoft : "#F9FAFB" }}>
              <div className="text-[10px] uppercase tracking-widest font-semibold"
                   style={{ color: reachedMin ? brand.primaryDark : brand.inkSoft }}>
                Min Goal {reachedMin && "✓"}
              </div>
              <div className="text-xl font-bold"
                   style={{ color: reachedMin ? brand.primaryDark : brand.ink }}>
                {minGoal}
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl text-center border border-gray-200"
                 style={{ background: reachedMax ? brand.primarySoft : "transparent" }}>
              <div className="text-[10px] uppercase tracking-widest font-semibold"
                   style={{ color: reachedMax ? brand.primaryDark : brand.inkSoft }}>
                Max Goal {reachedMax && "✓"}
              </div>
              <div className="text-xl font-bold"
                   style={{ color: reachedMax ? brand.primaryDark : brand.ink }}>
                {maxGoal}
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="w-full">
          <div className="flex gap-2">
            <input value={input}
                   onChange={(e) => { setInput(e.target.value); setError(null); }}
                   onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                   type="number" step="0.1" min="0"
                   placeholder="Track your water value"
                   className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition" />
            <div className="w-16 px-4 py-3 rounded-xl border border-gray-200 text-sm flex items-center justify-center"
                 style={{ color: brand.inkSoft }}>oz</div>
          </div>
          {error && (
            <div className="text-xs text-red-600 mt-1.5">{error}</div>
          )}
        </div>

        <button onClick={handleAdd}
                disabled={adding || !input}
                className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:shadow-lg shadow-emerald-300/40 transition disabled:opacity-60"
                style={{ background: brand.primary }}>
          {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {adding ? "Saving" : "TRACKER"}
          {!adding && <Plus size={16} />}
        </button>

        {/* Today's history */}
        {logs.length > 0 && (
          <div className="w-full pt-3 border-t border-gray-100">
            <div className="text-[10px] uppercase tracking-widest font-semibold mb-2"
                 style={{ color: brand.inkSoft }}>
              Today's entries
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id}
                     className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-gray-50 group">
                  <div className="flex items-center gap-2">
                    <Droplet size={12} style={{ color: brand.primary }} />
                    <span className="font-medium" style={{ color: brand.ink }}>
                      {Number(log.amount_oz).toFixed(log.amount_oz % 1 === 0 ? 0 : 1)} oz
                    </span>
                    <span style={{ color: brand.inkSoft }}>
                      at {new Date(log.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <button onClick={() => onDelete(log.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && logs.length === 0 && (
          <div className="text-xs flex items-center gap-1.5" style={{ color: brand.inkSoft }}>
            <Loader2 size={12} className="animate-spin" /> Loading…
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmReset}
        title="Reset today's water?"
        message="All water entries for today will be deleted. This can't be undone."
        confirmLabel="Reset water"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}