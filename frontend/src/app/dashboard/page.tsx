"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
} from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";

interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  host_id: string;
}

interface PropertyWithReviews extends Property {
  reviewCount: number;
  averageRating: number;
  trend: "up" | "down" | "stable";
}

async function fetchProperties(): Promise<Property[]> {
  const res = await fetch("http://localhost:8000/api/properties");
  if (!res.ok) throw new Error("Failed to fetch properties");
  const data = await res.json();
  return data.data || [];
}

async function fetchPropertyReviews(propertyId: string) {
  const res = await fetch(`http://localhost:8000/api/properties/${propertyId}/reviews`);
  if (!res.ok) return { data: [], meta: { totalCount: 0, averageRating: 0 } };
  return await res.json();
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
          const reviewsData = await fetchPropertyReviews(property.id);
          propertiesWithReviews.push({
            ...property,
            reviewCount: reviewsData.meta.totalCount,
            averageRating: reviewsData.meta.averageRating,
            trend: "stable" as const,
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
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, addresses, or hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] bg-white shadow-sm text-[#333333]"
            />
          </div>
          <button className="px-6 py-3 bg-[#284e4c] text-white rounded-full flex items-center gap-2 shadow-sm hover:bg-[#284e4c]/90 transition-colors font-medium">
            <Filter size={20} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Property</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Address</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Host</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Overall Rating</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Monthly Trend</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProperties.map((property, idx) => (
                  <tr key={property.id} onClick={() => handlePropertyClick(property)}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-100 hover:bg-gray-50 cursor-pointer`}>
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img
                        src={property.images[0] || '/placeholder-property.jpg'}
                        alt={property.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{property.title}</div>
                        <div className="text-sm text-[#5C5C5A]">{property.reviewCount} reviews</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#333333] font-medium">{property.location.address}</td>
                    <td className="py-4 px-6 text-[#333333] font-medium">Host ID: {property.host_id}</td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="font-medium text-[#333333]">{property.averageRating.toFixed(1)}</span>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {property.trend === "up" && <div className="text-green-500 flex items-center gap-1"><TrendingUp size={16} /> Up</div>}
                      {property.trend === "down" && <div className="text-red-500 flex items-center gap-1"><TrendingDown size={16} /> Down</div>}
                      {property.trend === "stable" && <div className="text-gray-500">Stable</div>}
                    </td>
                    <td className="py-4 px-6">
                      <button onClick={(e) => { e.stopPropagation(); handlePropertyClick(property); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#284e4c] text-white rounded-full hover:bg-[#284e4c]/90 transition-colors font-medium shadow-sm">
                        <Eye size={14} /> View Insights
                      </button>
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
