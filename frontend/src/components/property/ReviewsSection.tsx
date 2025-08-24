import React from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Calendar,
  Star,
} from "lucide-react";
import { ReviewWithNames } from "@/lib/api";

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
      className="flex items-center gap-1 font-medium text-gray-700 hover:text-[#284e4c] transition-colors cursor-pointer"
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
  reviews: ReviewWithNames[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: string;
  sortDirection: string;
  handleSort: (field: string) => void;
  handleReviewClick: (review: ReviewWithNames) => void;
  handleToggleStatus: (reviewId: string, currentStatus: string) => void;
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
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Status Filter Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-3 block h-5">Status</label>
              <div className="flex-1 flex items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] cursor-pointer bg-white text-gray-900"
                >
                  <option value="all" className="text-gray-900">All Statuses</option>
                  <option value="published" className="text-gray-900">Published</option>
                  <option value="unpublished" className="text-gray-900">Unpublished</option>
                </select>
              </div>
            </div>

            {/* Rating Range Filter Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-3 block h-5">Rating Range</label>
              <div className="flex-1 flex items-center">
                <div className="relative w-full h-10 flex items-center mt-2">
                  {/* Track */}
                  <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full -translate-y-1/2" />

                  {/* Selected Range */}
                  <div
                    className="absolute top-1/2 h-2 bg-[#284e4c] rounded-full -translate-y-1/2"
                    style={{
                      left: `${(minRating / 10) * 100}%`,
                      width: `${((maxRating - minRating) / 10) * 100}%`,
                    }}
                  />

                  {/* Min Handle */}
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={minRating}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setMinRating(Math.min(value, maxRating));
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto cursor-pointer"
                    style={{ zIndex: 4 }}
                  />

                  {/* Max Handle */}
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={maxRating}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setMaxRating(Math.max(value, minRating));
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto cursor-pointer"
                    style={{ zIndex: 3 }}
                  />

                  {/* Min Bubble */}
                  <div
                    className="absolute -top-6 px-2 py-1 bg-white text-xs font-medium text-gray-900 rounded shadow cursor-grab hover:cursor-grabbing"
                    style={{ left: `${(minRating / 10) * 100}%`, transform: 'translateX(-50%)' }}
                  >
                    {minRating}
                  </div>

                  {/* Max Bubble */}
                  <div
                    className="absolute -top-6 px-2 py-1 bg-white text-xs font-medium text-gray-900 rounded shadow cursor-grab hover:cursor-grabbing"
                    style={{ left: `${(maxRating / 10) * 100}%`, transform: 'translateX(-50%)' }}
                  >
                    {maxRating}
                  </div>
                </div>
              </div>
            </div>

            {/* Date Range Filter Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-3 block h-5">Date Range</label>
              <div className="flex-1 flex items-center">
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

            {/* Clear Filters Button */}
            <div className="flex items-end lg:items-center">
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
          <table className="w-full border-collapse">
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
                />
                <SortableHeader
                  field="guest_name"
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
                <SortableHeader
                  field="channel"
                  label="Channel"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
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
                  <td className="py-3 px-6 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(review.submitted_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-700 font-medium">
                    {review.guest_name || `Guest ${review.guest_id}`}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">
                        {review.overall_rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {(review as any).channel?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-700">
                    <p className="truncate max-w-full" title={review.public_review}>
                      {review.public_review}
                    </p>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${review.status === 'published'
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
