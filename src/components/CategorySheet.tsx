import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CategorySheetProps} from "@/types/Category";
import { categoryService } from "@/services/categoryService";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {Switch} from "@/components/ui/switch.tsx";
import {getImageUrl} from "@/utils/imageUtils.ts";
import {useCustomToast} from "@/hooks/CustomAlert.tsx";
import {ErrorCode} from "@/utils/error/ErrorCode.ts";



export default function CategorySheet({
                                          isOpen,
                                          onClose,
                                          category,
                                          onSuccess
                                      }: CategorySheetProps) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const form = useForm({
        defaultValues: {
            name: "",
            isActive: true,
            imageUrl: ""
        }
    });

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                isActive: category.isActive,
                imageUrl: category.imageUrl
            });
            setPreviewImage(category.imageUrl);
        } else {
            form.reset({
                name: "",
                isActive: true,
                imageUrl: ""
            });
            setPreviewImage("");
            setSelectedFile(null);
        }
    }, [category, form]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showErrorToast(ErrorCode.CATEGORY_IMAGE_SIZE);
                return;
            }

            if (!file.type.startsWith('image/')) {
                showErrorToast(ErrorCode.CATEGORY_IMAGE_TYPE);
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const onSubmit = async (data: any) => {
        try {
            setLoading(true);

            // Validate name
            if (!data.name.trim()) {
                showErrorToast(ErrorCode.CATEGORY_NAME_REQUIRED);
                return;
            }

            if (data.name.length > 250) {
                showErrorToast(ErrorCode.CATEGORY_NAME_LENGTH);
                return;
            }
            if (category) {
                if (!selectedFile && !data.name) {
                    showErrorToast(ErrorCode.CONNECT_ERROR);
                    onSuccess(false);
                    return;
                }
                const response = await categoryService.updateCategory(
                    category.id,
                    data.name,
                    data.isActive,
                    !!selectedFile,
                    selectedFile || new File([], ""),
                    category.imageUrl
                );
                if (response.success) {
                    showSuccessToast(ErrorCode.UPDATE_CATEGORY_SUCCESS);
                    onSuccess(true);
                    onClose();
                }
            }
            else {
                if (!selectedFile) {
                    showErrorToast(ErrorCode.CATEGORY_IMAGE_REQUIRED);
                    return;
                }

                const response = await categoryService.createCategory(
                    data.name,
                    selectedFile
                );

                if (response.success) {
                    showSuccessToast(ErrorCode.POST_CATEGORY_SUCCESS);
                    onSuccess(true);
                    onClose();
                }
            }
        } catch (error) {
            showErrorToast(ErrorCode.CONNECT_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>

            <SheetContent className="min-w-[800px] max-w-[1000px]">
                <SheetHeader>
                    <SheetTitle>
                        {category ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </SheetTitle>
                    <SheetDescription>
                        {category
                            ? "Cập nhật thông tin danh mục"
                            : "Thêm danh mục mới vào hệ thống"}
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên danh mục" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label>Hình ảnh</Label>
                            <div className="flex items-center gap-4">
                                {previewImage && (
                                    <div className="relative">
                                        <img
                                            src={getImageUrl(previewImage)}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute -top-2 -right-2"
                                            onClick={() => {
                                                setPreviewImage("");
                                                setSelectedFile(null);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="max-w-[250px]"
                                />
                            </div>
                        </div>

                        {category && (
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>Trạng thái hoạt động</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
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
                            <Button type="submit" disabled={loading}>
                                {loading ? "Đang xử lý..." : category ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}