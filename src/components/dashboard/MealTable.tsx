import { useState } from "react";
import { Repeat, Loader2, RotateCcw } from "lucide-react";
import { brand } from "../../theme/tokens";
import { ConfirmModal } from "../shared/ConfirmModal";
import type { Meal } from "../../hooks/useMeals";

type Props = {
  meals: Meal[];
  loading: boolean;
  onTrack: (mealId: string) => void;
  onMissed: (mealId: string) => void;
  onSwap: (mealId: string) => void;
  onResetToday: () => Promise<{ error: string | null }>;
};

export function MealTable({ meals, loading, onTrack, onMissed, onSwap, onResetToday }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const hasAnyMarked = meals.some((m) => m.status !== "planned");

  const handleReset = async () => {
    setResetting(true);
    await onResetToday();
    setResetting(false);
    setConfirmOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 overflow-hidden">
      <div className="h-56 relative overflow-hidden"
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80')",
             backgroundSize: "cover", backgroundPosition: "center",
           }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-4 left-5 text-white">
          <div className="text-xs uppercase tracking-widest opacity-90">Today's Plate</div>
          <div className="text-lg font-semibold">Grilled Beef Salad Bowl</div>
        </div>
        {hasAnyMarked && (
          <button onClick={() => setConfirmOpen(true)}
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-semibold hover:bg-white transition shadow"
                  style={{ color: brand.ink }}>
            <RotateCcw size={12} /> Reset today
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider pb-3 border-b border-gray-100"
             style={{ color: brand.inkSoft }}>
          <div className="col-span-3">Category</div>
          <div className="col-span-4">Sample Food</div>
          <div className="col-span-3">Amount</div>
          <div className="col-span-2 text-right">Exchange</div>
        </div>

        {loading && (
          <div className="py-12 flex items-center justify-center" style={{ color: brand.inkSoft }}>
            <Loader2 size={20} className="animate-spin mr-2" /> Loading meals…
          </div>
        )}

        {!loading && meals.length === 0 && (
          <div className="py-12 text-center" style={{ color: brand.inkSoft }}>
            No meals planned for today.
          </div>
        )}

        {!loading && meals.map((m) => (
          <div key={m.id}
               className="grid grid-cols-12 items-center py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition rounded-lg -mx-2 px-2">
            <div className="col-span-3 flex items-center gap-2">
              <span className="text-lg">{m.icon ?? "🍽️"}</span>
              <span className="text-sm font-medium" style={{ color: brand.ink }}>{m.category}</span>
            </div>
            <div className="col-span-4 text-sm" style={{ color: brand.ink }}>{m.food}</div>
            <div className="col-span-3 text-sm" style={{ color: brand.inkSoft }}>{m.amount ?? "—"}</div>
            <div className="col-span-2 flex justify-end gap-2">
              <ActionButtons meal={m} onTrack={onTrack} onMissed={onMissed} onSwap={onSwap} />
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Reset today's meals?"
        message="All meals marked as Tracked, Missed, or Swapped will be set back to Planned. This can't be undone."
        confirmLabel="Reset today"
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
        loading={resetting}
      />
    </div>
  );
}

function ActionButtons({
  meal, onTrack, onMissed, onSwap,
}: { meal: Meal; onTrack: (id: string) => void; onMissed: (id: string) => void; onSwap: (id: string) => void; }) {
  if (meal.status === "tracked") {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: brand.primarySoft, color: brand.primaryDark }}>
        ✓ Tracked
      </span>
    );
  }
  if (meal.status === "missed") {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600">
        Missed
      </span>
    );
  }
  if (meal.status === "swapped") {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700">
        Swapped
      </span>
    );
  }
  return (
    <>
      <button onClick={() => onSwap(meal.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:border-emerald-300 hover:text-emerald-600 transition"
              style={{ color: brand.inkSoft }}>
        Swap <Repeat size={12} />
      </button>
      <button onClick={() => onMissed(meal.id)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50"
              style={{ color: brand.inkSoft }}>Missed</button>
      <button onClick={() => onTrack(meal.id)}
              className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:shadow-md transition"
              style={{ background: brand.primary }}>Track</button>
    </>
  );
}