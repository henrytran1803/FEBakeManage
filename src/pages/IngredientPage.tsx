import React, { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { ingredientService } from "@/services/ingredientService";
import { Ingredient } from "@/types/Ingredient";
import LoadingScreen from "@/pages/LoadingScreen";
import { Button } from "@/components/ui/button";
import IngredientTable from "@/components/IngredientTable";
import { Unit } from "@/types/Unit";
import { unitService } from "@/services/unitService";
import Modal from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "@/hooks/CustomAlert";
import { IngredientErrorCode } from "@/utils/error/ingredientError";

const IngredientPage: React.FC = () => {
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]); // Dữ liệu từ API
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]); // Dữ liệu đã lọc
    const [units, setUnits] = useState<Unit[]>([]); // Danh sách đơn vị
    const [loading, setLoading] = useState(true);

    const [isActiveFilter, setIsActiveFilter] = useState(true); // Bộ lọc Hoạt động/Không hoạt động
    const [statusFilter, setStatusFilter] = useState("Tất cả"); // Bộ lọc Tất cả/Đủ nguyên liệu/Cần nhập thêm
    const [showAddUnitModal, setShowAddUnitModal] = useState(false); // Modal thêm đơn vị
    const [showAddModal, setShowAddModal] = useState(false); // Hiển thị modal thêm nguyên liệu
    const [newUnit, setNewUnit] = useState({ name: "" });
    const [newIngredient, setNewIngredient] = useState({
        name: "",
        unit_id: 0,
        warning_limits: 0,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const { showErrorToast, showSuccessToast } = useCustomToast();

    // Fetch danh sách nguyên liệu
    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const response = await ingredientService.getAllIngredients();
            if (response.success) {
                setAllIngredients(response.data);
            } else {
                showErrorToast(IngredientErrorCode.INGREDIENT_FETCH_FAIL);
            }
        } catch (error) {
            showErrorToast(IngredientErrorCode.INGREDIENT_FETCH_FAIL);
        } finally {
            setLoading(false);
        }
    };

    // Fetch danh sách đơn vị
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

    // Lọc dữ liệu dựa trên bộ lọc
    const applyFilters = () => {
        let filtered = allIngredients;

        // Lọc theo trạng thái hoạt động
        filtered = filtered.filter((ingredient) => ingredient.isactive === isActiveFilter);

        // Lọc theo trạng thái số lượng
        if (statusFilter === "Đủ nguyên liệu") {
            filtered = filtered.filter((ingredient) => ingredient.quantity > ingredient.warning_limits);
        } else if (statusFilter === "Cần nhập thêm") {
            filtered = filtered.filter((ingredient) => ingredient.quantity <= ingredient.warning_limits);
        }

        setFilteredIngredients(filtered);
    };

    // Xử lý thêm nguyên liệu mới
    const handleAddSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await ingredientService.createIngredient(newIngredient);
            if (response.success) {
                showSuccessToast(IngredientErrorCode.INGREDIENT_ADD_SUCCESS);
                fetchIngredients(); // Refresh danh sách nguyên liệu
                setShowAddModal(false);
                setNewIngredient({ name: "", unit_id: 0, warning_limits: 0 });
            } else {
                showErrorToast(IngredientErrorCode.INGREDIENT_ADD_FAIL);
            }
        } catch (error) {
            console.error("Error adding ingredient:", error);
            showErrorToast(IngredientErrorCode.INGREDIENT_ADD_FAIL);
        }
    };

    // Kiểm tra dữ liệu nhập vào
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!newIngredient.name.trim()) {
            newErrors.name = "Tên nguyên liệu không được để trống.";
            showErrorToast(IngredientErrorCode.INGREDIENT_NAME_REQUIRED);
        }
        if (newIngredient.name.length > 100) {
            showErrorToast(IngredientErrorCode.INGREDIENT_NAME_LENGTH);
        }
        if (newIngredient.unit_id === 0) {
            newErrors.unit_id = "Vui lòng chọn đơn vị.";
            showErrorToast(IngredientErrorCode.INGREDIENT_UNIT_REQUIRED);
        }
        if (newIngredient.warning_limits < 0) {
            newErrors.warning_limits = "Giới hạn cảnh báo không được nhỏ hơn 0.";
            showErrorToast(IngredientErrorCode.INGREDIENT_WARNING_LIMIT);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddUnitSubmit = async () => {
        if (!newUnit.name.trim()) {
            setErrors({ name: "Tên đơn vị không được để trống." });
            showErrorToast(IngredientErrorCode.UNIT_NAME_REQUIRED);
            return;
        }
        if (newUnit.name.length > 50) {
            showErrorToast(IngredientErrorCode.UNIT_NAME_LENGTH);
            return;
        }

        try {
            await unitService.createUnit(newUnit.name.trim());
            showSuccessToast(IngredientErrorCode.UNIT_ADD_SUCCESS);
            setShowAddUnitModal(false); // Đóng modal
            setNewUnit({ name: "" }); // Reset form
            setErrors({}); // Reset lỗi
            fetchUnits();
        } catch (error) {
            showErrorToast(IngredientErrorCode.UNIT_ADD_FAIL);
        }
    };


    useEffect(() => {
        fetchIngredients();
        fetchUnits();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [isActiveFilter, statusFilter, allIngredients]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="p-4 min-w-[85vw]">
            <h1 className="text-2xl font-bold mb-6">Quản lý nguyên liệu</h1>

            <div className="mb-4 flex justify-between">
                <div className="flex space-x-4">
                    <Button className="bg-blue-500 text-white" onClick={() => navigate("/admin/import-ingredient")}>
                        Nhập nguyên liệu
                    </Button>
                    <Button className="bg-green-500 text-white" onClick={() => navigate("/admin/export-ingredient")}>
                        Xuất nguyên liệu
                    </Button>
                </div>

                <div className="flex space-x-4">
                    <Button className="bg-white text-black border" onClick={() => navigate("/admin/import-history")}>
                        Lịch sử nhập nguyên liệu
                    </Button>
                    <Button className="bg-white text-black border" onClick={() => navigate("/admin/export-history")}>
                        Lịch sử xuất nguyên liệu
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex space-x-4">
                <select
                    value={isActiveFilter ? "Hoạt động" : "Không hoạt động"}
                    onChange={(e) => setIsActiveFilter(e.target.value === "Hoạt động")}
                    className="border rounded p-2"
                >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="Tất cả">Tất cả</option>
                    <option value="Đủ nguyên liệu">Đủ nguyên liệu</option>
                    <option value="Cần nhập thêm">Cần nhập thêm</option>
                </select>
            </div>

            <div className="mb-4 flex gap-4">
                <Button
                    className="inline-flex items-center"
                    onClick={() => setShowAddModal(true)}
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Thêm nguyên liệu
                </Button>
                <Button
                    className="inline-flex items-center"
                    onClick={() => setShowAddUnitModal(true)}
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Thêm đơn vị
                </Button>
            </div>

            <IngredientTable ingredients={filteredIngredients} units={units}  isActiveFilter={isActiveFilter} onRefresh={fetchIngredients} />

            {showAddModal && (
                <Modal
                    isOpen={showAddModal}
                    title="Thêm nguyên liệu mới"
                    onClose={() => setShowAddModal(false)}
                    actions={
                        <>
                            <Button onClick={() => setShowAddModal(false)}>Hủy</Button>
                            <Button onClick={handleAddSubmit}>Lưu</Button>
                        </>
                    }
                >
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tên nguyên liệu</label>
                            <input
                                type="text"
                                value={newIngredient.name}
                                className="border rounded p-2 w-full"
                                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
                            <select
                                value={newIngredient.unit_id}
                                onChange={(e) =>
                                    setNewIngredient({ ...newIngredient, unit_id: parseInt(e.target.value, 10) })
                                }
                                className="border rounded p-2 w-full"
                            >
                                <option value={0} disabled>
                                    Chọn đơn vị
                                </option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                            {errors.unit_id && <p className="text-red-500 text-sm">{errors.unit_id}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Giới hạn cảnh báo</label>
                            <input
                                type="number"
                                value={newIngredient.warning_limits}
                                className="border rounded p-2 w-full"
                                onChange={(e) =>
                                    setNewIngredient({ ...newIngredient, warning_limits: parseFloat(e.target.value) })
                                }
                            />
                            {errors.warning_limits && <p className="text-red-500 text-sm">{errors.warning_limits}</p>}
                        </div>
                    </form>
                </Modal>
            )}

            {showAddUnitModal && (
                <Modal
                    isOpen={showAddUnitModal}
                    title="Thêm đơn vị mới"
                    onClose={() => setShowAddUnitModal(false)}
                    actions={
                        <>
                            <Button onClick={() => setShowAddUnitModal(false)}>Hủy</Button>
                            <Button onClick={handleAddUnitSubmit}>Lưu</Button>
                        </>
                    }
                >
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tên đơn vị</label>
                            <input
                                type="text"
                                value={newUnit.name}
                                className="border rounded p-2 w-full"
                                onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                    </form>
                </Modal>
            )}

        </div>
    );
};

export default IngredientPage;