import  { useEffect, useState } from 'react';
import {Eye, Plus} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {recipeService} from "@/services/recipeService.ts";
import {ingredientService} from "@/services/ingredientService.ts";
import {Ingredient} from "@/types/ingredient.ts";
import {GetRecipe, Recipe} from "@/types/recipe.ts";
import {useToast} from "@/hooks/use-toast.ts";
import CreateRecipeSheet from "@/components/CreateRecipeSheet.tsx";
import RecipeDetailSheet from "@/components/RecipeDetailSheet.tsx";

const RecipePage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();
    const [recipeDetail, setRecipeDetail] = useState<GetRecipe | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    useEffect(() => {
        loadData();
    }, []);


    const handleViewRecipe = async (id: number) => {
        try {
            const response = await recipeService.getRecipeByid(id);
            setRecipeDetail(response.data);
            setIsDetailSheetOpen(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load recipe details",
                variant: "destructive",
            });
        }
    };

    const loadData = async () => {
        try {
            const [recipesRes, ingredientsRes] = await Promise.all([
                recipeService.getAllRecipes(),
                ingredientService.getAll()
            ]);
            setRecipes(recipesRes.data);
            setIngredients(ingredientsRes);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load data",
                variant: "destructive",
            });
        }
    };

    const handleDeleteRecipe = async (id:number) => {
        try {
            await recipeService.deleteRecipe(id);
            toast({
                title: "Success",
                description: "Recipe deleted successfully",
            });
            loadData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete recipe",
                variant: "destructive",
            });
        }
        setShowDeleteDialog(false);
    };

    return (
        <div className="p-4 min-w-[85vw]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Recipe Management</h1>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Recipe
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md w-full">
                        <CreateRecipeSheet
                            ingredients={ingredients}
                            onSuccess={() => {
                                loadData();
                                setIsSheetOpen(false);
                                toast({
                                    title: "Success",
                                    description: "Recipe created successfully",
                                });
                            }}
                            onError={() => {
                                toast({
                                    title: "Error",
                                    description: "Failed to create recipe",
                                    variant: "destructive",
                                });
                            }}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col gap-4">
                <Input
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recipe Name</TableHead>
                                <TableHead>Ingredients Count</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recipes
                                .filter(recipe =>
                                    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((recipe) => (
                                    <TableRow key={recipe.id}>
                                        <TableCell>{recipe.name}</TableCell>
                                        <TableCell>{recipe.recipeDetails.length}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewRecipe(recipe.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setRecipeToDelete(recipe);
                                                    setShowDeleteDialog(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the recipe.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteRecipe(recipeToDelete?.id || 0)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <RecipeDetailSheet
                open={isDetailSheetOpen}
                onOpenChange={setIsDetailSheetOpen}
                recipe={recipeDetail}
            />

        </div>
    );
};

export default RecipePage;