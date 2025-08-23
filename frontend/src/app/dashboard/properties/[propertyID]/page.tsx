"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import PropertyInfoCard from "@/components/property/PropertyInfoCard";
import HostCard from "@/components/property/HostCard";
import CategoryRatings from "@/components/property/CategoryRatings";
import RatingDistributionChart from "@/components/property/RatingDistributionChart";
import RatingTrendChart from "@/components/property/RatingTrendChart";
import ReviewsSection from "@/components/property/ReviewsSection";
import ReviewDetailsPopover from "@/components/property/ReviewDetailsPopover";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { BarChart3, MessageCircle, Star } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    neighborhood: string;
  };
  images: string[];
  host_id: string;
}

interface Review {
  id: string;
  public_review: string;
  overall_rating: number;
  submitted_at: string;
  ratings: {
    cleanliness: number;
    communication: number;
    check_in_experience: number;
    listing_accuracy: number;
    amenities: number;
    location: number;
    value_for_money: number;
  };
  guest_id: string;
  status: string;
}

interface PropertyData {
  property: Property;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

async function fetchPropertyData(propertyId: string): Promise<PropertyData> {
  const [propertyRes, reviewsRes] = await Promise.all([
    fetch(`http://localhost:8000/api/properties/${propertyId}`),
    fetch(`http://localhost:8000/api/properties/${propertyId}/reviews`)
  ]);

  if (!propertyRes.ok) throw new Error("Failed to fetch property");
  if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");

  const property = await propertyRes.json();
  const reviewsData = await reviewsRes.json();

  return {
    property: property.data,
    reviews: reviewsData.data.map((review: any) => ({ ...review, status: review.status || "published" })),
    averageRating: reviewsData.meta.averageRating,
    totalReviews: reviewsData.meta.totalCount
  };
}

function calculateCategoryAverages(reviews: Review[]) {
  const categoryTotals: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  reviews.forEach((review) => {
    if (review.ratings && typeof review.ratings === "object") {
      Object.entries(review.ratings).forEach(([category, rating]) => {
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
          categoryCounts[category] = 0;
        }
        categoryTotals[category] += rating;
        categoryCounts[category] += 1;
      });
    }
  });

  return Object.keys(categoryTotals).map((category) => ({
    category: category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    average: Math.round((categoryTotals[category] / categoryCounts[category]) * 10) / 10,
  }));
}

function createRatingDistribution(reviews: Review[]) {
  const distribution: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
  };

  reviews.forEach((review) => {
    const roundedRating = Math.round(review.overall_rating);
    if (roundedRating >= 1 && roundedRating <= 10) {
      distribution[roundedRating]++;
    }
  });

  return Object.keys(distribution).map((rating) => ({
    rating: rating,
    count: distribution[parseInt(rating)],
  }));
}

function createTrendData(reviews: Review[]) {
  const monthlyData: Record<string, { ratings: number[]; month: string }> = {};

  reviews.forEach((review) => {
    const date = new Date(review.submitted_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) monthlyData[monthKey] = { ratings: [], month: monthKey };
    monthlyData[monthKey].ratings.push(review.overall_rating);
  });

  return Object.values(monthlyData)
    .map((month) => ({
      month: month.month,
      average: month.ratings.reduce((sum, rating) => sum + rating, 0) / month.ratings.length,
      count: month.ratings.length,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export default function PropertyInsights() {
  const params = useParams();
  const propertyId = params.propertyID as string;
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("submitted_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    async function loadPropertyData() {
      try {
        const data = await fetchPropertyData(propertyId);
        setPropertyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load property data");
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) loadPropertyData();
  }, [propertyId]);

  const categoryAverages = useMemo(() => propertyData ? calculateCategoryAverages(propertyData.reviews) : [], [propertyData?.reviews]);
  const ratingDistribution = useMemo(() => propertyData ? createRatingDistribution(propertyData.reviews) : [], [propertyData?.reviews]);
  const trendData = useMemo(() => propertyData ? createTrendData(propertyData.reviews) : [], [propertyData?.reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    if (!propertyData?.reviews) return [];
    const filtered = propertyData.reviews.filter(r => r.public_review.toLowerCase().includes(searchTerm.toLowerCase()));
    filtered.sort((a, b) => {
      let aValue = (a as any)[sortField];
      let bValue = (b as any)[sortField];
      if (sortField === "submitted_at") { aValue = new Date(aValue).getTime(); bValue = new Date(bValue).getTime(); }
      else if (typeof aValue === "string") { aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase(); }
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
    return filtered;
  }, [propertyData?.reviews, searchTerm, sortField, sortDirection]);

  const handleSort = useCallback((field: string) => {
    if (sortField === field) setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("desc"); }
  }, [sortField]);

  const handleToggleStatus = useCallback((reviewId: string, currentStatus: string) => {
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => ({ ...prev!, status: currentStatus === "published" ? "unpublished" : "published" }));
    }
  }, [selectedReview]);

  const handleReviewClick = useCallback((review: Review) => setSelectedReview(review), []);
  const closePopover = useCallback(() => setSelectedReview(null), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedReview && !(event.target as Element)?.closest(".review-popover")) closePopover();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedReview, closePopover]);

  if (loading) return <LoadingSpinner />;
  if (error || !propertyData) return <ErrorDisplay message={error || "Property not found"} onRetry={() => window.history.back()} />;

  const { property, averageRating, totalReviews } = propertyData;
  const legacyPropertyData = {
    listingId: property.id,
    listingName: property.title,
    address: property.location.address,
    hostName: `Host ${property.host_id}`,
    propertyImage: property.images[0] || "/placeholder-property.jpg",
    reviewCount: totalReviews,
    averageRating,
  };

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <AppHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-[#f1f3ee] border-b border-gray-100 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">{property.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{property.location.address}, {property.location.city}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <Star size={20} className="text-yellow-400" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <BarChart3 size={20} />
            <span className="font-medium">{totalReviews} Reviews</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <PropertyInfoCard propertyData={legacyPropertyData} />
            <HostCard hostName={legacyPropertyData.hostName} />
          </div>
          <div className="lg:col-span-2">
            <CategoryRatings reviewCount={totalReviews} averageRating={averageRating} categoryAverages={categoryAverages} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RatingDistributionChart data={ratingDistribution} />
          <RatingTrendChart data={trendData} />
        </div>

        <ReviewsSection
          reviews={filteredAndSortedReviews}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleReviewClick={handleReviewClick}
          handleToggleStatus={handleToggleStatus}
        />
      </main>

      {selectedReview && (
        <ReviewDetailsPopover
          review={selectedReview}
          onClose={closePopover}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}
