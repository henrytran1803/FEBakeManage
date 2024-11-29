import {productApi} from "@/api/endpoints/productApi.ts";
import {
    DetailProductActiveResponse, ProductCart, ProductCartRequest,
    ProductCreate,
    ProductImage,
    ProductUpdate,
    SearchProductActiveParams
} from "@/types/product.ts";
import {uploadService} from "@/services/uploadService.ts";
import {priceApi} from "@/api/endpoints/priceApi.ts";
import {ApiResponse} from "@/types/ApiResponse.ts";

export const productService = {
    searchProducts: async (params: {
        page: number;
        size: number;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
        name?: string;
        status?: boolean;
        categoryId?: number;
        minPrice?: number;
        maxPrice?: number;
    }) => {
        try {
            const apiParams = {
                page: params.page,
                size: params.size,
                sortBy: params.sortBy || 'name',
                sortDir: params.sortDir || 'asc',
                name: params.name || undefined,
                status: params.status !== undefined ? params.status : undefined,
                categoryId: params.categoryId || undefined,
                minPrice: params.minPrice || undefined,
                maxPrice: params.maxPrice || undefined
            };

            const response = await productApi.search(apiParams);
            return response;

        } catch (error) {
            throw new Error('Failed to fetch products');
        }
    },
    searchActive: async (params: SearchProductActiveParams) => {
        try {
            const apiParams = {
                page: params.page,
                size: params.size,
                sortBy: params.sortBy || 'name',
                sortDirection: params.sortDirection || 'asc',
                productName: params.productName || undefined,
                categoryIds: params.categoryIds || undefined
            };

            const response = await productApi.searchActive(apiParams);
            return response;

        } catch (error) {
            throw new Error('Failed to fetch active products');
        }
    },
    create: async (data: {
        categoryId: number;
        name: string;
        price: number;
        description: string;
        weight: number;
        length: number;
        width: number;
        height: number;
        discountLimit: number;
        recipeId: number;
        shelfLifeDays: number;
        shelfLifeDaysWarning: number;
    }, files: File[]) => {
        try {
            const imageUrls: string[] = [];
            for (const file of files) {
                const uploadResponse = await uploadService.uploadImage(file);
                imageUrls.push(uploadResponse.data.url);
            }

            const productData: ProductCreate = {
                ...data,
                imageUrls
            };
            console.log(productData)
            const response = await productApi.create(productData);
            return response;

        } catch (error) {
            throw new Error('Failed to create product');
        }
    },
    update: async (updateProduct: ProductUpdate, isChange: boolean, files: File[], deletedFiles: ProductImage[]) => {
        try {
            if (isChange) {
                for (const fileName of deletedFiles) {
                    await uploadService.deleteImage(fileName.id, fileName.url);
                }
                for (const file of files) {
                    await uploadService.uploadProductImage(file, updateProduct.id);
                }
            }
            const response = await productApi.update(updateProduct);
            return response;
        } catch (error) {
            throw new Error('Failed to process image upload');
        }
    },
    updateStatus: async (id: number) => {
        try {
            const response = await productApi.updateStatus(id);
            return response;
        } catch (error) {
            throw new Error('Failed to update product status');
        }
    },
    getProductDetail: async (id: number) => {
        try {
            const response = await productApi.getDetail(id);
            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    },
    getAllProducts: async () => {
        try {
            const response = await productApi.getAllProducts();
            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    },

    getDetailProduct: async (id: number): Promise<DetailProductActiveResponse> => {
        try {
            const [activeResponse, pricesResponse] = await Promise.all([
                productApi.getProductActive(id),
                priceApi.getById(id)
            ]);

            const response: DetailProductActiveResponse = {
                active: activeResponse.data,
                prices: pricesResponse.data
            };

            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    },
    getPricehistory: async (id: number) => {
        try {
            const response = await priceApi.getById(id);
            return response;
        }
        catch (error) {
            throw new Error('Failed to get pricehistory');
        }
    },
    getProductCart: async (data: ProductCartRequest): Promise<ApiResponse<ProductCart[]>> => {
        try {
            const response = productApi.getProductCart(data);

            return response;
        } catch (error) {
            throw new Error('Failed to get product details');
        }
    }



}