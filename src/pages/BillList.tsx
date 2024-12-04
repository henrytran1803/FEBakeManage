import React, { useEffect, useState } from 'react';
import { Bill, BillResponse_View_Cake, BillStatus } from '@/types/Bill';
import { billService } from '@/services/billService';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TablePagination } from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogClose, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import {getImageUrl} from "@/utils/imageUtils.ts";
import {Input} from "@/components/ui/input.tsx";

const BillList: React.FC = () => {
  const defaultBill: BillResponse_View_Cake = {
    billId: 0,
    customerName: '',
    customerPhone: '',
    totalAmount: 0,
    billStatus: BillStatus.PAID,
    paymentMethod: 'CASH',
    nameArea: '',
    nameTable: '',
    diningOption: '',
    billDetails: []
  };
  // Search-related state and functions
  const [isSearching, setIsSearching] = useState(false);

  const [bills, setBills] = useState<Bill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillResponse_View_Cake>(defaultBill);
  const [status, setStatus] = useState<BillStatus>(BillStatus.PAID);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState<string | null>(null); // State to store user role
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Giả sử bạn lấy role từ localStorage hoặc từ API
    const userRole = localStorage.getItem('auth'); // Hoặc lấy từ API
    setRole(userRole); // Lưu role vào state
    console.log(userRole)
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        const response = await billService.search(status, page, size);
        setBills(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError('Không thể tải danh sách hóa đơn');

      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, [status, page, size]);

  const updateBillStatus = async (billId: number, newStatus: BillStatus) => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;
        const userRole = localStorage.getItem('auth');
        const bill = bills.find(bill => bill.billId === billId);
        if (!bill) {
          alert('Hóa đơn không tồn tại');
          return;
        }
        if (userRole === "MANAGE" && bill.billStatus === BillStatus.NOT_PAID) {
          await billService.updateBillStatus(billId, newStatus, userId);
          alert('Trạng thái hóa đơn đã được cập nhật');
          setIsDialogOpen(false);
        } else if (userRole !== "MANAGE") {
          alert('Bạn không có quyền cập nhật trạng thái này');
        } else if (bill.billStatus !== BillStatus.NOT_PAID) {
          alert('Hóa đơn không có trạng thái "NOT_PAID" để cập nhật thành "CANCEL"');
        }
      } else {
        alert('Không tìm thấy dữ liệu người dùng trong localStorage');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái hóa đơn', error);
      alert('Đã có lỗi xảy ra khi cập nhật trạng thái hóa đơn');
    }
  };


  const handleViewDetails = async (billId: number) => {
    try {
      const response = await billService.getDetailsById(billId);
      setSelectedBill(response);
      setIsDialogOpen(true);
    } catch (error) {
      setError('Không thể lấy chi tiết hóa đơn');
    }
  };

  interface SearchParams {
    id?: number;
    customerName?: string;
    customerPhone?: string;
  }

  const [searchParams, setSearchParams] = useState<SearchParams>({
    id: undefined,
    customerName: '',
    customerPhone: ''
  });

  const [searchResults, setSearchResults] = useState<Bill[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value === '' ? undefined :
          name === 'id' ? parseInt(value) : value
    }));
  };

  const handleSearchSubmit = async () => {
    try {
      // ... perform search logic using searchParams ...
      setIsSearching(true); // Set isSearching to true upon search submission
      const response = await billService.searchBill({
        ...(searchParams.id && { id: searchParams.id }),
        ...(searchParams.customerName && { customerName: searchParams.customerName.trim() }),
        ...(searchParams.customerPhone && { customerPhone: searchParams.customerPhone.trim() })
      });
      setSearchResults(response.data.content);
    } catch (error) {
      console.error("Lỗi tìm kiếm", error);
    }finally {
      setIsSearching(false);
    }
  };

  const handleStatusChange = async (newStatus: BillStatus) => {
    setStatus(newStatus);
    setIsSearching(false);
  };
  const handleCancelClick = (bill: BillResponse_View_Cake) => {
    setSelectedBill(bill); // Chọn hóa đơn cần hủy
    setIsDialogOpen(true); // Mở dialog xác nhận
  };
  // Hàm chuyển đổi Bill sang BillResponse_View_Cake
  const convertToBillResponseViewCake = (bill: Bill): BillResponse_View_Cake => {
    return {
      billId: bill.billId,
      customerName: bill.customerName,
      customerPhone: bill.customerPhone,
      totalAmount: bill.totalAmount,
      billStatus: bill.billStatus,
      paymentMethod: bill.paymentMethod,
      nameArea:  '',
      nameTable: '',
      diningOption: bill.diningOption || '',
      billDetails:  []
    };
  };
  const handleOpenDialog = (bill: Bill) => {
    setSelectedBill(convertToBillResponseViewCake(bill)); // Chuyển đổi Bill thành BillResponse_View_Cake
    setIsDialogOpen(true);
  };
  return (
      <div className="p-4 min-w-[80vw]">
        <h1 style={{fontSize: '32px', fontWeight: 'bold', marginTop: '20px'}}>Danh sách hóa đơn</h1>
        <br/>

        <div>
          <h2>Tìm kiếm hóa đơn</h2>
          <div>
            <div className="flex items-center gap-4">
              <Input
                  type="text"
                  name="id"
                  placeholder="Mã hóa đơn"
                  value={searchParams.id ?? ''}
                  onChange={handleSearchChange}
              />
              <Input
                  type="text"
                  name="customerName"
                  placeholder="Tên khách hàng"
                  value={searchParams.customerName ?? ''}
                  onChange={handleSearchChange}
              />
              <Input
                  type="text"
                  name="customerPhone"
                  placeholder="Số điện thoại"
                  value={searchParams.customerPhone ?? ''}
                  onChange={handleSearchChange}
              />
              <Button onClick={handleSearchSubmit}>Tìm kiếm</Button>
            </div>


          </div>
        </div>

        <h2>Chọn trạng thái thanh toán</h2>
        <Select value={status} onValueChange={(value) => handleStatusChange(value as BillStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BillStatus.PAID}>Đã thanh toán</SelectItem>
            <SelectItem value={BillStatus.NOT_PAID}>Chưa thanh toán</SelectItem>
            <SelectItem value={BillStatus.CANCEL}>Đã hủy</SelectItem>
            <SelectItem value={BillStatus.COMPLETED}>Hoàn thành</SelectItem>
          </SelectContent>
        </Select>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Hình thức dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thao tác</TableHead>
              <TableHead>Hủy</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isSearching ? (
                <>
                  <h3>Search Results</h3>
                  {searchResults.length > 0 ? (
                      searchResults.map((bill) => (
                          <TableRow key={bill.billId}>
                            <TableCell>{bill.billId}</TableCell>
                            <TableCell>{bill.customerName}</TableCell>
                            <TableCell>{bill.customerPhone}</TableCell>
                            <TableCell>{bill.paymentMethod}</TableCell>
                            <TableCell>{bill.diningOption}</TableCell>
                            <TableCell>
                              <Badge>{bill.billStatus}</Badge>
                            </TableCell>
                            <TableCell>{bill.totalAmount}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleViewDetails(bill.billId)}>Xem chi tiết</Button>
                            </TableCell>
                          </TableRow>
                      ))
                  ) : (
                      <p>No search results found.</p>
                  )}
                </>
            ) : (
                bills.map((bill) => (
                    <TableRow key={bill.billId}>
                      <TableCell>{bill.billId}</TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell>{bill.customerPhone}</TableCell>
                      <TableCell>{bill.paymentMethod}</TableCell>
                      <TableCell>{bill.diningOption}</TableCell>
                      <TableCell>
                        <Badge>{bill.billStatus}</Badge>
                      </TableCell>
                      <TableCell>{bill.totalAmount}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleViewDetails(bill.billId)}>Xem chi tiết</Button>
                      </TableCell>
                      <TableCell>
                        {/* Hiển thị nút "Hủy hóa đơn" nếu role là MANAGE và trạng thái là NOT_PAID */}
                        {role === "MANAGE" && bill.billStatus === BillStatus.NOT_PAID && (
                            <Button
                                variant="destructive"
                                onClick={() => handleOpenDialog(bill)} // Gọi hàm mở dialog và chuyển đối tượng bill vào
                            >
                              Hủy hóa đơn

                            </Button>
                        )}
                      </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
            page={page}
            setPage={setPage}
            size={size}
            setSize={setSize}
            totalPages={totalPages}
            currentPageElements={bills.length}
            totalElements={0}
        />
        {/* Dialog xác nhận Hủy hóa đơn */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogOverlay/>
          <DialogContent>
            <DialogClose onClick={() => setIsDialogOpen(false)}>
              <X/>
            </DialogClose>
            <h2 className="text-lg font-semibold">Xác nhận hủy hóa đơn</h2>
            <p>Bạn có chắc chắn muốn hủy hóa đơn của {selectedBill.customerName}?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button
                  variant="destructive"
                  onClick={() => updateBillStatus(selectedBill.billId, BillStatus.CANCEL)}
              >
                Xác nhận hủy
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/50"/>
          <DialogContent
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <p className="text-sm font-medium">Tên khu vực: {selectedBill.nameArea}</p>
              <p className="text-sm">Tên bàn: {selectedBill.nameTable}</p>
              <p className="text-sm font-semibold">Tổng tiền: {selectedBill.totalAmount.toFixed(2)} VND</p>
            </div>

            {selectedBill.billDetails && selectedBill.billDetails.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h4>
                  <ul className="space-y-4">
                    {selectedBill.billDetails.map((item) => (
                        <li key={item.id} className="flex items-center space-x-4">
                          <img
                              src={getImageUrl(item.productImages) || '/placeholder.png'}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{item.productName}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Giá: {item.price.toFixed(2)} VND</p>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
            ) : (
                <p className="mt-2">Không có chi tiết sản phẩm.</p>
            )}

            {selectedBill.billStatus === BillStatus.PAID && (
                <Button
                    className="mt-4"
                    onClick={() => updateBillStatus(selectedBill.billId, BillStatus.COMPLETED)}
                >
                  Xác nhận hoàn thành
                </Button>
            )}
            {selectedBill.billStatus === BillStatus.NOT_PAID && (
                <Button
                    className="mt-4"
                    onClick={() => updateBillStatus(selectedBill.billId, BillStatus.PAID)}
                >
                  Xác nhận thanh toán
                </Button>
            )}
          </DialogContent>
        </Dialog>

        {error && (
            <Alert variant="destructive">
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </div>

  );
};

export default BillList;