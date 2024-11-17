// components/ImageUpload.tsx
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getImageUrl } from '@/utils/imageUtils';
import { ProductImage } from "@/types/product.ts";

interface ImageUploadProps {
    onChange: (files: File[]) => void;
    maxFiles?: number;
    existingImages?: ProductImage[];
    onDeleteImage?: (deletedImage: ProductImage) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
                                                            onChange,
                                                            maxFiles = 4,
                                                            existingImages,
                                                            onDeleteImage
                                                        }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [displayedImages, setDisplayedImages] = useState<ProductImage[]>(existingImages || []);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const totalFiles = selectedFiles.length + files.length;

        if (totalFiles > maxFiles) {
            alert(`Bạn chỉ có thể tải lên tối đa ${maxFiles} ảnh`);
            return;
        }

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        const newSelectedFiles = [...selectedFiles, ...files];
        setSelectedFiles(newSelectedFiles);
        onChange(newSelectedFiles);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleExistingImageDelete = (image: ProductImage) => {
        onDeleteImage?.(image);
        setDisplayedImages(prev => prev.filter(img => img.id !== image.id));
    };

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newPreviewUrls);
        const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newSelectedFiles);
        onChange(newSelectedFiles);
    };

    const remainingSlots = maxFiles - selectedFiles.length - displayedImages.length;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {remainingSlots > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Chọn ảnh ({remainingSlots} ảnh còn lại)
                    </Button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Grid container for all images */}
            <div className="grid grid-cols-2 gap-4">
                {/* Existing Images */}
                {displayedImages.map((image) => (
                    <div key={`existing-${image.id}`} className="relative">
                        <img
                            src={getImageUrl(image.url)}
                            alt={`Existing ${image.id}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleExistingImageDelete(image)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* New Image Previews */}
                {previewUrls.map((url, index) => (
                    <div key={`preview-${index}`} className="relative">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};