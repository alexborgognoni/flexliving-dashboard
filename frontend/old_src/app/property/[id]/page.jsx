"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { usePropertyReviews } from "@/hooks/useReviews";
import {
  calculateCategoryAverages,
  createRatingDistribution,
  createTrendData,
} from "@/utils/property-insights";
import AppHeader from "@/components/layout/AppHeader";
import PropertyHeader from "@/components/property/PropertyHeader";
import PropertyInfoCard from "@/components/property/PropertyInfoCard";
import HostCard from "@/components/property/HostCard";
import CategoryRatings from "@/components/property/CategoryRatings";
import RatingDistributionChart from "@/components/property/RatingDistributionChart";
import RatingTrendChart from "@/components/property/RatingTrendChart";
import ReviewsSection from "@/components/property/ReviewsSection";
import ReviewDetailsPopover from "@/components/property/ReviewDetailsPopover";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function PropertyInsights() {
  const [listingId, setListingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("submitted_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      setListingId(pathParts[pathParts.length - 1]);
    }
  }, []);

  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = usePropertyReviews(listingId);
  const reviews = reviewsResponse?.data || [];

  const propertyData = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const firstReview = reviews[0];
    const propertyMeta = firstReview._meta?.property_data;

    return {
      listingId: firstReview.listing_id,
      listingName: firstReview._meta?.listing_name || propertyMeta?.listingName,
      address: propertyMeta?.address,
      hostName: propertyMeta?.hostName,
      propertyImage: propertyMeta?.propertyImage,
      reviewCount: reviews.length,
      averageRating:
        reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length,
    };
  }, [reviews]);

  const categoryAverages = useMemo(() => {
    if (!reviews) return [];
    return calculateCategoryAverages(reviews);
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    if (!reviews) return [];
    return createRatingDistribution(reviews);
  }, [reviews]);

  const trendData = useMemo(() => {
    if (!reviews) return [];
    return createTrendData(reviews);
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    if (!reviews) return [];

    let filtered = reviews.filter(
      (review) =>
        review._meta?.guest_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        review.public_review.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "submitted_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
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
  }, [reviews, searchTerm, sortField, sortDirection]);

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

  const handleToggleStatus = useCallback(
    (reviewId, currentStatus) => {
      console.log(`Toggle status for review ${reviewId} from ${currentStatus}`);
      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview((prev) => ({
          ...prev,
          status: currentStatus === "published" ? "unpublished" : "published",
        }));
      }
    },
    [selectedReview],
  );

  const handleReviewClick = useCallback((review) => {
    setSelectedReview(review);
  }, []);

  const closePopover = useCallback(() => {
    setSelectedReview(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedReview && !event.target.closest(".review-popover")) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedReview, closePopover]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !propertyData) {
    return (
      <ErrorDisplay
        message="Property not found"
        onRetry={() => window.history.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <AppHeader />
      <PropertyHeader listingName={propertyData.listingName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <PropertyInfoCard propertyData={propertyData} />
            <HostCard hostName={propertyData.hostName} />
          </div>
          <div className="lg:col-span-2">
            <CategoryRatings
              reviewCount={propertyData.reviewCount}
              averageRating={propertyData.averageRating}
              categoryAverages={categoryAverages}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
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

      <WhatsAppWidget />
    </div>
  );
}
