import { SearchCategoryFilterProps } from "@/types/Category";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const SearchFilter = ({
                                 searchTerm,
                                 setSearchTerm,
                                 activeFilter,
                                 setActiveFilter,
                                 sortConfig,
                                 setSortConfig,
                                 setPage
                             }: SearchCategoryFilterProps) => {
    return (
        <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 max-w-md relative">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                        className="pl-10"
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                <Select
                    value={sortConfig}
                    onValueChange={(value: 'asc' | 'desc') => {
                        setSortConfig(value);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Tên (A-Z)</SelectItem>
                        <SelectItem value="desc">Tên (Z-A)</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={activeFilter}
                    onValueChange={(value: 'all' | 'active' | 'inactive') => {
                        setActiveFilter(value);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="active">Đang hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {(searchTerm || activeFilter !== 'all') && (
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    {searchTerm && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
              Tìm kiếm: {searchTerm}
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setPage(0);
                                }}
                                className="ml-2 hover:text-blue-600"
                            >
                ×
              </button>
            </span>
                    )}
                    {activeFilter !== 'all' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
              Trạng thái: {activeFilter === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            <button
                                onClick={() => {
                                    setActiveFilter('all');
                                    setPage(0);
                                }}
                                className="ml-2 hover:text-blue-600"
                            >
                ×
              </button>
            </span>
                    )}
                </div>
            )}
        </div>
    );
};