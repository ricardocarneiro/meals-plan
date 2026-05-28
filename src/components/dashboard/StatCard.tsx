import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { brand } from "../../theme/tokens";
import { SPARKLINE } from "../../data/mockData";

type Props = {
  label: string; value: string; unit: string;
  icon: any; color: string; seed: number;
};

export function StatCard({ label, value, unit, icon: Icon, color, seed }: Props) {
  const data = useMemo(() => SPARKLINE(seed), [seed]);
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm shadow-gray-100">
      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brand.inkSoft }}>
        {label}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <Icon size={18} style={{ color }} />
        <span className="text-3xl font-bold" style={{ color: brand.ink }}>{value}</span>
        <span className="text-sm" style={{ color: brand.inkSoft }}>{unit}</span>
      </div>
      <div className="h-10 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2}
                  fill={`url(#grad-${seed})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}