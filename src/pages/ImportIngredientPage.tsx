import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ingredientService } from "@/services/ingredientService";
import { supplierService } from "@/services/supplierService";
import { ImportIngredientsRequest, IngredientDetail } from "@/types/ImportIngredientsRequest";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/pages/LoadingScreen";
import Modal from "@/components/ui/Modal";
import { Unit } from "@/types/Unit";
import { unitService } from "@/services/unitService";
import { useCustomToast } from "@/hooks/CustomAlert";
import { IngredientErrorCode } from "@/utils/error/ingredientError";
import { SupplierErrorCode } from "@/utils/error/supplierError";


const ImportIngredientPage: React.FC = () => {
    const [ingredients, setIngredients] = useState<any[]>([]);  // Lưu danh sách Ingredient ban đầu
    const [selectedIngredients, setSelectedIngredients] = useState<IngredientDetail[]>([]);  // Lưu danh sách nguyên liệu chọn vào ImportIngredientsRequest
    const [tempSelectedIngredients, setTempSelectedIngredients] = useState<IngredientDetail[]>([]); // Danh sách tạm
    const [units, setUnits] = useState<Unit[]>([]); // Danh sách đơn vị
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState<number | string>("Không");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { showErrorToast, showSuccessToast } = useCustomToast();
    
    // Lấy danh sách nhà cung cấp
    const fetchSuppliers = async () => {
        try {
            const response = await supplierService.getSuppliers();
            if (response.success) {
                setSuppliers(response.data);
            } else {
                showErrorToast(SupplierErrorCode.SUPPLIER_FETCH_FAIL);
            }
        } catch (error) {
            showErrorToast(SupplierErrorCode.SUPPLIER_FETCH_FAIL);
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

    // Lấy tất cả nguyên liệu có isactive = true và lọc nguyên liệu có quantity <= warning_limits
    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const response = await ingredientService.getAllIngredients();
            if (response.success) {
                const activeIngredients = response.data.filter((ingredient: any) => ingredient.isactive);  // Lọc nguyên liệu có isactive = true
                setIngredients(activeIngredients);

                // Lọc các nguyên liệu có quantity <= warning_limits và thêm vào selectedIngredients
                const filteredIngredients = activeIngredients.filter((ingredient: any) => ingredient.quantity <= ingredient.warning_limits);
                setSelectedIngredients(filteredIngredients.map((ingredient) => ({
                    ingredient_id: ingredient.id,
                    quantity: 1,  
                    price: 0,  
                })));
            } else {
                showErrorToast(IngredientErrorCode.INGREDIENT_FETCH_FAIL);
            }
        } catch (error) {
            showErrorToast(IngredientErrorCode.INGREDIENT_FETCH_FAIL);
        } finally {
            setLoading(false);
        }
    };

    const getUnitName = (unitId: number) => {
        const unit = units.find((unit) => unit.id === unitId);
        return unit ? unit.name : "Không xác định";
    };

    useEffect(() => {
        fetchIngredients();
        fetchSuppliers();
        fetchUnits();
    }, []);

    const handleSelectIngredient = (ingredient: any) => {
        // Kiểm tra xem nguyên liệu đã được chọn chưa
        const isAlreadySelected = tempSelectedIngredients.some((ing) => ing.ingredient_id === ingredient.id);
    
        if (isAlreadySelected) {
            // Nếu đã chọn rồi, loại bỏ nguyên liệu khỏi danh sách tạm
            setTempSelectedIngredients(tempSelectedIngredients.filter((ing) => ing.ingredient_id !== ingredient.id));
        } else {
            // Nếu chưa chọn, thêm nguyên liệu vào danh sách tạm
            const newIngredient: IngredientDetail = {
                ingredient_id: ingredient.id,
                quantity: 1, // Mặc định số lượng là 1
                price: 0, // Mặc định giá là 0
            };
            setTempSelectedIngredients([...tempSelectedIngredients, newIngredient]);
        }
    };

    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = [...selectedIngredients];
        updatedIngredients.splice(index, 1);
        setSelectedIngredients(updatedIngredients);
    };

    const handlePriceChange = (index: number, value: string) => {
        const updatedIngredients = [...selectedIngredients];
        updatedIngredients[index].price = parseFloat(value.replace(/,/g, ""));
        setSelectedIngredients(updatedIngredients);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const updatedIngredients = [...selectedIngredients];
        updatedIngredients[index].quantity = parseFloat(value);
        setSelectedIngredients(updatedIngredients);
    };

    const handleSubmit = async () => {
        if (selectedIngredients.length === 0) {
            showErrorToast(IngredientErrorCode.IMPORT_INGREDIENT_EMPTY);
            return;
        }

        for (const ingredient of selectedIngredients) {
            if (ingredient.quantity <= 0) {
                showErrorToast(IngredientErrorCode.IMPORT_INGREDIENT_QUANTITY);
                return;
            }
            if (ingredient.price === null ) {
                showErrorToast(IngredientErrorCode.IMPORT_INGREDIENT_PRICE_EMPTY);
                return;
            }
            if (ingredient.price < 0) {
                showErrorToast(IngredientErrorCode.IMPORT_INGREDIENT_PRICE);
                return;
            }
        }

        const requestData: ImportIngredientsRequest = {
            user_id: 1, // Đã tự lấy bên backend
            id_supplier: selectedSupplier === "Không" ? null : Number(selectedSupplier), // Chuyển đổi thành number
            ingredients: selectedIngredients,
        };

        try {
            const response = await ingredientService.importIngredients(requestData);
            if (response.success) {
                showSuccessToast(IngredientErrorCode.IMPORT_INGREDIENT_SUCCESS);
                setSelectedIngredients([]); // Reset lại danh sách nguyên liệu đã chọn
            } else {
                showErrorToast(IngredientErrorCode.IMPORT_INGREDIENT_FAIL);
            }
        } catch (error) {
            console.error("Error importing ingredients:", error);
            showErrorToast(IngredientErrorCode.IMPORT_INGREDIENT_FAIL);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="p-4 min-w-[80vw]">
            <h1 className="text-2xl font-bold mb-6">Nhập Nguyên Liệu</h1>
            <Button variant="outline" onClick={() => navigate("/admin/ingredient") } className="mb-4">
                Quay lại
            </Button>

            <div className="mb-4 flex justify-between items-center">
                <Button onClick={() => setShowModal(true)}>Chọn Nguyên Liệu</Button>
                <div className="flex items-center space-x-2"> {/* Thêm flex và space-x để tạo khoảng cách */}
                    <label htmlFor="supplier" className="text-sm">Nhà cung cấp</label>
                    <select
                        id="supplier"  // Gán id cho select để liên kết với label
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value === "Không" ? "Không" : parseInt(e.target.value, 10))}
                        className="border rounded p-1 w-1/2"
                    >
                        <option value="Không">Không</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Tên Nguyên Liệu</th>
                        <th className="border px-4 py-2">Số Lượng</th>
                        <th className="border px-4 py-2">Giá</th>
                        <th className="border px-4 py-2">Đơn Vị</th> 
                        <th className="border px-4 py-2">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedIngredients.map((ingredient, index) => {
                        const ingredientData = ingredients.find(ing => ing.id === ingredient.ingredient_id);
                        // const unitName = ingredientData ? ingredientData.unit_id : "Không xác định"; // Lấy unit_name từ unit_id
                        
                        return (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    {ingredientData ? ingredientData.name : "Nguyên liệu không tìm thấy"}
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        className="w-full"
                                        min={1}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        value={ingredient.price === 0 ? "" : ingredient.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        onBlur={(e) => handlePriceChange(index, e.target.value)}  // Tính lại khi người dùng click ra ngoài
                                        className="w-full"
                                        min={0}
                                    />
                                </td>
                                <td className="border px-4 py-2">{getUnitName(ingredientData.unit_id)}</td>
                                <td className="border px-4 py-2">
                                    <Button variant="outline" onClick={() => handleRemoveIngredient(index)}>Xóa</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>


            <div className="mt-4 flex justify-between items-center">
                <div>
                    <strong>Tổng Tiền:</strong>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        selectedIngredients.reduce((total, ingredient) => total + (ingredient.quantity * ingredient.price), 0)
                    )}
                </div>
                <Button onClick={handleSubmit}>Xác Nhận</Button>
            </div>

            {/* Modal chọn nguyên liệu */}
            {showModal && (
                <Modal 
                    title="Chọn Nguyên Liệu" 
                    onClose={() => setShowModal(false)} 
                    actions={
                        <>
                            <Button onClick={() => setShowModal(false)}>Hủy</Button>
                            <Button 
                                onClick={() => {
                                    // Sau khi nhấn "Thêm", thêm nguyên liệu tạm vào selectedIngredients
                                    setSelectedIngredients([...selectedIngredients, ...tempSelectedIngredients]);
                                    setTempSelectedIngredients([]); // Reset danh sách tạm
                                    setShowModal(false);
                                }}
                            >
                                Thêm
                            </Button>
                        </>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Tên Nguyên Liệu</th>
                                    <th className="border px-4 py-2">Số Lượng Tồn</th>
                                    <th className="border px-4 py-2">Đơn Vị</th>
                                    <th className="border px-4 py-2">Chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.filter((ingredient) => !selectedIngredients.some(ing => ing.ingredient_id === ingredient.id)).map((ingredient) => (
                                    <tr key={ingredient.id}>
                                        <td className="border px-4 py-2">
                                            {ingredient.name}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {ingredient.quantity}
                                        </td>
                                        <td className="border px-4 py-2">{getUnitName(ingredient.unit_id)}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectIngredient(ingredient)}
                                                id={`ingredient-${ingredient.id}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default ImportIngredientPage;
