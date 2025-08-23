import React from "react";

interface CategoryAverage {
  category: string;
  average?: number | null;
}

interface CategoryRatingsProps {
  reviewCount: number;
  averageRating?: number | null;
  categoryAverages: CategoryAverage[];
  allCategories?: string[]; // make optional
}

// Default categories if not provided
const DEFAULT_CATEGORIES = [
  "cleanliness",
  "communication",
  "check_in_experience",
  "listing_accuracy",
  "amenities",
  "location",
  "value_for_money",
];

export default function CategoryRatings({
  reviewCount,
  averageRating,
  categoryAverages,
  allCategories = DEFAULT_CATEGORIES,
}: CategoryRatingsProps) {
  // Create a map for easy lookup of category averages
  const categoryMap: Record<string, number | null> = {};
  categoryAverages.forEach((cat) => {
    categoryMap[cat.category] = cat.average ?? null;
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Guest Ratings
        </h3>
        <span className="text-sm text-gray-500">Based on {reviewCount} reviews</span>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Overall Rating */}
        <div className="text-center p-4 rounded-xl bg-[#284e4c] text-white flex flex-col items-center justify-center shadow-sm">
          <div className="text-2xl font-semibold mb-1">
            {averageRating !== null && averageRating !== undefined ? averageRating.toFixed(1) : "N/A"}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide">Overall</div>
        </div>

        {/* Category Ratings */}
        {allCategories.map((category) => {
          const displayName =
            category === "listing_accuracy"
              ? "Listing Accuracy"
              : category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

          const value = categoryMap[category];
          return (
            <div
              key={category}
              className="text-center p-4 rounded-xl bg-[#f1f3ee] flex flex-col items-center justify-center shadow-sm"
            >
              <div className="text-2xl font-semibold text-[#284e4c] mb-1">
                {value !== null && value !== undefined ? value.toFixed(1) : "No data"}
              </div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide break-words">
                {displayName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
