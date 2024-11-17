export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;

}
export interface CategoryCreate {
    name: string;
    url: string;
}
export interface PaginatedCategoryResponse {
    content: Category[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface SearchCategoryFilterProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    activeFilter: 'all' | 'active' | 'inactive';
    setActiveFilter: (value: 'all' | 'active' | 'inactive') => void;
    sortConfig: 'asc' | 'desc';
    setSortConfig: (value: 'asc' | 'desc') => void;
    setPage: (value: number) => void;
}
export interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    size: number;
    setSize: (size: number) => void;
    totalPages: number;
    totalElements: number;
    currentPageElements: number;
}
export interface CategoryListProps {
    categories: Category[];
    onCategoryAdded: () => void;
    onCategoryDeleted: (category: Category) => void;
    onCategoryUpdated: (category: Category) => void;
}
export interface CategorySheetProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category;
    onSuccess: (isSuccess: boolean) => void;
}
export interface SearchPromotionFilterProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    activeFilter: 'all' | 'active' | 'inactive';
    setActiveFilter: (value: 'all' | 'active' | 'inactive') => void;
    sortConfig: {
        sortBy: string;
        sortDir: 'asc' | 'desc';
    };
    setSortConfig: (value: { sortBy: string; sortDir: 'asc' | 'desc' }) => void;
    setPage: (page: number) => void;
    dateFilter: 'all' | 'upcoming' | 'ongoing' | 'ended';
    setDateFilter: (value: 'all' | 'upcoming' | 'ongoing' | 'ended') => void;
}