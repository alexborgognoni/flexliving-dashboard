import React from "react";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export default function RangeSlider({
  label,
  min,
  max,
  step,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  formatValue = (v) => v.toString(),
}: RangeSliderProps) {

  const handleMinInputChange = (input: string) => {
    const val = step === 1 ? parseInt(input) : parseFloat(input);
    if (!isNaN(val)) {
      onMinChange(Math.max(min, Math.min(val, maxValue)));
    }
  };

  const handleMaxInputChange = (input: string) => {
    const val = step === 1 ? parseInt(input) : parseFloat(input);
    if (!isNaN(val)) {
      onMaxChange(Math.min(max, Math.max(val, minValue)));
    }
  };

  const percentage = (value: number) => ((value - min) / (max - min)) * 100;

  const handleStyle =
    "absolute w-4 h-4 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#284e4c] rounded-full cursor-grab hover:cursor-grabbing shadow-lg hover:shadow-xl transition-shadow border-2 border-white hover:scale-110 transform transition-transform";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-4 block">
        {label}
      </label>

      <div className="flex-1 flex items-center justify-center gap-2">
        {/* Min Input */}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => handleMinInputChange(e.target.value)}
          className="w-12 px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#284e4c]/30 focus:border-[#284e4c] text-center"
        />

        {/* Slider Track */}
        <div className="relative flex-1 h-2 bg-gray-200 rounded-full mx-3">
          {/* Selected Range */}
          <div
            className="absolute h-2 bg-[#284e4c] rounded-full"
            style={{
              left: `${percentage(minValue)}%`,
              width: `${percentage(maxValue) - percentage(minValue)}%`,
            }}
          />

          {/* Min Handle */}
          <div
            className={handleStyle}
            style={{ left: `${percentage(minValue)}%` }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const rect = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
              const handleMove = (moveEvent: MouseEvent) => {
                const delta = moveEvent.clientX - rect.left;
                const newPercentage = Math.min(Math.max(delta / rect.width, 0), 1);
                const newValue = Math.round((min + newPercentage * (max - min)) / step) * step;
                onMinChange(Math.min(newValue, maxValue));
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          />

          {/* Max Handle */}
          <div
            className={handleStyle}
            style={{ left: `${percentage(maxValue)}%` }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const rect = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
              const handleMove = (moveEvent: MouseEvent) => {
                const delta = moveEvent.clientX - rect.left;
                const newPercentage = Math.min(Math.max(delta / rect.width, 0), 1);
                const newValue = Math.round((min + newPercentage * (max - min)) / step) * step;
                onMaxChange(Math.max(newValue, minValue));
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }}
          />
        </div>

        {/* Max Input */}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => handleMaxInputChange(e.target.value)}
          className="w-12 px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#284e4c]/30 focus:border-[#284e4c] text-center"
        />
      </div>
    </div>
  );
}
