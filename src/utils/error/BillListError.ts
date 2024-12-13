// constants/billErrorConstants.ts

import { BillResponse_View_Cake, BillStatus } from "@/types/Bill";

export enum BillErrorCode {
    // Loading Errors
    LOAD_BILLS_ERROR = 'LOAD_BILLS_ERROR',
    BILL_DETAILS_ERROR = 'BILL_DETAILS_ERROR',
    SEARCH_ERROR = 'SEARCH_ERROR',
    
    // Authentication Errors
    NO_USER_DATA = 'NO_USER_DATA',
    NO_USER_ROLE = 'NO_USER_ROLE',
    
    // Bill Status Errors
    BILL_NOT_FOUND = 'BILL_NOT_FOUND',
    UPDATE_STATUS_ERROR = 'UPDATE_STATUS_ERROR',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    STAFF_STATUS_RESTRICTION = 'STAFF_STATUS_RESTRICTION',
    
    // Success Messages
    STATUS_UPDATE_SUCCESS = 'STATUS_UPDATE_SUCCESS',
}

export const billErrorMessages: { [key in BillErrorCode]: string } = {
    [BillErrorCode.LOAD_BILLS_ERROR]: 'Không thể tải danh sách hóa đơn',
    [BillErrorCode.BILL_DETAILS_ERROR]: 'Không thể lấy chi tiết hóa đơn',
    [BillErrorCode.SEARCH_ERROR]: 'Lỗi tìm kiếm',
    
    [BillErrorCode.NO_USER_DATA]: 'Không tìm thấy dữ liệu người dùng trong localStorage',
    [BillErrorCode.NO_USER_ROLE]: 'Không tìm thấy vai trò người dùng trong localStorage',
    
    [BillErrorCode.BILL_NOT_FOUND]: 'Hóa đơn không tồn tại',
    [BillErrorCode.UPDATE_STATUS_ERROR]: 'Đã có lỗi xảy ra khi cập nhật trạng thái hóa đơn',
    [BillErrorCode.PERMISSION_DENIED]: 'Bạn không có quyền cập nhật trạng thái này',
    [BillErrorCode.STAFF_STATUS_RESTRICTION]: 'Nhân viên không thể chuyển trạng thái từ NOT_PAID sang CANCEL',
    
    [BillErrorCode.STATUS_UPDATE_SUCCESS]: 'Trạng thái hóa đơn đã được cập nhật',
};

// Type definitions for bill-related interfaces
export interface SearchParams {
    id?: number;
    customerName?: string;
    customerPhone?: string;
}

export interface DialogTypes {
    cancel: 'cancel';
    details: 'details';
    pay: 'pay';
}

// Default bill state
export const defaultBillState: BillResponse_View_Cake = {
    billId: 0,
    customerName: "",
    customerPhone: "",
    totalAmount: 0,
    billStatus: BillStatus.PAID,
    paymentMethod: "CASH",
    nameArea: "",
    nameTable: "",
    diningOption: "",
    billDetails: [],
};

// Table column definitions
export const TABLE_COLUMNS = {
    BILL_ID: 'billId',
    CUSTOMER_NAME: 'customerName',
    CUSTOMER_PHONE: 'customerPhone',
    PAYMENT_METHOD: 'paymentMethod',
    DINING_OPTION: 'diningOption',
    BILL_STATUS: 'billStatus',
    TOTAL_AMOUNT: 'totalAmount',
};

// Role definitions
export const ROLES = {
    MANAGE: 'manage',
    USER: 'user',
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
    INITIAL_PAGE: 0,
    PAGE_SIZE: 10,
};