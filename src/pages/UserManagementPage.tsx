import React, { useEffect, useState } from "react";
import { userApi } from "@/services/userService"; // Giả sử userApi có sẵn trong thư mục services

import { User, UserRequest, ListUserActive, RegisterRequest } from "@/types/User";
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
import { Label } from "@/components/ui/label"; // Nhập Label nếu chưa có
import { TablePagination } from "@/components/TablePagination"; // Phân trang

import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

const UserPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();
  const [users, setUsers] = useState<User[]>([]); // Lưu trữ danh sách người dùng
  const [totalUsers, setTotalUsers] = useState<number>(0); // Tổng số người dùng
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi fetch dữ liệu
  const [searchParams, setSearchParams] = useState({
    page: 0, // Trang bắt đầu từ 0
    size: 10, // Số lượng người dùng mỗi trang
    sortBy: "email",
    sortDir: "asc" as "asc" | "desc", // Ép kiểu đúng
    isActive: true,
  }); // Các tham số tìm kiếm (phân trang, sắp xếp)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Mở đóng modal
  const [userToCreate, setUserToCreate] = useState<RegisterRequest | null>(null); // Người dùng hiện tại để tạo
  const [userToEdit, setUserToEdit] = useState<UserRequest | null>(null); // Người dùng hiện tại để sửa
  // Chuyển đổi roles thành Set<string> nếu nó là string
  // Chuyển roles thành một string duy nhất, ví dụ như 'manage', 'user', hoặc 'both'
  const defaultRole = userToEdit?.roles ? userToEdit.roles : "user"; // Sử dụng 'user' nếu không có giá trị roles
  // Khởi tạo hook form

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getActiveUsers(searchParams);
      setUsers(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo người dùng mới
  const handleCreateUser = async (userRequest: RegisterRequest) => {
    try {
      const response = await userApi.create(userRequest);
      console.log("User created:", response);
      fetchUsers(); // Tải lại danh sách người dùng
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  // Sửa thông tin người dùng
  const handleUpdateUser = async (id: number, userRequest: UserRequest) => {
    try {
      const response = await userApi.updateUser(id, userRequest);
      console.log("User updated:", response);
      fetchUsers(); // Tải lại danh sách người dùng
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Khóa tài khoản người dùng
  const handleDeactivateUser = async (id: number) => {
    try {
      const response = await userApi.deactivateUser(id);
      console.log("User deactivated:", response);
      fetchUsers(); // Tải lại danh sách người dùng
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  };

  // Sửa đổi trang khi phân trang
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  const handleSizeChange = (size: number) => {
    setSearchParams((prev) => ({ ...prev, size }));
  };

  // Mở modal để tạo hoặc sửa người dùng
  const openModal = (user: UserRequest | null) => {
    if (user) {
      // Sửa người dùng
      setUserToEdit(user);
    } else {
      // Tạo người dùng mới
      setUserToCreate({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        roles: new Set<string>,
      });
    }
    setIsModalOpen(true);
  };


  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
    setUserToCreate(null);
  };

  const onClickHandler = () => {
    // if (userToEdit) {
    //   // Sửa người dùng
    //   handleUpdateUser(userToEdit.id, {
    //     email: "example@mail.com",

    //     firstName: "John", // Cập nhật dữ liệu cho firstName
    //     lastName: "Doe", // Cập nhật dữ liệu cho lastName
    //     password: "newPassword123", // Giả sử muốn chỉnh sửa password
    //     // Sử dụng 'active' thay vì 'isActive'
    //     dateOfBirth: "1990-01-01", // Dùng kiểu String cho dateOfBirth, có thể chuyển thành Date nếu cần
    //     roles: new Set(["admin", "user"]), // Dùng Set cho roles nếu backend yêu cầu
    //   });
    // } else {
      // Tạo người dùng mới
      handleCreateUser({
        email: "new@mail.com",
        firstName: "Jane",
        lastName: "Doe",
        password: "newPassword123",

        dateOfBirth: "1995-06-15",
        roles: new Set<string>, // Tạo người dùng mới với role mặc định
      });
    
  };

  // useEffect để gọi API khi trang hoặc size thay đổi
  useEffect(() => {
    fetchUsers();
  }, [searchParams.page, searchParams.size]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <br />
      {/* Table để hiển thị danh sách người dùng */}
      <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>First</TableHead>
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
              <TableCell>{user.roles}</TableCell>
              <TableCell>{user.active ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                {/* <Button onClick={() => openModal(user)}>Sửa</Button> */}
                <Button onClick={() => handleDeactivateUser(user.id)}>
                  Khóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <TablePagination
        page={searchParams.page}
        setPage={handlePageChange}
        size={searchParams.size}
        setSize={handleSizeChange}
        totalPages={Math.ceil(totalUsers / searchParams.size)}
        totalElements={totalUsers}
        currentPageElements={users.length}
      />

      {/* Modal để tạo/sửa người dùng */}
      {isModalOpen && (
        <Modal
          title='Tạo người dùng'
          onClose={closeModal}
          actions={
            <>
              <Button onClick={closeModal}>Đóng</Button>
            </>
          }
        >
          <form
            onSubmit={handleSubmit(
              (data) =>
                // userToEdit
                //   ? handleUpdateUser( data) // Sửa người dùng
                   handleCreateUser(data) // Tạo người dùng mới
            )}
          >
            {/* Trường First Name */}
            <div>
              <Label htmlFor="firstName">Họ</Label>
              <Controller
                control={control}
                name="firstName"
                defaultValue={userToCreate?.firstName || ""}
                render={({ field }) => (
                  <Input {...field} id="firstName" placeholder="Nhập họ" />
                )}
              />
            </div>

            {/* Trường Last Name */}
            <div>
              <Label htmlFor="lastName">Tên</Label>
              <Controller
                control={control}
                name="lastName"
                defaultValue={userToCreate?.lastName || ""}
                render={({ field }) => (
                  <Input {...field} id="lastName" placeholder="Nhập tên" />
                )}
              />
            </div>

            {/* Trường Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                defaultValue={userToCreate?.email || ""}
                render={({ field }) => (
                  <Input {...field} id="email" placeholder="Nhập email" />
                )}
              />
            </div>
            {/* Trường Ngày Sinh (Date of Birth) */}
            <div>
              <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
              <Controller
                control={control}
                name="dateOfBirth"
                defaultValue={userToCreate?.dateOfBirth || ""} // Nếu không có dateOfBirth, để trống
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dateOfBirth"
                    type="date"
                    value={String(field.value)} // Ép kiểu value về string nếu cần
                  />
                )}
              ></Controller>
            </div>
            {/* Trường Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Controller
                control={control}
                name="password"
                defaultValue={userToCreate?.password || ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password" // Set type là 'password' để ẩn mật khẩu
                    placeholder="Nhập mật khẩu"
                  />
                )}
              />
            </div>
            <div className=" mt-2">
              <Label htmlFor="roles" className="block mb-2 font-medium">
                Vai trò
              </Label>
              <Controller
                control={control}
                name="roles"
                defaultValue={userToCreate?.roles ?? new Set(["ROLE_USER"])}
                render={({ field }) => (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ROLE_USER"
                        value="ROLE_USER"
                        checked={Array.from(field.value).includes("ROLE_USER")}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const currentRoles = new Set(field.value);

                          if (isChecked && !currentRoles.has("ROLE_USER")) {
                            currentRoles.add("ROLE_USER");
                            field.onChange(currentRoles);
                          } else if (
                            !isChecked &&
                            currentRoles.has("ROLE_USER")
                          ) {
                            currentRoles.delete("ROLE_USER");
                            field.onChange(currentRoles);
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="ROLE_USER">Người dùng</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ROLE_MANAGE"
                        value="ROLE_MANAGE"
                        checked={Array.from(field.value).includes(
                          "ROLE_MANAGE"
                        )}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const currentRoles = new Set(field.value);

                          if (isChecked && !currentRoles.has("ROLE_MANAGE")) {
                            currentRoles.add("ROLE_MANAGE");
                            field.onChange(currentRoles);
                          } else if (
                            !isChecked &&
                            currentRoles.has("ROLE_MANAGE")
                          ) {
                            currentRoles.delete("ROLE_MANAGE");
                            field.onChange(currentRoles);
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor="ROLE_MANAGE">Quản lý</label>
                    </div>
                  </div>
                )}
              />
            </div>
            {/* Submit button */}
            <div className=" p-4  mt-3">
              <Button type="submit">
                {userToCreate ?   "Tạo Mới":""}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserPage;
