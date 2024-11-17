// components/product/ProductFormSheet.tsx
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

    // const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    // const [fileNames, setFileNames] = useState<string[]>([]);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [deletedImages, setDeletedImages] = useState<ProductImage[]>([]);

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
        // setFileNames([]);
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
                alert('Vui lòng chọn danh mục');
                return;
            }
            if (formData.recipeId === 0) {
                alert('Vui lòng chọn công thức');
                return;
            }
            if (!formData.name.trim()) {
                alert('Vui lòng nhập tên sản phẩm');
                return;
            }
            if (formData.name.length > 250) {
                alert('Tên sản phẩm không được vượt quá 250 ký tự');
                return;
            }
            if (!formData.description.trim()) {
                alert('Vui lòng nhập mô tả');
                return;
            }
            if (formData.description.length > 250) {
                alert('Mô tả không được vượt quá 250 ký tự');
                return;
            }
            if (formData.price < 0) {
                alert('Giá phải lớn hơn hoặc bằng 0');
                return;
            }
            if (formData.weight <= 0) {
                alert('Khối lượng phải lớn hơn 0');
                return;
            }
            if (formData.length <= 0) {
                alert('Chiều dài phải lớn hơn 0');
                return;
            }
            if (formData.width <= 0) {
                alert('Chiều rộng phải lớn hơn 0');
                return;
            }
            if (formData.height <= 0) {
                alert('Chiều cao phải lớn hơn 0');
                return;
            }
            if (formData.shelfLifeDays <= 0) {
                alert('Hạn sử dụng phải lớn hơn 0');
                return;
            }
            if (formData.shelfLifeDaysWarning <= 0) {
                alert('Cảnh báo hạn sử dụng phải lớn hơn 0');
                return;
            }
            if (formData.discountLimit < 0 || formData.discountLimit > 100) {
                alert('Giới hạn giảm giá phải từ 0 đến 100');
                return;
            }
            if (!productId && files.length === 0) {
                alert('Vui lòng chọn ít nhất một ảnh');
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
                    onSuccess();
                }
            } else {
                const response = await productService.create(formData, files);
                if (response.success) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra khi lưu sản phẩm');
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
                        <Label htmlFor="recipeId">Công thức</Label>
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
                            required
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
                            required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                            required
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div>Loading...</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            {/* ... rest of your form ... */}
                            <div className="space-y-2">
                                <Label>Hình ảnh</Label>
                                <ImageUpload
                                    onChange={handleFileChange}
                                    maxFiles={4}
                                    existingImages={productImages}
                                    onDeleteImage={handleImageDeleted}
                                />
                            </div>
                            {/* ... rest of your form ... */}
                        </form>
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