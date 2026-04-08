import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { gForceChartData } from "@/data/mockData";

export function GForceChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">G-Force Peaks</p>
          <p className="text-lg font-semibold text-foreground mt-1">Real-time Monitoring</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-destructive/15 text-destructive font-medium">
          2 Alerts
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={gForceChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gForceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 16%)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 16%, 52%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 16%, 52%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 10%, 10%)",
                border: "1px solid hsl(220, 10%, 16%)",
                borderRadius: "8px",
                color: "hsl(210, 17%, 82%)",
                fontSize: 13,
              }}
            />
            <ReferenceLine y={5} stroke="hsl(0, 72%, 51%)" strokeDasharray="6 4" label={{ value: "Threshold", fill: "hsl(0, 72%, 51%)", fontSize: 11 }} />
            <Area type="monotone" dataKey="gForce" stroke="hsl(160, 60%, 45%)" fill="url(#gForceGradient)" strokeWidth={2} dot={{ r: 3, fill: "hsl(160, 60%, 45%)" }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
