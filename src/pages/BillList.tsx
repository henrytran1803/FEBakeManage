import React, { useEffect, useState } from "react";
import { Bill, BillResponse_View_Cake, BillStatus } from "@/types/Bill";
import { billService } from "@/services/billService";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

import {
  BillErrorCode,
  billErrorMessages,
  SearchParams,
  DialogTypes,
  defaultBillState,
  TABLE_COLUMNS,
  ROLES,
  PAGINATION_DEFAULTS,
} from "@/utils/error/BillListError";
import { toast } from "@/hooks/use-toast";
import { Search, X } from "lucide-react";

const BillList: React.FC = () => {
  // State declarations
  const [isSearching, setIsSearching] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] =
    useState<BillResponse_View_Cake>(defaultBillState);
  const [status, setStatus] = useState<BillStatus>(BillStatus.PAID);
  const [page, setPage] = useState(PAGINATION_DEFAULTS.INITIAL_PAGE);
  const [size, setSize] = useState(PAGINATION_DEFAULTS.PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<
    "cancel" | "details" | "pay" | null
  >(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    id: undefined,
    customerName: "",
    customerPhone: "",
  });
  const [searchResults, setSearchResults] = useState<Bill[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem("auth");
    setRole(userRole);

    const fetchBills = async () => {
      try {
        setIsLoading(true);
        const response = await billService.search(status, page, size);
        setBills(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách hóa đơn",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, [status, page, size]);

  const updateBillStatus = async (billId: number, newStatus: BillStatus) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy thông tin người dùng",
          variant: "destructive",
        });
        return;
      }

      const userRole = localStorage.getItem("auth");
      if (!userRole) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy quyền người dùng",
          variant: "destructive",
        });
        return;
      }

      const foundBill = isSearching
        ? searchResults.find((b) => b.billId === billId)
        : bills.find((b) => b.billId === billId);

      if (!foundBill) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy hóa đơn",
          variant: "destructive",
        });
        return;
      }

      if (userRole === "manage") {
        await billService.updateBillStatus(billId, newStatus);
        setDialogType(null);

        const reloadData = async () => {
          if (isSearching) {
            const searchResponse = await billService.searchBill({
              ...(searchParams.id && { id: searchParams.id }),
              ...(searchParams.customerName && {
                customerName: searchParams.customerName.trim(),
              }),
              ...(searchParams.customerPhone && {
                customerPhone: searchParams.customerPhone.trim(),
              }),
            });
            setSearchResults(searchResponse.data.content);
          }
          const response = await billService.search(status, page, size);
          setBills(response.data.content);
          setTotalPages(response.data.totalPages);
        };

        await reloadData();

        toast({
          title: "Thành công",
          description: "Cập nhật trạng thái hóa đơn thành công",
          variant: "default",
        });
      } else if (userRole === "user") {
        if (
          foundBill.billStatus !== BillStatus.NOT_PAID ||
          newStatus !== BillStatus.CANCEL
        ) {
          await billService.updateBillStatus(billId, newStatus);
          setDialogType(null);

          const reloadData = async () => {
            if (isSearching) {
              const searchResponse = await billService.searchBill({
                ...(searchParams.id && { id: searchParams.id }),
                ...(searchParams.customerName && {
                  customerName: searchParams.customerName.trim(),
                }),
                ...(searchParams.customerPhone && {
                  customerPhone: searchParams.customerPhone.trim(),
                }),
              });
              setSearchResults(searchResponse.data.content);
            }
            const response = await billService.search(status, page, size);
            setBills(response.data.content);
            setTotalPages(response.data.totalPages);
          };

          await reloadData();

          toast({
            title: "Thành công",
            description: "Cập nhật trạng thái hóa đơn thành công",
            variant: "default",
          });
        } else {
          toast({
            title: "Lỗi",
            description: "Bạn không có quyền hủy hóa đơn chưa thanh toán",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Lỗi",
          description: "Bạn không có quyền thực hiện thao tác này",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái hóa đơn",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (billId: number) => {
    try {
      const response = await billService.getDetailsById(billId);
      setSelectedBill(response);
      setDialogType("details");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xem chi tiết hóa đơn",
        variant: "destructive",
      });
    }
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await billService.searchBill({
        ...(searchParams.id && { id: searchParams.id }),
        ...(searchParams.customerName && {
          customerName: searchParams.customerName.trim(),
        }),
        ...(searchParams.customerPhone && {
          customerPhone: searchParams.customerPhone.trim(),
        }),
      });
      setSearchResults(response.data.content);
      setIsSearching(true);

      if (response.data.content.length > 0) {
        toast({
          title: "Tìm kiếm thành công",
          description: `Đã tìm thấy ${response.data.content.length} kết quả`,
          variant: "default",
        });
      } else {
        toast({
          title: "Thông báo",
          description: "Không tìm thấy kết quả phù hợp",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện tìm kiếm",
        variant: "destructive",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]:
        value === "" ? undefined : name === "id" ? parseInt(value) : value,
    }));
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
    setSearchParams({
      id: undefined,
      customerName: "",
      customerPhone: "",
    });
  };
  const handleStatusChange = async (newStatus: BillStatus) => {
    setStatus(newStatus);
    setIsSearching(false);
  };

  const handleOpenDialog = (bill: Bill) => {
    setSelectedBill({
      ...defaultBillState,
      ...bill,
    });
    setDialogType("cancel");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh sách hóa đơn</h1>
        {isSearching && searchResults.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {searchResults.length} kết quả tìm thấy
            </Badge>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              <X className="h-4 w-4 mr-1" />
              Xóa tìm kiếm
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tìm kiếm hóa đơn</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="text"
            name="id"
            placeholder="Mã hóa đơn"
            value={searchParams.id ?? ""}
            onChange={handleSearchChange}
          />
          <Input
            type="text"
            name="customerName"
            placeholder="Tên khách hàng"
            value={searchParams.customerName ?? ""}
            onChange={handleSearchChange}
          />
          <Input
            type="text"
            name="customerPhone"
            placeholder="Số điện thoại"
            value={searchParams.customerPhone ?? ""}
            onChange={handleSearchChange}
          />
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleSearchSubmit}
              disabled={
                !searchParams.id &&
                !searchParams.customerName &&
                !searchParams.customerPhone
              }
            >
              <Search className="h-4 w-4 mr-1" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Chọn trạng thái thanh toán</h2>
        <Select
          value={status}
          onValueChange={(value) => handleStatusChange(value as BillStatus)}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BillStatus.PAID}>Đã thanh toán</SelectItem>
            <SelectItem value={BillStatus.NOT_PAID}>Chưa thanh toán</SelectItem>
            <SelectItem value={BillStatus.CANCEL}>Đã hủy</SelectItem>
            <SelectItem value={BillStatus.COMPLETED}>Hoàn thành</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isSearching && searchResults.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500">Không tìm thấy kết quả phù hợp</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Tên khách hàng</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Phương thức thanh toán</TableHead>
                <TableHead>Hình thức dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian tạo</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead>Thao tác</TableHead>
                {role === "manage" && status === BillStatus.NOT_PAID && (
                  <TableHead>Hủy</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {(isSearching ? searchResults : bills).map((bill) => (
                <TableRow key={bill.billId}>
                  <TableCell>{bill.billId}</TableCell>
                  <TableCell>{bill.customerName}</TableCell>
                  <TableCell>{bill.customerPhone}</TableCell>
                  <TableCell>{bill.paymentMethod}</TableCell>
                  <TableCell>{bill.diningOption}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bill.billStatus === BillStatus.PAID
                          ? "success"
                          : bill.billStatus === BillStatus.NOT_PAID
                          ? "destructive"
                          : bill.billStatus === BillStatus.CANCEL
                          ? "secondary"
                          : "default"
                      }
                    >
                      {bill.billStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{bill.createdAt}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(bill.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(bill.billId)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                  {role === "manage" &&
                    bill.billStatus === BillStatus.NOT_PAID && (
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenDialog(bill)}
                        >
                          Hủy hóa đơn
                        </Button>
                      </TableCell>
                    )}
                </TableRow>
              ))}
              {isSearching && searchResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      Không tìm thấy kết quả phù hợp
                    </div>
                  </TableCell>
                </TableRow>
              )}

             
              {isSearching && searchResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      Không tìm thấy kết quả phù hợp
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!isSearching && (
        <TablePagination
          page={page}
          setPage={setPage}
          size={size}
          setSize={setSize}
          totalPages={totalPages}
          currentPageElements={bills.length}
          totalElements={0}
        />
      )}

      {/* Dialog xác nhận Hủy hóa đơn */}
      <Dialog
        open={dialogType === "cancel"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            <h2 className="text-lg font-semibold">Xác nhận hủy hóa đơn</h2>
          </DialogTitle>

          <p>
            Bạn có chắc chắn muốn hủy hóa đơn của {selectedBill.customerName}?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                updateBillStatus(selectedBill.billId, BillStatus.CANCEL)
              }
            >
              Xác nhận hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogType === "details"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <p className="text-sm font-medium">
              Tên khu vực: {selectedBill.nameArea}
            </p>
            <p className="text-sm">Tên bàn: {selectedBill.nameTable}</p>
            <p className="text-sm font-semibold">
              Tổng tiền: {selectedBill.totalAmount.toFixed(2)} VND
            </p>
          </div>

          {selectedBill.billDetails && selectedBill.billDetails.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h4>
              <ul className="space-y-4">
                {selectedBill.billDetails.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.productImages || "/placeholder.png"}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Giá: {item.price.toFixed(2)} VND
                      </p>
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
              onClick={() =>
                updateBillStatus(selectedBill.billId, BillStatus.COMPLETED)
              }
            >
              Xác nhận hoàn thành
            </Button>
          )}
          {selectedBill.billStatus === BillStatus.NOT_PAID && (
            <Button
              className="mt-4"
              onClick={() =>
                updateBillStatus(selectedBill.billId, BillStatus.PAID)
              }
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