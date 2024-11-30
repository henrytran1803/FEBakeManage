// src/components/ui/pagination.tsx

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(0)}
        className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        disabled={currentPage === 0}
      >
        First
      </button>
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        disabled={currentPage === 0}
      >
        Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 text-sm rounded-md ${number === currentPage ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} hover:bg-blue-600`}
        >
          {number + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages - 1)}
        className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        disabled={currentPage === totalPages - 1}
      >
        Last
      </button>
    </div>
  );
};
