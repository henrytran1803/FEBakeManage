// constants/userErrorConstants.ts

export enum UserErrorCode {
    // Validation Errors
    FIRST_NAME_REQUIRED = 'FIRST_NAME_REQUIRED',
    FIRST_NAME_INVALID = 'FIRST_NAME_INVALID',
    LAST_NAME_REQUIRED = 'LAST_NAME_REQUIRED',
    LAST_NAME_INVALID = 'LAST_NAME_INVALID',
    EMAIL_REQUIRED = 'EMAIL_REQUIRED',
    EMAIL_INVALID = 'EMAIL_INVALID',
    DATE_OF_BIRTH_REQUIRED = 'DATE_OF_BIRTH_REQUIRED',
    DATE_OF_BIRTH_INVALID = 'DATE_OF_BIRTH_INVALID',
    PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
    PASSWORD_INVALID = 'PASSWORD_INVALID',
    ROLE_REQUIRED = 'ROLE_REQUIRED',
    
    // Operation Errors
    CREATE_USER_ERROR = 'CREATE_USER_ERROR',
    UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
    
    // Success Messages
    USER_CREATED = 'USER_CREATED',
    USER_UPDATED = 'USER_UPDATED'
}

export const userErrorMessages: { [key in UserErrorCode]: string } = {
    // Validation Errors
    [UserErrorCode.FIRST_NAME_REQUIRED]: 'Vui lòng nhập họ',
    [UserErrorCode.FIRST_NAME_INVALID]: 'Họ không hợp lệ',
    [UserErrorCode.LAST_NAME_REQUIRED]: 'Vui lòng nhập tên',
    [UserErrorCode.LAST_NAME_INVALID]: 'Tên không hợp lệ',
    [UserErrorCode.EMAIL_REQUIRED]: 'Vui lòng nhập email',
    [UserErrorCode.EMAIL_INVALID]: 'Email không hợp lệ',
    [UserErrorCode.DATE_OF_BIRTH_REQUIRED]: 'Vui lòng nhập ngày sinh',
    [UserErrorCode.DATE_OF_BIRTH_INVALID]: 'Ngày sinh không hợp lệ',
    [UserErrorCode.PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu',
    [UserErrorCode.PASSWORD_INVALID]: 'Mật khẩu phải có ít nhất 6 ký tự',
    [UserErrorCode.ROLE_REQUIRED]: 'Vui lòng chọn vai trò',
    
    // Operation Errors
    [UserErrorCode.CREATE_USER_ERROR]: 'Đã có lỗi xảy ra khi tạo người dùng',
    [UserErrorCode.UPDATE_USER_ERROR]: 'Đã có lỗi xảy ra khi cập nhật người dùng',
    
    // Success Messages
    [UserErrorCode.USER_CREATED]: 'Tạo người dùng thành công',
    [UserErrorCode.USER_UPDATED]: 'Cập nhật người dùng thành công'
};