export interface DisposedProductSummaryDTO {
    id: number;
    dateDisposed: string;
    totalBatches: number;
    totalQuantityDisposed: number;
    note: string | null;
    staffName: string;
}

export interface DisposedBatchDTO {
    batchId: number;
    productName: string;
    disposedQuantity: number;
    manufacturingDate: string;
}

export interface DisposedProductDetailResponseDTO {
    id: number;
    dateDisposed: string;
    note: string | null;
    staffName: string;
    disposedBatches: DisposedBatchDTO[];
}
