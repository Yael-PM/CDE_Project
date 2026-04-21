import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <FaChevronLeft size={14} />
            </button>

            {getPages().map((page, idx) =>
                page === "..." ? (
                    <span key={`dots-${idx}`} className="px-3 py-1 text-gray-500 select-none">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-9 h-9 rounded-lg font-medium text-sm transition-colors ${
                            currentPage === page
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-300 text-gray-700"
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <FaChevronRight size={14} />
            </button>
        </div>
    );
};

export default Pagination;