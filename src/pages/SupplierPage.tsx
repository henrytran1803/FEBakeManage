import React, { useEffect, useState } from "react";
import { supplierService } from "@/services/supplierService";
import { Supplier } from "@/types/Supplier";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { useCustomToast } from "@/hooks/CustomAlert";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";

const SupplierPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState<Omit<Supplier, "id">>({ name: "", number: "" });
    const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
    const { showErrorToast, showSuccessToast } = useCustomToast();

    // Phân trang state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Mỗi trang hiển thị 10 nhà cung cấp
    const totalPages = Math.ceil(suppliers.length / itemsPerPage);
    const currentItems = suppliers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchSuppliers = async () => {
        try {
            const response = await supplierService.getSuppliers();
            if (response.success) {
                setSuppliers(response.data);
            } else {
                showErrorToast(ErrorCode.SUPPLIER_FETCH_FAIL);
            }

        } catch (error) {
            showErrorToast(ErrorCode.SUPPLIER_FETCH_FAIL);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleOpenAddModal = () => {
        setCurrentSupplier({ name: "", number: "" });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleOpenEditModal = (supplier: Supplier) => {
        setCurrentSupplier({ name: supplier.name, number: supplier.number });
        setEditingSupplierId(supplier.id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const validateSupplier = (supplier: Omit<Supplier, "id">): string | null => {
        if (!supplier.name.trim()) {
            return ErrorCode.SUPPLIER_NAME_REQUIRED;
        }
        if (supplier.name.length > 50) {
            return ErrorCode.SUPPLIER_NAME_LENGTH;
        }
        if (!supplier.number.trim()) {
            return ErrorCode.SUPPLIER_NUMBER_REQUIRED;
        }
        if (supplier.number.trim().length < 8 || supplier.number.trim().length > 15) {
            return ErrorCode.SUPPLIER_NUMBER_LENGTH;
        }
        return null; // Dữ liệu hợp lệ
    };


    const handleSave = async () => {
        const validationError = validateSupplier(currentSupplier);

        if (validationError) {
            showErrorToast(validationError);
            return;
        }

        try {
            let response;
            if (isEditMode && editingSupplierId !== null) {
                // Update supplier
                response = await supplierService.updateSupplier(editingSupplierId, currentSupplier);
            } else {
                // Add new supplier
                response = await supplierService.createSupplier(currentSupplier);
            }

            if (response.success) {
                showSuccessToast(
                    isEditMode
                        ? ErrorCode.SUPPLIER_UPDATE_SUCCESS
                        : ErrorCode.SUPPLIER_ADD_SUCCESS
                );
                await fetchSuppliers(); // Cập nhật danh sách nhà cung cấp
                setShowModal(false); // Đóng modal
                setEditingSupplierId(null);
            } else {
                showErrorToast(
                    isEditMode
                        ? ErrorCode.SUPPLIER_UPDATE_FAIL
                        : ErrorCode.SUPPLIER_ADD_FAIL
                );
            }
        } catch (error) {
            showErrorToast(ErrorCode.SUPPLIER_UPDATE_FAIL);
        }
    };


    const handleInputChange = (field: keyof Omit<Supplier, "id">, value: string) => {
        setCurrentSupplier({ ...currentSupplier, [field]: value });
    };

    // Phân trang logic
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="p-4 min-w-[80vw]">
            <h1 className="text-2xl font-bold mb-4">Danh Sách Nhà Cung Cấp</h1>
            <Button onClick={handleOpenAddModal}>Thêm Nhà Cung Cấp</Button>

            <table className="table-auto min-w-full mt-4 border">
                <thead>
                <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Tên Nhà Cung Cấp</th>
                    <th className="border px-4 py-2">Số Điện Thoại</th>
                    <th className="border px-4 py-2">Thao Tác</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((supplier) => (
                    <tr key={supplier.id}>
                        <td className="border px-4 py-2">{supplier.id}</td>
                        <td className="border px-4 py-2">{supplier.name}</td>
                        <td className="border px-4 py-2">{supplier.number}</td>
                        <td className="border px-4 py-2">
                            <Button onClick={() => handleOpenEditModal(supplier)}>Sửa</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    Hiển thị {currentItems.length} trên tổng số {suppliers.length} nhà cung cấp
                </div>
                <div className="flex items-center">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Trước
                    </Button>
                    <span className="mx-2">Trang {currentPage} / {totalPages}</span>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Sau
                    </Button>
                </div>
            </div>

            {showModal && (
                <Modal
                    isOpen={showModal}
                    title={isEditMode ? "Sửa Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}
                    onClose={() => setShowModal(false)}
                    actions={
                        <>
                            <Button onClick={() => setShowModal(false)}>Hủy</Button>
                            <Button onClick={handleSave}>OK</Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Tên Nhà Cung Cấp</label>
                            <input
                                type="text"
                                value={currentSupplier.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="w-full border rounded px-2 py-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Số Điện Thoại</label>
                            <input
                                type="text"
                                value={currentSupplier.number}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        handleInputChange("number", value);
                                    }
                                }}
                                className="w-full border rounded px-2 py-1"
                                placeholder="Chỉ nhập số"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default SupplierPage;
