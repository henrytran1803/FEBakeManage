export interface ProductDetail {
    product_id: number;
    quantity: number;
}

export interface IngredientDetail {
    ingredient_id: number;
    quantity: number;
}

export interface ExportIngredientsRequest {
    sender_id: number;
    total_amount: number;
    ingredients: IngredientDetail[];  
    products: ProductDetail[];
}
