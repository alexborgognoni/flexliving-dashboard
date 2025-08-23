import React from "react";
import { Star } from "lucide-react";

export default function HostCard({ hostName }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-[#284e4c] px-6 py-4">
        <h3 className="text-xl font-medium text-white">Host Details</h3>
      </div>
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://ucarecdn.com/c8b5d4f3-6e2a-4b1d-9f3c-8a7e5f9b2c4d/-/format/auto/"
            alt={hostName}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h4 className="text-lg font-medium text-gray-900 mb-2">{hostName}</h4>
          <div className="text-sm text-gray-600 mb-4">Property Host</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span>Host since 2019</span>
          </div>
        </div>
      </div>
    </div>
  );
}
