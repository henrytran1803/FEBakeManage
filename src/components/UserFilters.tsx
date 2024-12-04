import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";

interface UserFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterActive: string;
    handleStatusChange: (value: string) => void;
    handleSearch: (e: React.FormEvent) => void;
}

export const UserFilters = ({
                                searchTerm,
                                setSearchTerm,
                                filterActive,
                                handleStatusChange,
                                handleSearch
                            }: UserFiltersProps) => {
    const statusOptions = [
        { label: 'Tất cả', value: 'all' },
        { label: 'Đang hoạt động', value: 'active' },
        { label: 'Không hoạt động', value: 'inactive' },
    ];



    return (
        <div className="mb-6 flex gap-4">
            <div className="flex-1">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Tìm kiếm theo tên, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button type="submit">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            <Select value={filterActive} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

        </div>
    );
};