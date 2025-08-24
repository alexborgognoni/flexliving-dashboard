"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";
import PropertyInfoCard from "@/components/property/PropertyInfoCard";
import HostCard from "@/components/property/HostCard";
import CategoryRatings from "@/components/property/CategoryRatings";
import RatingDistributionChart from "@/components/property/RatingDistributionChart";
import RatingTrendChart from "@/components/property/RatingTrendChart";
import ReviewsSection from "@/components/property/ReviewsSection";
import ReviewDetailsPopover from "@/components/property/ReviewDetailsPopover";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { BarChart3, MessageCircle, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { fetchProperty, fetchPropertyReviews, getHostName, getGuestName, Property, Review, ReviewWithNames } from "@/lib/api";
import { calculateTrend } from "@/lib/trend-utils";

interface PropertyData {
  property: Property;
  reviews: ReviewWithNames[];
  averageRating: number;
  totalReviews: number;
  hostName: string;
  trend: "up" | "down" | "stable";
}

async function fetchPropertyData(propertyId: string, filters?: any): Promise<PropertyData> {
  const [property, reviewsData, allReviewsData] = await Promise.all([
    fetchProperty(propertyId),
    fetchPropertyReviews(propertyId, filters),
    fetchPropertyReviews(propertyId) // Fetch unfiltered reviews for trend calculation
  ]);

  if (!property) throw new Error("Property not found");

  // Ensure host name is fully loaded
  const hostName = await getHostName(property.host_id);
  if (!hostName) throw new Error("Failed to load host information");

  const reviews: ReviewWithNames[] = [];

  // Fetch all guest names in parallel for better performance
  const guestNamePromises = reviewsData.data.map(review => getGuestName(review.guest_id));
  const guestNames = await Promise.all(guestNamePromises);

  // Ensure all guest names are loaded
  const missingGuestNames = guestNames.filter(name => !name);
  if (missingGuestNames.length > 0) {
    throw new Error("Failed to load all guest information");
  }

  // Combine reviews with guest names
  reviewsData.data.forEach((review, index) => {
    reviews.push({
      ...review,
      guest_name: guestNames[index],
      host_name: hostName
    });
  });

  // Calculate trend using unfiltered reviews (consistent with dashboard)
  const trend = calculateTrend(allReviewsData.data || []);

  return {
    property,
    reviews,
    averageRating: reviewsData.meta.averageRating || property.rating || 0,
    totalReviews: reviewsData.meta.totalCount,
    hostName,
    trend
  };
}

function calculateCategoryAverages(reviews: ReviewWithNames[]) {
  const categoryTotals: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  reviews.forEach((review) => {
    if (review.ratings && typeof review.ratings === "object") {
      Object.entries(review.ratings).forEach(([category, rating]) => {
        // Only include non-zero ratings (zero means the category wasn't rated)
        if (rating > 0) {
          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
            categoryCounts[category] = 0;
          }
          categoryTotals[category] += rating;
          categoryCounts[category] += 1;
        }
      });
    }
  });

  return Object.keys(categoryTotals).map((category) => ({
    category: category, // Keep original key for lookup
    average: Math.round((categoryTotals[category] / categoryCounts[category]) * 10) / 10,
  }));
}

function createRatingDistribution(reviews: ReviewWithNames[]) {
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

function createTrendData(reviews: ReviewWithNames[]) {
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
  const [selectedReview, setSelectedReview] = useState<ReviewWithNames | null>(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [originalStats, setOriginalStats] = useState<{ 
    totalReviews: number, 
    averageRating: number, 
    trend: "up" | "down" | "stable",
    categoryAverages: { category: string, average: number }[],
    reviews: ReviewWithNames[] // Store original unfiltered reviews
  } | null>(null);

  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const loadPropertyData = useCallback(async (filters?: any, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsFilterLoading(true);
      }
      const data = await fetchPropertyData(propertyId, filters);
      setPropertyData(data);

      // Store original stats on first load (without filters)
      if (isInitialLoad) {
        // Use the same trend that was calculated from unfiltered data
        console.log(`[INSIGHTS HERO] Property ${propertyId} using trend from unfiltered data: ${data.trend}`);
        setOriginalStats({
          totalReviews: data.totalReviews,
          averageRating: data.averageRating,
          trend: data.trend, // Use trend calculated from unfiltered data
          categoryAverages: calculateCategoryAverages(data.reviews),
          reviews: data.reviews // Store original reviews for consistent trend calculation
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load property data");
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setIsFilterLoading(false);
      }
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) loadPropertyData(undefined, true);
  }, [propertyId, loadPropertyData]);

  const handleFiltersChange = useCallback((filters: any) => {
    setCurrentFilters(filters);
    loadPropertyData(filters, false);
  }, [loadPropertyData]);

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    const updatedFilters = {
      ...currentFilters,
      search: newSearchTerm,
      sortBy: sortField,
      order: sortDirection
    };
    setCurrentFilters(updatedFilters);
    loadPropertyData(updatedFilters, false);
  }, [currentFilters, sortField, sortDirection, loadPropertyData]);

  const handleSort = useCallback((field: string) => {
    const newDirection = sortField === field ? (sortDirection === "asc" ? "desc" : "asc") : "desc";
    setSortField(field);
    setSortDirection(newDirection);

    // Trigger API call with new sort parameters
    const updatedFilters = {
      ...currentFilters,
      search: searchTerm,
      sortBy: field,
      order: newDirection
    };
    setCurrentFilters(updatedFilters);
    loadPropertyData(updatedFilters, false);
  }, [sortField, sortDirection, currentFilters, searchTerm, loadPropertyData]);

  const categoryAverages = useMemo(() => propertyData ? calculateCategoryAverages(propertyData.reviews) : [], [propertyData?.reviews]);
  const ratingDistribution = useMemo(() => propertyData ? createRatingDistribution(propertyData.reviews) : [], [propertyData?.reviews]);
  const trendData = useMemo(() => propertyData ? createTrendData(propertyData.reviews) : [], [propertyData?.reviews]);



  const handleToggleStatus = useCallback((reviewId: string, oldStatus: string, newStatus: string) => {
    // Update the main reviews list optimistically
    setPropertyData(prevData => {
      if (!prevData) return prevData;
      const updatedReviews = prevData.reviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      );
      return { ...prevData, reviews: updatedReviews };
    });

    // Update the selected review in the modal if it's the same review
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => ({ ...prev!, status: newStatus }));
    }
  }, [selectedReview]);

  const handleReviewUpdate = useCallback((updatedReview: ReviewWithNames) => {
    setSelectedReview(updatedReview);
    setPropertyData(prevData => {
      if (!prevData) return prevData;
      const updatedReviews = prevData.reviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      );
      return { ...prevData, reviews: updatedReviews };
    });
  }, []);

  const handleReviewClick = useCallback((review: ReviewWithNames) => setSelectedReview(review), []);
  const closePopover = useCallback(() => setSelectedReview(null), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedReview && !(event.target as Element)?.closest(".review-popover")) closePopover();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedReview, closePopover]);

  if (loading) return <LoadingSpinner />;
  if (error || !propertyData || !propertyData.hostName) return <ErrorDisplay message={error || "Property not found"} onRetry={() => window.history.back()} />;
  
  // Ensure all guest names are loaded
  const missingGuestNames = propertyData.reviews.some(review => !review.guest_name);
  if (missingGuestNames) return <LoadingSpinner />;

  const { property, averageRating, totalReviews } = propertyData;

  // Use original stats for hero section, current stats for everything else
  const heroAverageRating = originalStats?.averageRating ?? averageRating;
  const heroTotalReviews = originalStats?.totalReviews ?? totalReviews;
  const heroTrend = originalStats?.trend ?? propertyData.trend;
  const heroCategoryAverages = originalStats?.categoryAverages ?? categoryAverages;

  const legacyPropertyData = {
    listingId: property.id,
    listingName: property.title,
    address: property.location.address,
    hostName: propertyData.hostName,
    propertyImage: property.images[0] || "/placeholder-property.jpg",
    reviewCount: totalReviews,
    averageRating,
  };

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <DashboardHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-[#f1f3ee] border-b border-gray-100 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">{property.title}</h1>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <Star size={20} className="text-yellow-400" />
            <span className="font-medium text-gray-900">{heroAverageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <BarChart3 size={20} className="text-gray-700" />
            <span className="font-medium text-gray-900">{heroTotalReviews} Reviews</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            {heroTrend === "up" && <TrendingUp size={20} className="text-green-500" />}
            {heroTrend === "down" && <TrendingDown size={20} className="text-red-500" />}
            {heroTrend === "stable" && <Minus size={20} className="text-blue-500" />}
            <span className="font-medium text-gray-900">
              {heroTrend === "up" && "Rising"}
              {heroTrend === "down" && "Lowering"}
              {heroTrend === "stable" && "Stable"}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <PropertyInfoCard propertyData={legacyPropertyData} />
            <HostCard hostName={legacyPropertyData.hostName} />
          </div>
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 flex flex-col">
              <CategoryRatings reviewCount={totalReviews} averageRating={propertyData.reviews.length > 0 ? propertyData.reviews.reduce((sum, review) => sum + review.overall_rating, 0) / propertyData.reviews.length : null} categoryAverages={categoryAverages} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
              <RatingDistributionChart data={ratingDistribution} />
              <RatingTrendChart data={trendData} />
            </div>
          </div>
        </div>

        <ReviewsSection
          reviews={propertyData.reviews}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleReviewClick={handleReviewClick}
          handleToggleStatus={handleToggleStatus}
          propertyId={propertyId}
          onFiltersChange={handleFiltersChange}
        />
      </main>

      {selectedReview && (
        <ReviewDetailsPopover
          review={selectedReview}
          onClose={closePopover}
          onToggleStatus={handleToggleStatus}
          onReviewUpdate={handleReviewUpdate}
        />
      )}
    </div>
  );
}
