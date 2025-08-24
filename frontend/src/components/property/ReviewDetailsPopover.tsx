import React, { useRef, useEffect } from "react";
import { X, User, Calendar } from "lucide-react";
import { updateReviewStatus } from "@/lib/api";

interface Review {
  id: string;
  guest_id: string;
  guest_name?: string;
  submitted_at: string;
  overall_rating: number;
  public_review: string;
  status: string;
  channel?: {
    name: string;
    review_id: string;
  };
  ratings: {
    cleanliness?: number;
    communication?: number;
    check_in_experience?: number;
    listing_accuracy?: number;
    amenities?: number;
    location?: number;
    value_for_money?: number;
  };
}

interface ReviewDetailsPopoverProps {
  review: Review;
  onClose: () => void;
  onToggleStatus: (reviewId: string, currentStatus: string) => void;
  onReviewUpdate?: (updatedReview: Review) => void;
}

export default function ReviewDetailsPopover({
  review,
  onClose,
  onToggleStatus,
  onReviewUpdate,
}: ReviewDetailsPopoverProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!review) return null;

  const categories = Object.entries(review.ratings || {}).map(([key, value]) => ({
    category: key.replace(/_/g, " "),
    rating: value,
  }));

  const handleToggleStatus = async () => {
    const newStatus = review.status === "published" ? "unpublished" : "published";
    const result = await updateReviewStatus(review.id, newStatus);

    if (result.success && result.review) {
      onReviewUpdate?.(result.review as Review);
      onToggleStatus(review.id, review.status);
    } else {
      console.error("Failed to update review status:", result.error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="review-popover bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#2d5a4d] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-medium text-white">Review Details</h3>
            {review.channel && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white capitalize">
                {review.channel.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Status Banner + Toggle */}
            <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-xl shadow-sm min-w-[180px] justify-between">
              <span
                className={`text-sm font-medium ${review.status === "published" ? "text-white" : "text-gray-300"
                  }`}
              >
                {review.status === "published" ? "Published" : "Unpublished"}
              </span>

              <button
                onClick={handleToggleStatus}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${review.status === "published" ? "bg-green-400" : "bg-gray-400"
                  }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${review.status === "published" ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">

          {/* Guest Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-[#2d5a4d] rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium text-gray-900">
                {review.guest_name || `Guest ${review.guest_id}`}
              </h4>
              <div className="flex flex-col gap-1 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(review.submitted_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  Member since 2019
                </div>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-6">
            <h5 className="text-lg font-medium text-gray-900 mb-4">
              Guest Ratings
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#2d5a4d] text-white flex flex-col justify-center">
                <div className="text-2xl font-light mb-2">
                  {review.overall_rating.toFixed(1)}
                </div>
                <div className="text-xs font-medium uppercase tracking-wide">
                  Overall
                </div>
              </div>
              {categories.map((category) => (
                <div
                  key={category.category}
                  className="text-center p-4 rounded-xl bg-[#f1f3ee] flex flex-col justify-center"
                >
                  <div className="text-2xl font-light text-[#2d5a4d] mb-2">
                    {category.rating ? category.rating.toFixed(1) : "No data"}
                  </div>
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide break-words">
                    {category.category === "listing accuracy"
                      ? "Listing Accuracy"
                      : category.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <h5 className="text-lg font-medium text-gray-900 mb-3">
              Guest Review
            </h5>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {review.public_review}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
