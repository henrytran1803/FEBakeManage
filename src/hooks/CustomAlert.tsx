import {useToast} from "@/hooks/use-toast.ts";
import {ErrorCode} from "@/types/error.ts";
import {promotionErrorMessages} from "@/utils/error/promotionError.ts";
import { categoryErrorMessages} from "@/utils/error/categoryError.ts";
import { ingredientErrorMessages} from "@/utils/error/ingredientError";
import {errorProductMessages} from "@/utils/error/createProductError.ts";
import {userErrorMessages} from "@/utils/error/UserError.ts";
import {supplierErrorMessages} from "@/utils/error/supplierError.ts";



export const useCustomToast = () => {
    const { toast } = useToast();

    const getErrorMessage = (errorCode: ErrorCode): string => {
        const allErrorMessages  = {
            ...errorProductMessages,
            ...promotionErrorMessages,
            ...categoryErrorMessages,
            ...ingredientErrorMessages,
            ...supplierErrorMessages,
            ...userErrorMessages
        };
        return allErrorMessages[errorCode as keyof typeof allErrorMessages] || 'Đã xảy ra lỗi';
    };

    const showErrorToast = (message: ErrorCode) => {
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