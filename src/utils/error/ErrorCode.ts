
export enum ErrorCode {
    //category
    CATEGORY_NAME_REQUIRED = 'CATEGORY_NAME_REQUIRED',
    CATEGORY_NAME_LENGTH = 'CATEGORY_NAME_LENGTH',
    CATEGORY_IMAGE_REQUIRED = 'CATEGORY_IMAGE_REQUIRED',
    CATEGORY_IMAGE_SIZE = 'CATEGORY_IMAGE_SIZE',
    CATEGORY_IMAGE_TYPE = 'CATEGORY_IMAGE_TYPE',
    CONNECT_ERROR = 'CONNECT_ERROR',
    POST_CATEGORY_SUCCESS = 'POST_CATEGORY_SUCCESS',
    UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS',
    //bill error
    CUSTOMER_NAME_REQUIRED = 'CUSTOMER_NAME_REQUIRED',
    PHONE_NUMBER_REQUIRED = 'PHONE_NUMBER_REQUIRED',
    PAYMENT_METHOD_REQUIRED = 'PAYMENT_METHOD_REQUIRED',
    TABLE_REQUIRED = 'TABLE_REQUIRED',
    DINING_OPTION_REQUIRED = 'DINING_OPTION_REQUIRED',
    PAYMENT_LINK_ERROR = 'PAYMENT_LINK_ERROR',
    CREATE_BILL_ERROR = 'CREATE_BILL_ERROR',
    PAYMENT_PROCESSING_ERROR = 'PAYMENT_PROCESSING_ERROR',
    CREATE_BILL_SUCCESS = 'CREATE_BILL_SUCCESS',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    // product error
    PRODUCT_NAME_INPUT_ERROR = 'PRODUCT_NAME_INPUT_ERROR',
    PRODUCT_DESC_INPUT_ERROR = 'PRODUCT_DESC_INPUT_ERROR',
    PRODUCT_PRICE_INPUT_ERROR = 'PRODUCT_PRICE_INPUT_ERROR',
    PRODUCT_PRICE_INPUT_ERROR2 = 'PRODUCT_PRICE_INPUT_ERROR2',
    PRODUCT_EXPIRY_INPUT_ERROR1 = 'PRODUCT_EXPIRY_INPUT_ERROR1',
    PRODUCT_EXPIRY_INPUT_ERROR2 = 'PRODUCT_EXPIRY_INPUT_ERROR2',
    PRODUCT_LENGTH_INPUT_ERROR1 = 'PRODUCT_LENGTH_INPUT_ERROR1',
    PRODUCT_LENGTH_INPUT_ERROR2 = 'PRODUCT_LENGTH_INPUT_ERROR2',
    PRODUCT_HEIGHT_INPUT_ERROR1 = 'PRODUCT_HEIGHT_INPUT_ERROR1',
    PRODUCT_HEIGHT_INPUT_ERROR2 = 'PRODUCT_HEIGHT_INPUT_ERROR2',
    PRODUCT_WIDTH_INPUT_ERROR1 = 'PRODUCT_WIDTH_INPUT_ERROR1',
    PRODUCT_WIDTH_INPUT_ERROR2 = 'PRODUCT_WIDTH_INPUT_ERROR2',
    PRODUCT_WEIGHT_INPUT_ERROR1 = 'PRODUCT_WEIGHT_INPUT_ERROR1',
    PRODUCT_WEIGHT_INPUT_ERROR2 = 'PRODUCT_WEIGHT_INPUT_ERROR2',
    CATEGORY_REQUIRED_ERROR = 'CATEGORY_REQUIRED_ERROR',
    RECIPE_REQUIRED_ERROR = 'RECIPE_REQUIRED_ERROR',
    PRODUCT_NAME_LENGTH_ERROR = 'PRODUCT_NAME_LENGTH_ERROR',
    PRODUCT_DESC_LENGTH_ERROR = 'PRODUCT_DESC_LENGTH_ERROR',
    PRODUCT_EXPIRY_WARNING_ERROR= 'PRODUCT_EXPIRY_WARNING_ERROR',
    PRODUCT_EXPIRY_WARNING_ERROR1 = 'PRODUCT_EXPIRY_WARNING_ERROR1',
    PRODUCT_EXPIRY_WARNING_ERROR2 = 'PRODUCT_EXPIRY_WARNING_ERROR2',
    PRODUCT_DISCOUNT_LIMIT_ERROR = 'PRODUCT_DISCOUNT_LIMIT_ERROR',
    PRODUCT_IMAGE_REQUIRED_ERROR = 'PRODUCT_IMAGE_REQUIRED_ERROR',
    POST_PRODUCT_SUCCESS = 'POST_PRODUCT_SUCCESS',
    CHANGE_STATUS_PRODUCT_SUCCESS = 'CHANGE_STATUS_PRODUCT_SUCCESS',
    // ingredient error
    INGREDIENT_FETCH_FAIL = 'INGREDIENT_FETCH_FAIL',
    UNIT_FETCH_FAIL = 'UNIT_FETCH_FAIL',
    IMPORT_INGREDIENT_FETCH_FAIL = 'IMPORT_INGREDIENT_FETCH_FAIL',
    EXPORT_INGREDIENT_FETCH_FAIL = 'EXPORT_INGREDIENT_FETCH_FAIL',
    INGREDIENT_NAME_REQUIRED = 'INGREDIENT_NAME_REQUIRED',
    INGREDIENT_NAME_LENGTH = 'INGREDIENT_NAME_LENGTH',
    INGREDIENT_UNIT_REQUIRED = 'INGREDIENT_UNIT_REQUIRED',
    INGREDIENT_WARNING_LIMIT = 'INGREDIENT_WARNING_LIMIT',
    INGREDIENT_ADD_SUCCESS = 'INGREDIENT_ADD_SUCCESS',
    INGREDIENT_DELETE_SUCCESS = 'INGREDIENT_DELETE_SUCCESS',
    INGREDIENT_UPDATE_SUCCESS = 'INGREDIENT_UPDATE_SUCCESS',
    INGREDIENT_ADD_FAIL = 'INGREDIENT_ADD_FAIL',
    INGREDIENT_DELETE_FAIL = 'INGREDIENT_DELETE_FAIL',
    INGREDIENT_UPDATE_FAIL = 'INGREDIENT_UPDATE_FAIL',
    UNIT_NAME_REQUIRED = 'UNIT_NAME_REQUIRED',
    UNIT_NAME_LENGTH = 'UNIT_NAME_LENGTH',
    UNIT_ADD_SUCCESS = 'UNIT_ADD_SUCCESS',
    UNIT_ADD_FAIL = 'UNIT_ADD_FAIL',
    IMPORT_INGREDIENT_QUANTITY = 'IMPORT_INGREDIENT_QUANTITY',
    IMPORT_INGREDIENT_PRICE = 'IMPORT_INGREDIENT_PRICE',
    IMPORT_INGREDIENT_EMPTY = 'IMPORT_INGREDIENT_EMPTY',
    IMPORT_INGREDIENT_PRICE_EMPTY = 'IMPORT_INGREDIENT_PRICE_EMPTY',
    IMPORT_INGREDIENT_SUCCESS = 'IMPORT_INGREDIENT_SUCCESS',
    IMPORT_INGREDIENT_FAIL = 'IMPORT_INGREDIENT_FAIL',
    EXPORT_INGREDIENT_PRODUCT_EMPTY = 'EXPORT_INGREDIENT_PRODUCT_EMPTY',
    EXPORT_INGREDIENT_PRODUCT_QUANTITY = 'EXPORT_INGREDIENT_PRODUCT_QUANTITY',
    EXPORT_INGREDIENT_PRODUCT_QUANTITY_EMPTY = 'EXPORT_INGREDIENT_PRODUCT_QUANTITY_EMPTY',
    EXPORT_INGREDIENT_SUCCESS = 'EXPORT_INGREDIENT_SUCCESS',
    EXPORT_INGREDIENT_FAIL = 'EXPORT_INGREDIENT_FAIL',
    USER_FETCH_FAIL = 'USER_FETCH_FAIL',
    PRODUCT_FETCH_ERROR = 'PRODUCT_FETCH_ERROR',
    //user
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
    CREATE_USER_ERROR = 'CREATE_USER_ERROR',
    UPDATE_USER_ERROR = 'UPDATE_USER_ERROR',
    USER_CREATED = 'USER_CREATED',
    USER_UPDATED = 'USER_UPDATED',
    USER_DEACTIVATE_ERROR = 'USER_DEACTIVATE_ERROR',
    USER_ACTIVATE_ERROR = 'ACTIVATE_ERROR',
    USER_FETCH_ERROR = 'FETCH_ERROR',
    // promotion
    PROMOTION_CONNECT_ERROR = 'PROMOTION_CONNECT_ERROR',
    PROMOTION_POST_SUCCESS = 'PROMOTION_POST_SUCCESS',
    PROMOTION_NAME_REQUIRED = 'PROMOTION_NAME_REQUIRED',
    PROMOTION_NAME_NO_SPECIAL_CHARS = 'PROMOTION_NAME_NO_SPECIAL_CHARS',
    PROMOTION_NAME_LENGTH = 'PROMOTION_NAME_LENGTH',
    PROMOTION_DESC_REQUIRED = 'PROMOTION_DESC_REQUIRED',
    PROMOTION_DESC_LENGTH = 'PROMOTION_DESC_LENGTH',
    PROMOTION_START_DATE_REQUIRED = 'PROMOTION_START_DATE_REQUIRED',
    PROMOTION_END_DATE_REQUIRED = 'PROMOTION_END_DATE_REQUIRED',
    PROMOTION_START_DATE_INVALID = 'PROMOTION_START_DATE_INVALID',
    PROMOTION_END_DATE_INVALID = 'PROMOTION_END_DATE_INVALID',
    PROMOTION_DATE_RANGE_INVALID = 'PROMOTION_DATE_RANGE_INVALID',
    PROMOTION_DISCOUNT_REQUIRED = 'PROMOTION_DISCOUNT_REQUIRED',
    PROMOTION_DISCOUNT_RANGE = 'PROMOTION_DISCOUNT_RANGE',
    PROMOTION_PRODUCTS_REQUIRED = 'PROMOTION_PRODUCTS_REQUIRED',
    PROMOTION_DAILY_END_DATE_REQUIRED = 'PROMOTION_DAILY_END_DATE_REQUIRED',
    PROMOTION_DAILY_END_DATE_INVALID = 'PROMOTION_DAILY_END_DATE_INVALID',
    PROMOTION_DAILY_DISCOUNT_RANGE = 'PROMOTION_DAILY_DISCOUNT_RANGE',
    // recipe
    RECIPE_NAME_REQUIRED = 'RECIPE_NAME_REQUIRED',
    RECIPE_NAME_LENGTH = 'RECIPE_NAME_LENGTH',
    RECIPE_INGREDIENTS_REQUIRED = 'RECIPE_INGREDIENTS_REQUIRED',
    RECIPE_INGREDIENT_QUANTITY_REQUIRED = 'RECIPE_INGREDIENT_QUANTITY_REQUIRED',
    RECIPE_INGREDIENT_QUANTITY_INVALID = 'RECIPE_INGREDIENT_QUANTITY_INVALID',
    RECIPE_INGREDIENT_QUANTITY_MIN = 'RECIPE_INGREDIENT_QUANTITY_MIN',
    RECIPE_INGREDIENT_QUANTITY_MAX = 'RECIPE_INGREDIENT_QUANTITY_MAX',
    RECIPE_CONNECT_ERROR = 'RECIPE_CONNECT_ERROR',
    RECIPE_POST_SUCCESS = 'RECIPE_POST_SUCCESS',
    RECIPE_UPDATE_SUCCESS = 'RECIPE_UPDATE_SUCCESS',
    // supplier
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

export const errorCodeMessage: { [key in ErrorCode]: string } = {
    //category
    [ErrorCode.CATEGORY_NAME_REQUIRED]: 'Vui lòng nhập tên danh mục',
    [ErrorCode.CATEGORY_NAME_LENGTH]: 'Tên danh mục không được vượt quá 250 ký tự',
    [ErrorCode.CATEGORY_IMAGE_REQUIRED]: 'Vui lòng chọn hình ảnh cho danh mục',
    [ErrorCode.CATEGORY_IMAGE_SIZE]: 'Kích thước hình ảnh không được vượt quá 5MB',
    [ErrorCode.CATEGORY_IMAGE_TYPE]: 'Vui lòng chọn file hình ảnh hợp lệ',
    [ErrorCode.CONNECT_ERROR	]: 'Có lỗi xảy ra khi lưu ',
    [ErrorCode.POST_CATEGORY_SUCCESS]: 'Tạo danh mục thành công',
    [ErrorCode.UPDATE_CATEGORY_SUCCESS]: 'Cập nhật danh mục thành công',
    //bill error
    [ErrorCode.CUSTOMER_NAME_REQUIRED]: 'Vui lòng nhập tên khách hàng',
    [ErrorCode.PHONE_NUMBER_REQUIRED]: 'Vui lòng nhập số điện thoại',
    [ErrorCode.PAYMENT_METHOD_REQUIRED]: 'Vui lòng chọn phương thức thanh toán',
    [ErrorCode.TABLE_REQUIRED]: 'Vui lòng chọn bàn',
    [ErrorCode.DINING_OPTION_REQUIRED]: 'Vui lòng chọn hình thức dùng bữa',
    [ErrorCode.PAYMENT_LINK_ERROR]: 'Không thể tạo link thanh toán',
    [ErrorCode.CREATE_BILL_ERROR]: 'Có lỗi xảy ra khi tạo đơn hàng',
    [ErrorCode.PAYMENT_PROCESSING_ERROR]: 'Lỗi xử lý thanh toán',
    [ErrorCode.CREATE_BILL_SUCCESS]: 'Đặt hàng thành công!',
    [ErrorCode.PAYMENT_SUCCESS]: 'Thanh toán thành công',
    //product error
    [ErrorCode.PRODUCT_NAME_INPUT_ERROR]: 'Vui lòng nhập tên sản phẩm',
    [ErrorCode.PRODUCT_DESC_INPUT_ERROR]: 'Vui lòng nhập mô tả sản phẩm',
    [ErrorCode.PRODUCT_PRICE_INPUT_ERROR]: 'Vui lòng nhập giá sản phẩm',
    [ErrorCode.PRODUCT_PRICE_INPUT_ERROR2]: 'Giá sản phẩm không được nhỏ hơn 1,000đ',
    [ErrorCode.PRODUCT_EXPIRY_INPUT_ERROR1]: 'Vui lòng nhập thời hạn sử dụng',
    [ErrorCode.PRODUCT_EXPIRY_INPUT_ERROR2]: 'Định dạng thời hạn sử dụng không hợp lệ',
    [ErrorCode.PRODUCT_LENGTH_INPUT_ERROR1]: 'Vui lòng nhập chiều dài sản phẩm',
    [ErrorCode.PRODUCT_LENGTH_INPUT_ERROR2]: 'Chiều dài sản phẩm phải từ 1cm đến 200cm',
    [ErrorCode.PRODUCT_HEIGHT_INPUT_ERROR1]: 'Vui lòng nhập chiều cao sản phẩm',
    [ErrorCode.PRODUCT_HEIGHT_INPUT_ERROR2]: 'Chiều cao sản phẩm phải từ 1cm đến 200cm',
    [ErrorCode.PRODUCT_WIDTH_INPUT_ERROR1]: 'Vui lòng nhập chiều rộng sản phẩm',
    [ErrorCode.PRODUCT_WIDTH_INPUT_ERROR2]: 'Chiều rộng sản phẩm phải từ 1cm đến 200cm',
    [ErrorCode.PRODUCT_WEIGHT_INPUT_ERROR1]: 'Vui lòng nhập khối lượng sản phẩm',
    [ErrorCode.PRODUCT_WEIGHT_INPUT_ERROR2]: 'Khối lượng sản phẩm phải từ 1g đến 20,000g',
    [ErrorCode.CATEGORY_REQUIRED_ERROR]: 'Vui lòng chọn danh mục',
    [ErrorCode.RECIPE_REQUIRED_ERROR]: 'Vui lòng chọn công thức',
    [ErrorCode.PRODUCT_NAME_LENGTH_ERROR]: 'Tên sản phẩm không được vượt quá 250 ký tự',
    [ErrorCode.PRODUCT_DESC_LENGTH_ERROR]: 'Mô tả không được vượt quá 500 ký tự',
    [ErrorCode.PRODUCT_EXPIRY_WARNING_ERROR]: 'Cảnh báo hạn sử dụng không được bỏ trống',
    [ErrorCode.PRODUCT_EXPIRY_WARNING_ERROR1]: 'Cảnh báo hạn sử dụng không được âm',
    [ErrorCode.PRODUCT_EXPIRY_WARNING_ERROR2]: 'Cảnh báo hạn sử dụng không được lớn hơn hạn sử dụng',
    [ErrorCode.PRODUCT_DISCOUNT_LIMIT_ERROR]: 'Giới hạn giảm giá phải từ 0 đến 100',
    [ErrorCode.PRODUCT_IMAGE_REQUIRED_ERROR]: 'Vui lòng chọn ít nhất một ảnh',
    [ErrorCode.POST_PRODUCT_SUCCESS]:'Thêm sản phẩm thành công',
    [ErrorCode.CHANGE_STATUS_PRODUCT_SUCCESS]:'Đã đổi trạng thaí thành công',
    //Ingredient error
    [ErrorCode.INGREDIENT_NAME_REQUIRED]: "Vui lòng nhập tên danh mục",
    [ErrorCode.INGREDIENT_NAME_LENGTH]: "Tên nguyên liệu không được quá 100 ký tự",
    [ErrorCode.INGREDIENT_UNIT_REQUIRED]: "Vui lòng chọn đơn vị cho nguyên liệu",
    [ErrorCode.INGREDIENT_WARNING_LIMIT]: "Giới hạn cảnh báo không được nhỏ hơn 0",
    [ErrorCode.INGREDIENT_ADD_SUCCESS]: "Thêm nguyên liệu thành công",
    [ErrorCode.INGREDIENT_DELETE_SUCCESS]: "Xóa nguyên liệu thành công",
    [ErrorCode.INGREDIENT_UPDATE_SUCCESS]: "Sửa nguyên liệu thành công",
    [ErrorCode.INGREDIENT_ADD_FAIL]: "Thêm nguyên liệu mới thất bại",
    [ErrorCode.INGREDIENT_DELETE_FAIL]: "Xóa nguyên liệu thất bại",
    [ErrorCode.INGREDIENT_UPDATE_FAIL]: "Sửa nguyên liệu thất bại",
    [ErrorCode.UNIT_NAME_REQUIRED]: "Tên đơn vị không được để trống",
    [ErrorCode.UNIT_NAME_LENGTH]: "Tên đơn vị không được dài quá 50 ký tự",
    [ErrorCode.UNIT_ADD_SUCCESS]: "Thêm đơn vị mới thành công",
    [ErrorCode.UNIT_ADD_FAIL]: "Thêm đơn vị mới thất bại",
    [ErrorCode.IMPORT_INGREDIENT_QUANTITY]: "Số lượng nguyên liệu nhập không được nhỏ hơn 1",
    [ErrorCode.IMPORT_INGREDIENT_PRICE]: "Giá của nguyên liệu nhập không được nhỏ hơn 0",
    [ErrorCode.IMPORT_INGREDIENT_EMPTY]: "Phải có ít nhất một nguyên liệu nhập",
    [ErrorCode.IMPORT_INGREDIENT_PRICE_EMPTY]: "Giá nguyên liệu nhập không được bỏ trống",
    [ErrorCode.IMPORT_INGREDIENT_SUCCESS]: "Nhập nguyên liệu thành công",
    [ErrorCode.IMPORT_INGREDIENT_FAIL]: "Nhập nguyên liệu thất bại",
    [ErrorCode.EXPORT_INGREDIENT_PRODUCT_EMPTY]: "Chưa chọn bánh cần làm để xuất nguyên liệu",
    [ErrorCode.EXPORT_INGREDIENT_PRODUCT_QUANTITY]: "Số lượng bánh phải lớn hơn 0",
    [ErrorCode.EXPORT_INGREDIENT_PRODUCT_QUANTITY_EMPTY]: "Vui lòng nhập số lượng bánh cần làm",
    [ErrorCode.EXPORT_INGREDIENT_SUCCESS]: "Xuất nguyên liệu thành công",
    [ErrorCode.EXPORT_INGREDIENT_FAIL]: "Xuất nguyên liệu thất bại",
    [ErrorCode.INGREDIENT_FETCH_FAIL]: "Lấy danh sách nguyên liệu thất bại",
    [ErrorCode.UNIT_FETCH_FAIL]: "Lấy danh sách đơn vị thất bại",
    [ErrorCode.IMPORT_INGREDIENT_FETCH_FAIL]: "Lấy danh sách lịch sử nhập nguyên liệu thất bại",
    [ErrorCode.EXPORT_INGREDIENT_FETCH_FAIL]: "Lấy danh sách lịch sử xuất nguyên liệu thất bại",
    [ErrorCode.USER_FETCH_FAIL]: "Lấy danh sách người dùng thất bại",
    [ErrorCode.PRODUCT_FETCH_ERROR]: "Lấy danh sách sản phẩm thất bại",
    //user
    [ErrorCode.FIRST_NAME_REQUIRED]: 'Vui lòng nhập họ',
    [ErrorCode.FIRST_NAME_INVALID]: 'Họ không hợp lệ',
    [ErrorCode.LAST_NAME_REQUIRED]: 'Vui lòng nhập tên',
    [ErrorCode.LAST_NAME_INVALID]: 'Tên không hợp lệ',
    [ErrorCode.EMAIL_REQUIRED]: 'Vui lòng nhập email',
    [ErrorCode.EMAIL_INVALID]: 'Email không hợp lệ',
    [ErrorCode.DATE_OF_BIRTH_REQUIRED]: 'Vui lòng nhập ngày sinh',
    [ErrorCode.DATE_OF_BIRTH_INVALID]: 'Ngày sinh không hợp lệ',
    [ErrorCode.PASSWORD_REQUIRED]: 'Vui lòng nhập mật khẩu',
    [ErrorCode.PASSWORD_INVALID]: 'Mật khẩu phải có ít nhất 6 ký tự',
    [ErrorCode.ROLE_REQUIRED]: 'Vui lòng chọn vai trò',
    [ErrorCode.CREATE_USER_ERROR]: 'Đã có lỗi xảy ra khi tạo người dùng',
    [ErrorCode.UPDATE_USER_ERROR]: 'Đã có lỗi xảy ra khi cập nhật người dùng',
    [ErrorCode.USER_CREATED]: 'Tạo người dùng thành công',
    [ErrorCode.USER_UPDATED]: 'Cập nhật người dùng thành công',
    [ErrorCode.USER_DEACTIVATE_ERROR]: 'Lỗi khi vô hiệu hóa người dùng',
    [ErrorCode.USER_ACTIVATE_ERROR]: 'Lỗi khi kích hoạt người dùng',
    [ErrorCode.USER_FETCH_ERROR]: 'Lỗi khi tải danh sách người dùng',
    //promotion
    [ErrorCode.PROMOTION_CONNECT_ERROR]: 'Có lỗi xảy ra khi lưu khuyến mãi',
    [ErrorCode.PROMOTION_POST_SUCCESS]: 'Lưu khuyến mãi thành công',
    [ErrorCode.PROMOTION_NAME_REQUIRED]: 'Vui lòng nhập tên khuyến mãi',
    [ErrorCode.PROMOTION_NAME_NO_SPECIAL_CHARS]: 'Tên khuyến mãi không được chứa ký tự đặc biệt',
    [ErrorCode.PROMOTION_NAME_LENGTH]: 'Tên khuyến mãi không được vượt quá 250 ký tự',
    [ErrorCode.PROMOTION_DESC_REQUIRED]: 'Vui lòng nhập mô tả khuyến mãi',
    [ErrorCode.PROMOTION_DESC_LENGTH]: 'Mô tả không được vượt quá 250 ký tự',
    [ErrorCode.PROMOTION_START_DATE_REQUIRED]: 'Vui lòng chọn ngày bắt đầu',
    [ErrorCode.PROMOTION_END_DATE_REQUIRED]: 'Vui lòng chọn ngày kết thúc',
    [ErrorCode.PROMOTION_START_DATE_INVALID]: 'Ngày bắt đầu phải lớn hơn ngày hiện tại',
    [ErrorCode.PROMOTION_END_DATE_INVALID]: 'Ngày kết thúc phải lớn hơn ngày hiện tại',
    [ErrorCode.PROMOTION_DATE_RANGE_INVALID]: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    [ErrorCode.PROMOTION_DISCOUNT_REQUIRED]: 'Vui lòng nhập phần trăm giảm giá',
    [ErrorCode.PROMOTION_DISCOUNT_RANGE]: 'Phần trăm giảm giá phải từ 0 đến 100',
    [ErrorCode.PROMOTION_PRODUCTS_REQUIRED]: 'Vui lòng chọn ít nhất một sản phẩm',
    [ErrorCode.PROMOTION_DAILY_END_DATE_REQUIRED]: 'Vui lòng chọn ngày kết thúc cho khuyến mãi theo ngày',
    [ErrorCode.PROMOTION_DAILY_END_DATE_INVALID]: 'Ngày kết thúc khuyến mãi theo ngày phải lớn hơn ngày hiện tại',
    [ErrorCode.PROMOTION_DAILY_DISCOUNT_RANGE]: 'Phần trăm giảm giá theo ngày phải từ 0 đến 100',
    [ErrorCode.RECIPE_NAME_REQUIRED]: 'Vui lòng nhập tên công thức',
    [ErrorCode.RECIPE_NAME_LENGTH]: 'Tên công thức không được vượt quá 250 ký tự',
    [ErrorCode.RECIPE_INGREDIENTS_REQUIRED]: 'Vui lòng chọn ít nhất một nguyên liệu',
    [ErrorCode.RECIPE_INGREDIENT_QUANTITY_REQUIRED]: 'Vui lòng nhập số lượng cho tất cả nguyên liệu đã chọn',
    [ErrorCode.RECIPE_INGREDIENT_QUANTITY_INVALID]: 'Số lượng nguyên liệu không hợp lệ',
    [ErrorCode.RECIPE_INGREDIENT_QUANTITY_MIN]: 'Số lượng nguyên liệu phải lớn hơn 0',
    [ErrorCode.RECIPE_INGREDIENT_QUANTITY_MAX]: 'Số lượng nguyên liệu không được vượt quá 1000',
    [ErrorCode.RECIPE_CONNECT_ERROR]: 'Có lỗi xảy ra khi thao tác với công thức',
    [ErrorCode.RECIPE_POST_SUCCESS]: 'Tạo công thức thành công',
    [ErrorCode.RECIPE_UPDATE_SUCCESS]: 'Cập nhật công thức thành công',
    //supplier
    [ErrorCode.SUPPLIER_NAME_REQUIRED]: "Tên nhà cung cấp không được để trống",
    [ErrorCode.SUPPLIER_NAME_LENGTH]: "Tên nhà cung cấp không được quá 50 ký tự",
    [ErrorCode.SUPPLIER_NUMBER_REQUIRED]: "Số điện thoại nhà cung cấp không được để trống",
    [ErrorCode.SUPPLIER_NUMBER_LENGTH]: "Số điện thoại nhà cung cấp phải từ 8 đến 15 số",
    [ErrorCode.SUPPLIER_ADD_SUCCESS]: "Thêm nhà cung cấp thành công",
    [ErrorCode.SUPPLIER_UPDATE_SUCCESS]: "Sửa thông tin nhà cung cấp thành công",
    [ErrorCode.SUPPLIER_ADD_FAIL]: "Thêm nhà cung cấp thất bại",
    [ErrorCode.SUPPLIER_UPDATE_FAIL]: "Sửa thông tin nhà cung cấp thất bại",
    [ErrorCode.SUPPLIER_FETCH_FAIL]: "Lấy danh sách nhà cung cấp thất bại",

};


export const validatePromotionName = (name: string): boolean => {
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    return !specialCharsRegex.test(name);
};

// Helper function to validate dates
export const validatePromotionDates = (startDate: string, endDate: string): ErrorCode | null => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < currentDate) {
        return ErrorCode.PROMOTION_START_DATE_INVALID;
    }

    if (end < currentDate) {
        return ErrorCode.PROMOTION_END_DATE_INVALID;
    }

    if (end <= start) {
        return ErrorCode.PROMOTION_DATE_RANGE_INVALID;
    }

    return null;
};