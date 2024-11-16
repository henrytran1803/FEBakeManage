import { PaginationProps } from "@/types/Category";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const TablePagination = ({
                                    page,
                                    setPage,
                                    size,
                                    setSize,
                                    totalPages,
                                    totalElements,
                                    currentPageElements
                                }: PaginationProps) => {
    return (
        <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
                Hiển thị {currentPageElements} trên tổng số {totalElements} danh mục
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                >
                    Trước
                </Button>

                <span className="px-3 py-1">
         Trang {page + 1} / {totalPages}
       </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                >
                    Sau
                </Button>

                <Select
                    value={size.toString()}
                    onValueChange={(value) => {
                        setSize(Number(value));
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-[70px]">
                        <SelectValue>{size}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};