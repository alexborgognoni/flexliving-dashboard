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

const SortableHeader = ({ field, label, sortField, sortDirection, onSort }) => (
  <th className="text-left py-4 px-8">
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-2 font-medium text-gray-900 hover:text-[#284e4c] transition-colors"
    >
      {label}
      {sortField === field &&
        (sortDirection === "asc" ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        ))}
      {sortField !== field && <ArrowUpDown size={16} className="opacity-30" />}
    </button>
  </th>
);

export default function ReviewsSection({
  reviews,
  searchTerm,
  setSearchTerm,
  sortField,
  sortDirection,
  handleSort,
  handleReviewClick,
  handleToggleStatus,
}) {
  return (
    <div className="mt-12 bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="p-8 bg-[#284e4c] text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h3 className="text-2xl font-light">
            All Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] bg-gray-100 text-gray-900 placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-sm border border-gray-300">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader
                field="submitted_at"
                label="Date Submitted"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="_meta.guest_name"
                label="Guest Name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="overall_rating"
                label="Overall Rating"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <th className="text-left py-4 px-8 font-medium text-gray-900">
                Review
              </th>
              <th className="text-left py-4 px-8 font-medium text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={review.id}
                className={`review-row border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
                onClick={() => handleReviewClick(review)}
              >
                <td className="py-4 px-8 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(review.submitted_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-8 text-gray-700 font-medium">
                  {review._meta?.guest_name}
                </td>
                <td className="py-4 px-8">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900">
                      {review.overall_rating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-8 text-gray-700">
                  <div className="max-w-md">
                    <p className="truncate" title={review.public_review}>
                      {review.public_review}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(review.id, review.status);
                    }}
                    className="flex items-center gap-2 transition-colors rounded-full px-3 py-1"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg">No reviews found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your search criteria
          </div>
        </div>
      )}
    </div>
  );
}
