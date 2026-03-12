"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface DataPoint {
  dose_g: number;
  yield_g: number;
  rating: number | null;
}

interface Props {
  data: DataPoint[];
}

function ratingColor(r: number | null) {
  if (r == null) return "#94a3b8";
  if (r >= 8) return "#22c55e";
  if (r >= 5) return "#f59e0b";
  return "#ef4444";
}

export function DoseVsYieldScatter({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3a2e24" />
        <XAxis
          dataKey="dose_g"
          name="Dose (g)"
          tick={{ fontSize: 12, fill: "#9c7e65" }}
          axisLine={false} tickLine={false}
          label={{ value: "Dose (g)", position: "insideBottom", offset: -2, fontSize: 12, fill: "#9c7e65" }}
        />
        <YAxis
          dataKey="yield_g"
          name="Yield (g)"
          tick={{ fontSize: 12, fill: "#9c7e65" }}
          axisLine={false} tickLine={false}
          label={{ value: "Yield (g)", angle: -90, position: "insideLeft", fontSize: 12, fill: "#9c7e65" }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "#9c7e65" }}
          contentStyle={{ background: "#1f1610", border: "1px solid #3a2e24", borderRadius: 8, color: "#f0e6d8" }}
        />
        <Scatter data={data} name="Shots">
          {data.map((entry, index) => (
            <Cell key={index} fill={ratingColor(entry.rating)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
