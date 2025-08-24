import React, { useState } from "react";
import { ExternalLink, MapPin, Users, Bed, Bath, Home } from "lucide-react";

interface PropertyData {
  listingId: string;
  listingName: string;
  address: string;
  propertyImage: string;
}

interface PropertyInfoCardProps {
  propertyData: PropertyData;
}

export default function PropertyInfoCard({ propertyData }: PropertyInfoCardProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      {!imageError ? (
        <img
          src={propertyData.propertyImage}
          alt={propertyData.listingName}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
          <Home size={48} className="text-gray-400" />
        </div>
      )}
      <div className="bg-[#284e4c] px-6 py-4">
        <h3 className="text-xl font-medium text-white">Property Overview</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin size={18} className="text-[#284e4c]" />
            <span>{propertyData.address}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-600">
              <Users size={18} className="text-[#284e4c]" />
              <div>
                <span className="font-medium text-gray-900">8</span>
                <span className="text-sm text-gray-500 ml-1">guests</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Bed size={18} className="text-[#284e4c]" />
              <div>
                <span className="font-medium text-gray-900">3</span>
                <span className="text-sm text-gray-500 ml-1">bedrooms</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Bath size={18} className="text-[#284e4c]" />
              <div>
                <span className="font-medium text-gray-900">2</span>
                <span className="text-sm text-gray-500 ml-1">bathrooms</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Home size={18} className="text-[#284e4c]" />
              <div>
                <span className="font-medium text-gray-900">4</span>
                <span className="text-sm text-gray-500 ml-1">beds</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <a
              href={`/properties/${propertyData.listingId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#284e4c] text-white text-sm font-medium rounded-full hover:bg-[#284e4c]/90 transition-colors w-full justify-center"
            >
              <ExternalLink size={14} />
              View Details Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
