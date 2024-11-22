export interface Batch {
    id: number;
    status: string;
    dateExpiry: string;
    dailyDiscount: number;
    totalNearExpiry: number;
    countDown:number
}
export interface ProductBatch {
    id: number;
    name: string;
    shelfLifeDays: number;
    totalProductBatch: number;
    totalExpiry: number;
    productBatches: Batch[];
}

export interface QuickDisposed {
    note: string;
    productBatchIds: number[];
}

export interface GetBatchByStatus {
    id: number;
    name: string;
    status: string;
    dateExpiry: string;
    dailyDiscount:number;
    countDown:number
    quantity:number;
}

export interface ProductBatchStatus {
    status: ["ACTIVE", "NEAR_EXPIRY", "EXPIRED"]
}
export interface Cart {
    table: number;
    carts: CartItem[];
}

export interface CartItem {
    productBatchId: number;
    quantity: number;
}