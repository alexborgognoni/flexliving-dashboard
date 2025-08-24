import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  month: string;
  average: number;
  count: number;
}

interface RatingTrendChartProps {
  data?: TrendData[]; // make optional
}

export default function RatingTrendChart({ data = [] }: RatingTrendChartProps) {
  const hasData = data.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
      {/* Section Header */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating Trend</h3>

      {hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                formatter={(value: any) => [value.toFixed(1), "Average Rating"]}
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
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
          No trend data available
        </div>
      )}
    </div>
  );
}
