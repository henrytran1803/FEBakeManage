
import {Category} from "@/types/Category.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {ScrollArea} from "@radix-ui/react-scroll-area";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export const CategoryListForCheckBox = ({
                                 categories,
                                 selectedCategories,
                                 onCategoryChange
                             }: {
    categories: Category[];
    selectedCategories: number[];
    onCategoryChange: (id: number) => void;
}) => {
    return (
        <Card className="w-64">
        <CardHeader>
            <h3 className="font-semibold">Danh mục</h3>
    </CardHeader>
    <CardContent>
    <ScrollArea className="h-[400px]">
        {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 mb-2">
            <Checkbox
                id={`category-${category.id}`}
    checked={selectedCategories.includes(category.id)}
    onCheckedChange={() => onCategoryChange(category.id)}
    />
    <label htmlFor={`category-${category.id}`} className="text-sm">
        {category.name}
        </label>
        </div>
))}
    </ScrollArea>
    </CardContent>
    </Card>
);
};