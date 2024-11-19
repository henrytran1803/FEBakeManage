export interface Batch {
    id: number;
    status: string;
    dateExpiry: string;
    dailyDiscount: number;
    currentDiscount: number;
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
// \"id": 1,
//     "name": "Chocolate Cake",
//     "status": "EXPIRED",
//     "currentDiscount": 10,
//     "dailyDiscount": 10,
//     "quantity": 100,
//     "dateExpiry": "2024-11-14",
//     "countDown": -4

export interface GetBatchByStatus {
    id: number;
    name: string;
    status: string;
    dateExpiry: string;
    currentDiscount: number;
    dailyDiscount:number;
    countDown:number
    quantity:number;
}

export interface ProductBatchStatus {
    status: ["ACTIVE", "NEAR_EXPIRY", "EXPIRED"]
}