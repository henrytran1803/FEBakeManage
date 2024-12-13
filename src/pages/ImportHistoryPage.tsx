import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingredientService } from "@/services/ingredientService"; 
import { supplierService } from "@/services/supplierService";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal"; 
import { userService } from "@/services/userService";
import { UserName } from "@/types/User";
import { unitService } from "@/services/unitService";
import { Unit } from "@/types/Unit";
import { useCustomToast } from "@/hooks/CustomAlert";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";

const ImportHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [importIngredients, setImportIngredients] = useState<any[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [units, setUnits] = useState<Unit[]>([]); 
    const [loading, setLoading] = useState(true);
    const [selectedImport, setSelectedImport] = useState<any | null>(null);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [users, setUsers] = useState<UserName[]>([]);
    const { showErrorToast } = useCustomToast();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Items per page
    const totalPages = Math.ceil(importIngredients.length / itemsPerPage);
    const currentItems = importIngredients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    
    useEffect(() => {
        // Lấy danh sách lịch sử nhập
        const fetchImportIngredients = async () => {
            try {
                setLoading(true);
                const response = await ingredientService.getImportIngredients();
                const supplierResponse = await supplierService.getSuppliers();
                const ingredientResponse = await ingredientService.getAllIngredients();
                
                if (response.success) { 
                    const sortedData = response.data.sort((a: any, b: any) => 
                        new Date(b.import_date).getTime() - new Date(a.import_date).getTime()
                    );
                    setImportIngredients(sortedData);
                } else {
                    showErrorToast(ErrorCode.IMPORT_INGREDIENT_FETCH_FAIL);
                }

                if (supplierResponse.success) {
                    setSuppliers(supplierResponse.data);
                } else {
                    showErrorToast(ErrorCode.SUPPLIER_FETCH_FAIL);
                }

                if (ingredientResponse.success) {
                    setIngredients(ingredientResponse.data);
                } else {
                    showErrorToast(ErrorCode.INGREDIENT_FETCH_FAIL);
                }

                const UserResponse = await userService.getAllUser();
                if (UserResponse.success) {
                    setUsers(UserResponse.data);
                } else {
                    showErrorToast(ErrorCode.USER_FETCH_FAIL);
                }
            } catch (error) {
                showErrorToast(ErrorCode.IMPORT_INGREDIENT_FETCH_FAIL);
            } finally {
                setLoading(false);
            }
        };

        //Lấy danh sách đơn vị
        const fetchUnits = async () => {
            try {
                const response = await unitService.getAllUnits();
                if (response.success) {
                    setUnits(response.data);
                } else {
                    showErrorToast(ErrorCode.UNIT_FETCH_FAIL);
                }
            } catch (error) {
                showErrorToast(ErrorCode.UNIT_FETCH_FAIL);
            }
        };

        fetchImportIngredients();
        fetchUnits();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleShowDetails = (importItem: any) => {
        setSelectedImport(importItem);
        setShowDetailsModal(true);
    };

    const getSupplierNameById = (id: number | null) => {
        if (!id) return "";
        const supplier = suppliers.find((supplier: any) => supplier.id === id);
        return supplier ? supplier.name : "";
    };

    const getIngredientNameById = (id: number) => {
        const ingredient = ingredients.find((ingredient: any) => ingredient.id === id);
        return ingredient ? ingredient.name : `ID: ${id}`;
    };

    const getUnitByIngredientId = (id: number) => {
        const ingredient = ingredients.find((ingredient: any) => ingredient.id === id);
        return ingredient ? getUnitName(ingredient.unit_id) : `ID: ${id}`;
    };

    const getUnitName = (unitId: number) => {
        const unit = units.find((unit) => unit.id === unitId);
        return unit ? unit.name : "Không xác định";
    };

    const getNameUserById = (id: number) => {
        const user = users.find((user: any) => user.id === id);
        return user ? user.firstName + " " + user.lastName : `ID: ${id}`;
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="p-4 min-w-[80vw]">
            <Button variant="outline" onClick={() => navigate("/admin/ingredient")}>
                Quay lại
            </Button>

            <h1 className="text-2xl font-bold mb-6">Lịch sử nhập nguyên liệu</h1>

            <table className="w-full mt-4 border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Người nhập</th>
                        <th className="border px-4 py-2">Nhà cung cấp</th>
                        <th className="border px-4 py-2">Ngày nhập</th>
                        <th className="border px-4 py-2">Tổng số tiền</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((ingredient) => (
                        <tr key={ingredient.id}>
                            <td className="border px-4 py-2">{getNameUserById(ingredient.user_id)}</td>
                            <td className="border px-4 py-2">{getSupplierNameById(ingredient.id_supplier)}</td>
                            <td className="border px-4 py-2">
                                {new Intl.DateTimeFormat('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }).format(new Date(ingredient.import_date))}
                            </td>
                            <td className="border px-4 py-2">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ingredient.total_amount)}
                            </td>
                            <td className="border px-4 py-2">
                                <Button onClick={() => handleShowDetails(ingredient)}>
                                    Xem chi tiết
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    Hiển thị {currentItems.length} trên tổng số {importIngredients.length} danh mục
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

            {showDetailsModal && selectedImport && (
                <Modal
                    title="Chi tiết nhập nguyên liệu"
                    onClose={() => setShowDetailsModal(false)}
                    actions={<Button onClick={() => setShowDetailsModal(false)}>Đóng</Button>}
                >
                    <h2 className="font-bold">Danh sách nguyên liệu:</h2>
                    <table className="w-full mt-4 border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Nguyên liệu</th>
                                <th className="border px-4 py-2">Số lượng</th>
                                <th className="border px-4 py-2">Đơn vị</th>
                                <th className="border px-4 py-2">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedImport.ingredients.map((ingredientDetail: any) => (
                                <tr key={ingredientDetail.ingredient_id}>
                                    <td className="border px-4 py-2">{getIngredientNameById(ingredientDetail.ingredient_id)}</td>
                                    <td className="border px-4 py-2">{ingredientDetail.quantity}</td>
                                    <td className="border px-4 py-2">{getUnitByIngredientId(ingredientDetail.ingredient_id)}</td>
                                    <td className="border px-4 py-2">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ingredientDetail.price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal>
            )}
        </div>
    );
};

export default ImportHistoryPage;
