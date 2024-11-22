import {Price} from "@/types/price.ts";
import {CartItem} from "@/types/productBatch.ts";

export interface SearchProductParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
    status?: boolean;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
}
export interface PriceRange {
    min: number | null;
    max: number | null;
}
export interface SearchProductFilterProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    activeFilter: 'all' | 'active' | 'inactive';
    setActiveFilter: (value: 'all' | 'active' | 'inactive') => void;
    sortConfig: 'asc' | 'desc';
    setSortConfig: (value: 'asc' | 'desc') => void;
    priceRange: { min: number | null; max: number | null };
    setPriceRange: (value: { min: number | null; max: number | null } | ((prev: { min: number | null; max: number | null }) => { min: number | null; max: number | null })) => void;
    setPage: (value: number) => void;
}




export interface UpdateStatusParams {
    status: boolean;
}

export interface Product {
    id: number;
    name: string;
    currentPrice: number;
    categoryName: string;
    status: boolean;
    images: string[];
}

export interface ProductCreate {
    categoryId: number;
    name: string;
    price: number;
    description: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    discountLimit: number;
    recipeId: number;
    shelfLifeDays: number;
    shelfLifeDaysWarning: number;
    imageUrls: string[];
}
export interface ProductUpdate {
    id:number,
    categoryId: number;
    name: string;
    price: number;
    description: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    discountLimit: number;
    recipeId: number;
    shelfLifeDays: number;
    shelfLifeDaysWarning: number;
}
export interface ProductDetail {
    id?: number;
    categoryId: number;
    name: string;
    currentPrice?: number;
    price?: number;
    description: string;
    shelfLifeDays: number;
    shelfLifeDaysWarning: number;
    status?: boolean;
    weight: number;
    length: number;
    width: number;
    height: number;
    discountLimit: number;
    recipeId: number;
    category?: {
        id: number;
        name: string;
    };
    recipe?: {
        id: number;
        name: string;
    };
    images: ProductImage[];
}
export interface ProductImage {
    id: number;
    url: string;
}
export interface PaginatedProductResponse {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface PaginatedProductActiveResponse {
    content: SearchProductActiveResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export  interface SearchProductActiveResponse {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
    categoryName: string;
    maxDailyDiscount: number;
    totalQuantity: number;
    price: number;
}
export interface SearchProductActiveParams {
    productName?: string;
    categoryIds?: number[];
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onStatusChange: (id: number, currentStatus: boolean) => void;
}
export interface ProductFormSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productId?: number | null;
}
export interface ProductDetailActive {
    id : number;
    name: string;
    description: string;
    currentPrice: number;
    category: CategoryActive;
    productBatches: ProductBatchActive[];
    imageUrls: string[]
}
export interface ProductBatchActive {
    id : number;
    expirationDate: string;
    status: boolean;
    dailyDiscount: number;
}
export interface CategoryActive{
    id: number;
    name: string;
}
export interface DetailProductActiveResponse {
    active: ProductDetailActive;
    prices: Price[];
}
export interface ProductCart {
    productBatchId:number;
    quantity:number;
    quantityRemain: number;
    name: string;
    dailyDiscount: number;
    discountBonus: number;
    categoryName: string;
    price: number;
    imageUrl: string;
}
export interface ProductCartRequest {
    discountCode:string;
    productBatchCarts: CartItem[];
}
// productBatchCarts": [
// {
//     "productBatchId": 1,
//     "quantity": 2
// },