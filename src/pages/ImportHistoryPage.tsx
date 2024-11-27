import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingredientService } from "@/services/ingredientService"; 
import { supplierService } from "@/services/supplierService";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal"; 

const ImportHistoryPage: React.FC = () => {
    const navigate = useNavigate(); // điều hướng trang
    const [importIngredients, setImportIngredients] = useState<any[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImport, setSelectedImport] = useState<any | null>(null);
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const fetchImportIngredients = async () => {
            try {
                setLoading(true);
                const response = await ingredientService.getImportIngredients();
                const supplierResponse = await supplierService.getSuppliers();
                const ingredientResponse = await ingredientService.getAllIngredients();

                if (response.success && supplierResponse.success && ingredientResponse.success) { 
                    // Sắp xếp theo import_date trước khi lưu vào state
                    const sortedData = response.data.sort((a: any, b: any) => 
                        new Date(b.import_date).getTime() - new Date(a.import_date).getTime()
                    );
                    setImportIngredients(sortedData);
                    setSuppliers(supplierResponse.data);
                    setIngredients(ingredientResponse.data);
                }
            } catch (error) {
                console.error("Error fetching import ingredients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImportIngredients();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Hàm mở modal chi tiết
    const handleShowDetails = (importItem: any) => {
        setSelectedImport(importItem);
        setShowDetailsModal(true);
    };

    // Hàm tìm tên nhà cung cấp theo id
    const getSupplierNameById = (id: number | null) => {
        if (!id) return ""; //Nếu id null thì để trống
        const supplier = suppliers.find((supplier: any) => supplier.id === id);
        return supplier ? supplier.name : "";
    };

    // Hàm tìm tên nguyên liệu theo id
    const getIngredientNameById = (id: number) => {
        const ingredient = ingredients.find((ingredient: any) => ingredient.id === id);
        return ingredient ? ingredient.name : `ID: ${id}`;
    };

    return (
        <div className="p-4 min-w-[80vw]">
            {/* Nút quay lại */}
            <Button
                variant="outline"
                onClick={() => navigate("/admin/ingredient")}
            >
                Quay lại
            </Button>

            <h1 className="text-2xl font-bold mb-6">Lịch sử nhập nguyên liệu</h1>

            <table className="w-full mt-4 border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">User ID</th>
                        <th className="border px-4 py-2">Nhà cung cấp</th>
                        <th className="border px-4 py-2">Ngày nhập</th>
                        <th className="border px-4 py-2">Tổng số tiền</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {importIngredients.map((ingredient) => (
                        <tr key={ingredient.id}>
                            <td className="border px-4 py-2">{ingredient.user_id}</td>
                            {/* <td className="border px-4 py-2">{ingredient.id_supplier}</td> */}
                            <td className="border px-4 py-2">
                                {getSupplierNameById(ingredient.id_supplier)}
                            </td>
                            <td className="border px-4 py-2">
                                {new Intl.DateTimeFormat('vi-VN', {
                                    weekday: 'short', // optional
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false, // 24-hour format
                                }).format(new Date(ingredient.import_date))}
                            </td>
                            {/* <td className="border px-4 py-2">{ingredient.total_amount}</td> */}
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

            {/* Modal chi tiết */}
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
                                <th className="border px-4 py-2">Ingredient ID</th>
                                <th className="border px-4 py-2">Số lượng</th>
                                <th className="border px-4 py-2">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedImport.ingredients.map((ingredientDetail: any) => (
                                <tr key={ingredientDetail.ingredient_id}>
                                    {/* <td className="border px-4 py-2">{ingredientDetail.ingredient_id}</td> */}
                                    <td className="border px-4 py-2">
                                        {getIngredientNameById(ingredientDetail.ingredient_id)}
                                    </td>
                                    <td className="border px-4 py-2">{ingredientDetail.quantity}</td>
                                    <td className="border px-4 py-2">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ingredientDetail.price)}
                                    </td>
                                    {/* <td className="border px-4 py-2">{ingredientDetail.price}</td> */}
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
