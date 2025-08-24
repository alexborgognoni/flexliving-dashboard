import React from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

interface SortableHeaderProps {
  field: string;
  label: string;
  sortField: string;
  sortDirection: string;
  onSort: (field: string) => void;
  className?: string;
}

export default function SortableHeader({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className = "text-left",
}: SortableHeaderProps) {
  return (
    <th className={`${className} py-3 px-6`}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 font-medium text-gray-700 hover:text-[#284e4c] transition-colors cursor-pointer"
      >
        {label}
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          ))}
        {sortField !== field && <ArrowUpDown size={14} className="opacity-30" />}
      </button>
    </th>
  );
}