import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingredientService } from "@/services/ingredientService";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal"; // Import Modal component

const ExportHistoryPage: React.FC = () => {
    const navigate = useNavigate(); // Hook điều hướng trang
    const [exportIngredients, setExportIngredients] = useState<any[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExport, setSelectedExport] = useState<any | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const fetchExportIngredients = async () => {
            try {
                setLoading(true);
                const response = await ingredientService.getExportIngredients();
                const ingredientResponse = await ingredientService.getAllIngredients();

                if (response.success && ingredientResponse.success) {
                    // Sắp xếp theo export_date trước khi lưu vào state
                    const sortedData = response.data.sort((a: any, b: any) => 
                        new Date(b.export_date).getTime() - new Date(a.export_date).getTime()
                    );
                    setExportIngredients(sortedData);
                    setIngredients(ingredientResponse.data);
                }
            } catch (error) {
                console.error("Error fetching export ingredients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExportIngredients();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Hàm mở modal chi tiết
    const handleShowDetails = (exportItem: any) => {
        setSelectedExport(exportItem);
        setShowDetailsModal(true);
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

            <h1 className="text-2xl font-bold mb-6">Lịch sử xuất nguyên liệu</h1>

            <table className="w-full mt-4 border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Sender ID</th>
                        <th className="border px-4 py-2">Ngày xuất</th>
                        <th className="border px-4 py-2">Tổng số lượng</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {exportIngredients.map((ingredient) => (
                        <tr key={ingredient.id}>
                            <td className="border px-4 py-2">{ingredient.sender_id}</td>
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
                                }).format(new Date(ingredient.export_date))}
                            </td>
                            <td className="border px-4 py-2">{ingredient.total_amount}</td>
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
            {showDetailsModal && selectedExport && (
                <Modal
                    title="Chi tiết xuất nguyên liệu"
                    onClose={() => setShowDetailsModal(false)}
                    actions={<Button onClick={() => setShowDetailsModal(false)}>Đóng</Button>}
                >
                    <h2 className="font-bold">Danh sách nguyên liệu:</h2>
                    <table className="w-full mt-4 border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Ingredient ID</th>
                                <th className="border px-4 py-2">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedExport.ingredients.map((ingredientDetail: any) => (
                                <tr key={ingredientDetail.ingredient_id}>
                                    {/* <td className="border px-4 py-2">{ingredientDetail.ingredient_id}</td> */}
                                    <td className="border px-4 py-2">
                                        {getIngredientNameById(ingredientDetail.ingredient_id)}
                                    </td>
                                    <td className="border px-4 py-2">{ingredientDetail.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal>
            )}
        </div>
    );
};

export default ExportHistoryPage;
