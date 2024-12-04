// // import React, { useEffect, useState } from 'react';
// // import { User, UserRequest } from '@/types/User'; // Đảm bảo rằng bạn có kiểu dữ liệu User
// // import { userService } from '@/services/userService';
// // import {
// //   Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
// // } from '@/components/ui/table';
// // import { TablePagination } from '@/components/TablePagination';
// // import { Badge } from '@/components/ui/badge';
// // import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
//
//
// // const UserList: React.FC = () => {
// //   const [users, setUsers] = useState<User[]>([]); // State chứa danh sách người dùng
// //   const [page, setPage] = useState(0); // Trạng thái trang hiện tại
// //   const [size, setSize] = useState(10); // Trạng thái số lượng người dùng trên mỗi trang
// //   const [totalPages, setTotalPages] = useState(0); // Tổng số trang
// //   const [totalElements, setTotalElements] = useState(0); // Tổng số người dùng
// //   const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
// //   const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
// //   const [firstName, setFirstName] = useState("");
// //   const [lastName, setLastName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [dateOfBirth, setDateOfBirth] = useState("");
// //   const [roles, setRoles] = useState<Set<string>>(new Set()); // Set<string> để lưu các vai trò
// //   const [active, setActive] = useState(true);
// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
//
// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       setIsLoading(true); // Bắt đầu tải dữ liệu
// //       setError(null); // Reset lỗi khi bắt đầu tải lại dữ liệu
// //       try {
// //         const response = await userService.getActiveUsers(page, size); // Gọi API để lấy người dùng
// //         setUsers(response.data.content); // Cập nhật danh sách người dùng
// //         setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
// //         setTotalElements(response.data.totalElements); // Cập nhật tổng số người dùng
// //       } catch (error) {
// //         setError('Failed to fetch users'); // Nếu có lỗi, cập nhật thông báo lỗi
// //       } finally {
// //         setIsLoading(false); // Dừng tải dữ liệu
// //       }
// //     };
//
//
// //   // Khóa tài khoản người dùng
// //   const deactivateUser = async (userId: number) => {
// //     try {
// //       await userService.deactivateUser(userId);
// //       // Cập nhật lại danh sách sau khi khóa tài khoản
// //       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
// //       alert('Người dùng đã bị khóa');
// //     } catch (error) {
// //       setError("Failed to deactivate user");
// //     }
// //   };
//
//
// //     fetchUsers();
// //   }, [page, size]); // Chạy lại khi trang hoặc kích thước thay đổi
//
// //   const handleCreateUser = async () => {
// //     const newUser: UserRequest = {
// //       firstName,
// //       lastName,
// //       email,
// //       password,
// //       active: true, // Mặc định người dùng mới sẽ được kích hoạt
// //       dateOfBirth,
// //       roles,
// //     };
//
// //     try {
// //       setIsLoading(true);
// //       const response = await userService.createUser(newUser);
// //       setIsDialogOpen(true);
// //       setError(null);
// //       // Reset form after successful creation
// //       setFirstName("");
// //       setLastName("");
// //       setEmail("");
// //       setPassword("");
// //       setDateOfBirth("");
// //       setRoles(new Set());
// //     } catch (error) {
// //       setError("Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại!");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
//
//
// //   return (
// //     <div className="p-4 min-w-[80vw]">
// //       <h1 className="text-2xl font-bold mb-4">User List</h1>
//
// //       {error && (
// //         <Alert variant="destructive" className="mb-4">
// //           <AlertTitle>Error</AlertTitle>
// //           <AlertDescription>{error}</AlertDescription>
// //         </Alert>
// //       )}
//
// //       {isLoading ? (
// //         <div className="flex justify-center items-center">Loading...</div> // Hiển thị khi đang tải dữ liệu
// //       ) : (
// //         <>
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>User ID</TableHead>
// //                 <TableHead>First Name</TableHead>
// //                 <TableHead>Last Name</TableHead>
// //                 <TableHead>Email</TableHead>
// //                 <TableHead>Date of Birth</TableHead> {/* Thêm cột Date of Birth */}
// //                 <TableHead>Roles</TableHead> {/* Thêm cột Roles */}
// //                 <TableHead>Status</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {users.map((user) => (
// //                 <TableRow key={user.id}>
// //                   <TableCell>{user.id}</TableCell>
// //                   <TableCell>{user.firstName}</TableCell>
// //                   <TableCell>{user.lastName}</TableCell>
// //                   <TableCell>{user.email}</TableCell>
// //                   <TableCell>{new Date(user.dateOfBirth).toLocaleDateString()}</TableCell> {/* Hiển thị Date of Birth */}
// //                   <TableCell>{user.roles.join(', ')}</TableCell> {/* Hiển thị Roles */}
//
// //                   <TableCell>
// //                     <Badge variant={user.active ? 'default' : 'destructive'}>
// //                       {user.active ? 'Active' : 'Inactive'}
// //                     </Badge>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
//
// //           {/* Phân trang */}
// //           <TablePagination
// //             page={page}
// //             setPage={setPage}
// //             size={size}
// //             setSize={setSize}
// //             totalPages={totalPages}
// //             totalElements={totalElements}
// //             currentPageElements={users.length}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };
// // export default UserList;
// import React, { useEffect, useState } from 'react';
// import { userApi } from '@/services/userService'; // Giả sử userApi có sẵn trong thư mục services
// import { ApiResponse } from '@/types/ApiResponse';
// import { User, UserRequest, ListUserActive } from '@/types/User';
// import { Button } from '@/components/ui/button';
// import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import Modal from "@/components/ui/Modal";
// import { Label } from "@/components/ui/label" // Nhập Label nếu chưa có
// import { TablePagination } from '@/components/TablePagination'; // Phân trang
// import { Form } from '@/components/ui/form';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useForm, Controller } from "react-hook-form"
// import { Select, SelectItem } from '@/components/ui/select';
// const UserPage: React.FC = () => {
//   const { control, handleSubmit, formState: { errors } } = useForm<UserRequest>()
//   const [users, setUsers] = useState<User[]>([]); // Lưu trữ danh sách người dùng
//   const [totalUsers, setTotalUsers] = useState<number>(0); // Tổng số người dùng
//   const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi fetch dữ liệu
//   const [searchParams, setSearchParams] = useState({
//     page: 0,  // Trang bắt đầu từ 0
//     size: 10, // Số lượng người dùng mỗi trang
//     sortBy: 'email',
//     sortDir: 'asc' as 'asc' | 'desc', // Ép kiểu đúng
//     isActive: true,
//   }); // Các tham số tìm kiếm (phân trang, sắp xếp)
//
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Mở đóng modal
//   const [userToEdit, setUserToEdit] = useState<User | null>(null); // Người dùng hiện tại để sửa
//   // Khởi tạo hook form
//
//
//   // Lấy danh sách người dùng
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await userApi.getActiveUsers( searchParams);
//       setUsers(response.data.content);
//       setTotalUsers(response.data.totalElements);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Tạo người dùng mới
//   const handleCreateUser = async (userRequest: UserRequest) => {
//     try {
//       const response = await userApi.create(userRequest);
//       console.log('User created:', response);
//       fetchUsers();  // Tải lại danh sách người dùng
//     } catch (error) {
//       console.error('Failed to create user:', error);
//     }
//   };
//
//   // Sửa thông tin người dùng
//   const handleUpdateUser = async (id: number, userRequest: UserRequest) => {
//     try {
//       const response = await userApi.updateUser(id, userRequest);
//       console.log('User updated:', response);
//       fetchUsers();  // Tải lại danh sách người dùng
//     } catch (error) {
//       console.error('Failed to update user:', error);
//     }
//   };
//
//   // Khóa tài khoản người dùng
//   const handleDeactivateUser = async (id: number) => {
//     try {
//       const response = await userApi.deactivateUser(id);
//       console.log('User deactivated:', response);
//       fetchUsers();  // Tải lại danh sách người dùng
//     } catch (error) {
//       console.error('Failed to deactivate user:', error);
//     }
//   };
//
//   // Sửa đổi trang khi phân trang
//   const handlePageChange = (page: number) => {
//     setSearchParams(prev => ({ ...prev, page }));
//   };
//
//   const handleSizeChange = (size: number) => {
//     setSearchParams(prev => ({ ...prev, size }));
//   };
//
//   // Mở modal để tạo hoặc sửa người dùng
//   const openModal = (user: User | null) => {
//     setUserToEdit(user);
//     setIsModalOpen(true);
//   };
//
//   // Đóng modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setUserToEdit(null);
//   };
//
//
// const onClickHandler = () => {
//   if (userToEdit) {
//     // Sửa người dùng
//     handleUpdateUser(userToEdit.id, {
//       email: "example@mail.com",
//
//       firstName: "John",  // Cập nhật dữ liệu cho firstName
//       lastName: "Doe",    // Cập nhật dữ liệu cho lastName
//       password: "newPassword123", // Giả sử muốn chỉnh sửa password
//       active: true,      // Sử dụng 'active' thay vì 'isActive'
//       dateOfBirth: "1990-01-01",  // Dùng kiểu String cho dateOfBirth, có thể chuyển thành Date nếu cần
//       roles: new Set(["admin", "user"]),  // Dùng Set cho roles nếu backend yêu cầu
//     });
//   } else {
//     // Tạo người dùng mới
//     handleCreateUser({
//       email: "new@mail.com",
//
//       firstName: "Jane",
//       lastName: "Doe",
//       password: "newPassword123",
//       active: true,
//       dateOfBirth: "1995-06-15",
//       roles: new Set(["user"]),  // Tạo người dùng mới với role mặc định
//     });
//   }
// };
//
//   // useEffect để gọi API khi trang hoặc size thay đổi
//   useEffect(() => {
//     fetchUsers();
//   }, [searchParams.page, searchParams.size]);
//
//   return (
//     <div>
//       <Button onClick={() => openModal(null)}>Tạo Người Dùng</Button>
//       <Table>
//         <TableHeader>
//           <TableRow>
//           <TableHead>Id</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Last Name</TableHead>
//             <TableHead>First</TableHead>
//             <TableHead>Date of birth</TableHead>
//             <TableHead>Active</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map(user => (
//             <TableRow key={user.id}>
//                 <TableCell>{user.id}</TableCell>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.lastName}</TableCell>
//               <TableCell>{user.firstName}</TableCell>
//               <TableCell>{user.dateOfBirth}</TableCell>
//               <TableCell>{user.roles}</TableCell>
//               <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
//               <TableCell>
//                 <Button onClick={() => openModal(user)}>Sửa</Button>
//                 <Button onClick={() => handleDeactivateUser(user.id)}>Khóa</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//
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
//
//       {/* Modal để tạo/sửa người dùng */}
//       {isModalOpen && (
//   <Modal
//     title={userToEdit ? 'Sửa Người Dùng' : 'Tạo Người Dùng'}
//     onClose={closeModal}
//     actions={
//       <>
//         <Button onClick={closeModal}>Đóng</Button>
//
//       </>
//     }
//   >
//     <form onSubmit={handleSubmit((data) =>
//       userToEdit
//         ? handleUpdateUser(userToEdit.id, data) // Sửa người dùng
//         : handleCreateUser(data) // Tạo người dùng mới
//     )}>
//       {/* Trường First Name */}
//       <div>
//         <Label htmlFor="firstName">Họ</Label>
//         <Controller
//           control={control}
//           name="firstName"
//           defaultValue={userToEdit?.firstName || ''}
//           render={({ field }) => <Input {...field} id="firstName" placeholder="Nhập họ" />}
//         />
//       </div>
//
//       {/* Trường Last Name */}
//       <div>
//         <Label htmlFor="lastName">Tên</Label>
//         <Controller
//           control={control}
//           name="lastName"
//           defaultValue={userToEdit?.lastName || ''}
//           render={({ field }) => <Input {...field} id="lastName" placeholder="Nhập tên" />}
//         />
//       </div>
//
//       {/* Trường Email */}
//       <div>
//         <Label htmlFor="email">Email</Label>
//         <Controller
//           control={control}
//           name="email"
//           defaultValue={userToEdit?.email || ''}
//           render={({ field }) => <Input {...field} id="email" placeholder="Nhập email" />}
//         />
//       </div>
//      {/* Trường Ngày Sinh (Date of Birth) */}
//      <div>
//       <Label htmlFor="dateOfBirth">Ngày Sinh</Label>
//       <Controller
//         control={control}
//         name="dateOfBirth"
//         defaultValue={userToEdit?.dateOfBirth || ''}
//         render={({ field }) => <Input {...field} id="dateOfBirth" type="date" />}
//       />
//     </div>
//
//      {/* Trường Roles */}
//      <div>
//       <Label htmlFor="roles">Vai trò</Label>
//       <Controller
//         control={control}
//         name="roles"
//         defaultValue={userToEdit?.roles ? new Set(userToEdit.roles) : new Set()}  // Chuyển roles thành Set<string>
//         render={({ field }) => (
//           <>
//             <Checkbox
//               id="manageRole"
//               label="Quản lý"
//               value="manage"
//               checked={field.value.has('manage')}
//               onChange={() => {
//                 const newRoles = new Set(field.value);
//                 if (newRoles.has('manage')) {
//                   newRoles.delete('manage');
//                 } else {
//                   newRoles.add('manage');
//                 }
//                 field.onChange(newRoles);
//               }}
//             />
//             <Checkbox
//               id="userRole"
//               label="Người dùng"
//               value="user"
//               checked={field.value.has('user')}
//               onChange={() => {
//                 const newRoles = new Set(field.value);
//                 if (newRoles.has('user')) {
//                   newRoles.delete('user');
//                 } else {
//                   newRoles.add('user');
//                 }
//                 field.onChange(newRoles);
//               }}
//             />
//           </>
//         )}
//       />
//     </div>
//       {/* Checkbox - Hoạt động */}
//       <div>
//         <Label htmlFor="active">Hoạt động</Label>
//         <Controller
//           control={control}
//           name="active"
//           defaultValue={userToEdit?.active || false}
//           render={({ field }) => (
//             <Checkbox
//               id="active"
//               checked={field.value}  // Dùng checked thay vì value
//               onChange={() => field.onChange(!field.value)}  // Đảo ngược giá trị khi thay đổi
//             />
//           )}
//         />
//       </div>
//
//       {/* Submit button */}
//       <Button type="submit">{userToEdit ? 'Lưu Sửa' : 'Tạo Mới'}</Button>
//     </form>
//   </Modal>
// )}
//
//
//     </div>
//   );
// };
//
// export default UserPage;
//
