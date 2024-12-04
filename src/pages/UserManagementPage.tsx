// import React, { useEffect, useState } from "react";
// import { userApi, userService } from "@/services/userService"; // Giả sử userApi có sẵn trong thư mục services

// import {
//   User,
//   UserRequest,
//   ListUserActive,
//   RegisterRequest,
// } from "@/types/User";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHeader,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import Modal from "@/components/ui/Modal";
// import { Label } from "@/components/ui/label"; // Nhập Label nếu chưa có
// import { TablePagination } from "@/components/TablePagination"; // Phân trang

// import { useForm, Controller } from "react-hook-form";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogOverlay,
//   DialogPortal,
// } from "@/components/ui/dialog";

// const UserPage: React.FC = () => {
//   const { control, handleSubmit, reset } = useForm<RegisterRequest>();
//   const [users, setUsers] = useState<User[]>([]); // Lưu trữ danh sách người dùng
//   const [totalUsers, setTotalUsers] = useState<number>(0); // Tổng số người dùng
//   const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi fetch dữ liệu
//   const [searchParams, setSearchParams] = useState({
//     page: 0, // Trang bắt đầu từ 0
//     size: 10, // Số lượng người dùng mỗi trang
//     sortBy: "email",
//     sortDir: "asc" as "asc" | "desc", // Ép kiểu đúng
//     isActive: true,
//   }); // Các tham số tìm kiếm (phân trang, sắp xếp)

//   // const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Mở đóng modal
//   // const [userToCreate, setUserToCreate] = useState<RegisterRequest | null>(
//   //   null
//   // ); // Người dùng hiện tại để tạo
//   const [userToEdit, setUserToEdit] = useState<UserRequest | null>(null); // Người dùng hiện tại để sửa
//   const [isSuccess, setIsSuccess] = useState(false); // State to show success message
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [error, setError] = useState<string | null>(null); // Error message if any
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal trạng thái
//   const [isDeactivating, setIsDeactivating] = useState(false); // Dialog khóa tài khoản

//   const [selectedUser, setSelectedUser] = useState<User | null>(null); // Dùng để lưu thông tin người dùng khi chọn sửa

//   const [userIdToDeactivate, setUserIdToDeactivate] = useState<number | null>(
//     null);
//     // Lưu id của người dùng cần khóa
//   // const [userToCreate, setUserToCreate] = useState<RegisterRequest>({
//   //   firstName: "",
//   //   lastName: "",
//   //   email: "",
//   //   dateOfBirth: "",
//   //   password: "",
//   //   roleIds: [1],
//   // });
//   // làm update user
//   const [userData, setUserData] = useState<UserRequest|null>({
//     firstName: "",
//      lastName: "",
//      email: "",
//      dateOfBirth: "",
//      password: "",
//      roleIds: [1],
//   });

//   // Lấy danh sách người dùng
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await userApi.getActiveUsers(searchParams);
//       setUsers(response.data.content);
//       setTotalUsers(response.data.totalElements);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sửa đổi trang khi phân trang
//   const handlePageChange = (page: number) => {
//     setSearchParams((prev) => ({ ...prev, page }));
//   };

//   const handleSizeChange = (size: number) => {
//     setSearchParams((prev) => ({ ...prev, size }));
//   };

//   // useEffect để gọi API khi trang hoặc size thay đổi
//   useEffect(() => {
//     fetchUsers();
//   }, [searchParams.page, searchParams.size]);

//   // Sửa thông tin người dùng
//   const handleUpdateUser = async (id: number, userRequest: UserRequest) => {
//     try {
//       const response = await userApi.updateUser(id, userRequest);
//       console.log("User updated:", response);
//       setIsModalOpen(false);
//       fetchUsers(); // Tải lại danh sách người dùng
//     } catch (error) {
//       console.error("Failed to update user:", error);
//     }
//   };

//   // Xử lý khi nhấn nút khóa
//   const handleDeactivateUser = (id: number) => {
//     setUserIdToDeactivate(id); // Lưu id người dùng cần khóa
//     setIsDeactivating(true); // Mở dialog xác nhận
//   };

//   // Khóa tài khoản người dùng
//   const deactivateUser = async (id: number | null) => {
//     try {
//       if (id === null) {
//         // Xử lý trường hợp không có ID hợp lệ
//         console.error("Cannot deactivate user without a valid ID");
//         return;
//       }
//       const response = await userApi.deactivateUser(id);
//       console.log("User deactivated:", response);
//       fetchUsers(); // Tải lại danh sách người dùng
//     } catch (error) {
//       console.error("Failed to deactivate user:", error);
//     }
//   };

//   // Tạo người dùng mới
//  // Tạo người dùng mới
// const handleCreateUser = async (userRequest: RegisterRequest | null) => {
//   setIsLoading(true);
//   setError(null);
//   console.log("User creation data:", userRequest);

//   try {
//     if (userRequest) { // Kiểm tra nếu userRequest không phải null
//       const response = await userService.createUser(userRequest);

//       if (response) {
//         setIsSuccess(true);
//         reset();
//         fetchUsers(); // Reload user list
//         setTimeout(() => {
//           closeModal(); // Đóng modal sau khi tạo thành công
//         }, 1000);
//       } else {
//         // Xử lý khi không có phản hồi hoặc có lỗi khi tạo người dùng
//         setError("Tạo người dùng thất bại. Vui lòng thử lại!");
//       }
//     } else {
//       // Nếu userRequest là null, hiển thị lỗi
//       setError("Dữ liệu người dùng không hợp lệ.");
//     }
//   } catch (error) {
//     // Xử lý lỗi nếu gọi API thất bại
//     console.error("Failed to create user:", error);
//     setError("Có lỗi xảy ra khi tạo người dùng.");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // Mở Modal để tạo người dùng hoặc sửa
//   const openModal = (user: User | null) => {
//     if (user) {
//       setSelectedUser(user);
//       // Cập nhật form với dữ liệu người dùng cần sửa
//       setUserData({
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         dateOfBirth: user.dateOfBirth,
//         password: "", // không sửa password ở đây
//         roleIds: Array.from(user.roleIds),
//       });
//     } else {
//       // Trường hợp tạo mới
//       setSelectedUser(null);
//       setUserData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         dateOfBirth: "",
//         password: "",
//         roleIds: [],
//       });
//     }
//     setIsModalOpen(true);
//   };

//   // Đóng Modal sau khi tạo hoặc sửa thành công
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null); // Reset selectedUser khi đóng modal
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
//       <br />
//       {/* Table để hiển thị danh sách người dùng */}
//       <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Id</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Last Name</TableHead>
//             <TableHead>First</TableHead>
//             <TableHead>Date of birth</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Active</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user) => (
//             <TableRow key={user.id}>
//               <TableCell>{user.id}</TableCell>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.lastName}</TableCell>
//               <TableCell>{user.firstName}</TableCell>
//               <TableCell>{user.dateOfBirth}</TableCell>
//               <TableCell>{user.roleIds}</TableCell>
//               <TableCell>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs
//                      ${
//                        user.active
//                          ? "bg-red-100 text-red-800"
//                          : "bg-green-100 text-green-800"
//                      }`}
//                 >
//                   {user.active ? "Không hoạt động" : "Hoạt động"}
//                 </span>
//               </TableCell>
//               <TableCell>

//                 {/* <Button onClick={() => openModal(user)}>Sửa</Button> */}
//                 <Button onClick={() => handleDeactivateUser(user.id)}>
//                   Khóa
//                 </Button>

//                 {/* Nút "Sửa" */}
//                 <Button
//                   onClick={() => {
//                     // Kiểm tra xem selectedUser có phải là null không
//                     if (selectedUser) {
//                       //Chuyển selectedUser thành UserRequest và gọi API sửa
//                       const userRequest: UserRequest = {
//                         firstName: selectedUser.firstName,
//                         lastName: selectedUser.lastName,
//                         email: selectedUser.email,
//                         dateOfBirth: selectedUser.dateOfBirth,
//                         password: "12345678", // Nếu có trường password, cần chắc chắn trường này có trong form
//                         roleIds: Array.from(selectedUser.roleIds), // Chuyển Set thành Array
//                       };
//                       handleUpdateUser(user.id, userRequest); // Gọi API với ID và UserRequest
//                     } else {

//                       console.error("Selected user is null.");
//                     }
//                     openModal(user);
//                   }}
//                 >
//                   Sửa
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Phân trang */}
//       <TablePagination
//         page={searchParams.page}
//         setPage={handlePageChange}
//         size={searchParams.size}
//         setSize={handleSizeChange}
//         totalPages={Math.ceil(totalUsers / searchParams.size)}
//         totalElements={totalUsers}
//         currentPageElements={users.length}
//       />

//       {/* Dialog xác nhận khóa tài khoản */}
//       <Dialog open={isDeactivating} onOpenChange={setIsDeactivating}>
//         <DialogPortal>
//           <DialogOverlay />
//           <DialogContent>
//             <DialogClose></DialogClose>
//             <h2>
//               Bạn có muốn khóa tài khoản có id là: {userIdToDeactivate} không?
//             </h2>
//             <Button
//               onClick={() => {
//                 deactivateUser(userIdToDeactivate);
//                 setIsDeactivating(false);
//               }}
//             >
//               Có
//             </Button>
//             <Button onClick={() => setIsDeactivating(false)}>Không</Button>
//           </DialogContent>
//         </DialogPortal>
//       </Dialog>

//       {/* Modal để tạo/sửa người dùng */}
//       {(selectedUser || isModalOpen) && (
//         <Modal
//           isOpen={isModalOpen}
//           title={selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
//           onClose={closeModal}
//           actions={
//             <>
//               <Button onClick={closeModal}>Đóng</Button>
//             </>
//           }
//         >
//           <form
//            onSubmit={(e) => {
//             e.preventDefault();
//             if (userData === null) {
//               // Xử lý trường hợp userData là null
//               console.error("Dữ liệu người dùng không tồn tại");
//               return;
//             }

//             console.log("Submitting data:", userData);
//             if (selectedUser) {
//               const updateData: UserRequest = {
//                 firstName: userData.firstName,
//                 lastName: userData.lastName,
//                 email: userData.email,
//                 dateOfBirth: userData.dateOfBirth,
//                 password: userData.password,
//                 roleIds: userData.roleIds,
//               };

//               handleUpdateUser(selectedUser.id, updateData);
//             } else {
//               handleCreateUser(userData);
//             }
//           }}
//           >
//             {/* Trường First Name */}
//             <div>
//               <Label htmlFor="firstName">Họ</Label>
//               <Controller
//                 control={control}
//                 name="firstName"
//                 defaultValue={userData?.firstName || ""}
//                 render={({ field }) => (
//                   <Input {...field} id="firstName" placeholder="Nhập họ" />
//                 )}
//               />
//             </div>

//             {/* Trường Last Name */}
//             <div>
//               <Label htmlFor="lastName">Tên</Label>
//               <Controller
//                 control={control}
//                 name="lastName"
//                 defaultValue={userData?.lastName || ""}
//                 render={({ field }) => (
//                   <Input {...field} id="lastName" placeholder="Nhập tên" />
//                 )}
//               />
//             </div>

//             {/* Trường Email */}
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Controller
//                 control={control}
//                 name="email"
//                 defaultValue={userData?.email || ""}
//                 render={({ field }) => (
//                   <Input {...field} id="email" placeholder="Nhập email" />
//                 )}
//               />
//             </div>
//             {/* Trường Ngày Sinh (Date of Birth) */}
//             <div>
//               <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
//               <Controller
//                 control={control}
//                 name="dateOfBirth"
//                 defaultValue={userData?.dateOfBirth || ""} // Nếu không có dateOfBirth, để trống
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     id="dateOfBirth"
//                     type="date"
//                     value={String(field.value)} // Ép kiểu value về string nếu cần
//                   />
//                 )}
//               ></Controller>
//             </div>
//             {/* Trường Password */}
//             <div>
//               <Label htmlFor="password">Password</Label>
//               <Controller
//                 control={control}
//                 name="password"
//                 defaultValue={userData?.password || ""}
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     id="password"
//                     type="password" // Set type là 'password' để ẩn mật khẩu
//                     placeholder="Nhập mật khẩu"
//                   />
//                 )}
//               />
//             </div>

//             <div className="mt-2">
//               <Label htmlFor="roles" className="block mb-2 font-medium">
//                 Vai trò
//               </Label>
//               <Controller
//                 control={control}
//                 name="roleIds"
//                 defaultValue={
//                   userData?.roleIds ? Array.from(userData.roleIds) : [1]
//                 } // Chuyển Set thành mảng
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     multiple // Cho phép chọn nhiều vai trò
//                     className="form-select mt-1 block w-full"
//                     value={Array.from(field.value).map(String)} // Chuyển Set<number> thành string[] cho value
//                     onChange={(e) => {
//                       const selectedOptions = Array.from(
//                         e.target.selectedOptions,
//                         (option) => Number(option.value)
//                       );

//                       // Kiểm tra nếu chọn "Cả 2" (option value="3")
//                       if (selectedOptions.includes(3)) {
//                         selectedOptions.push(1, 2); // Thêm cả 1 và 2 nếu "Cả 2" được chọn
//                         // Loại bỏ giá trị "Cả 2" khỏi lựa chọn
//                         selectedOptions.filter((roleId) => roleId !== 3);
//                       }

//                       // Cập nhật giá trị cho field.value
//                       field.onChange(selectedOptions);
//                     }}
//                   >
//                     <option value="1">Quản lý</option>
//                     <option value="2">Nhân viên</option>
//                     <option value="3">Cả 2</option>{" "}
//                     {/* Chọn "Cả 2" sẽ thêm 1 và 2 */}
//                   </select>
//                 )}
//               />
//             </div>

//             {/* Submit button */}
//             <div className=" p-4  mt-3">
//               <Button type="submit">
//                 {selectedUser ? "Sửa người dùng" : "Tạo người dùng"}{" "}
//               </Button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default UserPage;
import React, { useEffect, useState } from "react";
import { userApi, userService } from "@/services/userService";
import { useForm, Controller } from "react-hook-form";
import { User, UserRequest, RegisterRequest, UserRequestSua } from "@/types/User";
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
      setTotalUsers(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch users:", error);
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
       const formattedDate = user.dateOfBirth ? 
         new Date(user.dateOfBirth).toISOString().split('T')[0] : '';
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
        isActive:true,
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
                    user.active
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.active ? "Không hoạt động" : "Hoạt động"}
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
