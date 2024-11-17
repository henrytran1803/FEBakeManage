export interface Batch {
    id: number;
    status: string;
    dateExpiry: string;
    countDown:number
}
export interface ProductBatch {
    id: number;
    name: string;
    shelfLifeDays: number;
    totalProductBatch: number;
    totalNearExpiry: number;
    totalExpiry: number;
    productBatches: Batch[];
}