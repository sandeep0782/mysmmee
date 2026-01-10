import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* First Page */}
      <Button
        variant={currentPage === 1 ? "default" : "outline"}
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        1
      </Button>

      {/* Previous */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Current Page Info */}
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant={currentPage === totalPages ? "default" : "outline"}
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        {totalPages}
      </Button>
    </div>
  );
};

export default Pagination;
