// <<<<<<< henry1803
// // // import React, { useEffect, useState } from 'react';
// // // import { User, UserRequest } from '@/types/User'; // Đảm bảo rằng bạn có kiểu dữ liệu User
// // // import { userService } from '@/services/userService';
// // // import {
// // //   Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
// // // } from '@/components/ui/table';
// // // import { TablePagination } from '@/components/TablePagination';
// // // import { Badge } from '@/components/ui/badge';
// // // import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// //
// //
// // // const UserList: React.FC = () => {
// // //   const [users, setUsers] = useState<User[]>([]); // State chứa danh sách người dùng
// // //   const [page, setPage] = useState(0); // Trạng thái trang hiện tại
// // //   const [size, setSize] = useState(10); // Trạng thái số lượng người dùng trên mỗi trang
// // //   const [totalPages, setTotalPages] = useState(0); // Tổng số trang
// // //   const [totalElements, setTotalElements] = useState(0); // Tổng số người dùng
// // //   const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
// // //   const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
// // //   const [firstName, setFirstName] = useState("");
// // //   const [lastName, setLastName] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [dateOfBirth, setDateOfBirth] = useState("");
// // //   const [roles, setRoles] = useState<Set<string>>(new Set()); // Set<string> để lưu các vai trò
// // //   const [active, setActive] = useState(true);
// // //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //
// // //   useEffect(() => {
// // //     const fetchUsers = async () => {
// // //       setIsLoading(true); // Bắt đầu tải dữ liệu
// // //       setError(null); // Reset lỗi khi bắt đầu tải lại dữ liệu
// // //       try {
// // //         const response = await userService.getActiveUsers(page, size); // Gọi API để lấy người dùng
// // //         setUsers(response.data.content); // Cập nhật danh sách người dùng
// // //         setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
// // //         setTotalElements(response.data.totalElements); // Cập nhật tổng số người dùng
// // //       } catch (error) {
// // //         setError('Failed to fetch users'); // Nếu có lỗi, cập nhật thông báo lỗi
// // //       } finally {
// // //         setIsLoading(false); // Dừng tải dữ liệu
// // //       }
// // //     };
// //
// //
// // //   // Khóa tài khoản người dùng
// // //   const deactivateUser = async (userId: number) => {
// // //     try {
// // //       await userService.deactivateUser(userId);
// // //       // Cập nhật lại danh sách sau khi khóa tài khoản
// // //       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
// // //       alert('Người dùng đã bị khóa');
// // //     } catch (error) {
// // //       setError("Failed to deactivate user");
// // //     }
// // //   };
// //
// //
// // //     fetchUsers();
// // //   }, [page, size]); // Chạy lại khi trang hoặc kích thước thay đổi
// //
// // //   const handleCreateUser = async () => {
// // //     const newUser: UserRequest = {
// // //       firstName,
// // //       lastName,
// // //       email,
// // //       password,
// // //       active: true, // Mặc định người dùng mới sẽ được kích hoạt
// // //       dateOfBirth,
// // //       roles,
// // //     };
// //
// // //     try {
// // //       setIsLoading(true);
// // //       const response = await userService.createUser(newUser);
// // //       setIsDialogOpen(true);
// // //       setError(null);
// // //       // Reset form after successful creation
// // //       setFirstName("");
// // //       setLastName("");
// // //       setEmail("");
// // //       setPassword("");
// // //       setDateOfBirth("");
// // //       setRoles(new Set());
// // //     } catch (error) {
// // //       setError("Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại!");
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };
// //
// //
// // //   return (
// // //     <div className="p-4 min-w-[80vw]">
// // //       <h1 className="text-2xl font-bold mb-4">User List</h1>
// //
// // //       {error && (
// // //         <Alert variant="destructive" className="mb-4">
// // //           <AlertTitle>Error</AlertTitle>
// // //           <AlertDescription>{error}</AlertDescription>
// // //         </Alert>
// // //       )}
// //
// // //       {isLoading ? (
// // //         <div className="flex justify-center items-center">Loading...</div> // Hiển thị khi đang tải dữ liệu
// // //       ) : (
// // //         <>
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>User ID</TableHead>
// // //                 <TableHead>First Name</TableHead>
// // //                 <TableHead>Last Name</TableHead>
// // //                 <TableHead>Email</TableHead>
// // //                 <TableHead>Date of Birth</TableHead> {/* Thêm cột Date of Birth */}
// // //                 <TableHead>Roles</TableHead> {/* Thêm cột Roles */}
// // //                 <TableHead>Status</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {users.map((user) => (
// // //                 <TableRow key={user.id}>
// // //                   <TableCell>{user.id}</TableCell>
// // //                   <TableCell>{user.firstName}</TableCell>
// // //                   <TableCell>{user.lastName}</TableCell>
// // //                   <TableCell>{user.email}</TableCell>
// // //                   <TableCell>{new Date(user.dateOfBirth).toLocaleDateString()}</TableCell> {/* Hiển thị Date of Birth */}
// // //                   <TableCell>{user.roles.join(', ')}</TableCell> {/* Hiển thị Roles */}
// //
// // //                   <TableCell>
// // //                     <Badge variant={user.active ? 'default' : 'destructive'}>
// // //                       {user.active ? 'Active' : 'Inactive'}
// // //                     </Badge>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// //
// // //           {/* Phân trang */}
// // //           <TablePagination
// // //             page={page}
// // //             setPage={setPage}
// // //             size={size}
// // //             setSize={setSize}
// // //             totalPages={totalPages}
// // //             totalElements={totalElements}
// // //             currentPageElements={users.length}
// // //           />
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };
// // // export default UserList;
// // import React, { useEffect, useState } from 'react';
// // import { userApi } from '@/services/userService'; // Giả sử userApi có sẵn trong thư mục services
// // import { ApiResponse } from '@/types/ApiResponse';
// // import { User, UserRequest, ListUserActive } from '@/types/User';
// // import { Button } from '@/components/ui/button';
// // import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table';
// // import { Input } from '@/components/ui/input';
// // import Modal from "@/components/ui/Modal";
// // import { Label } from "@/components/ui/label" // Nhập Label nếu chưa có
// // import { TablePagination } from '@/components/TablePagination'; // Phân trang
// // import { Form } from '@/components/ui/form';
// // import { Checkbox } from '@/components/ui/checkbox';
// // import { useForm, Controller } from "react-hook-form"
// // import { Select, SelectItem } from '@/components/ui/select';
// // const UserPage: React.FC = () => {
// //   const { control, handleSubmit, formState: { errors } } = useForm<UserRequest>()
// =======
// // import React, { useEffect, useState } from "react";
// // import { userApi, userService } from "@/services/userService"; // Giả sử userApi có sẵn trong thư mục services

// // import {
// //   User,
// //   UserRequest,
// //   ListUserActive,
// //   RegisterRequest,
// // } from "@/types/User";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Table,
// //   TableHead,
// //   TableBody,
// //   TableRow,
// //   TableCell,
// //   TableHeader,
// // } from "@/components/ui/table";
// // import { Input } from "@/components/ui/input";
// // import Modal from "@/components/ui/Modal";
// // import { Label } from "@/components/ui/label"; // Nhập Label nếu chưa có
// // import { TablePagination } from "@/components/TablePagination"; // Phân trang

// // import { useForm, Controller } from "react-hook-form";
// // import {
// //   Dialog,
// //   DialogClose,
// //   DialogContent,
// //   DialogOverlay,
// //   DialogPortal,
// // } from "@/components/ui/dialog";

// // const UserPage: React.FC = () => {
// //   const { control, handleSubmit, reset } = useForm<RegisterRequest>();
// >>>>>>> main
// //   const [users, setUsers] = useState<User[]>([]); // Lưu trữ danh sách người dùng
// //   const [totalUsers, setTotalUsers] = useState<number>(0); // Tổng số người dùng
// //   const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi fetch dữ liệu
// //   const [searchParams, setSearchParams] = useState({
// <<<<<<< henry1803
// //     page: 0,  // Trang bắt đầu từ 0
// //     size: 10, // Số lượng người dùng mỗi trang
// //     sortBy: 'email',
// //     sortDir: 'asc' as 'asc' | 'desc', // Ép kiểu đúng
// //     isActive: true,
// //   }); // Các tham số tìm kiếm (phân trang, sắp xếp)
// //
// //   const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Mở đóng modal
// //   const [userToEdit, setUserToEdit] = useState<User | null>(null); // Người dùng hiện tại để sửa
// //   // Khởi tạo hook form
// //
// //
// //   // Lấy danh sách người dùng
// //   const fetchUsers = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await userApi.getActiveUsers( searchParams);
// //       setUsers(response.data.content);
// //       setTotalUsers(response.data.totalElements);
// //     } catch (error) {
// //       console.error('Failed to fetch users:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //
// //   // Tạo người dùng mới
// //   const handleCreateUser = async (userRequest: UserRequest) => {
// //     try {
// //       const response = await userApi.create(userRequest);
// //       console.log('User created:', response);
// //       fetchUsers();  // Tải lại danh sách người dùng
// //     } catch (error) {
// //       console.error('Failed to create user:', error);
// //     }
// //   };
// //
// //   // Sửa thông tin người dùng
// //   const handleUpdateUser = async (id: number, userRequest: UserRequest) => {
// //     try {
// //       const response = await userApi.updateUser(id, userRequest);
// //       console.log('User updated:', response);
// //       fetchUsers();  // Tải lại danh sách người dùng
// //     } catch (error) {
// //       console.error('Failed to update user:', error);
// //     }
// //   };
// //
// //   // Khóa tài khoản người dùng
// //   const handleDeactivateUser = async (id: number) => {
// //     try {
// //       const response = await userApi.deactivateUser(id);
// //       console.log('User deactivated:', response);
// //       fetchUsers();  // Tải lại danh sách người dùng
// //     } catch (error) {
// //       console.error('Failed to deactivate user:', error);
// //     }
// //   };
// //
// //   // Sửa đổi trang khi phân trang
// //   const handlePageChange = (page: number) => {
// //     setSearchParams(prev => ({ ...prev, page }));
// //   };
// //
// //   const handleSizeChange = (size: number) => {
// //     setSearchParams(prev => ({ ...prev, size }));
// //   };
// //
// //   // Mở modal để tạo hoặc sửa người dùng
// //   const openModal = (user: User | null) => {
// //     setUserToEdit(user);
// //     setIsModalOpen(true);
// //   };
// //
// //   // Đóng modal
// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //     setUserToEdit(null);
// //   };
// //
// //
// // const onClickHandler = () => {
// //   if (userToEdit) {
// //     // Sửa người dùng
// //     handleUpdateUser(userToEdit.id, {
// //       email: "example@mail.com",
// //
// //       firstName: "John",  // Cập nhật dữ liệu cho firstName
// //       lastName: "Doe",    // Cập nhật dữ liệu cho lastName
// //       password: "newPassword123", // Giả sử muốn chỉnh sửa password
// //       active: true,      // Sử dụng 'active' thay vì 'isActive'
// //       dateOfBirth: "1990-01-01",  // Dùng kiểu String cho dateOfBirth, có thể chuyển thành Date nếu cần
// //       roles: new Set(["admin", "user"]),  // Dùng Set cho roles nếu backend yêu cầu
// //     });
// //   } else {
// //     // Tạo người dùng mới
// //     handleCreateUser({
// //       email: "new@mail.com",
// //
// //       firstName: "Jane",
// //       lastName: "Doe",
// //       password: "newPassword123",
// //       active: true,
// //       dateOfBirth: "1995-06-15",
// //       roles: new Set(["user"]),  // Tạo người dùng mới với role mặc định
// //     });
// //   }
// // };
// //
// //   // useEffect để gọi API khi trang hoặc size thay đổi
// //   useEffect(() => {
// //     fetchUsers();
// //   }, [searchParams.page, searchParams.size]);
// //
// //   return (
// //     <div>
// =======
// //     page: 0, // Trang bắt đầu từ 0
// //     size: 10, // Số lượng người dùng mỗi trang
// //     sortBy: "email",
// //     sortDir: "asc" as "asc" | "desc", // Ép kiểu đúng
// //     isActive: true,
// //   }); // Các tham số tìm kiếm (phân trang, sắp xếp)

// //   // const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Mở đóng modal
// //   // const [userToCreate, setUserToCreate] = useState<RegisterRequest | null>(
// //   //   null
// //   // ); // Người dùng hiện tại để tạo
// //   const [userToEdit, setUserToEdit] = useState<UserRequest | null>(null); // Người dùng hiện tại để sửa
// //   const [isSuccess, setIsSuccess] = useState(false); // State to show success message
// //   const [isLoading, setIsLoading] = useState(false); // Loading state
// //   const [error, setError] = useState<string | null>(null); // Error message if any
// //   const [isModalOpen, setIsModalOpen] = useState(false); // Modal trạng thái
// //   const [isDeactivating, setIsDeactivating] = useState(false); // Dialog khóa tài khoản

// //   const [selectedUser, setSelectedUser] = useState<User | null>(null); // Dùng để lưu thông tin người dùng khi chọn sửa

// //   const [userIdToDeactivate, setUserIdToDeactivate] = useState<number | null>(
// //     null);
// //     // Lưu id của người dùng cần khóa
// //   // const [userToCreate, setUserToCreate] = useState<RegisterRequest>({
// //   //   firstName: "",
// //   //   lastName: "",
// //   //   email: "",
// //   //   dateOfBirth: "",
// //   //   password: "",
// //   //   roleIds: [1],
// //   // });
// //   // làm update user
// //   const [userData, setUserData] = useState<UserRequest|null>({
// //     firstName: "",
// //      lastName: "",
// //      email: "",
// //      dateOfBirth: "",
// //      password: "",
// //      roleIds: [1],
// //   });

// //   // Lấy danh sách người dùng
// //   const fetchUsers = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await userApi.getActiveUsers(searchParams);
// //       setUsers(response.data.content);
// //       setTotalUsers(response.data.totalElements);
// //     } catch (error) {
// //       console.error("Failed to fetch users:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Sửa đổi trang khi phân trang
// //   const handlePageChange = (page: number) => {
// //     setSearchParams((prev) => ({ ...prev, page }));
// //   };

// //   const handleSizeChange = (size: number) => {
// //     setSearchParams((prev) => ({ ...prev, size }));
// //   };

// //   // useEffect để gọi API khi trang hoặc size thay đổi
// //   useEffect(() => {
// //     fetchUsers();
// //   }, [searchParams.page, searchParams.size]);

// //   // Sửa thông tin người dùng
// //   const handleUpdateUser = async (id: number, userRequest: UserRequest) => {
// //     try {
// //       const response = await userApi.updateUser(id, userRequest);
// //       console.log("User updated:", response);
// //       setIsModalOpen(false);
// //       fetchUsers(); // Tải lại danh sách người dùng
// //     } catch (error) {
// //       console.error("Failed to update user:", error);
// //     }
// //   };

// //   // Xử lý khi nhấn nút khóa
// //   const handleDeactivateUser = (id: number) => {
// //     setUserIdToDeactivate(id); // Lưu id người dùng cần khóa
// //     setIsDeactivating(true); // Mở dialog xác nhận
// //   };

// //   // Khóa tài khoản người dùng
// //   const deactivateUser = async (id: number | null) => {
// //     try {
// //       if (id === null) {
// //         // Xử lý trường hợp không có ID hợp lệ
// //         console.error("Cannot deactivate user without a valid ID");
// //         return;
// //       }
// //       const response = await userApi.deactivateUser(id);
// //       console.log("User deactivated:", response);
// //       fetchUsers(); // Tải lại danh sách người dùng
// //     } catch (error) {
// //       console.error("Failed to deactivate user:", error);
// //     }
// //   };

// //   // Tạo người dùng mới
// //  // Tạo người dùng mới
// // const handleCreateUser = async (userRequest: RegisterRequest | null) => {
// //   setIsLoading(true);
// //   setError(null);
// //   console.log("User creation data:", userRequest);

// //   try {
// //     if (userRequest) { // Kiểm tra nếu userRequest không phải null
// //       const response = await userService.createUser(userRequest);

// //       if (response) {
// //         setIsSuccess(true);
// //         reset();
// //         fetchUsers(); // Reload user list
// //         setTimeout(() => {
// //           closeModal(); // Đóng modal sau khi tạo thành công
// //         }, 1000);
// //       } else {
// //         // Xử lý khi không có phản hồi hoặc có lỗi khi tạo người dùng
// //         setError("Tạo người dùng thất bại. Vui lòng thử lại!");
// //       }
// //     } else {
// //       // Nếu userRequest là null, hiển thị lỗi
// //       setError("Dữ liệu người dùng không hợp lệ.");
// //     }
// //   } catch (error) {
// //     // Xử lý lỗi nếu gọi API thất bại
// //     console.error("Failed to create user:", error);
// //     setError("Có lỗi xảy ra khi tạo người dùng.");
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

// //   // Mở Modal để tạo người dùng hoặc sửa
// //   const openModal = (user: User | null) => {
// //     if (user) {
// //       setSelectedUser(user);
// //       // Cập nhật form với dữ liệu người dùng cần sửa
// //       setUserData({
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         email: user.email,
// //         dateOfBirth: user.dateOfBirth,
// //         password: "", // không sửa password ở đây
// //         roleIds: Array.from(user.roleIds),
// //       });
// //     } else {
// //       // Trường hợp tạo mới
// //       setSelectedUser(null);
// //       setUserData({
// //         firstName: "",
// //         lastName: "",
// //         email: "",
// //         dateOfBirth: "",
// //         password: "",
// //         roleIds: [],
// //       });
// //     }
// //     setIsModalOpen(true);
// //   };

// //   // Đóng Modal sau khi tạo hoặc sửa thành công
// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //     setSelectedUser(null); // Reset selectedUser khi đóng modal
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
// //       <br />
// //       {/* Table để hiển thị danh sách người dùng */}
// >>>>>>> main
// //       <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>
// //       <Table>
// //         <TableHeader>
// //           <TableRow>
// <<<<<<< henry1803
// //           <TableHead>Id</TableHead>
// =======
// //             <TableHead>Id</TableHead>
// >>>>>>> main
// //             <TableHead>Email</TableHead>
// //             <TableHead>Last Name</TableHead>
// //             <TableHead>First</TableHead>
// //             <TableHead>Date of birth</TableHead>
// <<<<<<< henry1803
// //             <TableHead>Active</TableHead>
// //             <TableHead>Role</TableHead>
// =======
// //             <TableHead>Role</TableHead>
// //             <TableHead>Active</TableHead>
// >>>>>>> main
// //             <TableHead>Actions</TableHead>
// //           </TableRow>
// //         </TableHeader>
// //         <TableBody>
// <<<<<<< henry1803
// //           {users.map(user => (
// //             <TableRow key={user.id}>
// //                 <TableCell>{user.id}</TableCell>
// =======
// //           {users.map((user) => (
// //             <TableRow key={user.id}>
// //               <TableCell>{user.id}</TableCell>
// >>>>>>> main
// //               <TableCell>{user.email}</TableCell>
// //               <TableCell>{user.lastName}</TableCell>
// //               <TableCell>{user.firstName}</TableCell>
// //               <TableCell>{user.dateOfBirth}</TableCell>
// <<<<<<< henry1803
// //               <TableCell>{user.roles}</TableCell>
// //               <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
// //               <TableCell>
// //                 <Button onClick={() => openModal(user)}>Sửa</Button>
// //                 <Button onClick={() => handleDeactivateUser(user.id)}>Khóa</Button>
// =======
// //               <TableCell>{user.roleIds}</TableCell>
// //               <TableCell>
// //                 <span
// //                   className={`px-3 py-1 rounded-full text-xs
// //                      ${
// //                        user.active
// //                          ? "bg-red-100 text-red-800"
// //                          : "bg-green-100 text-green-800"
// //                      }`}
// //                 >
// //                   {user.active ? "Không hoạt động" : "Hoạt động"}
// //                 </span>
// //               </TableCell>
// //               <TableCell>

// //                 {/* <Button onClick={() => openModal(user)}>Sửa</Button> */}
// //                 <Button onClick={() => handleDeactivateUser(user.id)}>
// //                   Khóa
// //                 </Button>

// //                 {/* Nút "Sửa" */}
// //                 <Button
// //                   onClick={() => {
// //                     // Kiểm tra xem selectedUser có phải là null không
// //                     if (selectedUser) {
// //                       //Chuyển selectedUser thành UserRequest và gọi API sửa
// //                       const userRequest: UserRequest = {
// //                         firstName: selectedUser.firstName,
// //                         lastName: selectedUser.lastName,
// //                         email: selectedUser.email,
// //                         dateOfBirth: selectedUser.dateOfBirth,
// //                         password: "12345678", // Nếu có trường password, cần chắc chắn trường này có trong form
// //                         roleIds: Array.from(selectedUser.roleIds), // Chuyển Set thành Array
// //                       };
// //                       handleUpdateUser(user.id, userRequest); // Gọi API với ID và UserRequest
// //                     } else {

// //                       console.error("Selected user is null.");
// //                     }
// //                     openModal(user);
// //                   }}
// //                 >
// //                   Sửa
// //                 </Button>
// >>>>>>> main
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>
// <<<<<<< henry1803
// //
// =======

// >>>>>>> main
// //       {/* Phân trang */}
// //       <TablePagination
// //         page={searchParams.page}
// //         setPage={handlePageChange}
// //         size={searchParams.size}
// //         setSize={handleSizeChange}
// //         totalPages={Math.ceil(totalUsers / searchParams.size)}
// //         totalElements={totalUsers}
// //         currentPageElements={users.length}
// //       />
// <<<<<<< henry1803
// //
// //       {/* Modal để tạo/sửa người dùng */}
// //       {isModalOpen && (
// //   <Modal
// //     title={userToEdit ? 'Sửa Người Dùng' : 'Tạo Người Dùng'}
// //     onClose={closeModal}
// //     actions={
// //       <>
// //         <Button onClick={closeModal}>Đóng</Button>
// //
// //       </>
// //     }
// //   >
// //     <form onSubmit={handleSubmit((data) =>
// //       userToEdit
// //         ? handleUpdateUser(userToEdit.id, data) // Sửa người dùng
// //         : handleCreateUser(data) // Tạo người dùng mới
// //     )}>
// //       {/* Trường First Name */}
// //       <div>
// //         <Label htmlFor="firstName">Họ</Label>
// //         <Controller
// //           control={control}
// //           name="firstName"
// //           defaultValue={userToEdit?.firstName || ''}
// //           render={({ field }) => <Input {...field} id="firstName" placeholder="Nhập họ" />}
// //         />
// //       </div>
// //
// //       {/* Trường Last Name */}
// //       <div>
// //         <Label htmlFor="lastName">Tên</Label>
// //         <Controller
// //           control={control}
// //           name="lastName"
// //           defaultValue={userToEdit?.lastName || ''}
// //           render={({ field }) => <Input {...field} id="lastName" placeholder="Nhập tên" />}
// //         />
// //       </div>
// //
// //       {/* Trường Email */}
// //       <div>
// //         <Label htmlFor="email">Email</Label>
// //         <Controller
// //           control={control}
// //           name="email"
// //           defaultValue={userToEdit?.email || ''}
// //           render={({ field }) => <Input {...field} id="email" placeholder="Nhập email" />}
// //         />
// //       </div>
// //      {/* Trường Ngày Sinh (Date of Birth) */}
// //      <div>
// //       <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
// //       <Controller
// //         control={control}
// //         name="dateOfBirth"
// //         defaultValue={userToEdit?.dateOfBirth || ''}
// //         render={({ field }) => <Input {...field} id="dateOfBirth" type="date" />}
// //       />
// //     </div>
// //
// //      {/* Trường Roles */}
// //      <div>
// //       <Label htmlFor="roles">Vai trò</Label>
// //       <Controller
// //         control={control}
// //         name="roles"
// //         defaultValue={userToEdit?.roles ? new Set(userToEdit.roles) : new Set()}  // Chuyển roles thành Set<string>
// //         render={({ field }) => (
// //           <>
// //             <Checkbox
// //               id="manageRole"
// //               label="Quản lý"
// //               value="manage"
// //               checked={field.value.has('manage')}
// //               onChange={() => {
// //                 const newRoles = new Set(field.value);
// //                 if (newRoles.has('manage')) {
// //                   newRoles.delete('manage');
// //                 } else {
// //                   newRoles.add('manage');
// //                 }
// //                 field.onChange(newRoles);
// //               }}
// //             />
// //             <Checkbox
// //               id="userRole"
// //               label="Người dùng"
// //               value="user"
// //               checked={field.value.has('user')}
// //               onChange={() => {
// //                 const newRoles = new Set(field.value);
// //                 if (newRoles.has('user')) {
// //                   newRoles.delete('user');
// //                 } else {
// //                   newRoles.add('user');
// //                 }
// //                 field.onChange(newRoles);
// //               }}
// //             />
// //           </>
// //         )}
// //       />
// //     </div>
// //       {/* Checkbox - Hoạt động */}
// //       <div>
// //         <Label htmlFor="active">Hoạt động</Label>
// //         <Controller
// //           control={control}
// //           name="active"
// //           defaultValue={userToEdit?.active || false}
// //           render={({ field }) => (
// //             <Checkbox
// //               id="active"
// //               checked={field.value}  // Dùng checked thay vì value
// //               onChange={() => field.onChange(!field.value)}  // Đảo ngược giá trị khi thay đổi
// //             />
// //           )}
// //         />
// //       </div>
// //
// //       {/* Submit button */}
// //       <Button type="submit">{userToEdit ? 'Lưu Sửa' : 'Tạo Mới'}</Button>
// //     </form>
// //   </Modal>
// // )}
// //
// //
// //     </div>
// //   );
// // };
// //
// // export default UserPage;
// //
// =======

// //       {/* Dialog xác nhận khóa tài khoản */}
// //       <Dialog open={isDeactivating} onOpenChange={setIsDeactivating}>
// //         <DialogPortal>
// //           <DialogOverlay />
// //           <DialogContent>
// //             <DialogClose></DialogClose>
// //             <h2>
// //               Bạn có muốn khóa tài khoản có id là: {userIdToDeactivate} không?
// //             </h2>
// //             <Button
// //               onClick={() => {
// //                 deactivateUser(userIdToDeactivate);
// //                 setIsDeactivating(false);
// //               }}
// //             >
// //               Có
// //             </Button>
// //             <Button onClick={() => setIsDeactivating(false)}>Không</Button>
// //           </DialogContent>
// //         </DialogPortal>
// //       </Dialog>

// //       {/* Modal để tạo/sửa người dùng */}
// //       {(selectedUser || isModalOpen) && (
// //         <Modal
// //           isOpen={isModalOpen}
// //           title={selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
// //           onClose={closeModal}
// //           actions={
// //             <>
// //               <Button onClick={closeModal}>Đóng</Button>
// //             </>
// //           }
// //         >
// //           <form
// //            onSubmit={(e) => {
// //             e.preventDefault();
// //             if (userData === null) {
// //               // Xử lý trường hợp userData là null
// //               console.error("Dữ liệu người dùng không tồn tại");
// //               return;
// //             }

// //             console.log("Submitting data:", userData);
// //             if (selectedUser) {
// //               const updateData: UserRequest = {
// //                 firstName: userData.firstName,
// //                 lastName: userData.lastName,
// //                 email: userData.email,
// //                 dateOfBirth: userData.dateOfBirth,
// //                 password: userData.password,
// //                 roleIds: userData.roleIds,
// //               };

// //               handleUpdateUser(selectedUser.id, updateData);
// //             } else {
// //               handleCreateUser(userData);
// //             }
// //           }}
// //           >
// //             {/* Trường First Name */}
// //             <div>
// //               <Label htmlFor="firstName">Họ</Label>
// //               <Controller
// //                 control={control}
// //                 name="firstName"
// //                 defaultValue={userData?.firstName || ""}
// //                 render={({ field }) => (
// //                   <Input {...field} id="firstName" placeholder="Nhập họ" />
// //                 )}
// //               />
// //             </div>

// //             {/* Trường Last Name */}
// //             <div>
// //               <Label htmlFor="lastName">Tên</Label>
// //               <Controller
// //                 control={control}
// //                 name="lastName"
// //                 defaultValue={userData?.lastName || ""}
// //                 render={({ field }) => (
// //                   <Input {...field} id="lastName" placeholder="Nhập tên" />
// //                 )}
// //               />
// //             </div>

// //             {/* Trường Email */}
// //             <div>
// //               <Label htmlFor="email">Email</Label>
// //               <Controller
// //                 control={control}
// //                 name="email"
// //                 defaultValue={userData?.email || ""}
// //                 render={({ field }) => (
// //                   <Input {...field} id="email" placeholder="Nhập email" />
// //                 )}
// //               />
// //             </div>
// //             {/* Trường Ngày Sinh (Date of Birth) */}
// //             <div>
// //               <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
// //               <Controller
// //                 control={control}
// //                 name="dateOfBirth"
// //                 defaultValue={userData?.dateOfBirth || ""} // Nếu không có dateOfBirth, để trống
// //                 render={({ field }) => (
// //                   <Input
// //                     {...field}
// //                     id="dateOfBirth"
// //                     type="date"
// //                     value={String(field.value)} // Ép kiểu value về string nếu cần
// //                   />
// //                 )}
// //               ></Controller>
// //             </div>
// //             {/* Trường Password */}
// //             <div>
// //               <Label htmlFor="password">Password</Label>
// //               <Controller
// //                 control={control}
// //                 name="password"
// //                 defaultValue={userData?.password || ""}
// //                 render={({ field }) => (
// //                   <Input
// //                     {...field}
// //                     id="password"
// //                     type="password" // Set type là 'password' để ẩn mật khẩu
// //                     placeholder="Nhập mật khẩu"
// //                   />
// //                 )}
// //               />
// //             </div>

// //             <div className="mt-2">
// //               <Label htmlFor="roles" className="block mb-2 font-medium">
// //                 Vai trò
// //               </Label>
// //               <Controller
// //                 control={control}
// //                 name="roleIds"
// //                 defaultValue={
// //                   userData?.roleIds ? Array.from(userData.roleIds) : [1]
// //                 } // Chuyển Set thành mảng
// //                 render={({ field }) => (
// //                   <select
// //                     {...field}
// //                     multiple // Cho phép chọn nhiều vai trò
// //                     className="form-select mt-1 block w-full"
// //                     value={Array.from(field.value).map(String)} // Chuyển Set<number> thành string[] cho value
// //                     onChange={(e) => {
// //                       const selectedOptions = Array.from(
// //                         e.target.selectedOptions,
// //                         (option) => Number(option.value)
// //                       );

// //                       // Kiểm tra nếu chọn "Cả 2" (option value="3")
// //                       if (selectedOptions.includes(3)) {
// //                         selectedOptions.push(1, 2); // Thêm cả 1 và 2 nếu "Cả 2" được chọn
// //                         // Loại bỏ giá trị "Cả 2" khỏi lựa chọn
// //                         selectedOptions.filter((roleId) => roleId !== 3);
// //                       }

// //                       // Cập nhật giá trị cho field.value
// //                       field.onChange(selectedOptions);
// //                     }}
// //                   >
// //                     <option value="1">Quản lý</option>
// //                     <option value="2">Nhân viên</option>
// //                     <option value="3">Cả 2</option>{" "}
// //                     {/* Chọn "Cả 2" sẽ thêm 1 và 2 */}
// //                   </select>
// //                 )}
// //               />
// //             </div>

// //             {/* Submit button */}
// //             <div className=" p-4  mt-3">
// //               <Button type="submit">
// //                 {selectedUser ? "Sửa người dùng" : "Tạo người dùng"}{" "}
// //               </Button>
// //             </div>
// //           </form>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserPage;
// import React, { useEffect, useState } from "react";
// import { userApi, userService } from "@/services/userService";
// import { useForm, Controller } from "react-hook-form";
// import { User, UserRequest, RegisterRequest, UserRequestSua } from "@/types/User";
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
// import { Label } from "@/components/ui/label";
// import { TablePagination } from "@/components/TablePagination";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogOverlay,
//   DialogPortal,
// } from "@/components/ui/dialog";

// const UserPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeactivating, setIsDeactivating] = useState(false);
//   const [userIdToDeactivate, setUserIdToDeactivate] = useState<number | null>(
//     null
//   );
//   const [searchParams, setSearchParams] = useState({
//     page: 0,
//     size: 10,
//     sortBy: "email",
//     sortDir: "asc" as "asc" | "desc",
//     isActive: true,
//   });

//   // Form for both create and update
//   const { control, handleSubmit, reset, setValue } = useForm<RegisterRequest>({
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       dateOfBirth: "",
//       password: "",
//       roleIds: [1],
//     },
//   });

//   // Fetch users
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

//   // Pagination handlers
//   const handlePageChange = (page: number) => {
//     setSearchParams((prev) => ({ ...prev, page }));
//   };

//   const handleSizeChange = (size: number) => {
//     setSearchParams((prev) => ({ ...prev, size }));
//   };

//   // Fetch users on page or size change
//   useEffect(() => {
//     fetchUsers();
//   }, [searchParams.page, searchParams.size]);

//   // Open modal for create or edit
//   const openModal = (user: User | null) => {
//     if (user) {
//        // Edit mode
//        setSelectedUser(user);
//        setValue("firstName", user.firstName);
//        setValue("lastName", user.lastName);
//        setValue("email", user.email);
//        // Convert dateOfBirth to YYYY-MM-DD format
//        const formattedDate = user.dateOfBirth ? 
//          new Date(user.dateOfBirth).toISOString().split('T')[0] : '';
//        setValue("dateOfBirth", formattedDate);
//        setValue("roleIds", Array.from(user.roleIds));
//        setValue("password", ""); // Clear password field for edit
//     } else {
//       // Create mode
//       setSelectedUser(null);
//       reset(); // Reset form to default values
//     }
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//     reset();
//   };

//   // Create user handler
//   const handleCreateUser = async (data: RegisterRequest) => {
//     try {
//       const response = await userService.createUser(data);
//       if (response) {
//         fetchUsers();
//         closeModal();
//       }
//     } catch (error) {
//       console.error("Failed to create user:", error);
//     }
//   };

//   // Update user handler
//   const handleUpdateUser = async (data: RegisterRequest) => {
//     if (!selectedUser) return;

//     try {
//       const updateData: UserRequestSua = {
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         dateOfBirth: data.dateOfBirth,
//         isActive:true,
//         password: data.password, // Always include password for backend
//         roleIds: data.roleIds,
//       };

//       const response = await userService.updateUser(
//         selectedUser.id,
//         updateData
//       );
//       if (response) {
//         fetchUsers();
//         closeModal();
//       }
//     } catch (error) {
//       console.error("Failed to update user:", error);
//     }
//   };

//   // Deactivate user handler
//   const handleDeactivateUser = (id: number) => {
//     setUserIdToDeactivate(id);
//     setIsDeactivating(true);
//   };

//   const deactivateUser = async (id: number | null) => {
//     if (id === null) return;

//     try {
//       await userApi.deactivateUser(id);
//       fetchUsers();
//       setIsDeactivating(false);
//     } catch (error) {
//       console.error("Failed to deactivate user:", error);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
//       <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Id</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Last Name</TableHead>
//             <TableHead>First Name</TableHead>
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
//               <TableCell>
//                 {
//                   Array.from(user.roleIds) // Chuyển Set thành mảng
//                     .map((roleId) => {
//                       if (roleId === 1) return "Quản lý";
//                       if (roleId === 2) return "Nhân viên";
//                       return null; // Trường hợp roleId khác
//                     })
//                     .filter(Boolean) // Loại bỏ giá trị null
//                     .join(" - ") // Nối các vai trò bằng dấu "-".
//                 }
//               </TableCell>

//               <TableCell>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs ${
//                     user.active
//                       ? "bg-red-100 text-red-800"
//                       : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {user.active ? "Không hoạt động" : "Hoạt động"}
//                 </span>
//               </TableCell>
//               <TableCell>
//                 <Button onClick={() => handleDeactivateUser(user.id)}>
//                   Khóa
//                 </Button>
//                 <Button onClick={() => openModal(user)}>Sửa</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <TablePagination
//         page={searchParams.page}
//         setPage={handlePageChange}
//         size={searchParams.size}
//         setSize={handleSizeChange}
//         totalPages={Math.ceil(totalUsers / searchParams.size)}
//         totalElements={totalUsers}
//         currentPageElements={users.length}
//       />

//       {/* Deactivate Confirmation Dialog */}
//       <Dialog open={isDeactivating} onOpenChange={setIsDeactivating}>
//         <DialogPortal>
//           <DialogOverlay />
//           <DialogContent>
//             <DialogClose></DialogClose>
//             <h2>
//               Bạn có muốn khóa tài khoản có id là: {userIdToDeactivate} không?
//             </h2>
//             <Button
//               onClick={() => {
//                 deactivateUser(userIdToDeactivate);
//               }}
//             >
//               Có
//             </Button>
//             <Button onClick={() => setIsDeactivating(false)}>Không</Button>
//           </DialogContent>
//         </DialogPortal>
//       </Dialog>

//       {/* Create/Edit User Modal */}
//       {isModalOpen && (
//         <Modal
//           isOpen={isModalOpen}
//           title={selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
//           onClose={closeModal}
//           actions={
//             <>
//               <Button onClick={closeModal}>Đóng</Button>
//             </>
//           }
//         >
//           <form
//             onSubmit={handleSubmit(
//               selectedUser ? handleUpdateUser : handleCreateUser
//             )}
//           >
//             {/* First Name */}
//             <div className="mb-4">
//               <Label htmlFor="firstName">Họ</Label>
//               <Controller
//                 control={control}
//                 name="firstName"
//                 render={({ field }) => (
//                   <Input {...field} id="firstName" placeholder="Nhập họ" />
//                 )}
//               />
//             </div>

//             {/* Last Name */}
//             <div className="mb-4">
//               <Label htmlFor="lastName">Tên</Label>
//               <Controller
//                 control={control}
//                 name="lastName"
//                 render={({ field }) => (
//                   <Input {...field} id="lastName" placeholder="Nhập tên" />
//                 )}
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <Label htmlFor="email">Email</Label>
//               <Controller
//                 control={control}
//                 name="email"
//                 render={({ field }) => (
//                   <Input {...field} id="email" placeholder="Nhập email" />
//                 )}
//               />
//             </div>

//             {/* Date of Birth */}
//             <div className="mb-4">
//               <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
//               <Controller
//                 control={control}
//                 name="dateOfBirth"
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     id="dateOfBirth"
//                     type="date"
//                     value={String(field.value)} // Ép kiểu value về string nếu cần
//                   />
//                 )}
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <Label htmlFor="password">
//                 {selectedUser ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
//               </Label>
//               <Controller
//                 control={control}
//                 name="password"
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     id="password"
//                     type="password"
//                     placeholder={
//                       selectedUser
//                         ? "Để trống nếu không muốn thay đổi"
//                         : "Nhập mật khẩu"
//                     }
//                   />
//                 )}
//               />
//             </div>

//             {/* Roles */}
//             <div className="mb-4">
//               <Label htmlFor="roleIds" className="block mb-2 font-medium">
//                 Vai trò
//               </Label>
//               <Controller
//                 control={control}
//                 name="roleIds"
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     multiple
//                     className="form-select mt-1 block w-full"
//                     value={field.value.map(String)}
//                     onChange={(e) => {
//                       const selectedOptions = Array.from(
//                         e.target.selectedOptions,
//                         (option) => Number(option.value)
//                       );

//                       // Handle special case for "Cả 2"
//                       if (selectedOptions.includes(3)) {
//                         field.onChange([1, 2]);
//                       } else {
//                         field.onChange(selectedOptions);
//                       }
//                     }}
//                   >
//                     <option value="1">Quản lý</option>
//                     <option value="2">Nhân viên</option>
//                     <option value="3">Cả 2</option>
//                   </select>
//                 )}
//               />
//             </div>

//             {/* Submit button */}
//             <Button type="submit" className="w-full mt-4">
//               {selectedUser ? "Sửa người dùng" : "Tạo người dùng"}
//             </Button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default UserPage;
// >>>>>>> main
