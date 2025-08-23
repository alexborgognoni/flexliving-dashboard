import React from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Calendar,
  Star,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Review {
  id: string;
  submitted_at: string;
  guest_id: string;
  overall_rating: number;
  public_review: string;
  status: string;
}

interface SortableHeaderProps {
  field: string;
  label: string;
  sortField: string;
  sortDirection: string;
  onSort: (field: string) => void;
}

const SortableHeader = ({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
}: SortableHeaderProps) => (
  <th className="text-left py-3 px-6">
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 font-medium text-gray-700 hover:text-[#284e4c] transition-colors"
    >
      {label}
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        ))}
      {sortField !== field && <ArrowUpDown size={14} className="opacity-30" />}
    </button>
  </th>
);

interface ReviewsSectionProps {
  reviews: Review[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
  handleReviewClick: (review: Review) => void;
  handleToggleStatus: (reviewId: string, currentStatus: string) => void;
}

export default function ReviewsSection({
  reviews,
  searchTerm,
  setSearchTerm,
  sortField,
  sortDirection,
  handleSort,
  handleReviewClick,
  handleToggleStatus,
}: ReviewsSectionProps) {
  return (
    <div className="mt-12 bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-[#f1f3ee] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">
          All Reviews ({reviews.length})
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#284e4c]/30 focus:border-[#284e4c]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#284e4c] text-white font-medium rounded-full hover:bg-[#284e4c]/90 transition-colors shadow-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      {reviews.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader
                  field="submitted_at"
                  label="Date"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="guest_id"
                  label="Guest"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="overall_rating"
                  label="Rating"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="text-left py-3 px-6 font-medium text-gray-700">
                  Review
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr
                  key={review.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  onClick={() => handleReviewClick(review)}
                >
                  <td className="py-3 px-6 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(review.submitted_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-700 font-medium">
                    Guest {review.guest_id}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">
                        {review.overall_rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-700">
                    <p className="truncate max-w-md" title={review.public_review}>
                      {review.public_review}
                    </p>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(review.id, review.status);
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full transition-colors"
                    >
                      {review.status === "published" ? (
                        <>
                          <ToggleRight size={16} className="text-green-500" />
                          <span className="text-green-600 text-sm font-medium">
                            Published
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={16} className="text-gray-400" />
                          <span className="text-gray-500 text-sm font-medium">
                            Unpublished
                          </span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="text-lg font-medium">No reviews found</div>
          <div className="text-sm mt-2 text-gray-400">
            Try adjusting your search or filters
          </div>
        </div>
      )}
    </div>
  );
}
