import { Utensils, Flame, Droplet, Timer } from "lucide-react";
import { brand } from "../theme/tokens";
import { StatCard } from "../components/dashboard/StatCard";
import { MealTable } from "../components/dashboard/MealTable";
import { WaterTracker } from "../components/dashboard/WaterTracker";
import { EvolutionChart } from "../components/dashboard/EvolutionChart";
import { useMeals } from "../hooks/useMeals";
import { useWaterLogs } from "../hooks/useWaterLogs";
import type { Profile } from "../hooks/useProfile";

type User = { id: string; name: string };

export function Overview({ user, profile }: { user: User; profile: Profile }) {
  const { meals, loading: mealsLoading, updateStatus, resetToday } = useMeals(user.id);
  const { logs, totalOz, loading: waterLoading, addLog, deleteLog, resetToday: resetWater } = useWaterLogs(user.id);

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm shadow-gray-100">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: brand.inkSoft }}>Overview</div>
          <div className="text-2xl font-bold mt-1" style={{ color: brand.ink }}>{user.name}</div>
          <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: brand.primary }}>
            <Utensils size={14} /> Your current meal
          </div>
        </div>
        <div className="col-span-3"><StatCard label="Calories Tracker" value={profile.daily_calories_goal.toLocaleString()} unit="Cal" icon={Flame}  color="#22C55E" seed={1} /></div>
        <div className="col-span-3"><StatCard label="Water Tracker"    value={Math.round(totalOz).toString()}                unit="oz"  icon={Droplet} color="#EF4DA0" seed={3} /></div>
        <div className="col-span-3"><StatCard label="Exercise Tracker" value={profile.exercise_min_goal.toString()}          unit="min" icon={Timer}   color="#3B82F6" seed={5} /></div>
      </div>

      {/* Meals + Water */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <MealTable
            meals={meals}
            loading={mealsLoading}
            onTrack={(id) => updateStatus(id, "tracked")}
            onMissed={(id) => updateStatus(id, "missed")}
            onSwap={(id) => updateStatus(id, "swapped")}
            onResetToday={resetToday}
          />
        </div>
        <div className="col-span-4">
          <WaterTracker
            logs={logs}
            totalOz={totalOz}
            loading={waterLoading}
            minGoal={profile.water_min_goal}
            maxGoal={profile.water_max_goal}
            onAdd={addLog}
            onDelete={deleteLog}
            onReset={resetWater}
          />
        </div>
      </div>

      <EvolutionChart />
    </div>
  );
}