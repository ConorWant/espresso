"use client";

import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  date: string;
  yield_g: number;
  ratio: number | null;
}

interface Props {
  data: DataPoint[];
}

export function RatioOverTime({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a2e24" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9c7e65" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#9c7e65" }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#9c7e65" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#1f1610", border: "1px solid #3a2e24", borderRadius: 8, color: "#f0e6d8" }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#9c7e65" }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="yield_g"
          stroke="#c8956c"
          strokeWidth={2}
          dot={false}
          name="Yield (g)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ratio"
          stroke="#e8c99a"
          strokeWidth={2}
          dot={false}
          name="Ratio"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
