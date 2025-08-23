import React from "react";
import { X, User, Calendar, Star, ToggleRight, ToggleLeft } from "lucide-react";

export default function ReviewDetailsPopover({
  review,
  onClose,
  onToggleStatus,
}) {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="review-popover bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-[#2d5a4d] px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-medium text-white">Review Details</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleStatus(review.id, review.status)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors bg-white"
            >
              {review.status === "published" ? (
                <>
                  <ToggleRight size={20} className="text-green-500" />
                  <span className="text-green-600 text-sm font-medium">
                    Published
                  </span>
                </>
              ) : (
                <>
                  <ToggleLeft size={20} className="text-gray-400" />
                  <span className="text-gray-500 text-sm font-medium">
                    Unpublished
                  </span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-[#2d5a4d] rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium text-gray-900">
                {review.guestName}
              </h4>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <Calendar size={14} />
                {new Date(review.submittedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-lg font-medium text-gray-900 mb-4">
              Guest Ratings
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#2d5a4d] text-white flex flex-col justify-center">
                <div className="text-2xl font-light mb-2">
                  {review.rating.toFixed(1)}
                </div>
                <div className="text-xs font-medium uppercase tracking-wide">
                  Overall
                </div>
              </div>
              {review.categories.map((category) => (
                <div
                  key={category.category}
                  className="text-center p-4 rounded-xl bg-[#f1f3ee] flex flex-col justify-center"
                >
                  <div className="text-2xl font-light text-[#2d5a4d] mb-2">
                    {category.rating.toFixed(1)}
                  </div>
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide break-words">
                    {category.category === "accuracy"
                      ? "Listing Accuracy"
                      : category.category.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h5 className="text-lg font-medium text-gray-900 mb-3">
              Guest Review
            </h5>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {review.publicReview}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-600">Check-in Date:</span>
              <div className="font-medium text-gray-900 mt-1">
                {review.checkinDate
                  ? new Date(review.checkinDate).toLocaleDateString()
                  : "Not available"}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-600">Check-out Date:</span>
              <div className="font-medium text-gray-900 mt-1">
                {review.checkoutDate
                  ? new Date(review.checkoutDate).toLocaleDateString()
                  : "Not available"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
