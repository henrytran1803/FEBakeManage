// export enum UserErrorCode {
//     // Success codes
//     CREATE_SUCCESS = 'CREATE_SUCCESS',
//     UPDATE_SUCCESS = 'UPDATE_SUCCESS',
//     DELETE_SUCCESS = 'DELETE_SUCCESS',
//     DEACTIVATE_SUCCESS = 'DEACTIVATE_SUCCESS',
//     ACTIVATE_SUCCESS = 'ACTIVATE_SUCCESS',
//
//     // Error codes
//     CREATE_ERROR = 'CREATE_ERROR',
//     UPDATE_ERROR = 'UPDATE_ERROR',
//     DELETE_ERROR = 'DELETE_ERROR',
//     DEACTIVATE_ERROR = 'DEACTIVATE_ERROR',
//     ACTIVATE_ERROR = 'ACTIVATE_ERROR',
//     FETCH_ERROR = 'FETCH_ERROR',
//
//     // Validation codes
//     FIRST_NAME_REQUIRED = 'FIRST_NAME_REQUIRED',
//     LAST_NAME_REQUIRED = 'LAST_NAME_REQUIRED',
//     EMAIL_REQUIRED = 'EMAIL_REQUIRED',
//     EMAIL_INVALID = 'EMAIL_INVALID',
//     PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
//     PASSWORD_INVALID = 'PASSWORD_INVALID',
//     DATE_OF_BIRTH_REQUIRED = 'DATE_OF_BIRTH_REQUIRED',
//     ROLE_REQUIRED = 'ROLE_REQUIRED',
//
//     // Additional error codes
//     EMAIL_EXISTS = 'EMAIL_EXISTS',
//     USER_NOT_FOUND = 'USER_NOT_FOUND',
//     UNAUTHORIZED = 'UNAUTHORIZED',
//     INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
// }
//
// export const userErrorMessages: { [key in UserErrorCode]: string } = {
//     // Success messages
//     [UserErrorCode.CREATE_SUCCESS]: 'Tạo người dùng thành công',
//     [UserErrorCode.UPDATE_SUCCESS]: 'Cập nhật người dùng thành công',
//     [UserErrorCode.DELETE_SUCCESS]: 'Xóa người dùng thành công',
//     [UserErrorCode.DEACTIVATE_SUCCESS]: 'Vô hiệu hóa người dùng thành công',
//     [UserErrorCode.ACTIVATE_SUCCESS]: 'Kích hoạt người dùng thành công',
//
//     // Error messages
//     [UserErrorCode.CREATE_ERROR]: 'Lỗi khi tạo người dùng',
//     [UserErrorCode.UPDATE_ERROR]: 'Lỗi khi cập nhật người dùng',
//     [UserErrorCode.DELETE_ERROR]: 'Lỗi khi xóa người dùng',
//     [UserErrorCode.DEACTIVATE_ERROR]: 'Lỗi khi vô hiệu hóa người dùng',
//     [UserErrorCode.ACTIVATE_ERROR]: 'Lỗi khi kích hoạt người dùng',
//     [UserErrorCode.FETCH_ERROR]: 'Lỗi khi tải danh sách người dùng',
//
//     // Validation messages
//     [UserErrorCode.FIRST_NAME_REQUIRED]: 'Vui lòng nhập họ',
//     [UserErrorCode.LAST_NAME_REQUIRED]: 'Vui lòng nhập tên',
//     [UserErrorCode.EMAIL_REQUIRED]: 'Vui lòng nhập email',
//     [UserErrorCode.EMAIL_INVALID]: 'Email không hợp lệ',
//     [UserErrorCode.PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu',
//     [UserErrorCode.PASSWORD_INVALID]: 'Mật khẩu phải có ít nhất 8 ký tự',
//     [UserErrorCode.DATE_OF_BIRTH_REQUIRED]: 'Vui lòng chọn ngày sinh',
//     [UserErrorCode.ROLE_REQUIRED]: 'Vui lòng chọn ít nhất một vai trò',
//
//     // Additional error messages
//     [UserErrorCode.EMAIL_EXISTS]: 'Email đã tồn tại trong hệ thống',
//     [UserErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng',
//     [UserErrorCode.UNAUTHORIZED]: 'Bạn không có quyền thực hiện thao tác này',
//     [UserErrorCode.INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không chính xác'
// };