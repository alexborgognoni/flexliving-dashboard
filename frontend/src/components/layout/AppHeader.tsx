import React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  Info,
  BookOpen,
  Mail,
  PoundSterling,
} from "lucide-react";

export default function AppHeader() {
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
          <div className="hidden md:flex items-center space-x-20">
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Landlords
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <Info className="h-4 w-4 mr-2" />
              About Us
            </button>
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Careers
            </button>
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </button>
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <span className="flex items-center">
                <span className="pr-4">🇬🇧</span>English
              </span>
            </button>
            <button 
              onClick={() => {}}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 font-medium text-white hover:text-gray-200 cursor-pointer transition-colors"
            >
              <span className="text-lg filter drop-shadow-sm">£</span>
              <span className="text-xs font-medium ml-1 filter drop-shadow-sm">GBP</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}