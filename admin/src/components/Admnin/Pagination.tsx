"use client";

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Calculate middle pages (current -1, current, current +1)
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        // Add dots if gap
        if (start > 2) pages.push(-1); // -1 will render as "..."
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push(-1);

        // Always show last page
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center mt-6 gap-2">
            {/* Prev Button */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded text-sm font-medium transition ${currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                Prev
            </button>

            {/* Page Numbers */}
            {pages.map((page, idx) =>
                page === -1 ? (
                    <span key={idx} className="px-3 py-1 text-sm text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded text-sm font-medium transition ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
