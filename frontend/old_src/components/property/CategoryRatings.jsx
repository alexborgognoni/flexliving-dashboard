import React from "react";

export default function CategoryRatings({
  reviewCount,
  averageRating,
  categoryAverages,
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-light text-[#284e4c]">Guest Ratings</h3>
        <div className="text-sm text-gray-500">({reviewCount} reviews)</div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div className="text-center p-4 rounded-xl bg-[#284e4c] text-white flex flex-col justify-center">
            <div className="text-2xl font-light mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide">
              Overall
            </div>
          </div>

          {categoryAverages.map((category) => (
            <div
              key={category.category}
              className="text-center p-4 rounded-xl bg-[#f1f3ee] flex flex-col justify-center"
            >
              <div className="text-2xl font-light text-[#284e4c] mb-2">
                {category.average.toFixed(1)}
              </div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide break-words">
                {category.category === "listing_accuracy"
                  ? "Listing Accuracy"
                  : category.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
