export enum PaymentMethod{
    CASH="CASK",
    QR_CODE="QR_CODE"
}
export enum DiningOption{
    DIN_IN="DIN_IN",
    TAKE_AWAY="TAKE_AWAY"

}
export enum BillStatus{
    NOT_PAID="NOT_PAID",
    PAID="PAID",
    COMPLETED="COMPLETED",
    CANCEL="CANCEL"
}
export interface Bill {
    billId: number;
    customerName: string;
    customerPhone: string;
    paymentMethod:PaymentMethod;
    diningOption: DiningOption;
    billStatus: BillStatus;
    totalAmount: number;
  }
  
  export interface BillResponseData {
    content: Bill[];
    pageable: any; // Có thể thêm kiểu dữ liệu chi tiết cho pageable
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any;
  }
export interface BillResponse_View_Cake{
    billId: number;
    customerName: string;
    customerPhone: string;
    paymentMethod:string;
    nameArea:string;
    nameTable:string;
    billStatus: string;
    diningOption: string;
    totalAmount: number;
    billDetails: BillDetailDTO_ViewCake[];
}  
export interface BillDetailDTO_ViewCake{
    id: number;
    productBatchId: number;
    productName: string;
    productImages:string;
    quantity:number;
    price:number;
    expirationDate:string;
}
export interface BillRequest{
    customerName: string;
    customerPhone:string;
    paymentMethod:string;
    tableId:number;
    diningOption:DiningOption;
    billDetails: BillDetailRequest[];
}
export interface BillDetailRequest{
    productBatchId: number;
    quantity: number;
}
export interface BillStatusDTO{
    billId: number;
    oldStatus:string;
    newStatus:string;
    updatedBy:number;
    updatedAt:Date;
}
export interface BillStatusHistoryDTO{
    id: number;
    billId: number;
    oldStatus:string;
    newStatus:string;
    updateById:number;
    updatedByName:string;
    updateAt:Date;

}