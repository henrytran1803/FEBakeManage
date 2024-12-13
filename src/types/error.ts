import {UserErrorCode} from "@/utils/error/UserError.ts";
import {ErrorCode} from "@/utils/error/promotionError.ts";
import {ErrorCode} from "@/utils/error/categoryError.ts";
import {SupplierErrorCode} from "@/utils/error/SupplierErrorCode.ts";

export type ErrorCode =
    | UserErrorCode
    | ErrorCode
    | ErrorCode
    | SupplierErrorCode

export type ErrorMessages = {
    [key in ErrorCode]: string;
};