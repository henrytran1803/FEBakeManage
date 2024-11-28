export enum CategoryErrorCode {
    CATEGORY_NAME_REQUIRED = 'CATEGORY_NAME_REQUIRED',
    CATEGORY_NAME_LENGTH = 'CATEGORY_NAME_LENGTH',
    CATEGORY_IMAGE_REQUIRED = 'CATEGORY_IMAGE_REQUIRED',
    CATEGORY_IMAGE_SIZE = 'CATEGORY_IMAGE_SIZE',
    CATEGORY_IMAGE_TYPE = 'CATEGORY_IMAGE_TYPE',
    CONNECT_ERROR = 'CONNECT_ERROR',
    POST_SUCCESS = 'POST_SUCCESS',
    UPDATE_SUCCESS = 'UPDATE_SUCCESS'
}

export const categoryErrorMessages: { [key in CategoryErrorCode]: string } = {
    [CategoryErrorCode.CATEGORY_NAME_REQUIRED]: 'Vui lòng nhập tên danh mục',
    [CategoryErrorCode.CATEGORY_NAME_LENGTH]: 'Tên danh mục không được vượt quá 250 ký tự',
    [CategoryErrorCode.CATEGORY_IMAGE_REQUIRED]: 'Vui lòng chọn hình ảnh cho danh mục',
    [CategoryErrorCode.CATEGORY_IMAGE_SIZE]: 'Kích thước hình ảnh không được vượt quá 5MB',
    [CategoryErrorCode.CATEGORY_IMAGE_TYPE]: 'Vui lòng chọn file hình ảnh hợp lệ',
    [CategoryErrorCode.CONNECT_ERROR]: 'Có lỗi xảy ra khi thao tác với danh mục',
    [CategoryErrorCode.POST_SUCCESS]: 'Tạo danh mục thành công',
    [CategoryErrorCode.UPDATE_SUCCESS]: 'Cập nhật danh mục thành công'
};