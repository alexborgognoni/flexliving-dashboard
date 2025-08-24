import React from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function DashboardHeader() {
  return (
    <nav className="bg-[#284e4c] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[88px]">
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer">
              <img
                src="https://ucarecdn.com/09a3ae55-ba77-434e-91d5-52bd450906dd/-/format/auto/"
                alt="The Flex Logo"
                className="object-contain w-[120px] h-[40px] hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <BarChart3 className="h-5 w-5 mr-2" />
              <Link href="/dashboard" className="cursor-pointer">
                <span className="text-lg font-medium hover:text-gray-200 transition-colors">Reviews Dashboard</span>
              </Link>
            </div>
            
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <span className="flex items-center">
                <span className="pr-4">🇬🇧</span>English
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}