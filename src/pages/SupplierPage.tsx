import React, { useEffect, useState } from "react";
import { supplierService } from "@/services/supplierService";
import { Supplier } from "@/types/Supplier";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import {useCustomToast} from "@/hooks/CustomAlert.tsx";
import {SupplierErrorCode} from "@/utils/error/SupplierErrorCode.ts";


const SupplierPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState<Omit<Supplier, "id">>({ name: "", number: "" });
    const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const fetchSuppliers = async () => {
        try {
            const response = await supplierService.getSuppliers();
            setSuppliers(response.data);
        } catch (error) {
            showErrorToast(SupplierErrorCode.FETCH_ERROR);
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

    const validateSupplier = (): boolean => {
        if (!currentSupplier.name.trim()) {
            showErrorToast(SupplierErrorCode.NAME_REQUIRED);
            return false;
        }
        if (!currentSupplier.number.trim()) {
            showErrorToast(SupplierErrorCode.PHONE_REQUIRED);
            return false;
        }
        // Validate phone number format (assuming Vietnamese phone number)
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(currentSupplier.number)) {
            showErrorToast(SupplierErrorCode.PHONE_REQUIRED);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        try {
            if (!validateSupplier()) {
                return;
            }

            if (isEditMode && editingSupplierId !== null) {
                await supplierService.updateSupplier(editingSupplierId, currentSupplier);
                showSuccessToast(SupplierErrorCode.UPDATE_SUCCESS);
            } else {
                await supplierService.createSupplier(currentSupplier);
                showSuccessToast(SupplierErrorCode.CREATE_SUCCESS);
            }

            setShowModal(false);
            setEditingSupplierId(null);
            await fetchSuppliers();
        } catch (error) {
            showErrorToast(
                isEditMode ? SupplierErrorCode.UPDATE_ERROR : SupplierErrorCode.CREATE_ERROR
            );
        }
    };

    const handleInputChange = (field: keyof Omit<Supplier, "id">, value: string) => {
        setCurrentSupplier({ ...currentSupplier, [field]: value });
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
                {suppliers.map((supplier) => (
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

            {showModal && (
                <Modal
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