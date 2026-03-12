"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  date: string;
  rating: number | null;
}

interface Props {
  data: DataPoint[];
  targetMin?: number;
  targetMax?: number;
}

export function RatingOverTime({ data, targetMin = 7, targetMax = 9 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <ReferenceLine y={targetMin} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "min", fontSize: 11 }} />
        <ReferenceLine y={targetMax} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "target", fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#8884d8"
          dot={{ r: 4 }}
          name="Rating"
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
