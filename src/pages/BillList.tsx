// import React, { useEffect, useState } from "react";
// import { Bill, BillResponse_View_Cake, BillStatus } from "@/types/Bill";
// import { billService } from "@/services/billService";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { TablePagination } from "@/components/TablePagination";
// import { Badge } from "@/components/ui/badge";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogOverlay,
// } from "@/components/ui/dialog";
// import { DialogTitle } from "@radix-ui/react-dialog";
// import { Input } from "@/components/ui/input";


// import {
//   BillErrorCode,
//   billErrorMessages,
//   SearchParams,
//   DialogTypes,
//   defaultBillState,
//   TABLE_COLUMNS,
//   ROLES,
//   PAGINATION_DEFAULTS,
// } from "@/utils/error/BillListError";
// import { toast } from "@/hooks/use-toast";
// import { Search, X } from "lucide-react";

// const BillList: React.FC = () => {
// // <<<<<<< quy
// //   // State declarations
// // ====
// //   const defaultBill: BillResponse_View_Cake = {
// //     billId: 0,
// //     customerName: '',
// //     customerPhone: '',
// //     totalAmount: 0,
// //     billStatus: BillStatus.PAID,
// //     paymentMethod: 'CASH',
// //     nameArea: '',
// //     nameTable: '',
// //     diningOption: '',
// //     billDetails: []
// //   };
// //   // Search-related state and functions
//   const [isSearching, setIsSearching] = useState(false);
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [selectedBill, setSelectedBill] =
//     useState<BillResponse_View_Cake>(defaultBillState);
// <!-- =======
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedBill, setSelectedBill] = useState<BillResponse_View_Cake>(defaultBill);
// >>>>>>> main -->
//   const [status, setStatus] = useState<BillStatus>(BillStatus.PAID);
//   const [page, setPage] = useState(PAGINATION_DEFAULTS.INITIAL_PAGE);
//   const [size, setSize] = useState(PAGINATION_DEFAULTS.PAGE_SIZE);
//   const [totalPages, setTotalPages] = useState(0);
//   const [role, setRole] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [dialogType, setDialogType] = useState<
//     "cancel" | "details" | "pay" | null
//   >(null);
//   const [searchParams, setSearchParams] = useState<SearchParams>({
//     id: undefined,
//     customerName: "",
//     customerPhone: "",
//   });
//   const [searchResults, setSearchResults] = useState<Bill[]>([]);

//   useEffect(() => {
//     const userRole = localStorage.getItem("auth");
//     setRole(userRole);

// // =======

// //   useEffect(() => {
// //     // Giả sử bạn lấy role từ localStorage hoặc từ API
// //     const userRole = localStorage.getItem('auth'); // Hoặc lấy từ API
// //     setRole(userRole); // Lưu role vào state
// //     console.log(userRole)
// // >>>>>>> main
//     const fetchBills = async () => {
//       try {
//         setIsLoading(true);
//         const response = await billService.search(status, page, size);
//         setBills(response.data.content);
//         setTotalPages(response.data.totalPages);
//       } catch (error) {
//         toast({
//           title: "Lỗi",
//           description: billErrorMessages[BillErrorCode.LOAD_BILLS_ERROR],
//           variant: "destructive",
//         });
// <!-- =======
//         setError('Không thể tải danh sách hóa đơn');

// >>>>>>> main -->
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBills();
//   }, [status, page, size]);

//   const updateBillStatus = async (billId: number, newStatus: BillStatus) => {
//     try {
//       const userData = localStorage.getItem("user");
//       if (!userData) {
//         toast({
//           title: 'Lỗi',
//           description: billErrorMessages[BillErrorCode.NO_USER_DATA],
//           variant: 'destructive',
//         });
//         return;
//       }
  
//       const parsedUser = JSON.parse(userData);
//       const userRole = localStorage.getItem("auth");
  
//       if (!userRole) {
//         toast({
//           title: 'Lỗi',
//           description: billErrorMessages[BillErrorCode.NO_USER_ROLE],
//           variant: 'destructive',
//         });
//         return;
//       }
  
//       const foundBill = isSearching 
//         ? searchResults.find((b) => b.billId === billId)
//         : bills.find((b) => b.billId === billId);
  
//       if (!foundBill) {
//         toast({
//           title: 'Lỗi',
//           description: billErrorMessages[BillErrorCode.BILL_NOT_FOUND],
//           variant: 'destructive',
//         });
//         return;
//       }
  
//       if (userRole === ROLES.MANAGE) {
//         await billService.updateBillStatus(billId, newStatus);
//         setDialogType(null);
  
//         // Load lại dữ liệu ngay lập tức
//         const reloadData = async () => {
//           if (isSearching) {
//             const searchResponse = await billService.searchBill({
//               ...(searchParams.id && { id: searchParams.id }),
//               ...(searchParams.customerName && {
//                 customerName: searchParams.customerName.trim(),
//               }),
//               ...(searchParams.customerPhone && {
//                 customerPhone: searchParams.customerPhone.trim(),
//               }),
//             });
//             setSearchResults(searchResponse.data.content);
//           }
//           // Luôn load lại danh sách gốc để đồng bộ
//           const response = await billService.search(status, page, size);
//           setBills(response.data.content);
//           setTotalPages(response.data.totalPages);
//         };
  
//         await reloadData();
  
//         toast({
//           title: 'Thành công',
//           description: billErrorMessages[BillErrorCode.STATUS_UPDATE_SUCCESS],
//           variant: 'default',
//         });
//       } else if (userRole === ROLES.USER) {
//         if (
//           foundBill.billStatus !== BillStatus.NOT_PAID ||
//           newStatus !== BillStatus.CANCEL
//         ) {
//           await billService.updateBillStatus(billId, newStatus);
//           setDialogType(null);
          
//           // Load lại dữ liệu ngay lập tức
//           const reloadData = async () => {
//             if (isSearching) {
//               const searchResponse = await billService.searchBill({
//                 ...(searchParams.id && { id: searchParams.id }),
//                 ...(searchParams.customerName && {
//                   customerName: searchParams.customerName.trim(),
//                 }),
//                 ...(searchParams.customerPhone && {
//                   customerPhone: searchParams.customerPhone.trim(),
//                 }),
//               });
//               setSearchResults(searchResponse.data.content);
//             }
//             // Luôn load lại danh sách gốc để đồng bộ
//             const response = await billService.search(status, page, size);
//             setBills(response.data.content);
//             setTotalPages(response.data.totalPages);
//           };
  
//           await reloadData();
          
//           toast({
//             title: 'Thành công',
//             description: billErrorMessages[BillErrorCode.STATUS_UPDATE_SUCCESS],
//             variant: 'default',
//           });
//         } else {
//           toast({
//             title: 'Lỗi',
//             description: billErrorMessages[BillErrorCode.STAFF_STATUS_RESTRICTION],
//             variant: 'destructive',
//           });
//         }
//       } else {
//         toast({
//           title: 'Lỗi',
//           description: billErrorMessages[BillErrorCode.PERMISSION_DENIED],
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       console.error(billErrorMessages[BillErrorCode.UPDATE_STATUS_ERROR], error);
//       toast({
//         title: 'Lỗi',
//         description: billErrorMessages[BillErrorCode.UPDATE_STATUS_ERROR],
//         variant: 'destructive',
//       });
// // =======
// //       const userData = localStorage.getItem('user');
// //       if (userData) {
// //         const parsedUser = JSON.parse(userData);
// //         const userId = parsedUser.id;
// //         const userRole = localStorage.getItem('auth');
// //         const bill = bills.find(bill => bill.billId === billId);
// //         if (!bill) {
// //           alert('Hóa đơn không tồn tại');
// //           return;
// //         }
// //         if (userRole === "MANAGE" && bill.billStatus === BillStatus.NOT_PAID) {
// //           await billService.updateBillStatus(billId, newStatus, userId);
// //           alert('Trạng thái hóa đơn đã được cập nhật');
// //           setIsDialogOpen(false);
// //         } else if (userRole !== "MANAGE") {
// //           alert('Bạn không có quyền cập nhật trạng thái này');
// //         } else if (bill.billStatus !== BillStatus.NOT_PAID) {
// //           alert('Hóa đơn không có trạng thái "NOT_PAID" để cập nhật thành "CANCEL"');
// //         }
// //       } else {
// //         alert('Không tìm thấy dữ liệu người dùng trong localStorage');
// //       }
// //     } catch (error) {
// //       console.error('Lỗi khi cập nhật trạng thái hóa đơn', error);
// //       alert('Đã có lỗi xảy ra khi cập nhật trạng thái hóa đơn');
// // >>>>>>> main
//     }
//   };


//   const handleViewDetails = async (billId: number) => {
//     try {
//       const response = await billService.getDetailsById(billId);
//       setSelectedBill(response);
//       setDialogType("details");
//     } catch (error) {
//       toast({
//         title: "Lỗi",
//         description: billErrorMessages[BillErrorCode.BILL_DETAILS_ERROR],
//         variant: "destructive",
//       });
//     }
//   };

// <!-- =======
//       setIsDialogOpen(true);
//     } catch (error) {
//       setError('Không thể lấy chi tiết hóa đơn');
//     }
//   };

//   interface SearchParams {
//     id?: number;
//     customerName?: string;
//     customerPhone?: string;
//   }

//   const [searchParams, setSearchParams] = useState<SearchParams>({
//     id: undefined,
//     customerName: '',
//     customerPhone: ''
//   });

//   const [searchResults, setSearchResults] = useState<Bill[]>([]);

// >>>>>>> main -->
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({
//       ...prev,
//       [name]: value === '' ? undefined :
//           name === 'id' ? parseInt(value) : value
//     }));
//   };

//   const handleSearchSubmit = async () => {
//     try {
//       const response = await billService.searchBill({
//         ...(searchParams.id && { id: searchParams.id }),
//         ...(searchParams.customerName && { customerName: searchParams.customerName.trim() }),
//         ...(searchParams.customerPhone && { customerPhone: searchParams.customerPhone.trim() })
//       });
//       setSearchResults(response.data.content);
//       setIsSearching(true); // Chuyển xuống sau khi có kết quả
//       if (response.data.content.length > 0) {
//         toast({
//           title: 'Tìm kiếm thành công',
//           description: `Đã tìm thấy ${response.data.content.length} kết quả`,
//           variant: 'default',
//         });
//       } else {
//         toast({
//           title: 'Thông báo',
//           description: 'Không tìm thấy kết quả phù hợp',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       console.error(billErrorMessages[BillErrorCode.SEARCH_ERROR], error);
//       toast({
//         title: 'Lỗi',
//         description: billErrorMessages[BillErrorCode.SEARCH_ERROR],
//         variant: 'destructive',
//       });
// <!-- =======
//       console.error("Lỗi tìm kiếm", error);
//     }finally {
//       setIsSearching(false);
// >>>>>>> main -->
//     }
//   };

//   const clearSearch = () => {
//     setIsSearching(false);
//     setSearchResults([]);
//     setSearchParams({
//       id: undefined,
//       customerName: "",
//       customerPhone: "",
//     });
//   };
//   const handleStatusChange = async (newStatus: BillStatus) => {
//     setStatus(newStatus);
//     setIsSearching(false);
//   };

//   const handleOpenDialog = (bill: Bill) => {
//     setSelectedBill({
//       ...defaultBillState,
//       ...bill,
//     });
//     setDialogType("cancel");
//   };

//   return (
//     <div className="space-y-6 p-6">
//     <div className="flex items-center justify-between">
//       <h1 className="text-3xl font-bold">Danh sách hóa đơn</h1>
//       {isSearching && searchResults.length > 0 && (
//         <div className="flex items-center gap-2">
//           <Badge variant="secondary">
//             {searchResults.length} kết quả tìm thấy
//           </Badge>
//           <Button 
//             variant="outline" 
//             size="sm"
//             onClick={clearSearch}
//           >
//             <X className="h-4 w-4 mr-1" />
//             Xóa tìm kiếm
//           </Button>
//         </div>
//       )}
//     </div>

//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">Tìm kiếm hóa đơn</h2>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Input
//           type="text"
//           name="id"
//           placeholder="Mã hóa đơn"
//           value={searchParams.id ?? ""}
//           onChange={handleSearchChange}
//         />
//         <Input
//           type="text"
//           name="customerName"
//           placeholder="Tên khách hàng"
//           value={searchParams.customerName ?? ""}
//           onChange={handleSearchChange}
//         />
//         <Input
//           type="text"
//           name="customerPhone"
//           placeholder="Số điện thoại"
//           value={searchParams.customerPhone ?? ""}
//           onChange={handleSearchChange}
//         />
//         <div className="flex gap-2">
//           <Button 
//             className="flex-1"
//             onClick={handleSearchSubmit}
//             disabled={!searchParams.id && !searchParams.customerName && !searchParams.customerPhone}
//           >
//             <Search className="h-4 w-4 mr-1" />
//             Tìm kiếm
//           </Button>
        
//         </div>
//       </div>
//     </div>

//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">Chọn trạng thái thanh toán</h2>
//       <Select
//         value={status}
//         onValueChange={(value) => handleStatusChange(value as BillStatus)}
//       >
//         <SelectTrigger className="w-[240px]">
//           <SelectValue placeholder="Chọn trạng thái" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value={BillStatus.PAID}>Đã thanh toán</SelectItem>
//           <SelectItem value={BillStatus.NOT_PAID}>Chưa thanh toán</SelectItem>
//           <SelectItem value={BillStatus.CANCEL}>Đã hủy</SelectItem>
//           <SelectItem value={BillStatus.COMPLETED}>Hoàn thành</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>

//     {isSearching && searchResults.length === 0 ? (
//       <div className="text-center py-12 bg-gray-50 rounded-lg">
//         <div className="text-gray-500">Không tìm thấy kết quả phù hợp</div>
//       </div>
//     ) : (
//       <div className="rounded-md border">
// <!-- =======
//   const handleCancelClick = (bill: BillResponse_View_Cake) => {
//     setSelectedBill(bill); // Chọn hóa đơn cần hủy
//     setIsDialogOpen(true); // Mở dialog xác nhận
//   };
//   // Hàm chuyển đổi Bill sang BillResponse_View_Cake
//   const convertToBillResponseViewCake = (bill: Bill): BillResponse_View_Cake => {
//     return {
//       billId: bill.billId,
//       customerName: bill.customerName,
//       customerPhone: bill.customerPhone,
//       totalAmount: bill.totalAmount,
//       billStatus: bill.billStatus,
//       paymentMethod: bill.paymentMethod,
//       nameArea:  '',
//       nameTable: '',
//       diningOption: bill.diningOption || '',
//       billDetails:  []
//     };
//   };
//   const handleOpenDialog = (bill: Bill) => {
//     setSelectedBill(convertToBillResponseViewCake(bill)); // Chuyển đổi Bill thành BillResponse_View_Cake
//     setIsDialogOpen(true);
//   };
//   return (
//       <div className="p-4 min-w-[80vw]">
//         <h1 style={{fontSize: '32px', fontWeight: 'bold', marginTop: '20px'}}>Danh sách hóa đơn</h1>
//         <br/>

//         <div>
//           <h2>Tìm kiếm hóa đơn</h2>
//           <div>
//             <div className="flex items-center gap-4">
//               <Input
//                   type="text"
//                   name="id"
//                   placeholder="Mã hóa đơn"
//                   value={searchParams.id ?? ''}
//                   onChange={handleSearchChange}
//               />
//               <Input
//                   type="text"
//                   name="customerName"
//                   placeholder="Tên khách hàng"
//                   value={searchParams.customerName ?? ''}
//                   onChange={handleSearchChange}
//               />
//               <Input
//                   type="text"
//                   name="customerPhone"
//                   placeholder="Số điện thoại"
//                   value={searchParams.customerPhone ?? ''}
//                   onChange={handleSearchChange}
//               />
//               <Button onClick={handleSearchSubmit}>Tìm kiếm</Button>
//             </div>


//           </div>
//         </div>

//         <h2>Chọn trạng thái thanh toán</h2>
//         <Select value={status} onValueChange={(value) => handleStatusChange(value as BillStatus)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Chọn trạng thái"/>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={BillStatus.PAID}>Đã thanh toán</SelectItem>
//             <SelectItem value={BillStatus.NOT_PAID}>Chưa thanh toán</SelectItem>
//             <SelectItem value={BillStatus.CANCEL}>Đã hủy</SelectItem>
//             <SelectItem value={BillStatus.COMPLETED}>Hoàn thành</SelectItem>
//           </SelectContent>
//         </Select>

// >>>>>>> main -->
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Mã hóa đơn</TableHead>
//               <TableHead>Tên khách hàng</TableHead>
//               <TableHead>Số điện thoại</TableHead>
//               <TableHead>Phương thức thanh toán</TableHead>
//               <TableHead>Hình thức dùng</TableHead>
//               <TableHead>Trạng thái</TableHead>
//               <TableHead className="text-right">Tổng tiền</TableHead>
//               <TableHead>Thao tác</TableHead>
//               {role === "MANAGE" && status === BillStatus.NOT_PAID && (
//                 <TableHead>Hủy</TableHead>
//               )}

// <!--               <TableHead>Tổng tiền</TableHead>
//               <TableHead>Thao tác</TableHead>
//               <TableHead>Hủy</TableHead>
// >>>>>>> main -->
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//   {(isSearching ? searchResults : bills).map((bill) => (
//     <TableRow key={bill.billId}>
//       <TableCell>{bill.billId}</TableCell>
//       <TableCell>{bill.customerName}</TableCell>
//       <TableCell>{bill.customerPhone}</TableCell>
//       <TableCell>{bill.paymentMethod}</TableCell>
//       <TableCell>{bill.diningOption}</TableCell>
//       <TableCell>
//         <Badge variant={
//           bill.billStatus === BillStatus.PAID ? "success" :
//           bill.billStatus === BillStatus.NOT_PAID ? "destructive" :
//           bill.billStatus === BillStatus.CANCEL ? "secondary" :
//           "default"
//         }>
//           {bill.billStatus}
//         </Badge>
//       </TableCell>
//       <TableCell className="text-right font-medium">
//         {new Intl.NumberFormat('vi-VN', { 
//           style: 'currency', 
//           currency: 'VND' 
//         }).format(bill.totalAmount)}
//       </TableCell>
//       <TableCell>
//         <Button 
//           variant="outline" 
//           size="sm"
//           onClick={() => handleViewDetails(bill.billId)}
//         >
//           Xem chi tiết
//         </Button>
//       </TableCell>
//       {(role === "MANAGE" && bill.billStatus === BillStatus.NOT_PAID) && (
//         <TableCell>
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => handleOpenDialog(bill)}
//           >
//             Hủy hóa đơn
//           </Button>
//         </TableCell>
//       )}
//     </TableRow>
//   ))}
//   {isSearching && searchResults.length === 0 && (
//     <TableRow>
//       <TableCell colSpan={9} className="text-center py-8">
//         <div className="text-gray-500">Không tìm thấy kết quả phù hợp</div>
//       </TableCell>
//     </TableRow>
//   )}
// </TableBody><TableBody>
//   {(isSearching ? searchResults : bills).map((bill) => (
//     <TableRow key={bill.billId}>
//       <TableCell>{bill.billId}</TableCell>
//       <TableCell>{bill.customerName}</TableCell>
//       <TableCell>{bill.customerPhone}</TableCell>
//       <TableCell>{bill.paymentMethod}</TableCell>
//       <TableCell>{bill.diningOption}</TableCell>
//       <TableCell>
//         <Badge variant={
//           bill.billStatus === BillStatus.PAID ? "success" :
//           bill.billStatus === BillStatus.NOT_PAID ? "destructive" :
//           bill.billStatus === BillStatus.CANCEL ? "secondary" :
//           "default"
//         }>
//           {bill.billStatus}
//         </Badge>
//       </TableCell>
//       <TableCell className="text-right font-medium">
//         {new Intl.NumberFormat('vi-VN', { 
//           style: 'currency', 
//           currency: 'VND' 
//         }).format(bill.totalAmount)}
//       </TableCell>
//       <TableCell>
//         <Button 
//           variant="outline" 
//           size="sm"
//           onClick={() => handleViewDetails(bill.billId)}
//         >
//           Xem chi tiết
//         </Button>
//       </TableCell>
//       {/* Thêm cột cho nút hủy hóa đơn */}
//       <TableCell>
//         {role === "MANAGE" && bill.billStatus === BillStatus.NOT_PAID && (
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => handleOpenDialog(bill)}
//           >
//             Hủy hóa đơn
//           </Button>
//         )}
//       </TableCell>
//     </TableRow>
//   ))}
//   {isSearching && searchResults.length === 0 && (
//     <TableRow>
//       <TableCell colSpan={9} className="text-center py-8">
//         <div className="text-gray-500">Không tìm thấy kết quả phù hợp</div>
//       </TableCell>
//     </TableRow>
//   )}
// </TableBody>
//         </Table>
//       </div>
//     )}

//     {!isSearching && (
//       <TablePagination
//         page={page}
//         setPage={setPage}
//         size={size}
//         setSize={setSize}
//         totalPages={totalPages}
//         currentPageElements={bills.length}
//         totalElements={0}
//       />
//     )}
  
//       {/* Dialog xác nhận Hủy hóa đơn */}
//       <Dialog
//         open={dialogType === "cancel"}
//         onOpenChange={() => setDialogType(null)}
//       >
//         <DialogOverlay />
//         <DialogContent>
//           <DialogTitle>
// <!-- =======
//             {isSearching ? (
//                 <>
//                   <h3>Search Results</h3>
//                   {searchResults.length > 0 ? (
//                       searchResults.map((bill) => (
//                           <TableRow key={bill.billId}>
//                             <TableCell>{bill.billId}</TableCell>
//                             <TableCell>{bill.customerName}</TableCell>
//                             <TableCell>{bill.customerPhone}</TableCell>
//                             <TableCell>{bill.paymentMethod}</TableCell>
//                             <TableCell>{bill.diningOption}</TableCell>
//                             <TableCell>
//                               <Badge>{bill.billStatus}</Badge>
//                             </TableCell>
//                             <TableCell>{bill.totalAmount}</TableCell>
//                             <TableCell>
//                               <Button onClick={() => handleViewDetails(bill.billId)}>Xem chi tiết</Button>
//                             </TableCell>
//                           </TableRow>
//                       ))
//                   ) : (
//                       <p>No search results found.</p>
//                   )}
//                 </>
//             ) : (
//                 bills.map((bill) => (
//                     <TableRow key={bill.billId}>
//                       <TableCell>{bill.billId}</TableCell>
//                       <TableCell>{bill.customerName}</TableCell>
//                       <TableCell>{bill.customerPhone}</TableCell>
//                       <TableCell>{bill.paymentMethod}</TableCell>
//                       <TableCell>{bill.diningOption}</TableCell>
//                       <TableCell>
//                         <Badge>{bill.billStatus}</Badge>
//                       </TableCell>
//                       <TableCell>{bill.totalAmount}</TableCell>
//                       <TableCell>
//                         <Button onClick={() => handleViewDetails(bill.billId)}>Xem chi tiết</Button>
//                       </TableCell>
//                       <TableCell>
//                         {/* Hiển thị nút "Hủy hóa đơn" nếu role là MANAGE và trạng thái là NOT_PAID */}
//                         {role === "MANAGE" && bill.billStatus === BillStatus.NOT_PAID && (
//                             <Button
//                                 variant="destructive"
//                                 onClick={() => handleOpenDialog(bill)} // Gọi hàm mở dialog và chuyển đối tượng bill vào
//                             >
//                               Hủy hóa đơn

//                             </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                 ))
//             )}
//           </TableBody>
//         </Table>

//         <TablePagination
//             page={page}
//             setPage={setPage}
//             size={size}
//             setSize={setSize}
//             totalPages={totalPages}
//             currentPageElements={bills.length}
//             totalElements={0}
//         />
//         {/* Dialog xác nhận Hủy hóa đơn */}
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogOverlay/>
//           <DialogContent>
//             <DialogClose onClick={() => setIsDialogOpen(false)}>
//               <X/>
//             </DialogClose>
// >>>>>>> main -->
//             <h2 className="text-lg font-semibold">Xác nhận hủy hóa đơn</h2>
//             <p>Bạn có chắc chắn muốn hủy hóa đơn của {selectedBill.customerName}?</p>
//             <div className="flex justify-end gap-4 mt-4">
//               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                 Hủy
//               </Button>
//               <Button
//                   variant="destructive"
//                   onClick={() => updateBillStatus(selectedBill.billId, BillStatus.CANCEL)}
//               >
//                 Xác nhận hủy
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogOverlay className="fixed inset-0 bg-black/50"/>
//           <DialogContent
//               className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg bg-white p-6 rounded-lg shadow-lg">
//             <div className="mb-4">
//               <p className="text-sm font-medium">Tên khu vực: {selectedBill.nameArea}</p>
//               <p className="text-sm">Tên bàn: {selectedBill.nameTable}</p>
//               <p className="text-sm font-semibold">Tổng tiền: {selectedBill.totalAmount.toFixed(2)} VND</p>
//             </div>

//             {selectedBill.billDetails && selectedBill.billDetails.length > 0 ? (
//                 <div className="mt-4">
//                   <h4 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h4>
//                   <ul className="space-y-4">
//                     {selectedBill.billDetails.map((item) => (
//                         <li key={item.id} className="flex items-center space-x-4">
//                           <img
//                               src={getImageUrl(item.productImages) || '/placeholder.png'}
//                               alt={item.productName}
//                               className="w-16 h-16 object-cover rounded"
//                           />
//                           <div className="flex-1">
//                             <p className="font-semibold">{item.productName}</p>
//                             <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
//                             <p className="text-sm text-gray-500">Giá: {item.price.toFixed(2)} VND</p>
//                           </div>
//                         </li>
//                     ))}
//                   </ul>
//                 </div>
//             ) : (
//                 <p className="mt-2">Không có chi tiết sản phẩm.</p>
//             )}

//             {selectedBill.billStatus === BillStatus.PAID && (
//                 <Button
//                     className="mt-4"
//                     onClick={() => updateBillStatus(selectedBill.billId, BillStatus.COMPLETED)}
//                 >
//                   Xác nhận hoàn thành
//                 </Button>
//             )}
//             {selectedBill.billStatus === BillStatus.NOT_PAID && (
//                 <Button
//                     className="mt-4"
//                     onClick={() => updateBillStatus(selectedBill.billId, BillStatus.PAID)}
//                 >
//                   Xác nhận thanh toán
//                 </Button>
//             )}
//           </DialogContent>
//         </Dialog>

//         {error && (
//             <Alert variant="destructive">
//               <AlertTitle>Lỗi</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//         )}
//       </div>

//   );
// };

// export default BillList;