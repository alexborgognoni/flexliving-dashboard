import React from "react";
import {
  Search,
  Filter,
  Calendar,
  Star,
} from "lucide-react";
import RangeSlider from "@/components/ui/RangeSlider";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SortableHeader from "@/components/ui/SortableHeader";
import { ReviewWithNames } from "@/lib/api";


interface ReviewsSectionProps {
  reviews: ReviewWithNames[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
  handleReviewClick: (review: ReviewWithNames) => void;
  handleToggleStatus: (reviewId: string, oldStatus: string, newStatus: string) => void;
  propertyId: string;
  onFiltersChange?: (filters: {
    status?: string;
    minRating?: number;
    maxRating?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => void;
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
  propertyId,
  onFiltersChange,
}: ReviewsSectionProps) {
  const [showFilters, setShowFilters] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [minRating, setMinRating] = React.useState(0);
  const [maxRating, setMaxRating] = React.useState(10);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // Debounce API calls
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFiltersChange) {
        onFiltersChange({
          status: statusFilter,
          minRating,
          maxRating,
          startDate,
          endDate,
          search: searchTerm,
          sortBy: sortField,
          order: sortDirection as 'asc' | 'desc',
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [statusFilter, minRating, maxRating, startDate, endDate, searchTerm, sortField, sortDirection, onFiltersChange]);

  // Use reviews directly from props (now filtered by backend)
  const filteredReviews = reviews;

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-[#f1f3ee] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">
          All Reviews ({filteredReviews.length})
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#284e4c] text-white font-medium rounded-full hover:bg-[#284e4c]/90 transition-colors shadow-sm cursor-pointer"
          >
            <Filter
              size={16}
              className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : 'rotate-0'}`}
            />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-80" : "max-h-0"
          } bg-gray-50 border-b border-gray-200`}
      >
        <div className="px-6 py-6">
          <div className="grid grid-cols-3 gap-4">
            <FilterDropdown
              label="Status"
              value={statusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'published', label: 'Published' },
                { value: 'unpublished', label: 'Unpublished' },
              ]}
              onChange={setStatusFilter}
            />

            <RangeSlider
              label="Rating Range"
              min={0}
              max={10}
              step={0.5}
              minValue={minRating}
              maxValue={maxRating}
              onMinChange={setMinRating}
              onMaxChange={setMaxRating}
            />

            {/* Date Range Filter Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
              <div className="flex items-center justify-center py-2">
                <div className="space-y-2 w-full">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] text-sm text-gray-900 cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] text-sm text-gray-900 cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Empty columns for spacing */}
            <div></div>
            <div></div>

            {/* Clear Filters Button - Last column of second row */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setMinRating(0);
                  setMaxRating(10);
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      {filteredReviews.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[18%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[35%]" />
              <col className="w-[13%]" />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader
                  field="submitted_at"
                  label="Date"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-32"
                />
                <SortableHeader
                  field="guest_name"
                  label="Guest"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-48"
                />
                <SortableHeader
                  field="overall_rating"
                  label="Rating"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-20"
                />
                <SortableHeader
                  field="channel"
                  label="Channel"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-24"
                />
                <SortableHeader
                  field="public_review"
                  label="Review"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="status"
                  label="Status"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  className="w-32 min-w-[8rem]"
                />
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review, index) => (
                <tr
                  key={review.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  onClick={() => handleReviewClick(review)}
                >
                  <td className="py-3 px-6 text-gray-700 w-32">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                      {new Date(review.submitted_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-700 font-medium w-48">
                    <div className="truncate">
                      {review.guest_name || `Guest ${review.guest_id}`}
                    </div>
                  </td>
                  <td className="py-3 px-6 w-20">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">
                        {review.overall_rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 w-24">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 capitalize truncate">
                      {(review as any).channel?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-700">
                    <div className="max-w-[300px] truncate" title={review.public_review}>
                      {review.public_review}
                    </div>
                  </td>
                  <td className="py-3 px-6 w-32 min-w-[8rem]">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap min-w-[6rem] ${review.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {review.status === 'published' ? 'Published' : 'Unpublished'}
                    </span>
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
