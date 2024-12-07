// UserPage.tsx
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
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UserErrorCode,
  userErrorMessages,
} from "@/utils/error/ManageUserError";
import { toast } from "@/hooks/use-toast";

const UserPage: React.FC = () => {
  // States
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [userStatus, setUserStatus] = useState<string>("active");
  const [userIdToDeactivate, setUserIdToDeactivate] = useState<number | null>(
    null
  );
  const [targetUserActive, setTargetUserActive] = useState<boolean>(true); // New state for tracking target user status
  const [searchParams, setSearchParams] = useState({
    page: 0,
    size: 10,
    sortBy: "email",
    sortDir: "asc" as "asc" | "desc",
    isActive: true,
  });

  // 1. Thêm state để theo dõi action type
  const [actionType, setActionType] = useState<
    "activate" | "deactivate" | null
  >(null);

  // Validation schema
  const userFormSchema = z.object({
    firstName: z
      .string()
      .min(1, { message: userErrorMessages[UserErrorCode.FIRST_NAME_REQUIRED] })
      .refine((value) => /^[\p{L}\s-]+$/u.test(value), {
        message: userErrorMessages[UserErrorCode.FIRST_NAME_INVALID],
      }),
    lastName: z
      .string()
      .min(1, { message: userErrorMessages[UserErrorCode.LAST_NAME_REQUIRED] })
      .refine((value) => /^[\p{L}\s-]+$/u.test(value), {
        message: userErrorMessages[UserErrorCode.LAST_NAME_INVALID],
      }),
    email: z
      .string()
      .min(1, { message: userErrorMessages[UserErrorCode.EMAIL_REQUIRED] })
      .email({ message: userErrorMessages[UserErrorCode.EMAIL_INVALID] }),
    dateOfBirth: z
      .string()
      .min(1, {
        message: userErrorMessages[UserErrorCode.DATE_OF_BIRTH_REQUIRED],
      }),
    password: selectedUser
      ? z.string().optional().or(z.literal(""))
      : z
          .string()
          .min(6, {
            message: userErrorMessages[UserErrorCode.PASSWORD_INVALID],
          }),
    roleIds: z
      .array(z.number())
      .min(1, { message: userErrorMessages[UserErrorCode.ROLE_REQUIRED] }),
  });

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      password: "",
      roleIds: [1],
    },
  });

  // Status change handler
  const handleStatusChange = (value: string) => {
    setUserStatus(value);
    setSearchParams((prev) => ({
      ...prev,
      isActive: value === "active",
    }));
    if (value === "active") {
      fetchUsers();
    } else {
      fetchInactiveUsers();
    }
  };

  // Fetch functions
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getActiveUsers(searchParams);
      setUsers(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInactiveUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getInactiveUsers(searchParams);
      setUsers(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng không hoạt động",
        variant: "destructive",
      });
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

  // Modal handlers
  const openModal = (user: User | null) => {
    if (user) {
      setSelectedUser(user);
      setValue("firstName", user.firstName);
      setValue("lastName", user.lastName);
      setValue("email", user.email);
      const formattedDate = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "";
      setValue("dateOfBirth", formattedDate);
      setValue("roleIds", Array.from(user.roleIds));
      setValue("password", "");
    } else {
      setSelectedUser(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    reset();
  };

  // User actions handlers
  const handleCreateUser = async (data: RegisterRequest) => {
    try {
      const response = await userService.createUser(data);
      if (response) {
        toast({
          title: "Thành công",
          description: userErrorMessages[UserErrorCode.USER_CREATED],
          variant: "default",
        });
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: userErrorMessages[UserErrorCode.CREATE_USER_ERROR],
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (data: RegisterRequest) => {
    if (!selectedUser) return;

    try {
      const updateData: UserRequestSua = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        isActive: true,
        password: data.password,
        roleIds: data.roleIds,
      };

      const response = await userService.updateUser(
        selectedUser.id,
        updateData
      );
      if (response) {
        toast({
          title: "Thành công",
          description: userErrorMessages[UserErrorCode.USER_UPDATED],
          variant: "default",
        });
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: userErrorMessages[UserErrorCode.UPDATE_USER_ERROR],
        variant: "destructive",
      });
    }
  };

  // 2. Sửa lại handlers
  const handleDeactivateUser = (id: number) => {
    setUserIdToDeactivate(id);
    setActionType("deactivate");
    setIsConfirming(true);
  };
  const deactivateUser = async (id: number | null) => {
    if (id === null) return;

    try {
      const response =await userApi.deactivateUser(id);
      toast({
        title: "Thành công",
        description: response.message,
        variant: "default",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể khóa tài khoản người dùng",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };
  const handleActivateUser = (id: number) => {
    setUserIdToDeactivate(id);
    setActionType("activate");
    setIsConfirming(true);
  };
 // 5. Sửa lại hàm activateUser để refresh đúng dữ liệu
const activateUser = async (id: number | null) => {
  if (id === null) return;

  try {
    await userApi.activateUser(id);
    toast({
      title: "Thành công",
      description: "Đã kích hoạt tài khoản người dùng",
      variant: "default",
    });
   
      fetchInactiveUsers();
 
  } catch (error) {
    toast({
      title: "Lỗi",
      description: "Không thể kích hoạt tài khoản người dùng",
      variant: "destructive",
    });
  } finally {
    setIsConfirming(false);
    setActionType(null);
  }
};

  useEffect(() => {
    if (userStatus === "active") {
      fetchUsers();
    } else {
      fetchInactiveUsers();
    }
  }, [searchParams.page, searchParams.size]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>
        </div>
        <Select value={userStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Họ</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
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
                  {Array.from(user.roleIds)
                    .map((roleId) => {
                      if (roleId === 1) return "Quản lý";
                      if (roleId === 2) return "Nhân viên";
                      return null;
                    })
                    .filter(Boolean)
                    .join(" - ")}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      user.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
                  </span>
                </TableCell>
                {/* // 4. Sửa lại các buttons trong table */}
                <TableCell>
                  {user.isActive ? (
                    <Button
                      variant="destructive"
                      onClick={() => handleDeactivateUser(user.id)}
                      className="mr-2"
                    >
                      Khóa
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleActivateUser(user.id)}
                      className="mr-2 bg-green-500 text-white hover:bg-green-600"
                    >
                      Kích hoạt
                    </Button>
                  )}
                  <Button onClick={() => openModal(user)}>Sửa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <TablePagination
          page={searchParams.page}
          setPage={handlePageChange}
          size={searchParams.size}
          setSize={handleSizeChange}
          totalPages={Math.ceil(totalUsers / searchParams.size)}
          totalElements={totalUsers}
          currentPageElements={users.length}
        />
      </div>
      {/* // 3. Sửa lại Dialog content */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogTitle>
            {actionType === "activate"
              ? "Xác nhận kích hoạt tài khoản"
              : "Xác nhận khóa tài khoản"}
          </DialogTitle>
          <p>
            Bạn có chắc chắn muốn{" "}
            {actionType === "activate" ? "kích hoạt" : "khóa"} tài khoản này?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirming(false);
                setActionType(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant={actionType === "deactivate" ? "destructive" : "default"}
              onClick={() => {
                if (actionType === "deactivate") {
                  deactivateUser(userIdToDeactivate);
                } else {
                  activateUser(userIdToDeactivate);
                }
              }}
            >
              {actionType === "activate" ? "Kích hoạt" : "Khóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
          onClose={closeModal}
        >
          <form
            onSubmit={handleSubmit(
              selectedUser ? handleUpdateUser : handleCreateUser
            )}
            className="space-y-4"
          >
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ</Label>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <div>
                    <Input {...field} id="firstName" placeholder="Nhập họ" />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <div>
                    <Input {...field} id="lastName" placeholder="Nhập tên" />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <div>
                    <Input {...field} id="email" placeholder="Nhập email" />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      id="dateOfBirth"
                      type="date"
                      value={String(field.value)}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

           {/* Password */}
<div className="space-y-2">
  <Label htmlFor="password" className="flex gap-1">
    Mật khẩu
    <span className="text-red-500">*</span>
  </Label>
  <Controller
    control={control}
    name="password"
    rules={{ required: 'Vui lòng nhập mật khẩu' }}
    render={({ field }) => (
      <div>
        <Input
          {...field}
          id="password"
          type="password"
          placeholder="Nhập mật khẩu"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
    )}
  />
</div>

            {/* Roles */}
            <div className="space-y-2">
              <Label htmlFor="roleIds">Vai trò</Label>
              <Controller
                control={control}
                name="roleIds"
                render={({ field }) => (
                  <div>
                    <select
                      {...field}
                      multiple
                      className="form-select mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                      value={field.value.map(String)}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                          (option) => Number(option.value)
                        );

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
                    {errors.roleIds && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.roleIds.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit">
                {selectedUser ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserPage;
