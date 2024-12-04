import {UserErrorCode} from "@/utils/error/UserError.ts";
import {PromotionErrorCode} from "@/utils/error/promotionError.ts";
import {CategoryErrorCode} from "@/utils/error/categoryError.ts";
import {SupplierErrorCode} from "@/utils/error/SupplierErrorCode.ts";

export type ErrorCode =
    | UserErrorCode
    | PromotionErrorCode
    | CategoryErrorCode
    | SupplierErrorCode

export type ErrorMessages = {
    [key in ErrorCode]: string;
};