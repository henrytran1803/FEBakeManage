
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {SearchPromotionFilterProps} from "@/types/Category.ts";

export const PromotionSearchFilter = ({
                                          searchTerm,
                                          setSearchTerm,
                                          activeFilter,
                                          setActiveFilter,
                                          sortConfig,
                                          setSortConfig,
                                          setPage,
                                          dateFilter,
                                          setDateFilter
                                      }: SearchPromotionFilterProps) => {
    return (
        <div className="mb-6 space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 max-w-md relative">
                    <Input
                        type="text"
                        placeholder="Tìm kiếm khuyến mãi..."
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
                    value={sortConfig.sortBy}
                    onValueChange={(value: string) => {
                        setSortConfig({ ...sortConfig, sortBy: value });
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Tên</SelectItem>
                        <SelectItem value="startDate">Ngày bắt đầu</SelectItem>
                        <SelectItem value="endDate">Ngày kết thúc</SelectItem>
                        <SelectItem value="discount">Giảm giá</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={sortConfig.sortDir}
                    onValueChange={(value: 'asc' | 'desc') => {
                        setSortConfig({ ...sortConfig, sortDir: value });
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Thứ tự" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Tăng dần</SelectItem>
                        <SelectItem value="desc">Giảm dần</SelectItem>
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

                <Select
                    value={dateFilter}
                    onValueChange={(value: 'all' | 'upcoming' | 'ongoing' | 'ended') => {
                        setDateFilter(value);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả thời gian</SelectItem>
                        <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                        <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                        <SelectItem value="ended">Đã kết thúc</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Filter tags */}
            {(searchTerm || activeFilter !== 'all' || dateFilter !== 'all') && (
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

                    {dateFilter !== 'all' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                            Thời gian: {
                            dateFilter === 'upcoming' ? 'Sắp diễn ra' :
                                dateFilter === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'
                        }
                            <button
                                onClick={() => {
                                    setDateFilter('all');
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