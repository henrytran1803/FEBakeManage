import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserRequest } from "@/types/User";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserFormSheet } from "@/components/UserFormSheet";
import { Pencil } from "lucide-react";
import {ErrorCode} from "@/types/error.ts";

interface UserTableProps {
    users: User[];
    handleDeactivateUser: (userId: number) => void;
    handleUpdateUser: (id: number, userRequest: UserRequest) => Promise<void>;
    showSuccessToast: (message: ErrorCode) => void;
    showErrorToast: (message: ErrorCode) => void;
}

export const UserTable = ({
                              users,
                              handleDeactivateUser,
                              handleUpdateUser,
                              showSuccessToast,
                              showErrorToast
                          }: UserTableProps) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ngày sinh</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <UserFormSheet
                                        trigger={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center"
                                            >
                                                <Pencil className="h-4 w-4 mr-1" />
                                                Sửa
                                            </Button>
                                        }
                                        user={user}
                                        onSubmit={(userRequest) => handleUpdateUser(user.id, userRequest)}
                                        showSuccessToast={showSuccessToast}
                                        showErrorToast={showErrorToast}
                                    />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                            >
                                                {user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {user.isActive ? 'Vô hiệu hóa người dùng' : 'Kích hoạt người dùng'}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {user.isActive
                                                        ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản của ${user.firstName} ${user.lastName}?`
                                                        : `Bạn có chắc chắn muốn kích hoạt lại tài khoản của ${user.firstName} ${user.lastName}?`
                                                    }
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeactivateUser(user.id)}
                                                >
                                                    {user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};