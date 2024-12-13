import { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { recipeService } from "@/services/recipeService"
import { CreateRecipe, CreateRecipeDetail } from "@/types/recipe"
import {Ingredient} from "@/types/Ingredient.ts";
import {useCustomToast} from "@/hooks/CustomAlert.tsx";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";

interface CreateRecipeSheetProps {
    ingredients: Ingredient[];
    onSuccess: () => void;
    onError: () => void;
}

interface Quantities {
    [key: number]: string;
}

const CreateRecipeSheet = ({ ingredients, onSuccess, onError }: CreateRecipeSheetProps) => {
    const [recipeName, setRecipeName] = useState<string>('');
    const { showErrorToast, showSuccessToast } = useCustomToast();
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
    const [quantities, setQuantities] = useState<Quantities>({});
    const [loading, setLoading] = useState(false);
    const validateForm = (): boolean => {
        if (!recipeName.trim()) {
            showErrorToast(ErrorCode.RECIPE_NAME_REQUIRED);
            return false;
        }

        if (recipeName.length > 250) {
            showErrorToast(ErrorCode.RECIPE_NAME_LENGTH);
            return false;
        }

        // Kiểm tra nguyên liệu
        if (selectedIngredients.length === 0) {
            showErrorToast(ErrorCode.RECIPE_INGREDIENTS_REQUIRED);
            return false;
        }

        // Kiểm tra số lượng nguyên liệu
        for (const ingredientId of selectedIngredients) {
            const quantity = quantities[ingredientId];

            if (!quantity) {
                showErrorToast(ErrorCode.RECIPE_INGREDIENT_QUANTITY_REQUIRED);
                return false;
            }

            const quantityNum = parseFloat(quantity);

            if (isNaN(quantityNum)) {
                showErrorToast(ErrorCode.RECIPE_INGREDIENT_QUANTITY_INVALID);
                return false;
            }

            if (quantityNum <= 0) {
                showErrorToast(ErrorCode.RECIPE_INGREDIENT_QUANTITY_MIN);
                return false;
            }

            if (quantityNum > 1000) {
                showErrorToast(ErrorCode.RECIPE_INGREDIENT_QUANTITY_MAX);
                return false;
            }
        }

        return true;
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const recipeDetails: CreateRecipeDetail[] = selectedIngredients.map(ingredientId => ({
                ingredientId,
                quantity: parseFloat(quantities[ingredientId])
            }));

            const newRecipe: CreateRecipe = {
                name: recipeName,
                recipeDetails
            };

            await recipeService.createRecipe(newRecipe);
            showSuccessToast(ErrorCode.POST_SUCCESS);
            onSuccess();

            // Reset form
            setRecipeName('');
            setSelectedIngredients([]);
            setQuantities({});
        } catch (error) {
            showErrorToast(ErrorCode.CONNECT_ERROR);
            onError();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Recipe Name</Label>
                    <Input
                        id="name"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Enter recipe name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Select Ingredients</Label>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                        <div className="space-y-4">
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-start space-x-4">
                                    <Checkbox
                                        checked={selectedIngredients.includes(ingredient.id)}
                                        onCheckedChange={(checked: boolean) => {
                                            setSelectedIngredients(prev => {
                                                if (checked) {
                                                    return [...prev, ingredient.id];
                                                }
                                                return prev.filter(id => id !== ingredient.id);
                                            });
                                        }}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label className="text-sm font-medium">
                                            {ingredient.name}
                                        </Label>
                                        {selectedIngredients.includes(ingredient.id) && (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Quantity"
                                                    value={quantities[ingredient.id] || ''}
                                                    onChange={(e) =>
                                                        setQuantities(prev => ({
                                                            ...prev,
                                                            [ingredient.id]: e.target.value
                                                        }))
                                                    }
                                                    className="w-24 h-8"
                                                />
                                                <span className="text-sm text-gray-500">
                                                    {ingredient.unit_id}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <Button
                    type="submit"
                    disabled={loading || !recipeName || selectedIngredients.length === 0}
                >
                    {loading ? "Đang xử lý..." : "Thêm công thức"}
                </Button>
            </div>
        </form>
    );
};

export default CreateRecipeSheet;