export interface IngredientDetail {
    ingredient_id: number;
    quantity: number;
    price: number;
}

export interface ImportIngredientsRequest {
    user_id: number;
    id_supplier: number | null;
    ingredients: IngredientDetail[];
}
