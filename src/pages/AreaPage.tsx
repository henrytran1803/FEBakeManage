import React, { useState, useEffect } from 'react';
import { areaService } from "@/services/areaService"; // Import service
import { Area } from "@/types/Area"; // Import kiểu Area
import { Button } from "@/components/ui/button"; // Button UI component
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from "@/components/ui/dialog"; // Dialog UI component
import { Input } from "@/components/ui/input"; // Input UI component
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"; // Table UI component
import { Alert } from "@/components/ui/alert"; // Alert UI component

const AreaPage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]); // State để lưu danh sách khu vực
  const [newAreaName, setNewAreaName] = useState(''); // State cho tên khu vực mới
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State kiểm tra xem Dialog có mở không
  const [editingArea, setEditingArea] = useState<Area | null>(null); // State lưu khu vực đang được chỉnh sửa
  const [isError, setIsError] = useState(''); // State để lưu thông báo lỗi
  const [isLoading, setIsLoading] = useState(true); // State kiểm tra trạng thái tải

  // Lấy danh sách khu vực từ API
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const response = await areaService.getAllAreas();
        setAreas(response.data);
      } catch (error) {
        setIsError('Không thể tải danh sách khu vực');
      } finally {
        setIsLoading(false);
      }
    };

    loadAreas();
  }, []);

  // Hàm thêm mới khu vực
  const handleCreateArea = async () => {
    if (!newAreaName) {
      setIsError("Tên khu vực không được để trống");
      return;
    }

    try {
      const area: Area = {
        name: newAreaName,
        id: 0, // ID sẽ được tạo tự động từ server
        description: ""
      };

      const response = await areaService.createArea(area);
      if (response) {
        setAreas((prev) => [...prev, response.data]);
        setNewAreaName(''); // Reset input
        setIsDialogOpen(false); // Đóng dialog
      } else {
        setIsError("Không thể tạo khu vực");
      }
    } catch (error) {
      setIsError("Lỗi khi tạo khu vực");
    }
  };

  // Hàm cập nhật khu vực
  const handleUpdateArea = async () => {
    if (!editingArea || !editingArea.name) {
      setIsError("Tên khu vực không được để trống");
      return;
    }
  
    try {
      // Gọi API để cập nhật khu vực
      const response = await areaService.updateArea(editingArea.id, editingArea);
      
      if (response) {
        // Nếu response.data là một đối tượng Area hợp lệ, cập nhật lại danh sách khu vực
        const updatedAreas = areas.map((area) =>
          area.id === editingArea.id ? response : area
        );
        setAreas(updatedAreas);  // Cập nhật state với danh sách mới
        setEditingArea(null);  // Reset thông tin khu vực đang chỉnh sửa
        setIsDialogOpen(false); // Đóng dialog sau khi cập nhật
      } else {
        setIsError("Không có dữ liệu trả về từ API");
      }
    } catch (error) {
      setIsError("Cập nhật khu vực thất bại");
      console.error("Error while updating area:", error);
    }
  };
  
  

  // Hàm mở dialog để chỉnh sửa khu vực
  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setIsDialogOpen(true);
  };

  // Hàm đóng dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingArea(null); // Reset
    setIsError('');
  };

  return (
    <div className="p-4 min-w-[82vw]">
      <h1 className="text-2xl font-bold mb-4">Quản lý khu vực</h1>

      {isError && <Alert variant="destructive">{isError}</Alert>}

      {/* Danh sách khu vực */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên khu vực</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map(area => (
            <TableRow key={area.id}>
              <TableCell>{area.id}</TableCell>
              <TableCell>{area.name}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleEditArea(area)}>
                  Chỉnh sửa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Button để mở dialog thêm khu vực */}
      <Button variant="default" onClick={() => setIsDialogOpen(true)}>
        Thêm khu vực mới
      </Button>

      {/* Dialog thêm và cập nhật khu vực */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>{editingArea ? 'Cập nhật khu vực' : 'Thêm khu vực mới'}</DialogTitle>
          <div className="mb-4">
            <Input
              value={editingArea ? editingArea.name : newAreaName}
              onChange={(e) => {
                if (editingArea) {
                  setEditingArea({ ...editingArea, name: e.target.value });
                } else {
                  setNewAreaName(e.target.value);
                }
              }}
              placeholder="Nhập tên khu vực"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Đóng
            </Button>
            <Button
              variant="default"
              onClick={editingArea ? handleUpdateArea : handleCreateArea}
            >
              {editingArea ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AreaPage;
