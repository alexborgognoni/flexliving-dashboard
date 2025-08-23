"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import {
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
  amenities: string[];
}

interface Review {
  id: string;
  public_review: string;
  overall_rating: number;
  submitted_at: string;
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
    fetch(`http://localhost:8000/api/properties/${propertyId}/reviews`),
  ]);

  if (!propertyRes.ok) throw new Error("Failed to fetch property");
  if (!reviewsRes.ok) throw new Error("Failed to fetch reviews");

  const property = await propertyRes.json();
  const reviewsData = await reviewsRes.json();

  return {
    property: property.data,
    reviews: reviewsData.data,
    averageRating: reviewsData.meta.averageRating,
    totalReviews: reviewsData.meta.totalCount,
  };
}

export default function PublicPropertyPage() {
  const params = useParams();
  const propertyId = params.propertyID as string;
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPropertyData() {
      try {
        const data = await fetchPropertyData(propertyId);
        setPropertyData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load property data",
        );
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      loadPropertyData();
    }
  }, [propertyId]);

  const publishedReviews = useMemo(() => {
    if (!propertyData?.reviews) return [];
    return propertyData.reviews.filter((review) => review.status === "published");
  }, [propertyData?.reviews]);

  const averageRating = useMemo(() => {
    if (!publishedReviews.length) return 0;
    return (
      publishedReviews.reduce(
        (sum, review) => sum + review.overall_rating,
        0,
      ) / publishedReviews.length
    );
  }, [publishedReviews]);

  if (loading) return <LoadingSpinner />;
  if (error || !propertyData) {
    return (
      <ErrorDisplay
        message={error || "Property not found"}
        onRetry={() => window.history.back()}
      />
    );
  }

  const { property } = propertyData;

  const galleryImages = [
    property.images[0] ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
  ];

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <AppHeader />

      <div className="flex flex-col">
        {/* Full Width Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Image Gallery */}
          <div className="mb-16 w-full">
            <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-4 h-[500px]">
              <div className="col-span-2 row-span-2">
                <img
                  src={galleryImages[0]}
                  alt="Main property view"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {galleryImages.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Property view ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </div>
            <div className="md:hidden w-full h-[300px]">
              <img
                src={galleryImages[0]}
                alt="Main property view"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.title}
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

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About this property
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description ||
                    "Experience comfort and style in this beautifully furnished property. Perfect for business travelers, families, or anyone seeking a premium stay with all the amenities you need."}
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

              {/* Reviews */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Guest Reviews
                  </h2>
                  {publishedReviews.length > 0 ? (
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
                  ) : <></>}
                </div>

                {publishedReviews.length > 0 ? (
                  <div className="space-y-6">
                    {publishedReviews.slice(0, 6).map((review) => (
                      <div
                        key={review.id}
                        className="bg-[#f9fafb] rounded-lg p-4 border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#284e4c] rounded-full flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Guest {review.guest_id}
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
                ) : (
                  <div className="bg-[#f9fafb] rounded-lg p-6 border border-gray-100 text-center">
                    <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                    <p className="text-gray-400 text-sm">
                      Be the first to leave a review for this property!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-lg sticky top-8 mb-6">
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
    </div>
  );
}
