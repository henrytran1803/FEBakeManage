
export interface RecipeId {
    recipeId: number;
    ingredientId: number;
}

export interface RecipeDetail {
    id: RecipeId;
    quantity: number;
}

export interface Recipe {
    id: number;
    name: string;
    recipeDetails: RecipeDetail[];
}

