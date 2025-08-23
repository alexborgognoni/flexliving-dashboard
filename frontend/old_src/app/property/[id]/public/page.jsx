"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePropertyReviews } from "@/hooks/useReviews";
import AppHeader from "@/components/layout/AppHeader";
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Home,
  Calendar,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Shirt,
  Phone,
  Clock,
  Shield,
  User,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorDisplay from "@/components/ui/ErrorDisplay";

export default function PublicPropertyPage() {
  const [listingId, setListingId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      setListingId(pathParts[2]);
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
    };
  }, [reviews]);

  const publishedReviews = useMemo(() => {
    if (!reviews) return [];
    return reviews.filter((review) => review.status === "published");
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (!publishedReviews.length) return 0;
    return (
      publishedReviews.reduce((sum, review) => sum + review.overall_rating, 0) /
      publishedReviews.length
    );
  }, [publishedReviews]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !propertyData) {
    return (
      <ErrorDisplay
        message="Property not found"
        onRetry={() => window.history.back()}
      />
    );
  }

  const galleryImages = [
    propertyData.propertyImage,
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
  ];

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery - Full Width */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4 h-96">
            <div className="col-span-1">
              <img
                src={galleryImages[0]}
                alt="Main property view"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              {galleryImages.slice(1, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property view ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Property Details - Full Width Below Images */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {propertyData.listingName}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#284e4c]" />
                <span>8 guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed size={16} className="text-[#284e4c]" />
                <span>3 bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={16} className="text-[#284e4c]" />
                <span>2 bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={16} className="text-[#284e4c]" />
                <span>4 beds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* About this property */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Experience comfort and style in this beautifully furnished
                property. Perfect for business travelers, families, or anyone
                seeking a premium stay with all the amenities you need. The
                space features modern furnishings, high-speed internet, and a
                fully equipped kitchen to make your stay as comfortable as
                possible.
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Wifi size={20} className="text-gray-600" />
                  <span className="text-gray-700">Free WiFi</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car size={20} className="text-gray-600" />
                  <span className="text-gray-700">Parking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Coffee size={20} className="text-gray-600" />
                  <span className="text-gray-700">Kitchen</span>
                </div>
                <div className="flex items-center gap-3">
                  <Tv size={20} className="text-gray-600" />
                  <span className="text-gray-700">TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wind size={20} className="text-gray-600" />
                  <span className="text-gray-700">Air Conditioning</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shirt size={20} className="text-gray-600" />
                  <span className="text-gray-700">Washer & Dryer</span>
                </div>
              </div>
            </div>

            {/* Stay Policies */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Stay Policies
              </h2>

              <div className="space-y-4">
                {/* Check-in & Check-out */}
                <div className="bg-[#f1f3ee] rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Clock size={18} />
                    Check-in & Check-out
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-md p-3">
                      <p className="text-gray-700">Check-in: 3:00 PM</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-gray-700">Check-out: 11:00 AM</p>
                    </div>
                  </div>
                </div>

                {/* House Rules */}
                <div className="bg-[#f1f3ee] rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={18} />
                    House Rules
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-md p-3">
                      <p className="text-gray-700">No smoking</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-gray-700">No pets allowed</p>
                    </div>
                    <div className="bg-white rounded-md p-3 col-span-2">
                      <p className="text-gray-700">No parties or events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section - Only Published */}
            {publishedReviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Guest Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <span className="text-lg font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({publishedReviews.length} review
                      {publishedReviews.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {publishedReviews.slice(0, 6).map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-lg p-6 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#284e4c] rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {review._meta?.guest_name}
                            </h4>
                            <div className="text-sm text-gray-600">
                              {new Date(
                                review.submitted_at,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="font-medium">
                            {review.overall_rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.public_review}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Book your stay
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in & Check-out
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">Select dates</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-gray-600">1 guest</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#284e4c] text-white py-3 rounded-lg font-medium hover:bg-[#284e4c]/90 transition-colors mb-4">
                Check availability
              </button>

              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={16} />
                Send inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
