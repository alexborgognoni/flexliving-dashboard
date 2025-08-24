import React from "react";

interface CategoryAverage {
  category: string;
  average?: number | null;
}

interface CategoryRatingsProps {
  reviewCount?: number;
  averageRating?: number | null;
  categoryAverages?: CategoryAverage[];
  allCategories?: string[];
  ratings?: Record<string, number>; // For individual review ratings
  compact?: boolean; // For smaller displays like modals
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
  categoryAverages = [],
  allCategories = DEFAULT_CATEGORIES,
  ratings,
  compact = false,
}: CategoryRatingsProps) {
  // Create a map for easy lookup of category averages or individual ratings
  const categoryMap: Record<string, number | null> = {};
  
  if (ratings) {
    // Use individual review ratings
    Object.entries(ratings).forEach(([key, value]) => {
      categoryMap[key] = value;
    });
  } else {
    // Use category averages
    categoryAverages.forEach((cat) => {
      categoryMap[cat.category] = cat.average ?? null;
    });
  }

  return (
    <div className={`bg-white rounded-2xl ${compact ? 'p-4' : 'p-6'} shadow-lg flex flex-col h-full`}>
      {/* Section Header */}
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Guest Ratings
          </h3>
          {reviewCount && (
            <span className="text-sm text-gray-500">Based on {reviewCount} reviews</span>
          )}
        </div>
      )}

      {/* Ratings Grid - 4x2 layout */}
      <div className="grid grid-cols-4 gap-3 flex-1 h-full w-full">
        {/* Overall Rating */}
        {averageRating !== null && averageRating !== undefined && (
          <div className="text-center p-3 rounded-xl bg-[#284e4c] text-white flex flex-col items-center justify-center shadow-sm h-full">
            <div className="text-xl font-bold mb-1">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide">Overall</div>
          </div>
        )}

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
              className="text-center p-3 rounded-xl bg-[#f1f3ee] flex flex-col items-center justify-center shadow-sm h-full"
            >
              <div className="text-xl font-bold text-[#284e4c] mb-1">
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
