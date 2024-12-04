import {useToast} from "@/hooks/use-toast.ts";
import {ErrorCode, ErrorMessages} from "@/types/error.ts";
import {promotionErrorMessages} from "@/utils/error/promotionError.ts";
import {ProductErrorCode} from "@/utils/error/createProductError.tsx";
import { categoryErrorMessages} from "@/utils/error/categoryError.ts";
import { IngredientErrorCode } from "@/utils/error/ingredientError";
import { SupplierErrorCode } from "@/utils/error/supplierError";



export const useCustomToast = () => {
    const { toast } = useToast();

    const getErrorMessage = (errorCode: ErrorCode): string => {
        const allErrorMessages  = {
            ...ProductErrorCode,
            ...promotionErrorMessages,
            ...categoryErrorMessages,
            ...IngredientErrorCode,
            ...SupplierErrorCode,

        };
        console.log(allErrorMessages[errorCode as keyof typeof allErrorMessages] || 'Đã xảy ra lỗi')
        return allErrorMessages[errorCode as keyof typeof allErrorMessages] || 'Đã xảy ra lỗi';
    };

    const showErrorToast = ( message: ErrorCode) => {
        const description =  getErrorMessage(message);

        toast({
            variant: "destructive",
            title: "Lỗi",
            description,
        });
    };

    const showSuccessToast = (message:ErrorCode) => {
        const description =  getErrorMessage(message);

        toast({
            title: "Thành công",
            description,
        });
    };

    return { showErrorToast, showSuccessToast };
};