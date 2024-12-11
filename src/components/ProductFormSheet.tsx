import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/Category";
import { Recipe } from "@/types/recipe";
import {ProductUpdate, ProductFormSheetProps, ProductImage} from "@/types/product";
import { categoryService } from "@/services/categoryService";
import { recipeService } from "@/services/recipeService";
import { productService } from "@/services/productService";
import {Textarea} from "@/components/ui/textarea.tsx";
import {ImageUpload} from "@/components/ImageUpload.tsx";
import {useCustomToast} from "@/hooks/CustomAlert.tsx";
import {ProductErrorCode} from "@/utils/error/createProductError.ts";
import {useNavigate} from "react-router-dom";



export const ProductFormSheet: React.FC<ProductFormSheetProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onSuccess,
                                                                      productId
                                                                  }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [productImages, setProductImages] = useState<ProductImage[] >([]);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [deletedImages, setDeletedImages] = useState<ProductImage[]>([]);
    const { showErrorToast, showSuccessToast } = useCustomToast();
    const navigate = useNavigate();

    const handleImageDeleted = (deletedImage: ProductImage) => {
        setDeletedImages(prev => [...prev, deletedImage]);
        setIsImageChanged(true);
    };
    const resetForm = () => {
        setFormData({
            categoryId: 0,
            name: '',
            price: 0,
            description: '',
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
            discountLimit: 0,
            recipeId: 0,
            shelfLifeDays: 0,
            shelfLifeDaysWarning: 0,
        });
        setFiles([]);
        setIsImageChanged(false);
        setDeletedImages([]);
        setProductImages([])
    };

    const [formData, setFormData] = useState({
        categoryId: 0,
        name: '',
        price: 0,
        description: '',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        discountLimit: 0,
        recipeId: 0,
        shelfLifeDays: 0,
        shelfLifeDaysWarning: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [categoriesResponse, recipesResponse] = await Promise.all([
                    categoryService.getAllCategories(),
                    recipeService.getAllRecipes()
                ]);

                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data);
                }
                if (recipesResponse) {
                    setRecipes(recipesResponse.data);
                }

                if (productId != null) {
                    const productResponse = await productService.getProductDetail(productId);
                    if (productResponse.success) {
                        const product = productResponse.data;
                        console.log(product);
                        setProductImages(productResponse.data.images);
                        setFormData({
                            categoryId: product.categoryId,
                            name: product.name,
                            price: product.price || 0,
                            description: product.description,
                            weight: product.weight,
                            length: product.length,
                            width: product.width,
                            height: product.height,
                            discountLimit: product.discountLimit,
                            recipeId: product.recipeId,
                            shelfLifeDays: product.shelfLifeDays,
                            shelfLifeDaysWarning: product.shelfLifeDaysWarning,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchInitialData();
            console.log(isLoading)
        }
    }, [isOpen, productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (formData.categoryId === 0) {
                showErrorToast(ProductErrorCode.CATEGORY_REQUIRED_ERROR);
                return;
            }
            if (formData.recipeId === 0) {
                showErrorToast(ProductErrorCode.RECIPE_REQUIRED_ERROR);
                return;
            }

            if (!formData.name) {
                showErrorToast(ProductErrorCode.PRODUCT_NAME_INPUT_ERROR);
                return;
            }
            if (formData.name.length > 250) {
                showErrorToast(ProductErrorCode.PRODUCT_NAME_LENGTH_ERROR);
                return;
            }
            if (!formData.description) {
                showErrorToast(ProductErrorCode.PRODUCT_DESC_INPUT_ERROR);
                return;
            }
            if (formData.description.length > 500) {
                showErrorToast(ProductErrorCode.PRODUCT_DESC_LENGTH_ERROR);
                return;
            }
            if (!formData.price) {
                showErrorToast(ProductErrorCode.PRODUCT_PRICE_INPUT_ERROR);
                return;
            }
            if (formData.price < 1000) {
                showErrorToast(ProductErrorCode.PRODUCT_PRICE_INPUT_ERROR2);
                return;
            }

            if (!formData.weight) {
                showErrorToast(ProductErrorCode.PRODUCT_WEIGHT_INPUT_ERROR1);
                return;
            }
            if (formData.weight < 1 || formData.weight > 20000) {
                showErrorToast(ProductErrorCode.PRODUCT_WEIGHT_INPUT_ERROR2);
                return;
            }

            if (!formData.length) {
                showErrorToast(ProductErrorCode.PRODUCT_LENGTH_INPUT_ERROR1);
                return;
            }
            if (formData.length < 1 || formData.length > 200) {
                showErrorToast(ProductErrorCode.PRODUCT_LENGTH_INPUT_ERROR2);
                return;
            }

            if (!formData.width) {
                showErrorToast(ProductErrorCode.PRODUCT_WIDTH_INPUT_ERROR1);
                return;
            }
            if (formData.width < 1 || formData.width > 200) {
                showErrorToast(ProductErrorCode.PRODUCT_WIDTH_INPUT_ERROR2);
                return;
            }
            if (!formData.height) {
                showErrorToast(ProductErrorCode.PRODUCT_HEIGHT_INPUT_ERROR1);
                return;
            }
            if (formData.height < 1 || formData.height > 200) {
                showErrorToast(ProductErrorCode.PRODUCT_HEIGHT_INPUT_ERROR2);
                return;
            }

            if (!formData.shelfLifeDays) {
                showErrorToast(ProductErrorCode.PRODUCT_EXPIRY_INPUT_ERROR1);
                return;
            }
            if (formData.shelfLifeDays <= 0) {
                showErrorToast(ProductErrorCode.PRODUCT_EXPIRY_INPUT_ERROR2);
                return;
            }
            if (!formData.shelfLifeDaysWarning ) {
                showErrorToast(ProductErrorCode.PRODUCT_EXPIRY_WARNING_ERROR);
                return;
            }
            if (formData.shelfLifeDaysWarning <= 0) {
                showErrorToast(ProductErrorCode.PRODUCT_EXPIRY_WARNING_ERROR1);
                return;
            }
            if ((formData.shelfLifeDaysWarning/24) > formData.shelfLifeDays ) {
                showErrorToast(ProductErrorCode.PRODUCT_EXPIRY_WARNING_ERROR2);
                return;
            }

            if (formData.discountLimit < 0 || formData.discountLimit > 100) {
                showErrorToast(ProductErrorCode.PRODUCT_DISCOUNT_LIMIT_ERROR);
                return;
            }

            if (!productId && files.length === 0) {
                showErrorToast(ProductErrorCode.PRODUCT_IMAGE_REQUIRED_ERROR);
                return;
            }

            if (productId) {
                const updateData: ProductUpdate = {
                    id: productId,
                    ...formData
                };
                const response = await productService.update(
                    updateData,
                    isImageChanged,
                    files,
                    deletedImages
                );
                if (response.success) {
                    showSuccessToast(ProductErrorCode.POST_PRODUCT_SUCCESS);
                    onSuccess();
                }
            } else {
                const response = await productService.create(formData, files);
                if (response.success) {
                    showSuccessToast(ProductErrorCode.POST_PRODUCT_SUCCESS);
                    onSuccess();
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showErrorToast(ProductErrorCode.CONNECT_ERROR);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);
    const handleFileChange = (files: File[]) => {
        setFiles(files);
        setIsImageChanged(true);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {productId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                    </SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Danh mục</Label>
                        <Select
                            value={formData.categoryId.toString()}
                            onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                categoryId: parseInt(value)
                            }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recipeId">Công thức  </Label>
                        <span
                            onClick={() => navigate("/admin/recipe")}
                                className="text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
                            >
                              Chưa có công thức?
                            </span>
                                                    <Select
                            value={formData.recipeId.toString()}
                            onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                recipeId: parseInt(value)
                            }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn công thức" />
                            </SelectTrigger>
                            <SelectContent>
                                {recipes.map(recipe => (
                                    <SelectItem
                                        key={recipe.id}
                                        value={recipe.id.toString()}
                                    >
                                        {recipe.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Tên sản phẩm</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Giá</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                price: parseFloat(e.target.value)
                            }))}
                            
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Khối lượng (g)</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    weight: parseFloat(e.target.value)
                                }))}
                                
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountLimit">Giảm giá tối đa (%)</Label>
                            <Input
                                id="discountLimit"
                                type="number"
                                value={formData.discountLimit}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    discountLimit: parseFloat(e.target.value)
                                }))}
                                
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="length">Chiều dài (cm)</Label>
                            <Input
                                id="length"
                                type="number"
                                value={formData.length}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    length: parseFloat(e.target.value)
                                }))}
                                
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="width">Chiều rộng (cm)</Label>
                            <Input
                                id="width"
                                type="number"
                                value={formData.width}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    width: parseFloat(e.target.value)
                                }))}
                                
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Chiều cao (cm)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={formData.height}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    height: parseFloat(e.target.value)
                                }))}
                                
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="shelfLifeDays">Hạn sử dụng (Ngày)</Label>
                            <Input
                                id="shelfLifeDays"
                                type="number"
                                value={formData.shelfLifeDays}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    shelfLifeDays: parseInt(e.target.value)
                                }))}
                                
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shelfLifeDaysWarning">Cảnh báo HSD (giờ)</Label>
                            <Input
                                id="shelfLifeDaysWarning"
                                type="number"
                                value={formData.shelfLifeDaysWarning}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    shelfLifeDaysWarning: parseInt(e.target.value)
                                }))}
                                
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div>Loading...</div>
                        </div>
                    ) : (
                            <div className="space-y-2">
                                <Label>Hình ảnh</Label>
                                <ImageUpload
                                    onChange={handleFileChange}
                                    maxFiles={4}
                                    existingImages={productImages}
                                    onDeleteImage={handleImageDeleted}
                                />
                            </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : (productId ? 'Cập nhật' : 'Thêm mới')}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};