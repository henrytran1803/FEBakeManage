
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

export interface RecipeResponseDetail {
    recipeId: number;
    ingredientId: number;
    quantity: number;
    
}


export interface RecipeResponse {
    id: number;
    name: string;
    recipeDetails: RecipeResponseDetail[];

}

