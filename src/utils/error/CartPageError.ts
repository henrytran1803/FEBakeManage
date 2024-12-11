// utils/error/billError.ts
export enum CartPageErrorCode {
    CUSTOMER_NAME_REQUIRED = 'CUSTOMER_NAME_REQUIRED',
    PHONE_NUMBER_REQUIRED = 'PHONE_NUMBER_REQUIRED',
    PAYMENT_METHOD_REQUIRED = 'PAYMENT_METHOD_REQUIRED',
    TABLE_REQUIRED = 'TABLE_REQUIRED',
    DINING_OPTION_REQUIRED = 'DINING_OPTION_REQUIRED',
    PAYMENT_LINK_ERROR = 'PAYMENT_LINK_ERROR',
    CREATE_BILL_ERROR = 'CREATE_BILL_ERROR',
    PAYMENT_PROCESSING_ERROR = 'PAYMENT_PROCESSING_ERROR',
    CREATE_BILL_SUCCESS = 'CREATE_BILL_SUCCESS',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS'
}

export const cartPageErrorMessages: { [key in CartPageErrorCode]: string } = {
    [CartPageErrorCode.CUSTOMER_NAME_REQUIRED]: 'Vui lòng nhập tên khách hàng',
    [CartPageErrorCode.PHONE_NUMBER_REQUIRED]: 'Vui lòng nhập số điện thoại',
    [CartPageErrorCode.PAYMENT_METHOD_REQUIRED]: 'Vui lòng chọn phương thức thanh toán',
    [CartPageErrorCode.TABLE_REQUIRED]: 'Vui lòng chọn bàn',
    [CartPageErrorCode.DINING_OPTION_REQUIRED]: 'Vui lòng chọn hình thức dùng bữa',
    [CartPageErrorCode.PAYMENT_LINK_ERROR]: 'Không thể tạo link thanh toán',
    [CartPageErrorCode.CREATE_BILL_ERROR]: 'Có lỗi xảy ra khi tạo đơn hàng',
    [CartPageErrorCode.PAYMENT_PROCESSING_ERROR]: 'Lỗi xử lý thanh toán',
    [CartPageErrorCode.CREATE_BILL_SUCCESS]: 'Đặt hàng thành công!',
    [CartPageErrorCode.PAYMENT_SUCCESS]: 'Thanh toán thành công'
};