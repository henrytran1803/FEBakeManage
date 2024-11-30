import React, { useEffect, useState } from 'react';
import { User } from '@/types/User'; // Đảm bảo rằng bạn có kiểu dữ liệu User
import { userService } from '@/services/userService';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { TablePagination } from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import exp from 'constants';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State chứa danh sách người dùng
  const [page, setPage] = useState(0); // Trạng thái trang hiện tại
  const [size, setSize] = useState(10); // Trạng thái số lượng người dùng trên mỗi trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số người dùng
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true); // Bắt đầu tải dữ liệu
      setError(null); // Reset lỗi khi bắt đầu tải lại dữ liệu
      try {
        const response = await userService.getActiveUsers(page, size); // Gọi API để lấy người dùng
        setUsers(response.data.content); // Cập nhật danh sách người dùng
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
        setTotalElements(response.data.totalElements); // Cập nhật tổng số người dùng
      } catch (error) {
        setError('Failed to fetch users'); // Nếu có lỗi, cập nhật thông báo lỗi
      } finally {
        setIsLoading(false); // Dừng tải dữ liệu
      }
    };

    fetchUsers();
  }, [page, size]); // Chạy lại khi trang hoặc kích thước thay đổi

  return (
    <div className="p-4 min-w-[80vw]">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center">Loading...</div> // Hiển thị khi đang tải dữ liệu
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date of Birth</TableHead> {/* Thêm cột Date of Birth */}
                <TableHead>Roles</TableHead> {/* Thêm cột Roles */}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.dateOfBirth).toLocaleDateString()}</TableCell> {/* Hiển thị Date of Birth */}
                  <TableCell>{user.roles.join(', ')}</TableCell> {/* Hiển thị Roles */}
                  
                  <TableCell>
                    <Badge variant={user.active ? 'default' : 'destructive'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Phân trang */}
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
export default UserList;
