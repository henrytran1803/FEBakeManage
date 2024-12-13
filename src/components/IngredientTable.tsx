import React, { useState } from "react";
import { Ingredient } from "@/types/Ingredient.ts";
import { Trash, Edit } from "lucide-react";
import { ingredientService } from "@/services/ingredientService";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { Unit } from "@/types/Unit";
import { useCustomToast } from "@/hooks/CustomAlert";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";

interface IngredientTableProps {
    ingredients: Ingredient[];
    units: Unit[];
    isActiveFilter: boolean; 
    onRefresh: () => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({ ingredients, units, isActiveFilter, onRefresh }) => {
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null); // Ingredient đang sửa
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Hiển thị modal xác nhận xóa
    const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null); // ID nguyên liệu cần xóa
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Lưu lỗi từng trường khi sửa nguyên liệu
    const { showErrorToast, showSuccessToast } = useCustomToast();

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Số lượng mục mỗi trang
    const totalPages = Math.ceil(ingredients.length / itemsPerPage);

    // Dữ liệu của trang hiện tại
    const currentIngredients = ingredients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatus = (quantity: number, warningLimit: number) => {
        return quantity <= warningLimit ? "Cần nhập thêm" : "Đủ nguyên liệu";
    };

    const getUnitName = (unitId: number) => {
        const unit = units.find((unit) => unit.id === unitId);
        return unit ? unit.name : "Không xác định";
    };

    const handleDelete = async () => {
        if (selectedIngredientId) {
            try {
                const deleteResponse = await ingredientService.deleteIngredient(selectedIngredientId);
                if (deleteResponse.success) {
                    onRefresh(); // Refresh danh sách sau khi xóa thành công
                    showSuccessToast(ErrorCode.INGREDIENT_DELETE_SUCCESS);
                } else {
                    showErrorToast(ErrorCode.INGREDIENT_DELETE_FAIL);
                }
                
            } catch (error) {
                showErrorToast(ErrorCode.INGREDIENT_DELETE_FAIL);
            } finally {
                setShowDeleteConfirm(false); // Đóng modal xác nhận
            }
        }
    };

    const handleEdit = (ingredient: Ingredient) => {
        setEditingIngredient(ingredient); // Mở form sửa với dữ liệu của nguyên liệu
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (editingIngredient) {
            if (!editingIngredient?.name.trim()) {
                newErrors.name = "Tên nguyên liệu không được để trống.";
                showErrorToast(ErrorCode.INGREDIENT_NAME_REQUIRED);
            }
            if (editingIngredient?.name.length > 100 ) {
                newErrors.name = "Tên nguyên liệu không được quá 100 ký tự";
                showErrorToast(ErrorCode.INGREDIENT_NAME_LENGTH);
            }
        } else {
            newErrors.name = "Tên nguyên liệu không được để trống.";
            showErrorToast(ErrorCode.INGREDIENT_NAME_REQUIRED);
        }
        

        if (editingIngredient?.unit_id === 0) {
            newErrors.unit_id = "Vui lòng chọn đơn vị.";
            showErrorToast(ErrorCode.INGREDIENT_UNIT_REQUIRED);
        }

        if (editingIngredient && editingIngredient?.warning_limits < 0) {
            newErrors.warning_limits = "Giới hạn cảnh báo không được nhỏ hơn 0.";
            showErrorToast(ErrorCode.INGREDIENT_WARNING_LIMIT);
        }

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0; 
    };

    const handleEditSubmit = async () => {
        if (!validateForm()) {
            return; 
        }

        if (editingIngredient) {
            try {
                const editResponse = await ingredientService.updateIngredient(editingIngredient.id, {
                    name: editingIngredient.name,
                    unit_id: editingIngredient.unit_id,
                    warning_limits: editingIngredient.warning_limits,
                });
                if (editResponse.success) {
                    showSuccessToast(ErrorCode.INGREDIENT_UPDATE_SUCCESS);
                } else {
                    showErrorToast(ErrorCode.INGREDIENT_UPDATE_FAIL);
                }
                onRefresh(); 
            } catch (error) {
                showErrorToast(ErrorCode.INGREDIENT_UPDATE_FAIL);
            } finally {
                setEditingIngredient(null); 
            }
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Tên nguyên liệu</th>
                        <th className="border px-4 py-2">Số lượng</th>
                        <th className="border px-4 py-2">Đơn vị</th>
                        <th className="border px-4 py-2">Trạng thái</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentIngredients.map((ingredient) => {
                        const status = getStatus(ingredient.quantity, ingredient.warning_limits);
                        const isLowStock = status === "Cần nhập thêm"; 
                        
                        return (
                            <tr key={ingredient.id} className={isLowStock ? "bg-yellow-100" : ""}>
                                <td className={`border px-4 py-2 ${isLowStock ? "text-red-500" : ""}`}>
                                    {ingredient.name}
                                </td>
                                <td className="border px-4 py-2">{ingredient.quantity}</td>
                                <td className="border px-4 py-2">{getUnitName(ingredient.unit_id)}</td>
                                <td className={`border px-4 py-2 ${isLowStock ? "text-red-500" : ""}`}>{status}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="text-blue-500 mr-2"
                                        onClick={() => handleEdit(ingredient)}
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    {isActiveFilter && (
                                        <button
                                            className="text-red-500"
                                            onClick={() => {
                                                setSelectedIngredientId(ingredient.id);
                                                setShowDeleteConfirm(true);
                                            }}
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    Hiển thị {currentIngredients.length} trên tổng số {ingredients.length} danh mục
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

            {/* Modal xác nhận xóa */}
            {showDeleteConfirm && (
                <Modal
                    title="Xác nhận xóa"
                    onClose={() => setShowDeleteConfirm(false)}
                    actions={
                        <>
                            <Button onClick={() => setShowDeleteConfirm(false)}>Hủy</Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Xóa
                            </Button>
                        </>
                    }
                >
                    Bạn có chắc chắn muốn xóa nguyên liệu này không?
                </Modal>
            )}

            {/* Form sửa */}
            {editingIngredient && (
                <Modal
                    title="Sửa nguyên liệu"
                    onClose={() => setEditingIngredient(null)}
                    actions={
                        <>
                            <Button onClick={() => setEditingIngredient(null)}>Hủy</Button>
                            <Button onClick={handleEditSubmit}>Lưu</Button>
                        </>
                    }
                >
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tên nguyên liệu</label>
                            <input
                                type="text"
                                value={editingIngredient.name}
                                className="border rounded p-2 w-full"
                                onChange={(e) =>
                                    setEditingIngredient({ ...editingIngredient, name: e.target.value })
                                }
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
                            <select
                                className="border rounded p-2 w-full"
                                value={editingIngredient.unit_id}
                                onChange={(e) =>
                                    setEditingIngredient({
                                        ...editingIngredient,
                                        unit_id: parseInt(e.target.value, 10),
                                    })
                                }
                            >
                                <option value={0} disabled>Chọn đơn vị</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            {errors.unit_id && <p className="text-red-500 text-sm">{errors.unit_id}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Warning Limits</label>
                            <input
                                type="number"
                                value={editingIngredient.warning_limits}
                                className="border rounded p-2 w-full"
                                onChange={(e) =>
                                    setEditingIngredient({
                                        ...editingIngredient,
                                        warning_limits: parseFloat(e.target.value),
                                    })
                                }
                            />
                            {errors.warning_limits && <p className="text-red-500 text-sm">{errors.warning_limits}</p>}
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default IngredientTable;
