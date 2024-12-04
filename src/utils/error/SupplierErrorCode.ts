export enum SupplierErrorCode {
    // Success messages
    CREATE_SUCCESS = 'CREATE_SUCCESS',
    UPDATE_SUCCESS = 'UPDATE_SUCCESS',
    DELETE_SUCCESS = 'DELETE_SUCCESS',

    // Error messages
    CREATE_ERROR = 'CREATE_ERROR',
    UPDATE_ERROR = 'UPDATE_ERROR',
    DELETE_ERROR = 'DELETE_ERROR',

    // Validation messages
    NAME_REQUIRED = 'NAME_REQUIRED',
    PHONE_REQUIRED = 'PHONE_REQUIRED',
    EMAIL_REQUIRED = 'EMAIL_REQUIRED',
    ADDRESS_REQUIRED = 'ADDRESS_REQUIRED',

    // API error
    FETCH_ERROR = 'FETCH_ERROR'
}

export const supplierErrorMessages: { [key in SupplierErrorCode]: string } = {
    // Success messages
    [SupplierErrorCode.CREATE_SUCCESS]: 'Thêm nhà cung cấp thành công',
    [SupplierErrorCode.UPDATE_SUCCESS]: 'Cập nhật nhà cung cấp thành công',
    [SupplierErrorCode.DELETE_SUCCESS]: 'Xóa nhà cung cấp thành công',

    // Error messages
    [SupplierErrorCode.CREATE_ERROR]: 'Lỗi khi thêm nhà cung cấp',
    [SupplierErrorCode.UPDATE_ERROR]: 'Lỗi khi cập nhật nhà cung cấp',
    [SupplierErrorCode.DELETE_ERROR]: 'Lỗi khi xóa nhà cung cấp',

    // Validation messages
    [SupplierErrorCode.NAME_REQUIRED]: 'Vui lòng nhập tên nhà cung cấp',
    [SupplierErrorCode.PHONE_REQUIRED]: 'Vui lòng nhập số điện thoại',
    [SupplierErrorCode.EMAIL_REQUIRED]: 'Vui lòng nhập email',
    [SupplierErrorCode.ADDRESS_REQUIRED]: 'Vui lòng nhập địa chỉ',

    // API error
    [SupplierErrorCode.FETCH_ERROR]: 'Lấy dữ liệu lỗi'
};