import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse text-[#2d5a4d] text-lg">
        Loading property insights...
      </div>
    </div>
  );
}
