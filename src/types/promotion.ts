export interface Promotion {
    id: number;
    name: string;
    description: string;
    discount: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    remainingDays: number;
}
export interface PaginatedPromotionResponse {
    content: Promotion[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
export interface PromotionSearchParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    id?: number;
    name?: string;
    description?: string;
    discount?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
export interface PromotionCreate {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    discount: number;
    productBatchIds: number[];
}
export interface PromotionDetailCreate{
    productBatchId: number;
}
export interface PromotionUpdate {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    discount: number;
}

export interface PromotionDetail {
    promotion:number;
    productBatch:number;
}
export interface PromotionDetailId {
    productBatchId: number;
    promotionId: number;
}

export interface PromotionDetail {
    id: PromotionDetailId;
}

export interface PromotionForDetail {
    id: number;
    name: string;
    description: string;
    discount: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string | null;
    promotionDetails: PromotionDetail[];
}
export interface PromotionListProps {
    promotions: Promotion[];
    onPromotionAdded: () => void;
    onPromotionDeleted: (promotion: Promotion) => void;
    onPromotionUpdated: (promotion: Promotion) => void;
}
export interface PromotionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    promotion?: Promotion;
    onSuccess: (isSuccess: boolean) => void;
}