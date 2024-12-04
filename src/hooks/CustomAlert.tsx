import { useToast } from "@/hooks/use-toast";
import { ErrorCode } from "@/types/error";
import {  promotionErrorMessages } from "@/utils/error/promotionError";
import { categoryErrorMessages } from "@/utils/error/categoryError";
import { supplierErrorMessages } from "@/utils/error/SupplierErrorCode";
import {  userErrorMessages } from "@/utils/error/UserError";
import {errorProductMessages} from "@/utils/error/createProductError.ts";

export const useCustomToast = () => {
    const { toast } = useToast();

    const getErrorMessage = (errorCode: ErrorCode): string => {
        const allErrorMessages = {
            ...errorProductMessages,
            ...promotionErrorMessages,
            ...categoryErrorMessages,
            ...supplierErrorMessages,
            ...userErrorMessages
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