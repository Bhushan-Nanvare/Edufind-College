"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CollegeDetail } from "@/lib/types";

interface CompareChartProps {
  colleges: CollegeDetail[];
  dataKey: string;
  extractData?: (college: CollegeDetail) => number;
  yAxisLabel: string;
  formatValue: (val: number) => string;
}

export function CompareChart({ colleges, dataKey, extractData, yAxisLabel, formatValue }: CompareChartProps) {
  const data = colleges.map((c) => {
    const value = extractData
      ? extractData(c)
      : Number((c as unknown as Record<string, unknown>)[dataKey]) || 0;

    return {
      name: c.name.length > 20 ? `${c.name.substring(0, 20)}...` : c.name,
      fullName: c.name,
      value,
    };
  });

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} dy={10} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          tickFormatter={(value) => (dataKey === "fees" ? (value / 100000).toString() : value.toString())}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: "insideLeft",
            fill: "hsl(var(--muted-foreground))",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0].payload as { fullName: string; value: number };
            return (
              <div className="rounded-lg border bg-card p-3 text-sm shadow-md">
                <p className="mb-1 font-medium">{item.fullName}</p>
                <p className="font-bold text-primary">{formatValue(item.value)}</p>
              </div>
            );
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
