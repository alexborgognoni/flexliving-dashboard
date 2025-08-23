import React from "react";
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
    <nav className="bg-[#284e4c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          <div className="flex items-center">
            <img
              src="https://ucarecdn.com/09a3ae55-ba77-434e-91d5-52bd450906dd/-/format/auto/"
              alt="The Flex Logo"
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-2 hover:text-gray-200 cursor-pointer">
              <Building2 size={27} />
              <span className="text-base font-medium">Landlords</span>
              <ChevronDown size={21} />
            </div>
            <div className="flex items-center space-x-2 hover:text-gray-200 cursor-pointer">
              <Info size={27} />
              <span className="text-base font-medium">About us</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-gray-200 cursor-pointer">
              <BookOpen size={27} />
              <span className="text-base font-medium">Careers</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-gray-200 cursor-pointer">
              <Mail size={27} />
              <span className="text-base font-medium">Contact</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-gray-200 cursor-pointer">
              <span className="text-xl">🇬🇧</span>
              <span className="text-base font-medium">English</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-gray-200 cursor-pointer">
              <PoundSterling size={27} />
              <span className="text-base font-medium">GBP</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
