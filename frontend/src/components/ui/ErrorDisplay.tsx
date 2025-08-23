import React from "react";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-lg">{message}</div>
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-3 bg-[#2d5a4d] text-white rounded-full hover:bg-[#2d5a4d]/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}