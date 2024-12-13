import { useEffect, useState } from "react";
import { User, UserRequest } from "@/types/User.ts";
import { userService } from "@/services/userService.ts";
import { Button } from "@/components/ui/button.tsx";
import { UserPlus } from "lucide-react";
import { UserFilters } from "@/components/UserFilters.tsx";
import { UserTable } from "@/components/UserTable.tsx";
import { TablePagination } from "@/components/TablePagination.tsx";
import { UserSearchParams } from "@/api/endpoints/userApi.ts";
import { UserFormSheet } from "@/components/UserFormSheet";
import {useCustomToast} from "@/hooks/CustomAlert.tsx";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";

const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('all');
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleStatusChange = (value: string) => {
        setFilterActive(value);
        setPage(0);
    };

    const handleCreateUser = async (userRequest: UserRequest) => {
        try {
            await userService.createUser(userRequest);
            fetchUsers();
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateUser = async (id: number, userRequest: UserRequest) => {
        try {
            await userService.updateUser(id, userRequest);
            fetchUsers();
        } catch (error) {
            throw error;
        }
    };

    const handleDeactivateUser = async (userId: number) => {
        try {
            await userService.deactivateUser(userId);
            fetchUsers();
            showSuccessToast(ErrorCode.USER_DEACTIVATE_ERROR);
        } catch (error) {
            console.error('Error deactivating user:', error);
            showErrorToast(ErrorCode.USER_DEACTIVATE_ERROR);
        }
    };


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params: UserSearchParams = {
                page,
                size,
                isActive: filterActive
            };

            const response = await userService.getActiveUsers(params);
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching users:', error);
            showErrorToast(ErrorCode.USER_FETCH_ERROR);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, filterActive]);

    return (
        <div className="p-4 min-w-[80vw]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                <UserFormSheet
                    trigger={
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Thêm người dùng
                        </Button>
                    }
                    onSubmit={handleCreateUser}
                    showSuccessToast={showSuccessToast}
                    showErrorToast={showErrorToast}
                />
            </div>

            <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterActive={filterActive}
                handleStatusChange={handleStatusChange}
                handleSearch={handleSearch}
            />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <UserTable
                        users={users}
                        handleDeactivateUser={handleDeactivateUser}
                        handleUpdateUser={handleUpdateUser}
                        showSuccessToast={showSuccessToast}
                        showErrorToast={showErrorToast}
                    />
                    <TablePagination
                        page={page}
                        setPage={setPage}
                        size={size}
                        setSize={setSize}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        currentPageElements={users.length}
                    />
                </>
            )}
        </div>
    );
};

export default UserPage;