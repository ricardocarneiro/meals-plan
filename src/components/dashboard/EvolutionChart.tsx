import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { brand } from "../../theme/tokens";
import { MOCK_TRACKER_DATA } from "../../data/mockData";

export function EvolutionChart() {
  const [tab, setTab] = useState("month");
  const tabs = [
    { id: "month", label: "LAST MONTH" },
    { id: "week",  label: "LAST WEEK" },
    { id: "year",  label: "LAST YEAR" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold tracking-wide" style={{ color: brand.ink }}>OVERVIEW TRACKER</h2>
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`text-xs font-semibold tracking-widest pb-1 transition relative ${
                      tab === t.id ? "" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ color: tab === t.id ? brand.primary : brand.inkSoft }}>
              {t.label}
              {tab === t.id && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full"
                      style={{ background: brand.primary }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_TRACKER_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"  stopColor="#A8E6C5"/>
                <stop offset="100%" stopColor="#1FA876"/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#F1F5F4" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false}
                   tick={{ fill: brand.inkSoft, fontSize: 11, fontWeight: 600, letterSpacing: 1 }} />
            <YAxis axisLine={false} tickLine={false}
                   tick={{ fill: brand.inkSoft, fontSize: 11 }}
                   ticks={[300, 500, 700, 900]} domain={[200, 1000]} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
              labelStyle={{ fontWeight: 600 }} />
            <Line type="monotone" dataKey="value"
                  stroke="url(#lineGrad)" strokeWidth={4}
                  dot={{ r: 4, fill: brand.primary, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: brand.primary }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}