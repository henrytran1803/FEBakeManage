import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ingredientService } from "@/services/ingredientService";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal"; 
import { UserName } from "@/types/User";
import { userService } from "@/services/userService";
import { Unit } from "@/types/Unit";
import { unitService } from "@/services/unitService";
import { useCustomToast } from "@/hooks/CustomAlert";
import { IngredientErrorCode } from "@/utils/error/ingredientError";

const ExportHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [exportIngredients, setExportIngredients] = useState<any[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [units, setUnits] = useState<Unit[]>([]); 
    const [loading, setLoading] = useState(true);
    const [selectedExport, setSelectedExport] = useState<any | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [users, setUsers] = useState<UserName[]>([]);
    const { showErrorToast, showSuccessToast } = useCustomToast();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Items per page
    const totalPages = Math.ceil(exportIngredients.length / itemsPerPage);
    const currentItems = exportIngredients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const fetchExportIngredients = async () => {
            try {
                setLoading(true);
                const response = await ingredientService.getExportIngredients();
                const ingredientResponse = await ingredientService.getAllIngredients();

                if (response.success ) {
                    const sortedData = response.data.sort((a: any, b: any) => 
                        new Date(b.export_date).getTime() - new Date(a.export_date).getTime()
                    );
                    setExportIngredients(sortedData);
                    
                } else {
                    showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_FETCH_FAIL);
                }

                if (ingredientResponse.success) {
                    setIngredients(ingredientResponse.data);
                } else {
                    showErrorToast(IngredientErrorCode.INGREDIENT_FETCH_FAIL);
                }

                const UserResponse = await userService.getAllUser();
                if(UserResponse.success) {
                    setUsers(UserResponse.data);
                } else {
                    showErrorToast(IngredientErrorCode.USER_FETCH_FAIL);
                }

            } catch (error) {
                showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_FETCH_FAIL);
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
                    showErrorToast(IngredientErrorCode.UNIT_FETCH_FAIL);
                }
            } catch (error) {
                showErrorToast(IngredientErrorCode.UNIT_FETCH_FAIL);
            }
        };

        fetchExportIngredients();
        fetchUnits();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleShowDetails = (exportItem: any) => {
        setSelectedExport(exportItem);
        setShowDetailsModal(true);
    };

    const getIngredientNameById = (id: number) => {
        const ingredient = ingredients.find((ingredient: any) => ingredient.id === id);
        return ingredient ? ingredient.name : `ID: ${id}`;
    };

    const getNameUserById = (id: number) => {
        if (!users || users.length === 0) {
            console.warn("Users list is empty or undefined");
            return `ID: ${id}`;
        }
        const user = users.find((user: any) => user.id === id);
        return user ? user.firstName + " " + user.lastName : `ID: ${id}`;
    };

    const getUnitByIngredientId = (id: number) => {
        const ingredient = ingredients.find((ingredient: any) => ingredient.id === id);
        return ingredient ? getUnitName(ingredient.unit_id) : `ID: ${id}`;
    };

    const getUnitName = (unitId: number) => {
        const unit = units.find((unit) => unit.id === unitId);
        return unit ? unit.name : "Không xác định";
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

            <h1 className="text-2xl font-bold mb-6">Lịch sử xuất nguyên liệu</h1>

            <table className="w-full mt-4 border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Người xuất kho</th>
                        <th className="border px-4 py-2">Ngày xuất</th>
                        <th className="border px-4 py-2">Tổng số lượng</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((ingredient) => (
                        <tr key={ingredient.id}>
                            <td className="border px-4 py-2">{getNameUserById(ingredient.sender_id)}</td>
                            <td className="border px-4 py-2">
                                {new Intl.DateTimeFormat('vi-VN', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    Hiển thị {currentItems.length} trên tổng số {exportIngredients.length} danh mục
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
                                <th className="border px-4 py-2">Nguyên liệu</th>
                                <th className="border px-4 py-2">Số lượng</th>
                                <th className="border px-4 py-2">Đơn vị</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedExport.ingredients.map((ingredientDetail: any) => (
                                <tr key={ingredientDetail.ingredient_id}>
                                    <td className="border px-4 py-2">
                                        {getIngredientNameById(ingredientDetail.ingredient_id)}
                                    </td>
                                    <td className="border px-4 py-2">{ingredientDetail.quantity}</td>
                                    <td className="border px-4 py-2">{getUnitByIngredientId(ingredientDetail.ingredient_id)}</td>
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
