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