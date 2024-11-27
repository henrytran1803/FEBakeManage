import { categoryApi } from '@/api/endpoints/categoryApi';
import {Category, CategoryCreate} from "@/types/Category.ts";
import {uploadService} from "@/services/uploadService.ts";

export const categoryService = {
    searchCategories: async (params: {
        page: number;
        size: number;
        search?: string;
        activeFilter: 'all' | 'active' | 'inactive';
        sortConfig: 'asc' | 'desc';
    }) => {
        try {
            const apiParams = {
                page: params.page,
                size: params.size,
                sortBy: 'name',
                sortDir: params.sortConfig,
                name: params.search || undefined,
                isActive: params.activeFilter !== 'all'
                    ? params.activeFilter === 'active'
                    : undefined
            };

            const response = await categoryApi.search(apiParams);
            console.log(response);
            return response;
        } catch (error) {
            throw new Error('Failed to fetch categories');
        }
    },
    createCategory: async (name: string, file: File)=>{
            try{
                const responseUpload = await uploadService.uploadImage(file);
                const apiParams: CategoryCreate = {
                    name: name,
                    url: responseUpload.data.url
                }
                const response = await categoryApi.create(apiParams);
                return response;
            }catch(error){
                throw new Error('Failed to create category');
            }
    },
    updateCategory: async (id :number, name: string, active: boolean, isChange: boolean, file: File, fileName: string)=>{
        try{
            if(isChange){
                await uploadService.deleteImageSingle(fileName)
                const responseUpload = await uploadService.uploadImage(file);
                const apiParams: Category = {
                    id: id,
                    name: name,
                    imageUrl: responseUpload.data.url,
                    isActive: active
                }
                const response = await categoryApi.update(apiParams);
                return response;
            }else {
                const apiParams: Category = {
                    id: id,
                    name: name,
                    imageUrl: fileName,
                    isActive: active
                }
                const response = await categoryApi.update(apiParams);
                return response;
            }
        }catch (error){
            throw new Error('Failed to update category');
        }
    },
    deleteCategory: async (id: number) => {
        try {
            const response = await categoryApi.delete(id);
            return response;
        } catch (error) {
            throw new Error('Failed to delete category');
        }
    },
    getAllCategories: async () => {
        try {
            const response = await categoryApi.getAll();
            console.log(response);
            return response;
        } catch (error) {
            throw new Error('Failed to get all category');
        }
    }
};