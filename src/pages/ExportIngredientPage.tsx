import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/pages/LoadingScreen";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import { ingredientService } from "@/services/ingredientService";
import { recipeService } from "@/services/recipeService";
import { ExportIngredientsRequest, IngredientDetail } from "@/types/ExportIngredientsRequest";
import { Ingredient } from "@/types/Ingredient";
import { Unit } from "@/types/Unit";
import { unitService } from "@/services/unitService";
import { useCustomToast } from "@/hooks/CustomAlert";
import { IngredientErrorCode } from "@/utils/error/ingredientError";
import { RecipeErrorCode } from "@/utils/error/recipeError";

const ExportIngredientPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]); // Danh sách sản phẩm từ API
    const [selectedProducts, setSelectedProducts] = useState<{ product: Product; quantity: number }[]>([]); // Danh sách sản phẩm đã chọn
    const [tempSelectedProducts, setTempSelectedProducts] = useState<Product[]>([]); // Danh sách sản phẩm tạm thời trong modal
    const [showProductModal, setShowProductModal] = useState<boolean>(false);
    const [showIngredientsModal, setShowIngredientsModal] = useState<boolean>(false);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientsNeeded, setIngredientsNeeded] = useState<IngredientDetail[]>([]);
    const [canExport, setCanExport] = useState<boolean>(true);
    const [units, setUnits] = useState<Unit[]>([]); // Danh sách đơn vị
    const navigate = useNavigate();
    const { showErrorToast, showSuccessToast } = useCustomToast();
    

    // Lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            const ingredientResponse = await ingredientService.getAllIngredients();
    
            if (response.success) {
                // Lọc sản phẩm theo status = true
                // setProducts(response.data.filter((product) => product.status));
                const data = response.data as unknown as { content: Product[] };
                const filteredProducts = data.content.filter((product) => product.status);
                setProducts(filteredProducts); 
            } else {
                showErrorToast(IngredientErrorCode.PRODUCT_FETCH_ERROR);
            }

            if (ingredientResponse.success) {
                setIngredients(ingredientResponse.data);
            } else {
                showErrorToast(IngredientErrorCode.INGREDIENT_FETCH_FAIL);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        finally {
            setLoading(false);
        }
    };

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

    const getUnitName = (unitId: number) => {
        const unit = units.find((unit) => unit.id === unitId);
        return unit ? unit.name : "Không xác định";
    };

    useEffect(() => {
        fetchProducts();
        fetchUnits()
    }, []);

    //Lấy recipe bằng product
    const handleGetRecipeByProduct = async (id: number) => {
        try {
            console.log(`Đang gọi API để lấy công thức cho sản phẩm với ID: ${id}`);
            const recipeResponse = await recipeService.getRecipesByProduct(id);
    
            if (recipeResponse.success) {
                console.log(`API trả về công thức cho sản phẩm ID: ${id}`, recipeResponse.data);
                return recipeResponse;
            } else {
                console.error(`Lỗi từ API khi lấy công thức cho sản phẩm ID: ${id}`, recipeResponse.message);
                showErrorToast(RecipeErrorCode.CONNECT_ERROR);
            }
        } catch (error) {
            console.error(`Lỗi không mong muốn khi lấy công thức cho sản phẩm ID: ${id}`, error);
            showErrorToast(RecipeErrorCode.CONNECT_ERROR);
        }
    };
    

    

    // Xử lý khi chọn sản phẩm trong modal
    const handleAddProducts = () => {
        const updatedSelected = [
            ...selectedProducts,
            ...tempSelectedProducts.map((product) => ({ product, quantity: 1 })), // Mặc định số lượng là 1
        ];
        setSelectedProducts(updatedSelected);
        setProducts(products.filter((p) => !tempSelectedProducts.includes(p))); // Loại khỏi danh sách còn lại
        setTempSelectedProducts([]); // Xóa danh sách tạm
        setShowProductModal(false);
    };

    // Xóa sản phẩm khỏi danh sách đã chọn
    const handleRemoveProduct = (index: number) => {
        const removedProduct = selectedProducts[index];
        setProducts([...products, removedProduct.product]); // Thêm lại vào danh sách có thể chọn
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = (index: number, value: string) => {
        const updated = [...selectedProducts];
        updated[index].quantity = parseInt(value, 10) || 1; // Đảm bảo số lượng tối thiểu là 1
        setSelectedProducts(updated);
    };

    const handleConfirm = async () => {
        try {
            if (selectedProducts.length === 0) {
                showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_PRODUCT_EMPTY);
                return;
            }

            for (const product of selectedProducts) {
                if (product.quantity <= 0) {
                    showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_PRODUCT_QUANTITY);
                    return;
                }
                if (product.quantity === null ) {
                    showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_PRODUCT_QUANTITY_EMPTY);
                    return;
                }
            }

            const ingredientMap: Record<number, number> = {};
    
            for (const selected of selectedProducts) {
                // Thêm log để kiểm tra từng sản phẩm
                console.log(`Đang lấy công thức cho sản phẩm: ${selected.product.name} (ID: ${selected.product.id})`);
    
                const recipeResponse = await handleGetRecipeByProduct(selected.product.id);
    
                if (recipeResponse?.success) {
                    console.log(`Lấy công thức thành công cho sản phẩm: ${selected.product.name}`, recipeResponse.data);
                    const recipeDetails = recipeResponse.data.recipeDetails;
    
                    recipeDetails.forEach((detail) => {
                        const ingredientId = detail.ingredientId;
                        // Làm tròn đến 2 chữ số thập phân
                        const requiredQuantity = Math.round(detail.quantity * selected.quantity * 100) / 100;    

                        ingredientMap[ingredientId] = (ingredientMap[ingredientId] || 0) + requiredQuantity;
                    });
                } else {
                    console.error(`Lỗi khi lấy công thức cho sản phẩm ${selected.product.name}`);
                    showErrorToast(RecipeErrorCode.CONNECT_ERROR);
                }
            }
    
            const ingredientsList: IngredientDetail[] = Object.entries(ingredientMap).map(([ingredient_id, quantity]) => ({
                ingredient_id: parseInt(ingredient_id, 10),
                quantity,
            }));
    
            setIngredientsNeeded(ingredientsList);

            // Kiểm tra trạng thái của nguyên liệu trước khi mở modal
            const hasMissingIngredients = ingredientsList.some((ingredientNeeded) => {
                const ingredient = ingredients.find((ing) => ing.id === ingredientNeeded.ingredient_id);
                return !ingredient || ingredient.quantity < ingredientNeeded.quantity;
            });
            
            setCanExport(!hasMissingIngredients);

            setShowIngredientsModal(true);
        } catch (error) {
            // Thêm log để kiểm tra lỗi trong toàn bộ quá trình
            console.error("Lỗi trong handleConfirm:", error);
            showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_FAIL);
        }
    };
    
    

    const handleExport = async () => {
        if (ingredientsNeeded.length === 0) {
            showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_PRODUCT_EMPTY);
            return;
        }

        const exportRequest: ExportIngredientsRequest = {
            sender_id: 1, 
            total_amount: selectedProducts.reduce((sum, ing) => sum + ing.quantity, 0),
            ingredients: ingredientsNeeded,
            products: selectedProducts.map((sp) => ({
                product_id: sp.product.id,
                quantity: sp.quantity,
            })),
        };

        try {
            const response = await ingredientService.exportIngredients(exportRequest);
            if (response.success) {
                showSuccessToast(IngredientErrorCode.EXPORT_INGREDIENT_SUCCESS);
                setShowIngredientsModal(false);
            } else {
                showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_FAIL);
            }
        } catch (error) {
            console.error("Error exporting ingredients:", error);
            showErrorToast(IngredientErrorCode.EXPORT_INGREDIENT_FAIL);
        }
    };

    

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="p-4 min-w-[80vw]">
            <h1 className="text-2xl font-bold mb-6">Xuất Nguyên Liệu</h1>
            <Button variant="outline" onClick={() => navigate("/admin/ingredient")} className="mb-4">
                Quay lại
            </Button>

            <div className="mb-4 flex justify-between items-center">
                <Button onClick={() => setShowProductModal(true)}>Chọn sản phẩm</Button>
            </div>

            {/* Bảng hiển thị sản phẩm đã chọn */}
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Tên Sản Phẩm</th>
                        <th className="border px-4 py-2">Số Lượng</th>
                        <th className="border px-4 py-2">Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedProducts.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.product.name}</td>
                            <td className="border px-4 py-2">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    className="w-full"
                                    min={1}
                                />
                            </td>
                            <td className="border px-4 py-2">
                                <Button variant="outline" onClick={() => handleRemoveProduct(index)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
                <div>
                    <strong>Tổng Số Bánh:</strong>{" "}
                    {selectedProducts.reduce((total, item) => total + item.quantity, 0)}
                </div>
                <Button onClick={handleConfirm}>Xác Nhận</Button>
            </div>

            {/* Modal chọn sản phẩm */}
            {showProductModal && (
                <Modal
                    title="Chọn Sản Phẩm"
                    onClose={() => setShowProductModal(false)}
                    actions={
                        <>
                            <Button onClick={() => setShowProductModal(false)}>Hủy</Button>
                            <Button onClick={handleAddProducts}>Thêm</Button>
                        </>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Tên Sản Phẩm</th>
                                    <th className="border px-4 py-2">Chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="border px-4 py-2">{product.name}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setTempSelectedProducts([...tempSelectedProducts, product]);
                                                    } else {
                                                        setTempSelectedProducts(
                                                            tempSelectedProducts.filter((p) => p.id !== product.id)
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
            {/* Modal Nguyên Liệu Cần Dùng */}
            {showIngredientsModal && (
                <Modal
                    title="Nguyên Liệu Cần Dùng"
                    onClose={() => setShowIngredientsModal(false)}
                    actions={
                        <>
                            <Button onClick={() => setShowIngredientsModal(false)}>Hủy</Button>
                            {canExport && <Button onClick={handleExport}>Xuất Nguyên Liệu</Button>}
                        </>
                    }
                >
                    <div>
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Tên Nguyên Liệu</th>
                                    <th className="border px-4 py-2">Số Lượng Cần Dùng</th>
                                    <th className="border px-4 py-2">Đơn Vị</th>
                                    <th className="border px-4 py-2">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredientsNeeded.map((ingredientNeeded, index) => {
                                    // Tìm thông tin nguyên liệu
                                    const ingredient = ingredients.find((ing) => ing.id === ingredientNeeded.ingredient_id);
                                    const status =
                                        ingredient && ingredient.quantity >= ingredientNeeded.quantity ? "Đủ" : "Thiếu";
                                    
                                    return (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{ingredient?.name || "N/A"}</td>
                                            <td className="border px-4 py-2">{ingredientNeeded.quantity}</td>
                                            <td className="border px-4 py-2">{ingredient ? getUnitName(ingredient.unit_id) : "N/A"}</td>
                                            <td className="border px-4 py-2">{status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default ExportIngredientPage;
