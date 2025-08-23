import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RatingData {
  rating: string;
  count: number;
}

interface RatingDistributionChartProps {
  data?: RatingData[]; // optional
}

export default function RatingDistributionChart({ data = [] }: RatingDistributionChartProps) {
  const hasData = data.some((d) => d.count > 0); // check that at least one count exists

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
      {/* Section Header */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Rating Distribution
      </h3>

      {hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fa" />
              <XAxis
                dataKey="rating"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => parseInt(value) % 2 === 0 ? value : ''}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#284e4c" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
          No rating data available
        </div>
      )}
    </div>
  );
}
