import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {Edit, Trash2, Plus, Check} from "lucide-react";
import { CategoryListProps} from "@/types/Category";
import {getImageUrl} from "@/utils/imageUtils.ts";


export default function CategoryList({
                                         categories,
                                         onCategoryAdded,
                                         onCategoryDeleted,
                                         onCategoryUpdated
                                     }: CategoryListProps) {


    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Button
                    onClick={onCategoryAdded}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Thêm danh mục
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">STT</TableHead>
                            <TableHead className="w-[100px]">Hình ảnh</TableHead>
                            <TableHead>Tên danh mục</TableHead>
                            <TableHead className="w-[150px] text-center">Trạng thái</TableHead>
                            <TableHead className="w-[130px] text-center">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell className="text-center">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    <img
                                        src={getImageUrl(category.imageUrl)}
                                        alt={category.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {category.name}
                                </TableCell>
                                <TableCell className="text-center">
                 <span
                     className={`px-3 py-1 rounded-full text-xs
                     ${category.isActive
                         ? 'bg-green-100 text-green-800'
                         : 'bg-red-100 text-red-800'
                     }`}
                 >
                   {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                 </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onCategoryUpdated(category)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        {category.isActive ? (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => onCategoryDeleted(category)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="border-green-500 text-green-500 hover:bg-green-50"
                                                onClick={() => onCategoryDeleted(category)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>

                                            )}

                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}