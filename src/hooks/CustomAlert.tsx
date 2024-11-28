import {useToast} from "@/hooks/use-toast.ts";
import {ErrorCode, ErrorMessages} from "@/types/error.ts";
import {promotionErrorMessages} from "@/utils/error/promotionError.ts";
import {ProductErrorCode} from "@/utils/error/createProductError.tsx";
import { categoryErrorMessages} from "@/utils/error/categoryError.ts";


export const useCustomToast = () => {
    const { toast } = useToast();
    const getErrorMessage = (errorCode: ErrorCode): string => {
        const errorMap: ErrorMessages = {
            ...ProductErrorCode,
            ...promotionErrorMessages,
            ...categoryErrorMessages,

        };
        return errorMap[errorCode.toString()] || 'Đã xảy ra lỗi';
    };
    const showErrorToast = (errorCode: ErrorCode) => {
        toast({
            variant: "destructive",
            title: "Error",
            description: getErrorMessage(errorCode),
        });
    };
    const showSuccessToast = (message: string | ErrorCode) => {
        const description = typeof message === 'string'
            ? message
            : getErrorMessage(message);

        toast({
            title: "Success",
            description,
        });
    };
    return { showErrorToast, showSuccessToast };
};