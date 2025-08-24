"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Filter,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import RangeSlider from "@/components/ui/RangeSlider";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SortableHeader from "@/components/ui/SortableHeader";
import { fetchProperties, fetchPropertyReviews, getHostName, PropertyWithNames } from "@/lib/api";

interface PropertyWithReviews extends PropertyWithNames {
  reviewCount: number;
  averageRating: number;
  trend: "up" | "down" | "stable";
}


export default function DashboardPage() {
  const [properties, setProperties] = useState<PropertyWithReviews[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("averageRating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [minReviews, setMinReviews] = useState(0);
  const [maxReviews, setMaxReviews] = useState(0);
  const [trendFilter, setTrendFilter] = useState('all');

  useEffect(() => {
    async function loadPropertiesWithReviews() {
      try {
        const propertiesData = await fetchProperties();
        const propertiesWithReviews: PropertyWithReviews[] = [];

        for (const property of propertiesData) {
          const [reviewsData, hostName] = await Promise.all([
            fetchPropertyReviews(property.id),
            getHostName(property.host_id)
          ]);

          // Calculate trend from last two reviews
          let trend: "up" | "down" | "stable" = "stable";
          if (reviewsData.reviews && reviewsData.reviews.length >= 2) {
            const sortedReviews = reviewsData.reviews.sort((a: any, b: any) => 
              new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
            );
            const lastReview = sortedReviews[0];
            const secondLastReview = sortedReviews[1];
            
            if (lastReview.overall_rating > secondLastReview.overall_rating) {
              trend = "up";
            } else if (lastReview.overall_rating < secondLastReview.overall_rating) {
              trend = "down";
            }
          }

          propertiesWithReviews.push({
            ...property,
            host_name: hostName,
            reviewCount: reviewsData.meta.totalCount,
            averageRating: reviewsData.meta.averageRating || property.rating || 0,
            trend,
          });
        }

        setProperties(propertiesWithReviews);
        
        // Set max reviews for slider
        const maxReviewCount = Math.max(...propertiesWithReviews.map(p => p.reviewCount));
        setMaxReviews(maxReviewCount);
        
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPropertiesWithReviews();
  }, []);

  const filteredAndSortedProperties = React.useMemo(() => {
    let filtered = properties.filter((property) => {
      // Search filter
      const searchMatch = !searchTerm || 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.host_name && property.host_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Rating filter
      const ratingMatch = property.averageRating >= minRating && property.averageRating <= maxRating;
      
      // Review count filter
      const reviewMatch = property.reviewCount >= minReviews && property.reviewCount <= maxReviews;
      
      // Trend filter
      const trendMatch = trendFilter === 'all' || property.trend === trendFilter;
      
      return searchMatch && ratingMatch && reviewMatch && trendMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = (a as any)[sortField];
      let bValue = (b as any)[sortField];
      
      // Handle nested properties
      if (sortField === "address") {
        aValue = a.location.address;
        bValue = b.location.address;
      }
      if (sortField === "host_name") {
        aValue = a.host_name || `Host ${a.host_id}`;
        bValue = b.host_name || `Host ${b.host_id}`;
      }
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [properties, searchTerm, sortField, sortDirection, minRating, maxRating, minReviews, maxReviews, trendFilter]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handlePropertyClick = (property: PropertyWithReviews) => {
    window.location.href = `/dashboard/properties/${property.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf6]">
        <AppHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg font-medium text-gray-900">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-[#f1f3ee] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              Properties ({filteredAndSortedProperties.length})
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search properties..."
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
                <RangeSlider
                  label="Review Count Range"
                  min={0}
                  max={maxReviews}
                  step={1}
                  minValue={minReviews}
                  maxValue={maxReviews}
                  onMinChange={setMinReviews}
                  onMaxChange={setMaxReviews}
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

                <FilterDropdown
                  label="Trend"
                  value={trendFilter}
                  options={[
                    { value: 'all', label: 'All Trends' },
                    { value: 'up', label: 'Rising' },
                    { value: 'stable', label: 'Stable' },
                    { value: 'down', label: 'Lowering' },
                  ]}
                  onChange={setTrendFilter}
                />

                {/* Empty columns for spacing */}
                <div></div>
                <div></div>

                {/* Clear Filters Button - Last column of second row */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setMinRating(0);
                      setMaxRating(10);
                      setMinReviews(0);
                      setMaxReviews(properties.length > 0 ? Math.max(...properties.map(p => p.reviewCount)) : 0);
                      setTrendFilter('all');
                      setSearchTerm('');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <SortableHeader
                    field="title"
                    label="Property"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="address"
                    label="Address"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="host_name"
                    label="Host"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    field="reviewCount"
                    label="Reviews"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="text-center"
                  />
                  <SortableHeader
                    field="averageRating"
                    label="Rating"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="text-center"
                  />
                  <SortableHeader
                    field="trend"
                    label="Trend"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProperties.length > 0 ? (
                  filteredAndSortedProperties.map((property, idx) => (
                  <tr key={property.id} onClick={() => handlePropertyClick(property)}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors`}>
                    <td className="py-3 px-6 flex items-center gap-4">
                      <img
                        src={property.images[0] || '/placeholder-property.jpg'}
                        alt={property.title}
                        className="w-16 h-12 object-cover rounded-lg shadow-sm"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{property.title}</div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-gray-700">{property.location.address}</td>
                    <td className="py-3 px-6 text-gray-700">{property.host_name || `Host ${property.host_id}`}</td>
                    <td className="py-3 px-6 text-center">
                      <span className="font-medium text-gray-900">{property.reviewCount}</span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">{property.averageRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 font-medium">
                      {property.trend === "up" && <div className="text-green-500 flex items-center gap-1"><TrendingUp size={16} /> Rising</div>}
                      {property.trend === "down" && <div className="text-red-500 flex items-center gap-1"><TrendingDown size={16} /> Lowering</div>}
                      {property.trend === "stable" && <div className="text-blue-500 flex items-center gap-1"><Minus size={16} /> Stable</div>}
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="text-lg font-medium text-gray-500">No properties found</div>
                      <div className="text-sm mt-2 text-gray-400">
                        Try adjusting your search or filters
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
