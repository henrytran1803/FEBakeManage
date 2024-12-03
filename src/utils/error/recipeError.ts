export enum RecipeErrorCode {
    // Recipe name validations
    RECIPE_NAME_REQUIRED = 'RECIPE_NAME_REQUIRED',
    RECIPE_NAME_LENGTH = 'RECIPE_NAME_LENGTH',

    // Ingredient validations
    RECIPE_INGREDIENTS_REQUIRED = 'RECIPE_INGREDIENTS_REQUIRED',
    RECIPE_INGREDIENT_QUANTITY_REQUIRED = 'RECIPE_INGREDIENT_QUANTITY_REQUIRED',
    RECIPE_INGREDIENT_QUANTITY_INVALID = 'RECIPE_INGREDIENT_QUANTITY_INVALID',
    RECIPE_INGREDIENT_QUANTITY_MIN = 'RECIPE_INGREDIENT_QUANTITY_MIN',
    RECIPE_INGREDIENT_QUANTITY_MAX = 'RECIPE_INGREDIENT_QUANTITY_MAX',

    // API response messages
    CONNECT_ERROR = 'CONNECT_ERROR',
    POST_SUCCESS = 'POST_SUCCESS',
    UPDATE_SUCCESS = 'UPDATE_SUCCESS'
}

export const recipeErrorMessages: { [key in RecipeErrorCode]: string } = {
    // Recipe name messages
    [RecipeErrorCode.RECIPE_NAME_REQUIRED]: 'Vui lòng nhập tên công thức',
    [RecipeErrorCode.RECIPE_NAME_LENGTH]: 'Tên công thức không được vượt quá 250 ký tự',

    // Ingredient messages
    [RecipeErrorCode.RECIPE_INGREDIENTS_REQUIRED]: 'Vui lòng chọn ít nhất một nguyên liệu',
    [RecipeErrorCode.RECIPE_INGREDIENT_QUANTITY_REQUIRED]: 'Vui lòng nhập số lượng cho tất cả nguyên liệu đã chọn',
    [RecipeErrorCode.RECIPE_INGREDIENT_QUANTITY_INVALID]: 'Số lượng nguyên liệu không hợp lệ',
    [RecipeErrorCode.RECIPE_INGREDIENT_QUANTITY_MIN]: 'Số lượng nguyên liệu phải lớn hơn 0',
    [RecipeErrorCode.RECIPE_INGREDIENT_QUANTITY_MAX]: 'Số lượng nguyên liệu không được vượt quá 1000',

    // API response messages
    [RecipeErrorCode.CONNECT_ERROR]: 'Có lỗi xảy ra khi thao tác với công thức',
    [RecipeErrorCode.POST_SUCCESS]: 'Tạo công thức thành công',
    [RecipeErrorCode.UPDATE_SUCCESS]: 'Cập nhật công thức thành công'
};