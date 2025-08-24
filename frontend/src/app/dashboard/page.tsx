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
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPropertiesWithReviews();
  }, []);

  const filteredAndSortedProperties = React.useMemo(() => {
    const filtered = properties.filter((property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = (a as any)[sortField];
      let bValue = (b as any)[sortField];
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [properties, searchTerm, sortField, sortDirection]);

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
        {/* Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, addresses, or hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#284e4c]/30 focus:border-[#284e4c] bg-white shadow-sm text-gray-900 placeholder-gray-400"
            />
          </div>
          <button className="px-4 py-2 bg-[#284e4c] text-white rounded-full flex items-center gap-2 shadow-sm hover:bg-[#284e4c]/90 transition-colors font-medium">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-[#f1f3ee] border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              Properties ({filteredAndSortedProperties.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Property</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Address</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Host</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700">Reviews</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-700">Rating</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProperties.map((property, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
