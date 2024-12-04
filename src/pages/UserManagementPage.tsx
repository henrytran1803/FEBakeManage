import React, { useEffect, useState } from "react";
import { userApi, userService } from "@/services/userService";
import { useForm, Controller } from "react-hook-form";
import {
  User,
  UserRequest,
  RegisterRequest,
  UserRequestSua,
} from "@/types/User";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import { Label } from "@/components/ui/label";
import { TablePagination } from "@/components/TablePagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { log } from "console";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [userIdToDeactivate, setUserIdToDeactivate] = useState<number | null>(
    null
  );
  const [searchParams, setSearchParams] = useState({
    page: 0,
    size: 10,
    sortBy: "email",
    sortDir: "asc" as "asc" | "desc",
    isActive: true,
  });

  // Form for both create and update
  const { control, handleSubmit, reset, setValue } = useForm<RegisterRequest>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      password: "",
      roleIds: [1],
    },
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getActiveUsers(searchParams);
      setUsers(response.data.content);
      console.log(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inactive users
  const fetchInactiveUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getInactiveUsers(searchParams); // API call for inactive users
      setUsers(response.data.content); // Set state for users
      console.log(response.data.content);
      setTotalUsers(response.data.totalElements); // Set total users
    } catch (error) {
      console.error("Failed to fetch inactive users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const handleSizeChange = (size: number) => {
    setSearchParams((prev) => ({ ...prev, size }));
  };

  // Fetch users on page or size change
  useEffect(() => {
    fetchUsers();
  }, [searchParams.page, searchParams.size]);

  // Open modal for create or edit
  const openModal = (user: User | null) => {
    if (user) {
      // Edit mode
      setSelectedUser(user);
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      // Convert dateOfBirth to YYYY-MM-DD format
      const formattedDate = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "";
      setValue("dateOfBirth", formattedDate);
      setValue("roleIds", Array.from(user.roleIds));
      setValue("password", ""); // Clear password field for edit
    } else {
      // Create mode
      setSelectedUser(null);
      reset(); // Reset form to default values
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    reset();
  };

  // Create user handler
  const handleCreateUser = async (data: RegisterRequest) => {
    try {
      const response = await userService.createUser(data);
      if (response) {
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  // Update user handler
  const handleUpdateUser = async (data: RegisterRequest) => {
    if (!selectedUser) return;

    try {
      const updateData: UserRequestSua = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        isActive: true,
        password: data.password, // Always include password for backend
        roleIds: data.roleIds,
      };

      const response = await userService.updateUser(
        selectedUser.id,
        updateData
      );
      if (response) {
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Deactivate user handler
  const handleDeactivateUser = (id: number) => {
    setUserIdToDeactivate(id);
    setIsDeactivating(true);
  };

  const deactivateUser = async (id: number | null) => {
    if (id === null) return;

    try {
      await userApi.deactivateUser(id);
      fetchUsers();
      setIsDeactivating(false);
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>
      <Button
        onClick={fetchUsers}
        className="bg-blue-500 text-white hover:bg-blue-700 p-2 rounded"
      >
        Xem người dùng kích hoạt
      </Button>

      <Button
        onClick={fetchInactiveUsers}
        className="bg-gray-500 text-white hover:bg-gray-700 p-2 rounded"
      >
        Xem người dùng chưa kích hoạt
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Date of birth</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.dateOfBirth}</TableCell>
              <TableCell>
                {
                  Array.from(user.roleIds) // Chuyển Set thành mảng
                    .map((roleId) => {
                      if (roleId === 1) return "Quản lý";
                      if (roleId === 2) return "Nhân viên";
                      return null; // Trường hợp roleId khác
                    })
                    .filter(Boolean) // Loại bỏ giá trị null
                    .join(" - ") // Nối các vai trò bằng dấu "-".
                }
              </TableCell>

              <TableCell>
  <span
    className={`px-3 py-1 rounded-full text-xs ${
      user.isActive === true 
        ? 'bg-green-500 text-white'  // Nếu active = 1 thì là người dùng hoạt động
        : 'bg-red-500 text-white'    // Nếu active = 0 thì là người dùng không hoạt động
    }`}
  >
    {user.isActive === true ? 'Đang hoạt động' : 'Không hoạt động'}
  </span>
</TableCell>




              <TableCell>
                <Button onClick={() => handleDeactivateUser(user.id)}>
                  Khóa
                </Button>
                <Button onClick={() => openModal(user)}>Sửa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        page={searchParams.page}
        setPage={handlePageChange}
        size={searchParams.size}
        setSize={handleSizeChange}
        totalPages={Math.ceil(totalUsers / searchParams.size)}
        totalElements={totalUsers}
        currentPageElements={users.length}
      />

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={isDeactivating} onOpenChange={setIsDeactivating}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogClose></DialogClose>
            <h2>
              Bạn có muốn khóa tài khoản có id là: {userIdToDeactivate} không?
            </h2>
            <Button
              onClick={() => {
                deactivateUser(userIdToDeactivate);
              }}
            >
              Có
            </Button>
            <Button onClick={() => setIsDeactivating(false)}>Không</Button>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Create/Edit User Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
          onClose={closeModal}
          actions={
            <>
              <Button onClick={closeModal}>Đóng</Button>
            </>
          }
        >
          <form
            onSubmit={handleSubmit(
              selectedUser ? handleUpdateUser : handleCreateUser
            )}
          >
            {/* First Name */}
            <div className="mb-4">
              <Label htmlFor="firstName">Họ</Label>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <Input {...field} id="firstName" placeholder="Nhập họ" />
                )}
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <Label htmlFor="lastName">Tên</Label>
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <Input {...field} id="lastName" placeholder="Nhập tên" />
                )}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input {...field} id="email" placeholder="Nhập email" />
                )}
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dateOfBirth"
                    type="date"
                    value={String(field.value)} // Ép kiểu value về string nếu cần
                  />
                )}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <Label htmlFor="password">
                {selectedUser ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder={
                      selectedUser
                        ? "Để trống nếu không muốn thay đổi"
                        : "Nhập mật khẩu"
                    }
                  />
                )}
              />
            </div>

            {/* Roles */}
            <div className="mb-4">
              <Label htmlFor="roleIds" className="block mb-2 font-medium">
                Vai trò
              </Label>
              <Controller
                control={control}
                name="roleIds"
                render={({ field }) => (
                  <select
                    {...field}
                    multiple
                    className="form-select mt-1 block w-full"
                    value={field.value.map(String)}
                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions,
                        (option) => Number(option.value)
                      );

                      // Handle special case for "Cả 2"
                      if (selectedOptions.includes(3)) {
                        field.onChange([1, 2]);
                      } else {
                        field.onChange(selectedOptions);
                      }
                    }}
                  >
                    <option value="1">Quản lý</option>
                    <option value="2">Nhân viên</option>
                    <option value="3">Cả 2</option>
                  </select>
                )}
              />
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full mt-4">
              {selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserPage;
