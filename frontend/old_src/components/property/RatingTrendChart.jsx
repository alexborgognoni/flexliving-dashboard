import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RatingTrendChart({ data }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-medium text-[#284e4c] mb-6">Rating Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fa" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [value.toFixed(1), "Average Rating"]}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#284e4c"
              strokeWidth={3}
              dot={{ fill: "#284e4c", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#284e4c" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
