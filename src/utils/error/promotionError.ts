export enum PromotionErrorCode {
    CONNECT_ERROR = 'CONNECT_ERROR',
    POST_SUCCESS = 'POST_SUCCESS',

    // Name validation
    PROMOTION_NAME_REQUIRED = 'PROMOTION_NAME_REQUIRED',
    PROMOTION_NAME_NO_SPECIAL_CHARS = 'PROMOTION_NAME_NO_SPECIAL_CHARS',
    PROMOTION_NAME_LENGTH = 'PROMOTION_NAME_LENGTH',

    // Description validation
    PROMOTION_DESC_REQUIRED = 'PROMOTION_DESC_REQUIRED',
    PROMOTION_DESC_LENGTH = 'PROMOTION_DESC_LENGTH',

    // Date validation
    PROMOTION_START_DATE_REQUIRED = 'PROMOTION_START_DATE_REQUIRED',
    PROMOTION_END_DATE_REQUIRED = 'PROMOTION_END_DATE_REQUIRED',
    PROMOTION_START_DATE_INVALID = 'PROMOTION_START_DATE_INVALID',
    PROMOTION_END_DATE_INVALID = 'PROMOTION_END_DATE_INVALID',
    PROMOTION_DATE_RANGE_INVALID = 'PROMOTION_DATE_RANGE_INVALID',

    // Discount validation
    PROMOTION_DISCOUNT_REQUIRED = 'PROMOTION_DISCOUNT_REQUIRED',
    PROMOTION_DISCOUNT_RANGE = 'PROMOTION_DISCOUNT_RANGE',

    // Product selection validation
    PROMOTION_PRODUCTS_REQUIRED = 'PROMOTION_PRODUCTS_REQUIRED',

    // Daily promotion specific errors
    PROMOTION_DAILY_END_DATE_REQUIRED = 'PROMOTION_DAILY_END_DATE_REQUIRED',
    PROMOTION_DAILY_END_DATE_INVALID = 'PROMOTION_DAILY_END_DATE_INVALID',
    PROMOTION_DAILY_DISCOUNT_RANGE = 'PROMOTION_DAILY_DISCOUNT_RANGE'
}

export const promotionErrorMessages: { [key in PromotionErrorCode]: string } = {
    // Common errors
    [PromotionErrorCode.CONNECT_ERROR]: 'Có lỗi xảy ra khi lưu khuyến mãi',
    [PromotionErrorCode.POST_SUCCESS]: 'Lưu khuyến mãi thành công',

    // Name validation
    [PromotionErrorCode.PROMOTION_NAME_REQUIRED]: 'Vui lòng nhập tên khuyến mãi',
    [PromotionErrorCode.PROMOTION_NAME_NO_SPECIAL_CHARS]: 'Tên khuyến mãi không được chứa ký tự đặc biệt',
    [PromotionErrorCode.PROMOTION_NAME_LENGTH]: 'Tên khuyến mãi không được vượt quá 250 ký tự',

    // Description validation
    [PromotionErrorCode.PROMOTION_DESC_REQUIRED]: 'Vui lòng nhập mô tả khuyến mãi',
    [PromotionErrorCode.PROMOTION_DESC_LENGTH]: 'Mô tả không được vượt quá 250 ký tự',

    // Date validation
    [PromotionErrorCode.PROMOTION_START_DATE_REQUIRED]: 'Vui lòng chọn ngày bắt đầu',
    [PromotionErrorCode.PROMOTION_END_DATE_REQUIRED]: 'Vui lòng chọn ngày kết thúc',
    [PromotionErrorCode.PROMOTION_START_DATE_INVALID]: 'Ngày bắt đầu phải lớn hơn ngày hiện tại',
    [PromotionErrorCode.PROMOTION_END_DATE_INVALID]: 'Ngày kết thúc phải lớn hơn ngày hiện tại',
    [PromotionErrorCode.PROMOTION_DATE_RANGE_INVALID]: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',

    // Discount validation
    [PromotionErrorCode.PROMOTION_DISCOUNT_REQUIRED]: 'Vui lòng nhập phần trăm giảm giá',
    [PromotionErrorCode.PROMOTION_DISCOUNT_RANGE]: 'Phần trăm giảm giá phải từ 0 đến 100',

    // Product selection validation
    [PromotionErrorCode.PROMOTION_PRODUCTS_REQUIRED]: 'Vui lòng chọn ít nhất một sản phẩm',

    // Daily promotion specific errors
    [PromotionErrorCode.PROMOTION_DAILY_END_DATE_REQUIRED]: 'Vui lòng chọn ngày kết thúc cho khuyến mãi theo ngày',
    [PromotionErrorCode.PROMOTION_DAILY_END_DATE_INVALID]: 'Ngày kết thúc khuyến mãi theo ngày phải lớn hơn ngày hiện tại',
    [PromotionErrorCode.PROMOTION_DAILY_DISCOUNT_RANGE]: 'Phần trăm giảm giá theo ngày phải từ 0 đến 100'
};

export const validatePromotionName = (name: string): boolean => {
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    return !specialCharsRegex.test(name);
};

// Helper function to validate dates
export const validatePromotionDates = (startDate: string, endDate: string): PromotionErrorCode | null => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < currentDate) {
        return PromotionErrorCode.PROMOTION_START_DATE_INVALID;
    }

    if (end < currentDate) {
        return PromotionErrorCode.PROMOTION_END_DATE_INVALID;
    }

    if (end <= start) {
        return PromotionErrorCode.PROMOTION_DATE_RANGE_INVALID;
    }

    return null;
};