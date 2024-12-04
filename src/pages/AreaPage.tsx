import React, { useState, useEffect } from 'react';
import { areaService } from "@/services/areaService";
import { tableService } from "@/services/tableService";
import { Area } from "@/types/Area";
import { Table as TableType, TableRequest } from "@/types/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const AreaPage: React.FC = () => {
  // Area States
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  // Table States
  const [tables, setTables] = useState<TableType[]>([]);
  const [newTable, setNewTable] = useState<TableRequest>({
    name: '',
    areaId: 0,
    active: true
  });
  const [editingTable, setEditingTable] = useState<TableType | null>(null);

  // UI States
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    type: 'area' | 'table' | 'general';
  } | null>(null);

  // Load areas on mount
  useEffect(() => {
    loadAreas();
  }, []);

  // Load tables when selected area changes
  useEffect(() => {
    if (selectedArea) {
      loadTables(selectedArea.id);
    }
  }, [selectedArea]);

     // Load tables when selected area changes
  useEffect(() => {
    if (selectedArea) {
      loadTables(selectedArea.id);
    } else {
      setTables([]);
    }
  }, [selectedArea]);

  // Load areas function
  const loadAreas = async () => {
    try {
      const response = await areaService.getAllAreas();
      setAreas(response.data);
      if (response.data.length > 0 && !selectedArea) {
        setSelectedArea(response.data[0]);
      }
    } catch (error) {
      setError({
        message: 'Không thể tải danh sách khu vực',
        type: 'area'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load tables function
  const loadTables = async (areaId: number) => {
    try {
      const response = await tableService.getTablesByArea(areaId);
      // Luôn set tables, nếu không có data thì set mảng rỗng
      setTables(response?.data || []);
      // Reset error nếu có
      setError(null);
    } catch (error) {
      // Khi có lỗi, chỉ set tables về mảng rỗng mà không hiện thông báo lỗi
      setTables([]);
      setError(null);
    }
  };

  // Area CRUD Operations
  const handleCreateArea = async () => {
    if (!newAreaName) {
      setError({
        message: "Tên khu vực không được để trống",
        type: 'area'
      });
      return;
    }

    try {
      const area: Area = {
        name: newAreaName,
        id: 0,
        description: ""
      };

      const response = await areaService.createArea(area);
      if (response) {
        await loadAreas();
        setNewAreaName('');
        setIsAreaDialogOpen(false);
      }
    } catch (error) {
      setError({
        message: "Không thể tạo khu vực",
        type: 'area'
      });
    }
  };

  const handleUpdateArea = async () => {
    if (!editingArea?.name.trim()) {
      setError({
        message: "Tên khu vực không được để trống",
        type: 'area'
      });
      return;
    }

    try {
      await areaService.updateArea(editingArea.id, editingArea);
      await loadAreas();
      setError(null);
      closeAreaDialog();
    } catch (error) {
      setError({
        message: "Không thể cập nhật khu vực",
        type: 'area'
      });
    }
  };

  // Table CRUD Operations
  const handleCreateTable = async () => {
    if (!selectedArea) {
      setError({
        message: "Vui lòng chọn khu vực trước",
        type: 'table'
      });
      return;
    }

    if (!newTable.name.trim()) {
      setError({
        message: "Tên bàn không được để trống",
        type: 'table'
      });
      return;
    }

    try {
      const request = {
        ...newTable,
        areaId: selectedArea.id
      };
      await tableService.createTable(request);
      await loadTables(selectedArea.id);
      setError(null);
      closeTableDialog();
    } catch (error) {
      setError({
        message: "Không thể tạo bàn",
        type: 'table'
      });
    }
  };
  const handleUpdateTable = async () => {
    if (!editingTable || !editingTable.name.trim()) {
      setError({
        message: "Tên bàn không được để trống",
        type: 'table'
      });
      return;
    }

    try {
      const request: TableRequest = {
        name: editingTable.name,
        areaId: editingTable.areaId,
        active: editingTable.active
      };
      
      await tableService.updateTable(editingTable.id!, request);
      await loadTables(editingTable.areaId);
      setError(null);
      closeTableDialog();
    } catch (error) {
      setError({
        message: "Không thể cập nhật bàn",
        type: 'table'
      });
    }
  };

  const closeAreaDialog = () => {
    setIsAreaDialogOpen(false);
    setEditingArea(null);
    setNewAreaName('');
    setError(null);
  };

  const closeTableDialog = () => {
    setIsTableDialogOpen(false);
    setEditingTable(null);
    setNewTable({ name: '', areaId: 0, active: true });
    setError(null);
  };

  const closeQrDialog = () => {
    setIsQrDialogOpen(false);
    setSelectedQrCode(null);
  };

  const openAreaDialog = () => {
    setError(null);
    setIsAreaDialogOpen(true);
  };

  const openTableDialog = () => {
    setError(null);
    setIsTableDialogOpen(true);
  };

  const handleQrCodeClick = (qrCodeUrl: string) => {
    setSelectedQrCode(qrCodeUrl);
    setIsQrDialogOpen(true);
  };
  
  return (
    <div className="p-4 min-w-[82vw]">
      <h1 className="text-2xl font-bold mb-4">Quản lý khu vực và bàn</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-4">
        {/* Area List Section */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh sách khu vực</CardTitle>
              <Button variant="outline" onClick={() => setIsAreaDialogOpen(true)}>
                Thêm khu vực
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {areas.map(area => (
                <div
                  key={area.id}
                  className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                    selectedArea?.id === area.id ? 'bg-primary/10' : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => setSelectedArea(area)}
                >
                  <span>{area.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingArea(area);
                      setIsAreaDialogOpen(true);
                    }}
                  >
                    Sửa
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tables Section */}
        {/* Tables Section */}
        <Card className="col-span-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Danh sách bàn {selectedArea ? `- ${selectedArea.name}` : ''}
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsTableDialogOpen(true)}
                disabled={!selectedArea}
              >
                Thêm bàn mới
              </Button>
            </div>
          </CardHeader>


          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Tên bàn</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Mã QR</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
  {tables.length > 0 ? (
    tables.map(table => (
      <TableRow key={table.id}>
        <TableCell>{table.name}</TableCell>
        <TableCell>
          {table.active ? 'Hoạt động' : 'Không hoạt động'}
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            className="p-0"
            onClick={() => handleQrCodeClick(table.qrCodeUrl)}
          >
            <img
              src={`${API_URL}${table.qrCodeUrl}`}
              alt={`QR Code for ${table.name}`}
              width={40}
              height={40}
              className="cursor-pointer hover:opacity-80"
            />
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingTable(table);
              setIsTableDialogOpen(true);
            }}
          >
            Sửa
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
        Khu vực này chưa có bàn nào
      </TableCell>
    </TableRow>
  )}
</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Area Dialog */}
      <Dialog open={isAreaDialogOpen} onOpenChange={(open) => {
        setIsAreaDialogOpen(open);
        if (!open) {
          setEditingArea(null);
          setNewAreaName('');
        }
      }}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editingArea ? 'Cập nhật khu vực' : 'Thêm khu vực mới'}
          </DialogTitle>
          <div className="space-y-4">
            <div>
              <Label>Tên khu vực</Label>
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
              <Button
                variant="outline"
                onClick={() => setIsAreaDialogOpen(false)}
              >
                Đóng
              </Button>
              <Button
                variant="default"
                onClick={editingArea ? handleUpdateArea : handleCreateArea}
              >
                {editingArea ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table Dialog */}
      <Dialog open={isTableDialogOpen} onOpenChange={(open) => {
        setIsTableDialogOpen(open);
        if (!open) {
          setEditingTable(null);
          setNewTable({ name: '', areaId: 0, active: true });
        }
      }}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>
            {editingTable ? 'Cập nhật bàn' : 'Thêm bàn mới'}
          </DialogTitle>
          <div className="space-y-4">
            <div>
              <Label>Tên bàn</Label>
              <Input
                value={editingTable ? editingTable.name : newTable.name}
                onChange={(e) => {
                  if (editingTable) {
                    setEditingTable({ ...editingTable, name: e.target.value });
                  } else {
                    setNewTable({ ...newTable, name: e.target.value });
                  }
                }}
                placeholder="Nhập tên bàn"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editingTable ? editingTable.active : newTable.active}
                onCheckedChange={(checked) => {
                  if (editingTable) {
                    setEditingTable({ ...editingTable, active: checked });
                  } else {
                    setNewTable({ ...newTable, active: checked });
                  }
                }}
              />
              <Label>Hoạt động</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsTableDialogOpen(false)}
              >
                Đóng
              </Button>
              <Button
                variant="default"
                onClick={editingTable ? handleUpdateTable : handleCreateTable}
              >
                {editingTable ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

        {/* QR Code Dialog */}
        <Dialog 
        open={isQrDialogOpen} 
        onOpenChange={(open) => {
          setIsQrDialogOpen(open);
          if (!open) setSelectedQrCode(null);
        }}
      >
        <DialogOverlay />
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Mã QR</DialogTitle>
          <div className="flex justify-center items-center p-4">
            {selectedQrCode && (
              <img
              src={`${API_URL}${selectedQrCode}`}
                alt="QR Code"
                className="w-64 h-64 object-contain"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsQrDialogOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AreaPage;