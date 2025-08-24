import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-4 block">{label}</label>
      <div className="flex-1 flex items-center justify-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284e4c]/20 focus:border-[#284e4c] cursor-pointer bg-white text-gray-900"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}