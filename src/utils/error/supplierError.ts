export enum SupplierErrorCode {
    SUPPLIER_FETCH_FAIL = 'SUPPLIER_FETCH_FAIL',
    SUPPLIER_NAME_REQUIRED = 'SUPPLIER_NAME_REQUIRED',
    SUPPLIER_NAME_LENGTH = 'SUPPLIER_NAME_LENGTH',
    SUPPLIER_NUMBER_REQUIRED ='SUPPLIER_NUMBER_REQUIRED',
    SUPPLIER_NUMBER_LENGTH = 'SUPPLIER_NUMBER_LENGTH',
    SUPPLIER_ADD_SUCCESS = 'SUPPLIER_ADD_SUCCESS',
    SUPPLIER_UPDATE_SUCCESS = 'SUPPLIER_UPDATE_SUCCESS',
    SUPPLIER_ADD_FAIL = 'SUPPLIER_ADD_FAIL',
    SUPPLIER_UPDATE_FAIL = 'SUPPLIER_UPDATE_FAIL',

 }

export const supplierErrorMessages: { [key in SupplierErrorCode]: string } = {
    [SupplierErrorCode.SUPPLIER_NAME_REQUIRED]: "Tên nhà cung cấp không được để trống",
    [SupplierErrorCode.SUPPLIER_NAME_LENGTH]: "Tên nhà cung cấp không được quá 50 ký tự",
    [SupplierErrorCode.SUPPLIER_NUMBER_REQUIRED]: "Số điện thoại nhà cung cấp không được để trống",
    [SupplierErrorCode.SUPPLIER_NUMBER_LENGTH]: "Số điện thoại nhà cung cấp phải từ 8 đến 15 số",
    [SupplierErrorCode.SUPPLIER_ADD_SUCCESS]: "Thêm nhà cung cấp thành công",
    [SupplierErrorCode.SUPPLIER_UPDATE_SUCCESS]: "Sửa thông tin nhà cung cấp thành công",
    [SupplierErrorCode.SUPPLIER_ADD_FAIL]: "Thêm nhà cung cấp thất bại",
    [SupplierErrorCode.SUPPLIER_UPDATE_FAIL]: "Sửa thông tin nhà cung cấp thất bại",
    [SupplierErrorCode.SUPPLIER_FETCH_FAIL]: "Lấy danh sách nhà cung cấp thất bại"
}
