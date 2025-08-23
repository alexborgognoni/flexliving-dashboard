"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  MessageCircle,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";

// Custom hook to fetch reviews
function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await fetch("/api/reviews/hostaway");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      return data.result || [];
    },
  });
}

// Utility function to group reviews by property
function groupReviewsByProperty(reviews) {
  const grouped = reviews.reduce((acc, review) => {
    const key = review.listingId;
    if (!acc[key]) {
      acc[key] = {
        listingId: review.listingId,
        listingName: review.listingName,
        address: review.address,
        hostName: review.hostName,
        propertyImage: review.propertyImage,
        reviews: [],
      };
    }
    acc[key].reviews.push(review);
    return acc;
  }, {});

  // Calculate aggregate data for each property
  return Object.values(grouped).map((property) => {
    const ratings = property.reviews.map((r) => r.rating).filter((r) => r > 0);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    // Calculate trend (mock data for now - in real app would compare time periods)
    const recentRatings = property.reviews
      .filter(
        (r) =>
          new Date(r.submittedAt) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      )
      .map((r) => r.rating)
      .filter((r) => r > 0);

    const olderRatings = property.reviews
      .filter(
        (r) =>
          new Date(r.submittedAt) <=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      )
      .map((r) => r.rating)
      .filter((r) => r > 0);

    const recentAvg =
      recentRatings.length > 0
        ? recentRatings.reduce((sum, rating) => sum + rating, 0) /
          recentRatings.length
        : 0;
    const olderAvg =
      olderRatings.length > 0
        ? olderRatings.reduce((sum, rating) => sum + rating, 0) /
          olderRatings.length
        : 0;

    const trend =
      recentAvg > olderAvg ? "up" : recentAvg < olderAvg ? "down" : "stable";

    return {
      ...property,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: property.reviews.length,
      trend,
    };
  });
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("averageRating");
  const [sortDirection, setSortDirection] = useState("desc");

  const { data: reviews, isLoading, error } = useReviews();

  const propertiesData = useMemo(() => {
    if (!reviews) return [];
    return groupReviewsByProperty(reviews);
  }, [reviews]);

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = propertiesData.filter(
      (property) =>
        property.listingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.hostName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Sort the data
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle string values
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [propertiesData, searchTerm, sortField, sortDirection]);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField],
  );

  const handlePropertyClick = useCallback((property) => {
    // Navigate to property insights page
    window.location.href = `/property/${property.listingId}`;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-[#284e4c] text-lg">
          Loading reviews...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">
          Error loading reviews: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              Review Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monitor and analyze guest feedback across all your properties
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search properties, addresses, or hosts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] bg-white shadow-sm"
              />
            </div>
            <button className="px-6 py-3 bg-[#284e4c] text-white rounded-full font-medium hover:bg-[#284e4c]/90 transition-colors flex items-center gap-2 shadow-sm">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("listingName")}
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-[#284e4c] transition-colors"
                    >
                      Property
                      {sortField === "listingName" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        ))}
                      {sortField !== "listingName" && (
                        <ArrowUpDown size={16} className="opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("address")}
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-[#284e4c] transition-colors"
                    >
                      Address
                      {sortField === "address" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        ))}
                      {sortField !== "address" && (
                        <ArrowUpDown size={16} className="opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("hostName")}
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-[#284e4c] transition-colors"
                    >
                      Host
                      {sortField === "hostName" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        ))}
                      {sortField !== "hostName" && (
                        <ArrowUpDown size={16} className="opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("averageRating")}
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-[#284e4c] transition-colors"
                    >
                      Overall Rating
                      {sortField === "averageRating" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        ))}
                      {sortField !== "averageRating" && (
                        <ArrowUpDown size={16} className="opacity-30" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Monthly Trend
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProperties.map((property, index) => (
                  <tr
                    key={property.listingId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={property.propertyImage}
                          alt={property.listingName}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {property.listingName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.reviewCount} reviews
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {property.address}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {property.hostName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="font-medium text-gray-900">
                          {property.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {property.trend === "up" && (
                          <>
                            <TrendingUp size={16} className="text-green-500" />
                            <span className="text-green-500 text-sm font-medium">
                              Up
                            </span>
                          </>
                        )}
                        {property.trend === "down" && (
                          <>
                            <TrendingDown size={16} className="text-red-500" />
                            <span className="text-red-500 text-sm font-medium">
                              Down
                            </span>
                          </>
                        )}
                        {property.trend === "stable" && (
                          <span className="text-gray-500 text-sm font-medium">
                            Stable
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropertyClick(property);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#284e4c] text-white text-sm font-medium rounded-full hover:bg-[#284e4c]/90 transition-colors"
                      >
                        <Eye size={14} />
                        View Insights
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAndSortedProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg">No properties found</div>
            <div className="text-gray-400 text-sm mt-2">
              Try adjusting your search criteria
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Chat Widget */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}
