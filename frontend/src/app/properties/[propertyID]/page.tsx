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
  Ban,
  PawPrint,
  PartyPopper,
  CalendarClock,
  Sofa,
  Network,
  UtensilsCrossed,
  WashingMachine,
  Thermometer,
  CalendarCheck,
  MessageCircle,
  ChevronDown,
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
  stay_policies: {
    check_in: string;
    check_out: string;
    house_rules: string[];
  };
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
              <div className="rounded-lg text-card-foreground mb-8 p-6 bg-white border-0 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-[#333333]">
                  About this property
                </h2>
                <div className="space-y-4">
                  <p className="text-[#5C5C5A] whitespace-pre-line leading-relaxed">
                    {property.description ||
                      "Experience comfort and style in this beautifully furnished property. Perfect for business travelers, families, or anyone seeking a premium stay with all the amenities you need."}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="rounded-lg text-card-foreground p-6 mb-12 bg-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-[#333333]">
                    Amenities
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <Sofa className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Cable TV</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <Network className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Internet</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <Wifi className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Wireless</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <span className="capitalize">Air conditioning</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <UtensilsCrossed className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Kitchen</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <WashingMachine className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Washing Machine</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <span className="capitalize">Dryer</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <Wind className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Hair Dryer</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5C5C5A]">
                    <div className="p-2 rounded-full">
                      <Thermometer className="h-4 w-4" />
                    </div>
                    <span className="capitalize">Heating</span>
                  </div>
                </div>
              </div>

              {/* Stay Policies */}
              <div className="bg-white border-0 shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-[#333333]">
                  Stay Policies
                </h2>
                <div className="space-y-8">
                  {/* Check-in & Check-out */}
                  <div className="bg-[#F1F3EE] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full">
                        <Clock className="h-5 w-5 text-[#284E4C]" />
                      </div>
                      <h3 className="font-semibold text-lg text-[#333333]">
                        Check-in & Check-out
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-[#5C5C5A]">Check-in time</p>
                        <p className="font-semibold text-lg text-[#333333]">
                          {property.stay_policies.check_in || "3:00 PM"}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-[#5C5C5A]">Check-out time</p>
                        <p className="font-semibold text-lg text-[#333333]">
                          {property.stay_policies.check_out || "10:00 AM"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* House Rules */}
                  <div className="bg-[#F1F3EE] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full">
                        <Shield className="h-5 w-5 text-[#284E4C]" />
                      </div>
                      <h3 className="font-semibold text-lg text-[#333333]">
                        House Rules
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.stay_policies.house_rules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4">
                          {rule === "no_smoking" && (
                            <>
                              <Ban className="h-5 w-5 text-[#5C5C5A]" />
                              <p className="font-medium text-[#333333]">No smoking</p>
                            </>
                          )}
                          {rule === "no_pets" && (
                            <>
                              <PawPrint className="h-5 w-5 text-[#5C5C5A]" />
                              <p className="font-medium text-[#333333]">No pets</p>
                            </>
                          )}
                          {rule === "no_parties_or_events" && (
                            <>
                              <PartyPopper className="h-5 w-5 text-[#5C5C5A]" />
                              <p className="font-medium text-[#333333]">No parties or events</p>
                            </>
                          )}
                          {rule === "security_deposit_required" && (
                            <>
                              <Shield className="h-5 w-5 text-[#5C5C5A]" />
                              <p className="font-medium text-[#333333]">Security deposit required</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="bg-[#F1F3EE] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full">
                        <CalendarClock className="h-5 w-5 text-[#284E4C]" />
                      </div>
                      <h3 className="font-semibold text-lg text-[#333333]">
                        Cancellation Policy
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-[#333333]">
                          For stays less than 28 days
                        </h4>
                        <div className="flex items-start gap-2 text-sm text-[#5C5C5A]">
                          <div className="w-2 h-2 bg-[#284E4C] rounded-full mt-1.5 flex-shrink-0"></div>
                          <p>Full refund up to 14 days before check-in</p>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-[#5C5C5A] mt-1">
                          <div className="w-2 h-2 bg-[#284E4C] rounded-full mt-1.5 flex-shrink-0"></div>
                          <p>No refund for bookings less than 14 days before check-in</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-[#333333]">
                          For stays of 28 days or more
                        </h4>
                        <div className="flex items-start gap-2 text-sm text-[#5C5C5A]">
                          <div className="w-2 h-2 bg-[#284E4C] rounded-full mt-1.5 flex-shrink-0"></div>
                          <p>Full refund up to 30 days before check-in</p>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-[#5C5C5A] mt-1">
                          <div className="w-2 h-2 bg-[#284E4C] rounded-full mt-1.5 flex-shrink-0"></div>
                          <p>No refund for bookings less than 30 days before check-in</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="rounded-lg text-card-foreground p-6 mb-8 bg-white border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#333333]">
                    Guest Reviews
                  </h2>
                  {publishedReviews.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-400 fill-current" />
                      <span className="text-lg font-medium text-[#333333]">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-[#5C5C5A]">
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
                        className="bg-[#F1F3EE] rounded-lg p-4 border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#284E4C] rounded-full flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-[#333333]">
                                Guest {review.guest_id}
                              </h4>
                              <div className="text-sm text-[#5C5C5A]">
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
                            <span className="font-medium text-[#333333]">
                              {review.overall_rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-[#5C5C5A] leading-relaxed">
                          {review.public_review}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F1F3EE] rounded-lg p-6 border border-gray-100 text-center">
                    <p className="text-[#5C5C5A] text-lg mb-2">No reviews yet</p>
                    <p className="text-[#5C5C5A] text-sm">
                      Be the first to leave a review for this property!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="text-card-foreground sticky top-24 overflow-hidden bg-white border-0 shadow-lg rounded-2xl mb-6">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#284E4C]"></div>
                  <div className="relative p-6">
                    <h3 className="text-lg font-semibold text-[#FFFFFF] mb-1">
                      Book your stay
                    </h3>
                    <p className="text-sm text-[#D2DADA]">
                      Select dates to see the total price
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="grid w-full h-full">
                          <button
                            className="inline-flex items-center whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-300 px-4 py-2 w-full h-[42px] justify-start text-left font-normal bg-white shadow-sm transition-colors rounded-l-md rounded-r-none text-[#333333] hover:bg-gray-100"
                            type="button"
                          >
                            <Calendar className="mr-2 h-4 w-4 text-[#333333]" />
                            <span>Select dates</span>
                          </button>
                        </div>
                      </div>
                      <div className="w-[120px]">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] bg-white shadow-sm hover:bg-gray-100 transition-colors text-[#333333] rounded-l-none rounded-r-md"
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#333333]" />
                            <span>1</span>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50 text-[#333333]" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-6">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-12 rounded-md px-8 w-full bg-[#284E4C] hover:bg-[#284E4C]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      <span>Check availability</span>
                    </button>
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#284E4C]/20 bg-white shadow-sm h-12 rounded-md px-8 w-full text-[#284E4C] hover:bg-[#f5f5f5] hover:border-[#284E4C]/30">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Send Inquiry</span>
                    </button>
                  </div>
                  <p className="text-sm text-[#5C5C5A] text-center mt-4">
                    <span className="inline-flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Instant confirmation</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
