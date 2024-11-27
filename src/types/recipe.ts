
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

export interface GetRecipe {
    id: number;
    name: string;
    detailDTOS: GetDetailRecipe[];
}
export interface GetDetailRecipe {
    ingredientId:number;
    ingredientName:string;
    quantity: number;
}


export interface CreateRecipe {
    name:string;
    recipeDetails: CreateRecipeDetail[]
}
export interface CreateRecipeDetail {
    ingredientId:number;
    quantity:number;
}

