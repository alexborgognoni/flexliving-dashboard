"use client";

import React from "react";
import { BarChart3, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function Home() {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#fffdf6]">
      <DashboardHeader />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Manage
              <br />
              <span className="font-bold text-[#284e4c]">
                Beautiful Reviews
              </span>
            </h1>
            <p className="text-xl text-[#5C5C5A] mb-12 max-w-2xl mx-auto">
              The Flex property review management dashboard – track guest
              feedback, analyze ratings, and optimize your hosting performance
              across all locations.
            </p>

            <button
              onClick={navigateToDashboard}
              className="inline-flex items-center px-8 py-4 bg-[#284e4c] text-white font-medium rounded-full hover:bg-[#284e4c]/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              <BarChart3 size={20} className="mr-2" />
              View Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-[#fffdf6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Review Management Made Simple
            </h2>
            <p className="text-lg text-[#5C5C5A] max-w-3xl mx-auto">
              All the tools you need to track, analyze, and improve your
              property reviews in one beautifully designed dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
              <div className="w-16 h-16 bg-[#284e4c] rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Analytics & Insights
              </h3>
              <p className="text-[#5C5C5A]">
                Track rating trends, distribution patterns, and performance
                metrics across all your properties with interactive charts and
                visualizations.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
              <div className="w-16 h-16 bg-[#284e4c] rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Review Management
              </h3>
              <p className="text-[#5C5C5A]">
                Organize, filter, and manage all guest reviews in one place.
                Search by property, guest, or rating to find exactly what you
                need.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
              <div className="w-16 h-16 bg-[#284e4c] rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Property Performance
              </h3>
              <p className="text-[#5C5C5A]">
                Deep dive into individual property performance with detailed
                category ratings and historical trend analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#284e4c] mb-2">3</div>
              <div className="text-sm font-medium text-[#5C5C5A] uppercase tracking-wide">
                Properties
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#284e4c] mb-2">5</div>
              <div className="text-sm font-medium text-[#5C5C5A] uppercase tracking-wide">
                Total Reviews
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#284e4c] mb-2">8.8</div>
              <div className="text-sm font-medium text-[#5C5C5A] uppercase tracking-wide">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
