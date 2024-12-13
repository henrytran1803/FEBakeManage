import {useToast} from "@/hooks/use-toast.ts";
import {ErrorCode} from "@/types/error.ts";
import {errorCodeMessage} from "@/utils/error/ErrorCode.ts";



export const useCustomToast = () => {
    const { toast } = useToast();

    const getErrorMessage = (errorCode: ErrorCode): string => {
        const allErrorMessages  = {
            ...errorCodeMessage
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