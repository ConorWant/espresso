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
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="yield_g"
          stroke="#8884d8"
          dot={false}
          name="Yield (g)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ratio"
          stroke="#82ca9d"
          dot={false}
          name="Ratio"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
