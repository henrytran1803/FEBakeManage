import { uploadApi } from '@/api/endpoints/uploadApi';

export const uploadService = {
    uploadProductImage: async (file: File, productId: number) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('productName', file.name);

            const uploadResponse = await uploadApi.uploadImage(formData);

            if (!uploadResponse.success) {
                throw new Error('Failed to upload image');
            }
            const createResponse = await uploadApi.createImage({
                productId,
                url: uploadResponse.data.url
            });

            return createResponse;

        } catch (error) {
            throw new Error('Failed to process image upload');
        }
    },
    uploadImage: async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('productName', file.name);
            const uploadResponse = await uploadApi.uploadImage(formData);
            if (!uploadResponse.success) {
                throw new Error('Failed to upload image');
            }
            return uploadResponse;
        } catch (error) {
            throw new Error('Failed to process image upload');
        }
    },
    deleteImageSingle: async (fileName: string) => {
        try {
            await uploadApi.deleteImageByName(fileName);


        } catch (error) {
            throw new Error('Failed to delete image');
        }
    },


    deleteImage: async (id: number, fileName: string) => {
        try {
            await uploadApi.deleteImageByName(fileName);

            await uploadApi.deleteImageById(id);

        } catch (error) {
            throw new Error('Failed to delete image');
        }
    }
};