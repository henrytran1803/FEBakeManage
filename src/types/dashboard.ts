export interface DashBoardDTO {
    todayRevenue: number;
    todayBill: number;
    productNameBestSeller: string;
    monthRevenue: MonthRevenueDTO[];
    categoryRevenue: ProductCategoryRevenueDTO[];
    hourlyOrders: { [hour: string]: number };
}

export interface MonthRevenueDTO {
    month: string;
    revenue: number;
    totalOrders: number;
}

export interface ProductCategoryRevenueDTO {
    categoryName: string;
    revenue: number;
    percentage: number;
}