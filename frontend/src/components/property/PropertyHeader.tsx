import React from "react";

interface PropertyHeaderProps {
  listingName: string;
}

export default function PropertyHeader({ listingName }: PropertyHeaderProps) {
  return (
    <div className="bg-[#f1f3ee] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-light text-[#284e4c] mb-4">
            {listingName}
          </h1>
          <p className="text-lg text-gray-600">
            Detailed insights and guest feedback analysis
          </p>
        </div>
      </div>
    </div>
  );
}