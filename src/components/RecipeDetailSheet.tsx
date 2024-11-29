import { FC } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GetRecipe } from "@/types/recipe"

interface RecipeDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipe: GetRecipe | null;
}

const RecipeDetailSheet: FC<RecipeDetailSheetProps> = ({
                                                           open,
                                                           onOpenChange,
                                                           recipe
                                                       }) => {
    if (!recipe) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md w-full">
                <SheetHeader>
                    <SheetTitle>{recipe.name}</SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[600px] mt-4">
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ingredient</TableHead>
                                    <TableHead>Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recipe.detailDTOS.map((detail) => (
                                    <TableRow key={detail.ingredientId}>
                                        <TableCell>{detail.ingredientName}</TableCell>
                                        <TableCell>{detail.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default RecipeDetailSheet;